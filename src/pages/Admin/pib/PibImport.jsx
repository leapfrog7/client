import { useEffect, useState } from "react";
import AxiosInstance from "../../../components/AxiosInstance";

const API = "/admin/pib";
import { pibApiError as message } from "./pibApiError.js";
const dateTime = value => value ? new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST" : "Not yet fetched";
const india = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "2-digit", timeZone: "Asia/Kolkata",
}).formatToParts(new Date()).map(part => [part.type, part.value]));
const button = "rounded border px-3 py-2 text-sm bg-white hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed";
const field = "border rounded px-3 py-2 bg-white";

export default function PibImport() {
  const [year, setYear] = useState(india.year);
  const [month, setMonth] = useState(String(Number(india.month)));
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({ search: "", ministry: "", status: "", page: 1 });
  const [data, setData] = useState(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [monthStatus, setMonthStatus] = useState(null);
  const [monthError, setMonthError] = useState("");

  useEffect(() => {
    // Defer pending searches until the decision save completes, avoiding stale count/selection responses.
    if (busy || search === query.search) return undefined;
    const timer = setTimeout(() => setQuery(q => ({ ...q, search, page: 1 })), 350);
    return () => clearTimeout(timer);
  }, [search, query.search, busy]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    AxiosInstance.get(API, { params: { year, month, ...query }, signal: controller.signal })
      .then(response => { setData(response.data); setError(""); })
      .catch(err => { if (!controller.signal.aborted) { setError(message(err)); setData(null); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [year, month, query, revision]);

  useEffect(() => {
    if (!data?.importReadiness?.ready) return undefined;
    const controller = new AbortController();
    setMonthStatus(null); setMonthError("");
    AxiosInstance.get(API + "/month", { params: { year, month }, signal: controller.signal })
      .then(response => setMonthStatus(response.data))
      .catch(err => { if (!controller.signal.aborted) setMonthError(message(err)); });
    return () => controller.abort();
  }, [year, month, data?.importReadiness?.ready]);

  const changeMonth = (nextYear, nextMonth) => {
    setYear(nextYear); setMonth(nextMonth); setData(null); setPreview(null);
    setNotice(""); setError(""); setSearch(""); setResults([]); setMonthStatus(null); setMonthError("");
    setQuery({ search: "", ministry: "", status: "", page: 1 });
  };
  const filter = (key, value) => setQuery(q => ({ ...q, [key]: value, page: 1 }));

  async function perform(key, work) {
    setBusy(key); setError("");
    // Keep the existing notice height stable while saving a row decision.
    if (!/^\d{5,10}$/.test(key)) setNotice("");
    try { await work(); }
    catch (err) { setError(message(err)); }
    finally { setBusy(""); }
  }
  const collect = () => perform("collect", async () => {
    const response = await AxiosInstance.post(API + "/collect", { year: Number(year), month: Number(month), force: true }, { timeout: 240000 });
    setNotice(response.data.incomplete ? "Collection incomplete. Check the warnings below." : "Headlines collected. Your review decisions have been retained.");
    setRevision(value => value + 1);
  });
  const review = (item, status) => perform(item.releaseId, async () => {
    const previous = data;
    setData(current => ({
      ...current,
      items: current.items.map(row => row.releaseId === item.releaseId ? { ...row, reviewStatus: status } : row),
      selectedIds: status === "selected"
        ? [...new Set([...current.selectedIds, item.releaseId])]
        : current.selectedIds.filter(id => id !== item.releaseId),
      counts: { ...current.counts,
        [item.reviewStatus]: current.counts[item.reviewStatus] - 1,
        [status]: current.counts[status] + 1,
      },
    }));
    try {
      const response = await AxiosInstance.patch(API + "/" + item.releaseId + "/review", { status });
      setData(current => ({ ...current,
        items: current.items.map(row => row.releaseId === item.releaseId ? response.data.item : row),
      }));
      // Filtered lists may need to fill the vacated row; keep existing rows mounted while fetching.
      if (query.status) setRevision(value => value + 1);
    } catch (err) {
      setData(previous);
      throw err;
    }
  });
  const showPreview = item => perform("preview-" + item.releaseId, async () => {
    setPreview(null);
    const response = await AxiosInstance.get(API + "/" + item.releaseId + "/preview", { timeout: 90000 });
    setPreview(response.data);
  });

  const importItems = ids => perform("import", async () => {
    setResults([]);
    const status = (await AxiosInstance.get(API + "/month", { params: { year, month } })).data;
    setMonthStatus(status);
    if (!status.ready) { setError(status.message); setNotice("No imports started. Your selections are retained."); return; }
    // One release per request keeps progress and retries visible and bounds each request.
    for (let index = 0; index < ids.length; index++) {
      setNotice("Importing " + (index + 1) + " of " + ids.length + " selected releases...");
      try {
        const response = await AxiosInstance.post(API + "/import", {
          year: Number(year), month: Number(month), ids: [ids[index]],
        }, { timeout: 180000 });
        setResults(previous => [...previous, ...response.data.results]);
      } catch (err) {
        setResults(previous => [...previous, { releaseId: ids[index], status: "failed", error: message(err) }]);
        if ([401, 403, 429, 503].includes(err.response?.status)) {
          setNotice("Import stopped. Unprocessed and failed releases remain selected for retry.");
          setRevision(value => value + 1);
          return;
        }
      }
    }
    setNotice("Import finished. Review the results below. Drafts must be edited and published in Sanity.");
    setRevision(value => value + 1);
  });

  const checkMonth = () => perform("month-check", async () => {
    const response = await AxiosInstance.get(API + "/month", { params: { year, month } });
    setMonthStatus(response.data); setMonthError("");
  });
  const createMonth = () => perform("month-create", async () => {
    const response = await AxiosInstance.post(API + "/month", { year: Number(year), month: Number(month) });
    setMonthStatus(response.data); setMonthError(""); setResults([]);
    setNotice("Month container is ready. New month containers stay hidden from the website. Click Import selected to create article drafts.");
  });

  const disabled = Boolean(busy) || loading;
  const collection = data?.collection;
  const counts = data?.counts || {};
  const readiness = data?.importReadiness;
  const totalSaved = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <section className="bg-white rounded-lg shadow p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">PIB Import</h2>
        <p className="text-sm text-gray-600 mt-2">Collect headlines, preview releases and select relevant articles. Review decisions are saved automatically, so you can leave and continue this month later. Importing creates Sanity drafts for review before publication.</p>
        <p className="text-sm text-gray-600 mt-2">{data?.coverageDescription || "English All Releases (lang=1, reg=1), all ministries. Other regional/language editions are not included."}</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm">Month
          <select aria-label="Month" className={field} value={month} disabled={disabled} onChange={event => changeMonth(year, event.target.value)}>
            {Array.from({ length: 12 }, (_, index) => index + 1).map(value => (
              <option key={value} value={value} disabled={year === india.year && value > Number(india.month)}>
                {new Date(2020, value - 1, 1).toLocaleString("en-IN", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Year
          <select aria-label="Year" className={field} value={year} disabled={disabled} onChange={event => {
            const selectedYear = event.target.value;
            changeMonth(selectedYear, selectedYear === india.year && Number(month) > Number(india.month) ? String(Number(india.month)) : month);
          }}>
            {Array.from({ length: Number(india.year) - 2016 }, (_, index) => Number(india.year) - index).map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button className={button} disabled={disabled} onClick={collect}>{busy === "collect" ? "Collecting headlines..." : "Fetch / refresh headlines"}</button>
        <button className={button} disabled={disabled} onClick={() => setRevision(value => value + 1)}>Reload saved inbox</button>
      </div>
      <div className="text-sm space-y-1">
        <p>Last successful fetch: {dateTime(collection?.lastSuccessfulAt)}</p>
        {collection?.coverage && <p>Latest collection: {collection.coverage.collected} unique releases of {collection.coverage.expected} displayed by PIB. {collection.coverage.complete ? "Count verified." : "Incomplete."} {collection.coverage.currentMonth ? "The current month is still growing." : ""}</p>}
        {collection?.lockUntil && new Date(collection.lockUntil) > new Date() && <p>Collection is running. Reload the saved inbox shortly.</p>}
        {collection?.error && <p className="text-red-700">{collection.error}</p>}
        {collection?.coverage?.warnings?.length > 0 && <details className="text-amber-800">
          <summary>Collection warnings ({collection.coverage.warnings.length})</summary>
          <ul className="list-disc pl-5">{collection.coverage.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>
        </details>}
      </div>
      {error && <p role="alert" className="bg-red-50 text-red-800 p-3 rounded">{error} <button className="underline ml-2" disabled={disabled} onClick={() => setRevision(value => value + 1)}>Reload saved inbox</button></p>}
      {notice && <p role="status" className="bg-teal-50 text-teal-900 p-3 rounded">{notice}</p>}
      <div className="flex flex-wrap gap-3 text-sm" aria-label="Review counts">
        <span>Saved: {totalSaved}</span>
        {["unreviewed", "selected", "skipped", "imported"].map(status => <span key={status} className="capitalize">{status}: {counts[status] || 0}</span>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">Search headlines
          <input className={field} value={search} disabled={Boolean(busy)} maxLength={200} onChange={event => setSearch(event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">Ministry
          <select aria-label="Ministry" className={field + " max-w-full md:max-w-xs"} value={query.ministry} disabled={disabled} onChange={event => filter("ministry", event.target.value)}>
            <option value="">All ministries</option>
            {data?.ministries.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Status
          <select aria-label="Status" className={field} value={query.status} disabled={disabled} onChange={event => filter("status", event.target.value)}>
            <option value="">All statuses</option>
            {["unreviewed", "selected", "skipped", "imported"].map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
          </select>
        </label>
      </div>
      {readiness?.ready && <section aria-label="Sanity month" className="border rounded p-3 text-sm space-y-2">
        <h3 className="font-semibold">Month in Sanity</h3>
        <p>{monthStatus?.message || monthError || "Checking the month in Sanity..."}</p>
        {monthStatus?.canCreate && <>
          <p>Create the month container once before importing. This writes the month metadata to Sanity with website visibility off. It does not publish articles.</p>
          <button className={button} disabled={disabled} onClick={createMonth}>
            {busy === "month-create" ? "Creating month..." : "Create " + monthStatus.title + " month"}
          </button>
        </>}
        {monthStatus?.studioUrl && <a className="underline text-teal-800 mr-3" href={monthStatus.studioUrl} target="_blank" rel="noopener noreferrer">Open month in Sanity</a>}
        {monthStatus?.ready && monthStatus.visible === false && <p>Website visibility is off. After reviewing your drafts, enable Published on this month in Studio and publish it when ready.</p>}
        <button className={button} disabled={disabled} onClick={checkMonth}>Check month again</button>
      </section>}
      <div className="bg-teal-50 text-teal-900 p-3 rounded text-sm">
        <button className={button} disabled={disabled || !readiness?.ready || !monthStatus?.ready || !counts.selected}
          onClick={() => importItems(data.selectedIds)}>
          {busy === "import" ? "Importing drafts..." : "Import selected (" + (counts.selected || 0) + ")"}
        </button>
        <p className="mt-2">Imports all selected releases in this month, including other pages and filters. Creates article drafts only. Prepare the month above first if it is missing.</p>
        {readiness?.reasons?.map(reason => <p key={reason} className="mt-1 text-amber-800">{reason}</p>)}
      </div>
      {results.length > 0 && <section aria-label="Import results" className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Import results</h3>
        <p className="text-sm">Created: {results.filter(result => result.status === "imported").length} · Already imported: {results.filter(result => result.status === "alreadyImported").length} · Failed: {results.filter(result => result.status === "failed").length}</p>
        <ul className="space-y-2 text-sm">{results.map(result => <li key={result.releaseId}>
          <strong>PIB {result.releaseId}</strong>: {result.status === "alreadyImported" ? "Already imported" : result.status === "imported" ? "Draft created" : result.error}
          {result.studioUrl && <a className="underline ml-2" href={result.studioUrl} target="_blank" rel="noopener noreferrer">Open in Sanity</a>}
          {result.status === "failed" && <button className={button + " ml-2"} disabled={disabled || !readiness?.ready} onClick={() => importItems([result.releaseId])}>Retry this release</button>}
          {result.matches?.map(match => <p key={match.id}><a className="underline" href={match.studioUrl} target="_blank" rel="noopener noreferrer">Possible match: {match.title}</a></p>)}
        </li>)}</ul>
      </section>}
      {loading && !data ? <p role="status">Loading saved inbox...</p> : data && (
        <>
          {!data.items.length && <p className="py-6 text-gray-600">{!collection ? "Fetch headlines to start this month's inbox." : collection.error && !totalSaved ? "Collection failed. Retry fetching headlines." : totalSaved ? "No headlines match these filters." : "The verified listing contains no releases for this month."}</p>}
          <ul className="divide-y" aria-label="PIB headlines" aria-busy={loading}>
            {data.items.map(item => (
              <li key={item.releaseId} className="py-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" aria-label={"Select " + item.headline} checked={item.reviewStatus === "selected" && !item.imported} disabled={disabled || item.imported}
                    onChange={event => review(item, event.target.checked ? "selected" : "unreviewed")} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{item.headline}</h3>
                    {busy === item.releaseId && <span className="sr-only" role="status">Saving decision...</span>}
                    <p className="text-sm text-gray-600 mt-1">{item.publishedDate} (IST) · {item.ministry} · <span className="capitalize">{item.imported ? "Imported" : item.reviewStatus}</span></p>
                    {item.importError && <p className="text-red-700 text-sm mt-1">{item.importError}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <a className="text-teal-800 underline text-sm" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Original PIB release</a>
                      <button className={button} disabled={disabled} onClick={() => showPreview(item)}>Preview</button>
                      {!item.imported && <button className={button} disabled={disabled} onClick={() => review(item, item.reviewStatus === "skipped" ? "unreviewed" : "skipped")}>{item.reviewStatus === "skipped" ? "Unskip" : "Skip"}</button>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {data.pages > 1 && <nav aria-label="Headline pages" className="flex items-center gap-3">
            <button className={button} disabled={disabled || query.page <= 1} onClick={() => setQuery(q => ({ ...q, page: q.page - 1 }))}>Previous</button>
            <span>Page {query.page} of {data.pages} ({data.total} matches)</span>
            <button className={button} disabled={disabled || query.page >= data.pages} onClick={() => setQuery(q => ({ ...q, page: q.page + 1 }))}>Next</button>
          </nav>}
        </>
      )}
      {busy.startsWith("preview-") && <p role="status">Fetching article preview...</p>}
      {preview && <section aria-label="Article preview" className="border rounded p-4 space-y-3">
        <div className="flex justify-between gap-3">
          <h3 className="text-xl font-semibold">{preview.title}</h3>
          <button className={button} onClick={() => setPreview(null)}>Close preview</button>
        </div>
        <p className="text-sm">{preview.publishedDate} (IST) · {preview.ministry}</p>
        {preview.warnings.map(warning => <p key={warning} className="text-amber-800">{warning}</p>)}
        <a href={preview.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline text-teal-800">Check original source</a>
        {/* Only backend-sanitized markup is returned by this authenticated endpoint. */}
        <div className="prose max-w-none break-words" dangerouslySetInnerHTML={{ __html: preview.html }} />
      </section>}
    </section>
  );
}
