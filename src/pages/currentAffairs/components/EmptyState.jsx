import PropTypes from "prop-types";

const EmptyState = ({ title, desc }) => {
  return (
    <div className="mx-2 mt-3 rounded-2xl border bg-white p-6 text-center shadow-sm">
      <div className="text-lg font-bold text-gray-800">{title}</div>
      {desc && <div className="mt-2 text-sm text-gray-600">{desc}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
};

export default EmptyState;
