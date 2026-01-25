import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const STATUS_BADGE = (status) => {
  const base =
    "inline-flex items-center px-2 py-1 rounded text-xs font-semibold";
  if (status === "ACTIVE") return `${base} bg-green-100 text-green-800`;
  if (status === "VALIDATED") return `${base} bg-blue-100 text-blue-800`;
  if (status === "DRAFT") return `${base} bg-yellow-100 text-yellow-800`;
  if (status === "ARCHIVED") return `${base} bg-gray-200 text-gray-800`;
  return `${base} bg-gray-100 text-gray-700`;
};

const CghsRateManagementV2 = () => {
  // ===== Config =====
  const BASE_URL = "https://server-v4dy.onrender.com";
  // const BASE_URL = "http://localhost:5000";
  const token = localStorage.getItem("jwtToken");

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token],
  );

  // ===== State =====
  const [rateSets, setRateSets] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedRateSetId, setSelectedRateSetId] = useState("");
  const [selectedRateSet, setSelectedRateSet] = useState(null);
  const [loadingRateSet, setLoadingRateSet] = useState(false);

  // ===== Procedure Browser (Admin Editing) =====
  const [procQ, setProcQ] = useState("");
  const [procLoading, setProcLoading] = useState(false);
  const [procItems, setProcItems] = useState([]);
  const [procTotal, setProcTotal] = useState(0);
  const [procPage, setProcPage] = useState(1);
  const procLimit = 20;

  const [needsFixOnly, setNeedsFixOnly] = useState(false);

  // Editor modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [activeProc, setActiveProc] = useState(null); // full document
  const [editModeRaw, setEditModeRaw] = useState(false); // optional toggle
  const [draftEdits, setDraftEdits] = useState({}); // key -> { amount?, raw? }
  const [savingEdits, setSavingEdits] = useState(false);
  const [tierTab, setTierTab] = useState("TIER_I"); // editor tab
  const [confirmLiveEdit, setConfirmLiveEdit] = useState(false);
  const [liveEditReason, setLiveEditReason] = useState("");

  // Create form
  const [createForm, setCreateForm] = useState({
    title: "",
    effectiveFrom: "",
    sourceNotification: "",
  });
  const [creating, setCreating] = useState(false);

  // Upload
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Validate/Import/Activate
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [activating, setActivating] = useState(false);

  // UI toggles for report
  const [showErrors, setShowErrors] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);

  // ===== API calls =====
  const fetchRateSets = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets`,
        authHeaders,
      );
      setRateSets(res.data || []);

      // auto-select ACTIVE if exists and nothing selected
      if (!selectedRateSetId) {
        const active = (res.data || []).find((r) => r.status === "ACTIVE");
        if (active?._id) setSelectedRateSetId(active._id);
      }
    } catch (e) {
      toast.error("Failed to fetch RateSets");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchRateSetById = async (id) => {
    if (!id) return;
    setLoadingRateSet(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${id}`,
        authHeaders,
      );
      setSelectedRateSet(res.data);
    } catch (e) {
      toast.error("Failed to load RateSet details");
    } finally {
      setLoadingRateSet(false);
    }
  };

  useEffect(() => {
    fetchRateSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRateSetId) fetchRateSetById(selectedRateSetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRateSetId]);

  const handleCreateRateSet = async () => {
    if (!createForm.effectiveFrom) {
      toast.error("Effective From is required");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        title: createForm.title,
        effectiveFrom: createForm.effectiveFrom,
        sourceNotification: createForm.sourceNotification,
      };
      const res = await axios.post(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets`,
        payload,
        authHeaders,
      );

      toast.success("Draft RateSet created");
      await fetchRateSets();
      if (res.data?._id) setSelectedRateSetId(res.data._id);

      setCreateForm({ title: "", effectiveFrom: "", sourceNotification: "" });
      setFile(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create RateSet");
    } finally {
      setCreating(false);
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedRateSet?._id) {
      toast.error("Select a RateSet first");
      return;
    }
    if (selectedRateSet.status !== "DRAFT") {
      toast.error("Upload allowed only when RateSet is DRAFT");
      return;
    }
    if (!file) {
      toast.error("Please choose an .xlsx file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Excel uploaded");
      await fetchRateSetById(selectedRateSet._id);
      await fetchRateSets();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleValidate = async () => {
    if (!selectedRateSet?._id) return;
    if (selectedRateSet.status !== "DRAFT") {
      toast.error("Validation is allowed only in DRAFT");
      return;
    }
    setValidating(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/validate`,
        {},
        authHeaders,
      );

      toast.success(res?.data?.message || "Validated");
      await fetchRateSetById(selectedRateSet._id);
      await fetchRateSets();

      // auto-open report panels if errors exist
      const errors = res?.data?.summary?.errors || 0;
      const warnings = res?.data?.summary?.warnings || 0;
      setShowErrors(errors > 0);
      setShowWarnings(warnings > 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Validation failed");
    } finally {
      setValidating(false);
    }
  };

  const handleImport = async () => {
    if (!selectedRateSet?._id) return;
    if (selectedRateSet.status !== "VALIDATED") {
      toast.error("Import allowed only when status is VALIDATED");
      return;
    }
    setImporting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/import`,
        {},
        authHeaders,
      );
      toast.success(res?.data?.message || "Imported");

      // Keep status as VALIDATED until activation (by design)
      await fetchRateSetById(selectedRateSet._id);
      await fetchRateSets();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedRateSet?._id) return;
    if (selectedRateSet.status !== "VALIDATED") {
      toast.error("Only VALIDATED RateSet can be activated");
      return;
    }
    if (
      !window.confirm(
        "Activate this RateSet? This will archive the current ACTIVE dataset.",
      )
    ) {
      return;
    }
    setActivating(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/activate`,
        {},
        authHeaders,
      );
      toast.success(res?.data?.message || "Activated");

      await fetchRateSets();
      await fetchRateSetById(selectedRateSet._id);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Activation failed");
    } finally {
      setActivating(false);
    }
  };

  const fetchProcedures = async () => {
    if (!selectedRateSet?._id) return;

    setProcLoading(true);
    try {
      const skip = (procPage - 1) * procLimit;

      // If you implement /needs-fixing endpoint, use it when toggle is on.
      if (needsFixOnly) {
        const res = await axios.get(
          `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/needs-fixing?skip=${skip}&limit=${procLimit}`,
          authHeaders,
        );
        setProcItems(res.data?.items || []);
        // If your endpoint doesn't return total, just set a rough total
        setProcTotal(res.data?.total ?? (res.data?.items?.length || 0));
        return;
      }

      const q = encodeURIComponent(procQ.trim());
      const res = await axios.get(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/procedures?q=${q}&skip=${skip}&limit=${procLimit}`,
        authHeaders,
      );

      setProcItems(res.data?.items || []);
      setProcTotal(res.data?.total || 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to fetch procedures");
    } finally {
      setProcLoading(false);
    }
  };

  const openEditor = async (cghsCode) => {
    if (!selectedRateSet?._id) return;
    setEditorOpen(true);
    setEditorLoading(true);
    setDraftEdits({});
    setTierTab("TIER_I");
    setConfirmLiveEdit(false);
    setLiveEditReason("");
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/procedures/${cghsCode}`,
        authHeaders,
      );
      setActiveProc(res.data);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load procedure");
      setEditorOpen(false);
    } finally {
      setEditorLoading(false);
    }
  };

  const updateDraftCell = (tier, facility, ward, patch) => {
    const key = cellKey(tier, facility, ward);
    setDraftEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), ...patch },
    }));
  };

  const saveEdits = async () => {
    if (!selectedRateSet?._id || !activeProc?.cghsCode) return;

    const entries = Object.entries(draftEdits);
    if (entries.length === 0) {
      toast("No changes to save");
      return;
    }

    if (!canEditSelected) {
      toast.error("Editing allowed only for DRAFT / VALIDATED RateSets");
      return;
    }

    setSavingEdits(true);
    try {
      const updates = entries.map(([key, val]) => {
        const [tier, facility, ward] = key.split(".");
        return {
          tier,
          facility,
          ward,
          ...(val.raw !== undefined ? { raw: val.raw } : {}),
          ...(val.amount !== undefined ? { amount: val.amount } : {}),
        };
      });

      const isActive = selectedRateSet?.status === "ACTIVE";

      if (isActive) {
        if (!confirmLiveEdit) {
          toast.error(
            "Please confirm live edit (checkbox) to save ACTIVE RateSet.",
          );
          return;
        }
        if (!liveEditReason.trim()) {
          toast.error("Please provide a reason for live edit.");
          return;
        }
      }

      const payload = {
        updates,
        ...(isActive
          ? { confirmLiveEdit: true, reason: liveEditReason.trim() }
          : {}),
      };

      const res = await axios.patch(
        `${BASE_URL}/api/v1/cghs-rates-v2/ratesets/${selectedRateSet._id}/procedures/${activeProc.cghsCode}`,
        payload,
        authHeaders,
      );
      toast.success(res.data?.message || "Saved");
      setActiveProc(res.data?.procedure || null);
      setDraftEdits({});
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSavingEdits(false);
    }
  };

  useEffect(() => {
    // reset pagination when RateSet changes
    setProcPage(1);
    setProcItems([]);
    setProcTotal(0);
    setProcQ("");
    setNeedsFixOnly(false);
  }, [selectedRateSetId]);

  useEffect(() => {
    if (selectedRateSet?._id) fetchProcedures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRateSet?._id, procPage, needsFixOnly]);

  // ===== Helpers for UI =====

  const canEditSelected =
    selectedRateSet &&
    (selectedRateSet.status === "DRAFT" ||
      selectedRateSet.status === "VALIDATED" ||
      selectedRateSet.status === "ACTIVE");

  const wardLabel = {
    GENERAL: "General",
    SEMI_PRIVATE: "Semi-Private",
    PRIVATE: "Private",
  };

  const facLabel = { SS: "SS", NABH: "NABH", NON_NABH: "Non-NABH" };

  const tiers = ["TIER_I", "TIER_II", "TIER_III"];
  const facilities = ["SS", "NABH", "NON_NABH"];
  const wards = ["GENERAL", "SEMI_PRIVATE", "PRIVATE"];

  const cellKey = (tier, facility, ward) => `${tier}.${facility}.${ward}`;

  const getCell = (proc, tier, facility, ward) =>
    proc?.rates?.[tier]?.[facility]?.[ward] || null;

  const isPureNumberString = (s) => {
    if (s === null || s === undefined) return false;
    const t = String(s).trim();
    if (!t) return false;
    const n = Number(t);
    return Number.isFinite(n) && String(n) === t;
  };

  const cellNeedsFix = (cell) => {
    if (!cell) return false;
    const raw = cell.raw;
    const amount = cell.amount;
    return (
      (amount === null || amount === undefined) &&
      raw &&
      !isPureNumberString(raw)
    );
  };

  const activeRateSet = useMemo(
    () => rateSets.find((r) => r.status === "ACTIVE"),
    [rateSets],
  );

  const fileInfo = selectedRateSet?.fileMeta?.originalName
    ? `${selectedRateSet.fileMeta.originalName} (${Math.round(
        (selectedRateSet.fileMeta.sizeBytes || 0) / 1024,
      )} KB)`
    : null;

  const summary = selectedRateSet?.summary || null;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">CGHS Rates (V2) – Admin Upload</h1>
          <p className="text-sm text-gray-600">
            Upload Excel (Tier I/II/III sheets) → Validate → Import → Activate.
          </p>
        </div>

        {activeRateSet ? (
          <div className="text-sm">
            <span className="mr-2 text-gray-600">Current Active:</span>
            <span className="font-semibold">
              {activeRateSet.title || "Untitled"}
            </span>{" "}
            <span className={STATUS_BADGE(activeRateSet.status)}>
              {activeRateSet.status}
            </span>
          </div>
        ) : (
          <div className="text-sm text-red-600">No ACTIVE RateSet found.</div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: RateSet list */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">RateSets</h2>
            <button
              className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={fetchRateSets}
              disabled={loadingList}
            >
              {loadingList ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {rateSets.length === 0 && !loadingList ? (
              <p className="text-sm text-gray-500">No RateSets yet.</p>
            ) : (
              rateSets.map((rs) => (
                <button
                  key={rs._id}
                  onClick={() => setSelectedRateSetId(rs._id)}
                  className={`w-full text-left border rounded p-3 hover:bg-gray-50 ${
                    selectedRateSetId === rs._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm truncate">
                      {rs.title || "Untitled RateSet"}
                    </div>
                    <span className={STATUS_BADGE(rs.status)}>{rs.status}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Effective:{" "}
                    {rs.effectiveFrom
                      ? new Date(rs.effectiveFrom).toLocaleDateString()
                      : "—"}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Middle: Create RateSet */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Create New Draft RateSet</h2>

          <div className="space-y-3">
            <input
              className="w-full border rounded p-2"
              placeholder="Title (optional)"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, title: e.target.value }))
              }
            />

            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Effective From <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={createForm.effectiveFrom}
                onChange={(e) =>
                  setCreateForm((p) => ({
                    ...p,
                    effectiveFrom: e.target.value,
                  }))
                }
              />
            </div>

            <textarea
              rows={3}
              className="w-full border rounded p-2"
              placeholder="Source notification / OM reference (optional)"
              value={createForm.sourceNotification}
              onChange={(e) =>
                setCreateForm((p) => ({
                  ...p,
                  sourceNotification: e.target.value,
                }))
              }
            />

            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleCreateRateSet}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Draft RateSet"}
            </button>

            <p className="text-xs text-gray-500">
              Tip: Create a new RateSet for each revision. Your public pages
              always read the ACTIVE RateSet only.
            </p>
          </div>
        </div>

        {/* Right: Selected RateSet actions */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Selected RateSet</h2>
            <button
              className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() =>
                selectedRateSetId && fetchRateSetById(selectedRateSetId)
              }
              disabled={loadingRateSet || !selectedRateSetId}
            >
              {loadingRateSet ? "Loading..." : "Reload"}
            </button>
          </div>

          {!selectedRateSet ? (
            <p className="text-sm text-gray-600">
              Select a RateSet from the list.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Meta */}
              <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm truncate">
                    {selectedRateSet.title || "Untitled RateSet"}
                  </div>
                  <span className={STATUS_BADGE(selectedRateSet.status)}>
                    {selectedRateSet.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Effective:{" "}
                  {selectedRateSet.effectiveFrom
                    ? new Date(
                        selectedRateSet.effectiveFrom,
                      ).toLocaleDateString()
                    : "—"}
                </div>
                {selectedRateSet.sourceNotification ? (
                  <div className="text-xs text-gray-600 mt-1">
                    Ref: {selectedRateSet.sourceNotification}
                  </div>
                ) : null}
              </div>

              {/* Upload */}
              <div className="border rounded p-3">
                <div className="font-semibold text-sm mb-2">
                  A) Upload Excel
                </div>
                <input
                  type="file"
                  accept=".xlsx"
                  className="w-full text-sm"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={selectedRateSet.status !== "DRAFT"}
                />
                {fileInfo ? (
                  <div className="text-xs text-gray-600 mt-2">
                    Uploaded: <span className="font-semibold">{fileInfo}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-2">
                    No file uploaded yet.
                  </div>
                )}

                <button
                  className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  onClick={handleUploadExcel}
                  disabled={uploading || selectedRateSet.status !== "DRAFT"}
                >
                  {uploading ? "Uploading..." : "Upload Excel"}
                </button>

                {selectedRateSet.status !== "DRAFT" ? (
                  <p className="text-xs text-gray-500 mt-2">
                    Upload disabled because status is {selectedRateSet.status}.
                  </p>
                ) : null}
              </div>

              {/* Validate */}
              <div className="border rounded p-3">
                <div className="font-semibold text-sm mb-2">B) Validate</div>

                <button
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-black disabled:opacity-50"
                  onClick={handleValidate}
                  disabled={validating || selectedRateSet.status !== "DRAFT"}
                >
                  {validating ? "Validating..." : "Run Validation"}
                </button>

                {summary ? (
                  <div className="mt-3 text-sm">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="border rounded p-2">
                        <div className="text-gray-500">Tier I</div>
                        <div className="font-semibold">
                          {summary?.rows?.TIER_I ?? 0}
                        </div>
                      </div>
                      <div className="border rounded p-2">
                        <div className="text-gray-500">Tier II</div>
                        <div className="font-semibold">
                          {summary?.rows?.TIER_II ?? 0}
                        </div>
                      </div>
                      <div className="border rounded p-2">
                        <div className="text-gray-500">Tier III</div>
                        <div className="font-semibold">
                          {summary?.rows?.TIER_III ?? 0}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-semibold text-red-600">
                          Errors: {summary.errors ?? 0}
                        </span>{" "}
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="font-semibold text-amber-700">
                          Warnings: {summary.warnings ?? 0}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowErrors((p) => !p)}
                        >
                          {showErrors ? "Hide" : "Show"} Errors
                        </button>
                        <button
                          className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowWarnings((p) => !p)}
                        >
                          {showWarnings ? "Hide" : "Show"} Warnings
                        </button>
                      </div>
                    </div>

                    {showErrors ? (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-red-700 mb-1">
                          Error Samples (first 50)
                        </div>
                        <div className="max-h-40 overflow-auto text-xs border rounded p-2 bg-red-50">
                          {(summary.errorSamples || []).length === 0 ? (
                            <div className="text-gray-600">No errors.</div>
                          ) : (
                            (summary.errorSamples || []).map((er, i) => (
                              <div
                                key={i}
                                className="border-b border-red-100 py-1"
                              >
                                <span className="font-semibold">{er.type}</span>{" "}
                                {er.tier ? (
                                  <span className="text-gray-600">
                                    [{er.tier}]
                                  </span>
                                ) : null}{" "}
                                {er.code ? (
                                  <span className="text-gray-700">
                                    ({er.code})
                                  </span>
                                ) : null}
                                {er.row ? (
                                  <span className="text-gray-600">
                                    {" "}
                                    row {er.row}
                                  </span>
                                ) : null}
                                {er.col ? (
                                  <span className="text-gray-600">
                                    {" "}
                                    col {er.col}
                                  </span>
                                ) : null}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}

                    {showWarnings ? (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-amber-800 mb-1">
                          Warning Samples (first 50)
                        </div>
                        <div className="max-h-40 overflow-auto text-xs border rounded p-2 bg-amber-50">
                          {(summary.warningSamples || []).length === 0 ? (
                            <div className="text-gray-600">No warnings.</div>
                          ) : (
                            (summary.warningSamples || []).map((wr, i) => (
                              <div
                                key={i}
                                className="border-b border-amber-100 py-1"
                              >
                                <span className="font-semibold">{wr.type}</span>{" "}
                                {wr.tier ? (
                                  <span className="text-gray-600">
                                    [{wr.tier}]
                                  </span>
                                ) : null}{" "}
                                {wr.code ? (
                                  <span className="text-gray-700">
                                    ({wr.code})
                                  </span>
                                ) : null}
                                {wr.row ? (
                                  <span className="text-gray-600">
                                    {" "}
                                    row {wr.row}
                                  </span>
                                ) : null}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    No validation report yet. Upload Excel and validate.
                  </p>
                )}
              </div>

              {/* Import + Activate */}
              <div className="border rounded p-3">
                <div className="font-semibold text-sm mb-2">
                  C) Import & Activate
                </div>

                <button
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  onClick={handleImport}
                  disabled={importing || selectedRateSet.status !== "VALIDATED"}
                >
                  {importing ? "Importing..." : "Import into Database"}
                </button>

                <button
                  className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  onClick={handleActivate}
                  disabled={
                    activating ||
                    selectedRateSet.status !== "VALIDATED" ||
                    !selectedRateSet?.summary?.imported
                  }
                >
                  {activating ? "Activating..." : "Activate RateSet"}
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  Activation will archive the currently ACTIVE RateSet.
                </p>
              </div>

              {/* Helpful note */}
              <div className="text-xs text-gray-500">
                Tip: If validation shows errors, fix the Excel and re-upload
                (same DRAFT RateSet).
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Admin Editing: Procedure Browser ===== */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-semibold">Procedure Browser (Admin)</h2>
            <p className="text-xs text-gray-500">
              Search and edit rates for the selected RateSet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={fetchProcedures}
              disabled={!selectedRateSet?._id || procLoading}
            >
              {procLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {!selectedRateSet?._id ? (
          <p className="text-sm text-gray-600 mt-3">Select a RateSet first.</p>
        ) : (
          <>
            <div className="mt-3 flex flex-col md:flex-row md:items-center gap-2">
              <input
                className="w-full md:w-1/2 border rounded p-2"
                placeholder="Search by CGHS Code or Procedure Name..."
                value={procQ}
                onChange={(e) => {
                  setProcQ(e.target.value);
                  setProcPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchProcedures();
                }}
              />

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setProcPage(1);
                  fetchProcedures();
                }}
              >
                Search
              </button>

              <label className="flex items-center gap-2 text-sm text-gray-700 md:ml-auto">
                <input
                  type="checkbox"
                  checked={needsFixOnly}
                  onChange={(e) => {
                    setNeedsFixOnly(e.target.checked);
                    setProcPage(1);
                  }}
                />
                Needs fixing only
              </label>

              <div className="text-xs text-gray-500">
                {canEditSelected ? (
                  <span className="text-green-700 font-semibold">Editable</span>
                ) : (
                  <span className="text-gray-600">
                    Read-only (status: {selectedRateSet.status})
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">CGHS Code</th>
                    <th className="border px-3 py-2 text-left">
                      Procedure Name
                    </th>
                    <th className="border px-3 py-2 text-left">Speciality</th>
                    <th className="border px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {procLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-gray-600"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : procItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No procedures found.
                      </td>
                    </tr>
                  ) : (
                    procItems.map((p, idx) => (
                      <tr
                        key={p._id || p.cghsCode}
                        className={idx % 2 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border px-3 py-2 font-semibold">
                          {p.cghsCode}
                        </td>
                        <td className="border px-3 py-2">{p.name}</td>
                        <td className="border px-3 py-2">{p.speciality}</td>
                        <td className="border px-3 py-2 text-center">
                          <button
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            onClick={() => openEditor(p.cghsCode)}
                          >
                            View / Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Showing {(procPage - 1) * procLimit + 1}–
                {(procPage - 1) * procLimit + procItems.length}
                {procTotal ? ` of ${procTotal}` : ""}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  disabled={procPage === 1}
                  onClick={() => setProcPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <span className="text-sm">Page {procPage}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  disabled={procItems.length < procLimit}
                  onClick={() => setProcPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== Procedure Editor Modal ===== */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold">Procedure Editor</div>
                {activeProc ? (
                  <div className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">{activeProc.cghsCode}</span>{" "}
                    — {activeProc.name}
                    <span className="text-gray-500">
                      {" "}
                      • {activeProc.speciality}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mt-1">Loading…</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  RateSet: {selectedRateSet?.title || "Untitled"} (
                  {selectedRateSet?.status})
                </div>
              </div>

              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setEditorOpen(false);
                  setActiveProc(null);
                  setDraftEdits({});
                }}
              >
                Close
              </button>
            </div>

            <div className="p-4">
              {editorLoading || !activeProc ? (
                <div className="py-10 text-center text-gray-600">
                  Loading procedure…
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    {/* Tier tabs */}
                    <div className="flex gap-2">
                      {tiers.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTierTab(t)}
                          className={`px-3 py-1 rounded text-sm border ${
                            tierTab === t
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          {t.replace("_", " ")}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={editModeRaw}
                          onChange={(e) => setEditModeRaw(e.target.checked)}
                        />
                        Allow editing RAW text
                      </label>
                      {selectedRateSet?.status === "ACTIVE" && (
                        <div className="border border-red-200 bg-red-50 rounded p-3 text-sm">
                          <div className="font-semibold text-red-700">
                            Editing LIVE data
                          </div>
                          <div className="text-xs text-red-700 mt-1">
                            This RateSet is ACTIVE and shown to public. Please
                            confirm and provide a reason.
                          </div>

                          <label className="flex items-center gap-2 mt-2 text-sm">
                            <input
                              type="checkbox"
                              checked="true"
                              onChange={(e) =>
                                setConfirmLiveEdit(e.target.checked)
                              }
                            />
                            I understand this will update LIVE rates
                          </label>

                          <input
                            className="mt-2 w-full border rounded p-2 text-sm"
                            placeholder="Reason for live edit (required)"
                            value="yes"
                            onChange={(e) => setLiveEditReason(e.target.value)}
                          />
                        </div>
                      )}

                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={
                          !canEditSelected ||
                          savingEdits ||
                          Object.keys(draftEdits).length === 0 ||
                          (selectedRateSet?.status === "ACTIVE" &&
                            (!confirmLiveEdit || !liveEditReason.trim()))
                        }
                        onClick={saveEdits}
                      >
                        {savingEdits ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>

                  {/* Grid for selected tier */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2 text-left">
                            Facility
                          </th>
                          {wards.map((w) => (
                            <th
                              key={w}
                              className="border px-3 py-2 text-center"
                            >
                              {wardLabel[w]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {facilities.map((fac, i) => (
                          <tr
                            key={fac}
                            className={i % 2 ? "bg-gray-50" : "bg-white"}
                          >
                            <td className="border px-3 py-2 font-semibold">
                              {facLabel[fac]}
                            </td>

                            {wards.map((w) => {
                              const key = cellKey(tierTab, fac, w);
                              const baseCell = getCell(
                                activeProc,
                                tierTab,
                                fac,
                                w,
                              );
                              const draft = draftEdits[key] || {};

                              const raw =
                                draft.raw !== undefined
                                  ? draft.raw
                                  : baseCell?.raw || "";
                              const amount =
                                draft.amount !== undefined
                                  ? draft.amount
                                  : (baseCell?.amount ?? "");

                              const needsFix = cellNeedsFix({
                                raw,
                                amount: baseCell?.amount,
                              });

                              return (
                                <td
                                  key={w}
                                  className={`border px-3 py-2 align-top ${
                                    needsFix ? "bg-amber-50" : ""
                                  }`}
                                >
                                  <div className="text-xs text-gray-600 mb-1">
                                    RAW:{" "}
                                    <span className="font-medium">
                                      {String(raw || "—")}
                                    </span>
                                  </div>

                                  <input
                                    type="number"
                                    className="w-full border rounded p-2 text-sm"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) =>
                                      updateDraftCell(tierTab, fac, w, {
                                        amount: e.target.value,
                                      })
                                    }
                                    disabled={!canEditSelected}
                                  />

                                  {editModeRaw ? (
                                    <textarea
                                      rows={2}
                                      className="mt-2 w-full border rounded p-2 text-xs"
                                      placeholder="Edit RAW text"
                                      value={raw}
                                      onChange={(e) =>
                                        updateDraftCell(tierTab, fac, w, {
                                          raw: e.target.value,
                                        })
                                      }
                                      disabled={!canEditSelected}
                                    />
                                  ) : null}

                                  {needsFix ? (
                                    <div className="mt-2 text-xs text-amber-800">
                                      Needs fixing: amount missing but RAW is
                                      text.
                                    </div>
                                  ) : null}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!canEditSelected ? (
                    <div className="mt-3 text-xs text-gray-600">
                      Editing disabled because RateSet status is{" "}
                      <b>{selectedRateSet.status}</b>.
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CghsRateManagementV2;

// // src/pages/Admin/CghsRateManagement.jsx

// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const CghsRateManagement = () => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedCity, setSelectedCity] = useState("Delhi");

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     cghsCode: "",
//     rates: {
//       Delhi: { nabhRate: "", nonNabhRate: "" },
//     },
//     reference: "",
//     note: "",
//     tags: "",
//   });
//   const BASE_URL = "https://server-v4dy.onrender.com";
//   // const BASE_URL = "http://localhost:5000";

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const ratesPerPage = 10;

//   const [editId, setEditId] = useState(null);
//   const nameInputRef = useRef(null);
//   const token = localStorage.getItem("jwtToken"); // assuming your admin token is stored here
//   useEffect(() => {
//     if (modalOpen && nameInputRef.current) {
//       nameInputRef.current.focus();
//     }
//   }, [modalOpen]);

//   // Filter based on search term

//   const filteredRates = rates.filter((rate) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       rate.name.toLowerCase().includes(search) ||
//       rate.category.toLowerCase().includes(search) ||
//       rate.cghsCode?.toLowerCase().includes(search) ||
//       (rate.rates &&
//         rate.rates[selectedCity]?.nabhRate?.toString().includes(search)) ||
//       (rate.rates &&
//         rate.rates[selectedCity]?.nonNabhRate?.toString().includes(search))
//     );
//   });

//   // Pagination logic
//   const indexOfLastRate = currentPage * ratesPerPage;
//   const indexOfFirstRate = indexOfLastRate - ratesPerPage;
//   const currentRates = filteredRates.slice(indexOfFirstRate, indexOfLastRate);

//   const totalPages = Math.ceil(filteredRates.length / ratesPerPage);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on new search
//   };
//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const fetchRates = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/v1/cghsRateManagement/list`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setRates(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch rates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRates();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       tags: formData.tags.split(",").map((tag) => tag.trim()),
//     };
//     try {
//       if (editId) {
//         await axios.put(
//           `${BASE_URL}/api/v1/cghsRateManagement/updateCghsRate/${editId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         toast.success("Rate updated successfully");
//       } else {
//         await axios.post(
//           `${BASE_URL}/api/v1/cghsRateManagement/addCghsRate`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         toast.success("Rate added successfully");
//       }
//       setModalOpen(false);
//       fetchRates();
//       setFormData({
//         name: "",
//         category: formData.category,
//         cghsCode: "",
//         rates: {
//           Delhi: { nabhRate: "", nonNabhRate: "" },
//         },
//         reference: "",
//         note: formData.note,
//         tags: "",
//       });
//       setEditId(null);
//     } catch (error) {
//       toast.error("Operation failed");
//     }
//   };

//   const handleEdit = (rate) => {
//     setFormData({
//       name: rate.name,
//       description: rate.description || "",
//       category: rate.category,
//       cghsCode: rate.cghsCode || "",
//       rates: rate.rates || { Delhi: { nabhRate: "", nonNabhRate: "" } },
//       reference: rate.reference,
//       note: rate.note,
//       tags: rate.tags ? rate.tags.join(", ") : "",
//     });
//     setSelectedCity("Delhi"); // Default to Delhi when opening modal
//     setEditId(rate._id);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to deactivate this rate?"))
//       return;
//     try {
//       await axios.delete(
//         `${BASE_URL}/api/v1/cghsRateManagement/deleteCghsRate/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("Rate deactivated successfully");
//       fetchRates();
//     } catch (error) {
//       toast.error("Failed to deactivate rate");
//     }
//   };
//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">CGHS Rates Management</h1>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={() => {
//             const nextCghsCode = rates.length;
//             setFormData({
//               ...formData,
//               name: "",
//               description: "",
//               category: formData.category,
//               cghsCode: nextCghsCode.toString(),
//               rates: { Delhi: { nabhRate: "", nonNabhRate: "" } },
//               reference: "",
//               note: formData.note,
//               tags: "",
//             });
//             setEditId(null);
//             setModalOpen(true);
//           }}
//         >
//           Add New Rate
//         </button>
//       </div>

//       {/* Search + Pagination Controls */}
//       <div className="flex justify-between items-center mb-4">
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search by Name, Category, or Rate"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className="border p-2 rounded w-1/3"
//         />

//         {/* Pagination Controls */}
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm border border-gray-300 rounded-md overflow-hidden">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-3 py-2 text-left">Name</th>
//                 <th className="border px-3 py-2 text-left">CGHS Code</th>
//                 <th className="border px-3 py-2 text-left">Category</th>
//                 <th className="border px-3 py-2 text-center">NABH Rate</th>
//                 <th className="border px-3 py-2 text-center">Non-NABH Rate</th>
//                 <th className="border px-3 py-2 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRates.map((rate, idx) => (
//                 <tr
//                   key={rate._id}
//                   className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   <td className="border px-3 py-2">{rate.name}</td>
//                   <td className="border px-3 py-2">{rate.cghsCode || "N/A"}</td>
//                   <td className="border px-3 py-2">{rate.category}</td>
//                   <td className="border px-3 py-2 text-center">
//                     {rate.rates &&
//                     rate.rates[selectedCity]?.nabhRate !== undefined
//                       ? rate.rates[selectedCity].nabhRate
//                       : "N/A"}
//                   </td>
//                   <td className="border px-3 py-2 text-center">
//                     {rate.rates &&
//                     rate.rates[selectedCity]?.nonNabhRate !== undefined
//                       ? rate.rates[selectedCity].nonNabhRate
//                       : "N/A"}
//                   </td>

//                   <td className="border px-3 py-2 text-center space-x-2">
//                     <button
//                       className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
//                       onClick={() => handleEdit(rate)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                       onClick={() => handleDelete(rate._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal (Same as before) */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
//             <select
//               value={selectedCity}
//               onChange={(e) => setSelectedCity(e.target.value)}
//               className="w-full border p-2 rounded mb-4"
//             >
//               <option value="Delhi">Delhi</option>
//               <option value="Mumbai">Mumbai</option>
//               <option value="Chennai">Chennai</option>
//               <option value="Kolkata">Kolkata</option>
//               {/* Add more cities if you want */}
//             </select>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 ref={nameInputRef}
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//               <textarea
//                 name="description"
//                 placeholder="Description (optional)"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className="w-full border p-2 rounded"
//               />
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="">Select Category</option>
//                 <option value="Procedure">Procedure</option>
//                 <option value="Test">Test</option>
//                 <option value="Implant">Implant</option>
//                 <option value="Medical Device">Medical Device</option>
//                 <option value="Others">Others</option>
//               </select>

//               <input
//                 name="cghsCode"
//                 placeholder="CGHS Code (optional)"
//                 value={formData.cghsCode}
//                 onChange={handleInputChange}
//                 className="w-full border p-2 rounded"
//               />

//               <input
//                 name="nonNabhRate"
//                 placeholder={`Non-NABH Rate for ${selectedCity}`}
//                 value={formData.rates[selectedCity]?.nonNabhRate || ""}
//                 onChange={(e) => {
//                   const updatedRates = {
//                     ...formData.rates,
//                     [selectedCity]: {
//                       ...formData.rates[selectedCity],
//                       nonNabhRate: e.target.value,
//                     },
//                   };
//                   setFormData({ ...formData, rates: updatedRates });
//                 }}
//                 type="number"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 name="nabhRate"
//                 placeholder={`NABH Rate for ${selectedCity}`}
//                 value={formData.rates[selectedCity]?.nabhRate || ""}
//                 onChange={(e) => {
//                   const updatedRates = {
//                     ...formData.rates,
//                     [selectedCity]: {
//                       ...formData.rates[selectedCity],
//                       nabhRate: e.target.value,
//                     },
//                   };
//                   setFormData({ ...formData, rates: updatedRates });
//                 }}
//                 type="number"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 name="reference"
//                 placeholder="Reference"
//                 value={formData.reference}
//                 onChange={handleInputChange}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 name="note"
//                 placeholder="Note"
//                 value={formData.note}
//                 onChange={handleInputChange}
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 name="tags"
//                 placeholder="Tags (comma separated)"
//                 value={formData.tags}
//                 onChange={handleInputChange}
//                 className="w-full border p-2 rounded"
//               />

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   {editId ? "Update" : "Add"} Rate
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CghsRateManagement;
