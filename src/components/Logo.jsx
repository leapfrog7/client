import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <>
      {/* Logo */}
      <Link to="/" className="text-white flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" width={60} />
        <span className="text-xl tracking-wider text-shadow font-bold">
          UnderSigned
        </span>
      </Link>
    </>
  );
}
