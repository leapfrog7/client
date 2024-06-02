import PropTypes from "prop-types";

Button.propTypes = {
  buttonText: PropTypes.string.isRequired,
};

export default function Button({ buttonText }) {
  return (
    <button
      className="mt-5 middle none center rounded-lg bg-blue-700 py-3 px-6 font-sans text-xs font-bold upper text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      data-ripple-light="true"
    >
      {buttonText}
    </button>
  );
}
