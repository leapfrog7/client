import { Link } from "react-router-dom";

const TokenExpired = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
        <p className="mb-4">
          Your session has expired. Please log in again to continue.
        </p>
        <Link to="/login" className="text-blue-500 underline">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};

export default TokenExpired;
