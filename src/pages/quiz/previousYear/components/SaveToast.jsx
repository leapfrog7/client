import PropTypes from "prop-types";

export default function SaveToast({ isSaved }) {
  if (!isSaved) return null;

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-emerald-700 text-white py-4 px-2 md:text-base rounded-lg shadow-lg z-50 transition-transform duration-500 ease-in-out w-10/12 max-w-xl ${
        isSaved ? "translate-y-20 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <p className="text-base md:text-lg text-center">
        Your session has been saved. You can resume later.
      </p>
    </div>
  );
}

SaveToast.propTypes = {
  isSaved: PropTypes.bool.isRequired,
};
