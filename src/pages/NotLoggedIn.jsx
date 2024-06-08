import { Link } from "react-router-dom";

const NotLoggedIn = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <p className="mb-4">Please log in to access this page.</p>
        <Link to="/login" className="text-blue-500 underline">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};

export default NotLoggedIn;
