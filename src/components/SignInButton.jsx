import { useNavigate } from "react-router-dom";
import { PiSignInLight } from "react-icons/pi";

const SignInButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/login")}
      className="
        inline-flex items-center justify-center gap-2
        h-10 px-3 rounded-lg
        border border-slate-200 bg-white text-slate-700
        hover:bg-slate-50 transition
        focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
      "
      title="Sign in"
      aria-label="Sign in"
    >
      <PiSignInLight className="text-xl" />
      <span className="hidden sm:inline text-xs font-semibold">Sign in</span>
    </button>
  );
};

export default SignInButton;
