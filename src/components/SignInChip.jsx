import { useNavigate } from "react-router-dom";
import { PiSignInLight } from "react-icons/pi";

export default function SignInChip() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/login")}
      className="
        inline-flex items-center gap-2
        h-9 px-3 rounded-full
        border border-white/25 bg-white/10 text-white
        hover:bg-white/15 hover:border-white/35
        active:scale-[0.98]
        transition
        focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-customBlue
      "
      aria-label="Sign in"
      title="Sign in"
    >
      <PiSignInLight className="text-lg" />
      <span className="hidden sm:inline text-sm font-semibold">Sign in</span>
    </button>
  );
}
