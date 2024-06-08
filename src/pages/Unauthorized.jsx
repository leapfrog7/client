import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p className="mb-4">You are not authorized to access this page.</p>
        <Link to="/" className="text-blue-500 underline">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
