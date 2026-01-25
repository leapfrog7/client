import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

const CghsGuidelinesModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-2 md:p-6"
      onMouseDown={(e) => {
        // close when clicking the overlay
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 md:px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <div className="text-lg md:text-xl font-bold text-blue-900">
              CGHS General Instructions
            </div>
            <div className="text-xs md:text-sm text-gray-600 mt-1">
              Quick reference for ward entitlement, packages, billing &
              reimbursements
            </div>
          </div>

          <button
            className="shrink-0 p-2 rounded-full hover:bg-white/60 text-gray-700"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="max-h-[78vh] overflow-y-auto px-4 md:px-6 py-4 space-y-6">
          {/* A) Ward entitlement adjustment */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              A) Ward Entitlement Adjustment (±5%)
            </h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              Package rates are based on <b>Semi-Private</b> ward.
              <b> General</b> ward entitlement reduces rates by <b>5%</b>, and
              <b> Private</b> ward entitlement increases rates by <b>5%</b>.
            </p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="text-xs text-gray-500">General Ward</div>
                <div className="font-semibold text-gray-900">
                  F = A − 5% of A
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Semi-Private Ward</div>
                <div className="font-semibold text-gray-900">F = A</div>
              </div>
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Private Ward</div>
                <div className="font-semibold text-gray-900">
                  F = A + 5% of A
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              Let <b>A</b> = Base CGHS Package Rate, <b>F</b> = Final Rate
              payable.
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <b>Uniform rates</b> (no ward adjustment): radiotherapy,
              investigations, day-care procedures, and minor procedures not
              requiring admission.
            </div>
          </section>

          {/* B) Multiple surgeries same OT session */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              B) Multiple Surgical Procedures in One OT Session (same date)
            </h3>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Scenario</th>
                    <th className="border px-3 py-2 text-left">
                      Reimbursement Rule
                    </th>
                    <th className="border px-3 py-2 text-left">Illustration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border px-3 py-2 font-medium">
                      Primary surgery*
                    </td>
                    <td className="border px-3 py-2">100% of package rate</td>
                    <td className="border px-3 py-2">A = ₹X → reimbursed X</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-3 py-2 font-medium">
                      Second surgery
                    </td>
                    <td className="border px-3 py-2">50% of package rate</td>
                    <td className="border px-3 py-2">
                      B = ₹Y → reimbursed 50% of Y
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border px-3 py-2 font-medium">
                      Third & subsequent
                    </td>
                    <td className="border px-3 py-2">
                      25% of each package rate
                    </td>
                    <td className="border px-3 py-2">
                      C = ₹Z → reimbursed 25% of Z
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-600 mt-2">
              *Primary surgery = surgery with the <b>highest package rate</b>.
              Total (T) = X + 50% of Y + 25% of Z.
            </p>
          </section>

          {/* C) Identical bilateral */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              C) Identical Surgeries at Different Anatomical Sites (e.g.,
              bilateral)
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              If identical procedures are performed at different anatomical
              sites in a single session, the second procedure is reimbursed at{" "}
              <b>50%</b>.
            </p>
            <div className="mt-2 text-sm text-gray-800 bg-gray-50 border rounded-lg p-3">
              Example: Procedure ₹X each side → Total = X + 50% of X
            </div>
          </section>

          {/* D) Within package period */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              D) Procedure within Package Period of Earlier Procedure
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              If a subsequent procedure is performed within the package period
              (typically up to 12 days) of an earlier procedure (same
              admission), it is reimbursed at <b>75%</b> of its applicable
              package rate.
            </p>
            <div className="mt-2 text-sm text-gray-800 bg-gray-50 border rounded-lg p-3">
              Example: Follow-up procedure ₹X within package period → reimbursed
              75% of X
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <b>Package duration (maximum indoor treatment):</b>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>
                  Up to <b>12 days</b> for Specialized (Super Specialties)
                  treatment
                </li>
                <li>
                  Up to <b>7 days</b> for other Major Surgeries
                </li>
                <li>
                  Up to <b>3 days</b> for Laparoscopic / elective angioplasty /
                  normal deliveries
                </li>
                <li>
                  <b>1 day</b> for day-care / minor (OPD) surgeries
                </li>
              </ul>
            </div>
          </section>

          {/* E) Package definition + inclusions */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              E) CGHS Package Rate: Definition & Inclusions
            </h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              CGHS package rate is an <b>all-inclusive</b> lump sum cost from
              admission to discharge, covering the entire
              inpatient/day-care/diagnostic treatment cycle (including emergency
              cases).
            </p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              {[
                "Accommodation + patient diet",
                "Admission/registration charges",
                "Anaesthesia",
                "Medicines + consumables/disposables",
                "Doctor/consultant visits",
                "Dressing + injection + monitoring",
                "ICU/ICCU charges (as applicable)",
                "Operation/OT charges + surgeon fee",
                "Routine essential investigations during admission",
                "Blood transfusion + processing",
                "Equipment (infusion/syringe pump, flowtron etc.)",
                "Physiotherapy/procedural charges",
              ].map((x) => (
                <div key={x} className="border rounded-lg p-3 bg-gray-50">
                  • {x}
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <b>No differential pricing</b> is allowed for outsourced services.
              Package rate applies uniformly.
            </div>
          </section>

          {/* F) Consultation */}
          <section className="border rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">
              F) Consultation Rates
            </h3>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Type</th>
                    <th className="border px-3 py-2 text-left">
                      Payable Fee (₹)
                    </th>
                    <th className="border px-3 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border px-3 py-2 font-medium">
                      OPD – Specialist
                    </td>
                    <td className="border px-3 py-2">₹350</td>
                    <td className="border px-3 py-2">
                      Includes emergency/casualty consultations
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-3 py-2 font-medium">
                      OPD – Super Specialist (DM/MCh)
                    </td>
                    <td className="border px-3 py-2">₹700</td>
                    <td className="border px-3 py-2">
                      Uniform for empanelled hospitals
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border px-3 py-2 font-medium">
                      OPD – Psychiatry
                    </td>
                    <td className="border px-3 py-2">₹700</td>
                    <td className="border px-3 py-2">Enhanced fixed rate</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-3 py-2 font-medium">
                      Indoor (IPD) Consultation
                    </td>
                    <td className="border px-3 py-2">₹350</td>
                    <td className="border px-3 py-2">
                      Flat rate regardless of specialty level
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border px-3 py-2 font-medium">
                      Eye Consultations
                    </td>
                    <td className="border px-3 py-2">₹350</td>
                    <td className="border px-3 py-2">
                      Includes refraction, tonometry, fundus exam
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-600 mt-2">
              Consultation fee includes examination consumables. Each
              consultation is valid for <b>7 days</b> for the same specialty.
            </p>
          </section>

          {/* Footer reference */}
          <div className="text-xs text-gray-500">
            Reference:{" "}
            <span className="font-medium">
              5-16/CGHS(HQ)/HEC/2024(PartI) I/3807087/2025
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 md:px-6 py-3 border-t bg-white flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-semibold text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CghsGuidelinesModal;
CghsGuidelinesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
