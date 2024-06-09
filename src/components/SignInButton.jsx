import { useNavigate } from "react-router-dom";
import { PiSignInLight } from "react-icons/pi";

import PropTypes from "prop-types";

const SignInButton = () => {
  console.log("inside SignIn");
  const navigate = useNavigate();
  //When User Clicks on Sign Out button
  const handleSignIn = () => {
    console.log("inside SignIn");
    navigate("/login");

    //verifyToken();
  };

  return (
    <button
      onClick={handleSignIn}
      className={`bg-yellow-500 text-gray-900 px-4 text-sm py-2 rounded hover:bg-yellow-400 flex items-center space-x-2 `}
    >
      <span> Sign In</span>
      <PiSignInLight className="text-yellow-700 text-xl" />
    </button>
  );
};
SignInButton.propTypes = {
  isSideBarOpen: PropTypes.bool,
  toggleSideBar: PropTypes.func,
};

export default SignInButton;
