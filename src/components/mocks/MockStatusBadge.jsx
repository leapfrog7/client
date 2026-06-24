import PropTypes from "prop-types";
import {
  getComputedStatusLabel,
  getStatusClasses,
} from "../../pages/Admin/mocks/mockFormatters";

function MockStatusBadge({ status, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        getStatusClasses(status),
        className,
      ].join(" ")}
    >
      {getComputedStatusLabel(status)}
    </span>
  );
}

MockStatusBadge.propTypes = {
  status: PropTypes.string,
  className: PropTypes.string,
};

export default MockStatusBadge;
