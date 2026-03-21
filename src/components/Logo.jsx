import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <>
      {/* Logo */}
      <Link
        to="/"
        className="text-white flex items-center space-x-0 lg:space-x-2"
      >
        <img src="/logo.png" alt="Logo" width={50} />
        <span className="text-lg lg:text-xl lg:tracking-wider text-shadow font-semibold lg:font-bold">
          UnderSigned
        </span>
      </Link>
    </>
  );
}
