import PropTypes from "prop-types";
import {
  getAttemptStatusLabel,
  getStatusClasses,
} from "../../pages/Admin/mocks/mockFormatters";

function AttemptStatusBadge({ status, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        getStatusClasses(status),
        className,
      ].join(" ")}
    >
      {getAttemptStatusLabel(status)}
    </span>
  );
}

AttemptStatusBadge.propTypes = {
  status: PropTypes.string,
  className: PropTypes.string,
};

export default AttemptStatusBadge;
