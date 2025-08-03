// import { useNavigate } from "react-router-dom";
// import { PiSignOutLight } from "react-icons/pi";
// import PropTypes from "prop-types";

// const SignOutButton = ({ isLoggedIn, verifyToken }) => {
//   //console.log("inside Signout");
//   const navigate = useNavigate();
//   //When User Clicks on Sign Out button
//   const handleSignOut = () => {

//     localStorage.removeItem("jwtToken");
//     console.log(isLoggedIn);
//     verifyToken();
//     navigate("/");

//   };

//   return (
//     <button
//       onClick={handleSignOut}
//       className="bg-yellow-500 text-gray-900 px-2 text-xs md:text-sm py-2 rounded hover:bg-yellow-400 flex items-center space-x-1 mx-auto"
//     >
//       <span> Sign Out</span>
//       <PiSignOutLight className="text-yellow-800 text-lg" />
//     </button>
//   );
// };
// SignOutButton.propTypes = {
//   verifyToken: PropTypes.func,
//   isLoggedIn: PropTypes.bool,
// };

// export default SignOutButton;
// //

import { useNavigate } from "react-router-dom";
import { PiSignOutLight } from "react-icons/pi";
import { jwtDecode } from "jwt-decode"; // 👈 Correct import
import PropTypes from "prop-types";

const SignOutButton = ({ verifyToken }) => {
  const navigate = useNavigate();

  // Decode token to get userType
  let isAdmin = false;
  const token = localStorage.getItem("jwtToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.userType === "Admin";
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    verifyToken();
    navigate("/");
  };

  // Navigate to admin dashboard
  const handleAdminClick = () => {
    navigate("/adminDashboard");
  };

  return (
    <div className="flex gap-2 items-center">
      {isAdmin && (
        <button
          onClick={handleAdminClick}
          className="bg-black text-white px-2 text-xs md:text-sm py-2 rounded hover:bg-gray-600 flex items-center space-x-1 "
        >
          Admin 👨‍💼
        </button>
      )}

      <button
        onClick={handleSignOut}
        className="bg-yellow-500 text-gray-900 px-2 text-xs md:text-sm py-2 rounded hover:bg-yellow-400 flex items-center space-x-1"
      >
        <span>Sign Out</span>
        <PiSignOutLight className="text-yellow-800 text-lg" />
      </button>
    </div>
  );
};

SignOutButton.propTypes = {
  verifyToken: PropTypes.func,
  isLoggedIn: PropTypes.bool,
};

export default SignOutButton;
