import PropTypes from "prop-types";

export default function Input({ type, onChange, value, onFocus, onBlur }) {
  return (
    <input
      className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
      placeholder=" "
      onChange={onChange}
      value={value}
      type={type === "password" ? "password" : "text"}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
Input.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};
