import PropTypes from "prop-types";

export default function AnalysisControlBar({ children }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      {children}
    </div>
  );
}

AnalysisControlBar.propTypes = {
  children: PropTypes.node,
};
