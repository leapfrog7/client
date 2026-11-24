import PropTypes from "prop-types";
import { FaWhatsapp } from "react-icons/fa";
import { readSession } from "../auth/session";
import { trialRequestUrl } from "../util/trialSupport";

export default function TrialApprovalNotice({ mobile = "", compact = false }) {
  const registeredMobile = mobile || readSession()?.mobile || "";
  return (
    <section aria-label="Trial approval" className="min-w-0 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
      {!compact && <h2 className="text-lg font-semibold">Trial access requires approval</h2>}
      <p className={compact ? "text-sm leading-6" : "mt-2 text-sm leading-6"}>
        Registration and signing in do not start a trial. Contact UnderSigned on
        WhatsApp using your registered mobile number. An Admin reviews each request.
      </p>
      <p className="mt-2 text-sm leading-6">
        If approved, your 24-hour trial starts when the Admin enables it.
      </p>
      <a href={trialRequestUrl(registeredMobile)} target="_blank" rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md bg-[#16075a] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
        <FaWhatsapp aria-hidden="true" className="shrink-0" />
        Request trial on WhatsApp
      </a>
    </section>
  );
}
TrialApprovalNotice.propTypes = { mobile: PropTypes.string, compact: PropTypes.bool };

