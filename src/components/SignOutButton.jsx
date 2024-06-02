import { useNavigate } from "react-router-dom";
import { PiSignOutLight } from "react-icons/pi";
import PropTypes from "prop-types";

const SignOutButton = ({ verifyToken }) => {
  console.log("inside Signout");
  const navigate = useNavigate();
  //When User Clicks on Sign Out button
  const handleSignOut = () => {
    // Remove the JWT from local storage
    console.log(localStorage.getItem("jwtToken") + 4);
    console.log("inside handlesignout");
    console.log(localStorage.getItem("jwtToken"));
    navigate("/");
    localStorage.removeItem("jwtToken");
    verifyToken();
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-yellow-500 text-gray-900 px-4 text-sm py-2 rounded hover:bg-yellow-400 flex items-center space-x-2"
    >
      <span> Sign Out</span>
      <PiSignOutLight className="text-yellow-700 text-xl" />
    </button>
  );
};
SignOutButton.propTypes = {
  verifyToken: PropTypes.func,
};

export default SignOutButton;
