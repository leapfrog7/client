import Input from "./Input";
import Label from "./Label";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Loading from "./Loading";
import { Helmet } from "react-helmet";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

Login.propTypes = {
  verifyToken: PropTypes.func,
};

export default function Login({ verifyToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl") || "/";

  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
  // const BASE_URL = "http://localhost:5000/api/v1";

  const canSubmit =
    userInput.trim().length >= 8 && passwordInput.length >= 4 && !loading;

  const handleCredentialCheck = async (e) => {
    e?.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        mobile: userInput.trim(),
        password: passwordInput,
      });

      localStorage.setItem("jwtToken", response.data.token);
      verifyToken?.();
      navigate(returnUrl, { replace: true });
      // Clear only on success
      setUserInput("");
      setPasswordInput("");
    } catch (error) {
      console.log(error);
      const serverMsg =
        error?.response?.data?.msg ||
        "Login failed. Please check your credentials and try again.";
      setMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUserInput = (event) => setUserInput(event.target.value);
  const handlePasswordInput = (event) => setPasswordInput(event.target.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Helmet>
        <title>Login - UnderSigned</title>
        <meta
          name="description"
          content="Log in to UnderSigned to continue taking quizzes and tracking your progress. Enter your registered mobile number and password to access your account."
        />
        <link rel="canonical" href="https://undersigned.in/login" />
        <meta property="og:title" content="Login - UnderSigned" />
        <meta
          property="og:description"
          content="Log in to UnderSigned to continue taking quizzes and tracking your progress."
        />
        <meta property="og:url" content="https://undersigned.in/login" />
        <meta property="og:type" content="website" />
      </Helmet>

      {loading && <Loading />}

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Top brand area */}
          <div className="mb-8 text-center">
            <h1 className="mt-5 text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
              Continue your LDCE preparation and track your progress seamlessly.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="p-6 sm:p-8">
              <p className="p-2 rounded-md text-center font-bold tracking-widest text-white rounded-base bg-blue-700">
                LOGIN
              </p>
              {/* Message (error/success) */}
              {msg && (
                <div
                  className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                    msg.toLowerCase().includes("success")
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {msg}
                </div>
              )}

              <form onSubmit={handleCredentialCheck} className="space-y-5 pt-6">
                {/* Mobile */}
                <div className="relative h-11 w-full min-w-[200px] flex items-center gap-2">
                  <Input
                    onChange={handleUserInput}
                    value={userInput}
                    inputMode="numeric"
                    autoComplete="tel"
                    aria-label="Mobile number"
                  />
                  <Label labelText="Mobile" />
                  <IoIosPhonePortrait className="text-2xl absolute right-2 text-gray-400 peer-focus:text-blue-500" />
                </div>

                {/* Password */}
                <div className="relative h-11 w-full min-w-[200px] flex items-center gap-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={handlePasswordInput}
                    value={passwordInput}
                    autoComplete="current-password"
                    aria-label="Password"
                  />
                  <Label labelText="Password" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible className="text-xl" />
                    ) : (
                      <AiFillEye className="text-xl" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Use the mobile number you registered with.
                  </p>
                  <Link
                    to="/reset-password"
                    className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    Reset password
                  </Link>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full rounded-xl py-3 px-4 font-semibold shadow-sm transition
                    flex items-center justify-center gap-2
                    ${
                      canSubmit
                        ? "bg-gradient-to-r from-blue-800 to-indigo-900 text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <FaSignInAlt className="text-base" />
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Register */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Don&apos;t have an account?
                </p>

                <Link
                  to="/register"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full
                             bg-gradient-to-r from-rose-700 to-pink-600 px-5 py-2.5
                             text-white font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition"
                >
                  <FaUserPlus className="text-lg" />
                  <span>Register Now</span>
                </Link>
              </div>
            </div>

            {/* Bottom subtle bar */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500 rounded-b-2xl">
              By signing in, you agree to our{" "}
              <Link
                to="/PrivacyPolicy"
                className="text-blue-700 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>

          {/* Small footer hint */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Trouble signing in? Try resetting your password or contact support
            via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
