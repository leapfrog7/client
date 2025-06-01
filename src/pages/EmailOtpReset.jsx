import { useState } from "react";
import axios from "axios";

const EmailOtpReset = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "https://server-v4dy.onrender.com";
  //   const BASE_URL = "http://localhost:5000";

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/send-reset-otp`, {
        email,
      });
      setOtpSent(true);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify-reset-otp`, {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Reset Your Password
      </h2>

      {message && (
        <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
      )}
      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              disabled={loading || !otp || !newPassword}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailOtpReset;
