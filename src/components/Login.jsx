import Input from "./Input";
import Label from "./Label";
// import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import Loading from "./Loading";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { IoIosPhonePortrait } from "react-icons/io";
// import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

Login.propTypes = {
  verifyToken: PropTypes.func,
};

export default function Login({ verifyToken }) {
  const [data, setData] = useState(null);
  //const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //function to check credentials when sing In button is clicked
  const handleCredentialCheck = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://server-v4dy.onrender.com/api/v1/login",
        {
          mobile: userInput,
          password: passwordInput,
        }
      );
      setData(response);
      // Store the token in local storage
      localStorage.setItem("jwtToken", response.data.token);
      verifyToken();
      //console.log(response.data);
      if (data) console.log("");
      navigate("/");
    } catch (error) {
      console.log(error);
      //on encountering any error, this msg will show
      setMsg(error.response.data.msg);
    } finally {
      setLoading(false);
      setUserInput("");
      setPasswordInput("");
      setData(null);
    }
  };

  // Function to set the User Input Field
  function handleUserInput(event) {
    //console.log(event.target.value);
    setUserInput(event.target.value);
  }

  // Function to set the User Password Field
  function handlePasswordInput(event) {
    //console.log(event.target.value);
    setPasswordInput(event.target.value);
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: "url('/loginBackground.png')" }}
    >
      <Helmet>
        <title>Login - UnderSigned</title>
        <meta
          name="description"
          content="Log in to UnderSigned to continue taking quizzes and tracking your progress. Enter your registered email and password to access your account."
        />
        <link rel="canonical" href="https://undersigned.in/login" />
        <meta property="og:title" content="Login - UnderSigned" />
        <meta
          property="og:description"
          content="Log in to UnderSigned to continue taking quizzes and tracking your progress. Enter your registered email and password to access your account."
        />
        <meta property="og:url" content="https://undersigned.in/login" />
        <meta property="og:type" content="website" />
      </Helmet>
      {loading && <Loading />} {/* Render the loading spinner if loading */}
      {/* Render this component if not loading */}
      <div className="flex flex-col items-center justify-center p-4">
        {!loading && (
          <div className="w-11/12 md:w-2/5 flex flex-col gap-4 mt-8 mx-auto shadow-lg rounded-lg space-y-6 p-10 bg-gradient-to-r from-white to-amber-50">
            <h2 className="text-center text-xl font-bold text-blue-700">
              Log in to your account
            </h2>
            <div className="relative h-11 w-full min-w-[200px] flex items-center gap-2">
              <Input onChange={handleUserInput} value={userInput} />
              <Label labelText="Mobile" />
              <IoIosPhonePortrait className="text-2xl absolute right-2 text-gray-400 peer-focus:text-blue-500" />
            </div>
            <div className="relative h-11 w-full min-w-[200px] flex items-center gap-1">
              <Input
                type={showPassword ? "text" : "password"}
                onChange={handlePasswordInput}
                value={passwordInput}
              />
              <Label labelText="Password" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-xl" />
                ) : (
                  <AiFillEye className="text-xl" />
                )}
              </button>
            </div>

            <div className="w-full text-right text-sm text-blue-700 hover:underline hover:text-blue-800">
              <Link to="/reset-password">Reset your password</Link>
            </div>

            <div
              className="text-center mx-auto"
              onClick={handleCredentialCheck}
            >
              <button
                onClick={handleCredentialCheck}
                className="w-full sm:w-48 bg-gradient-to-r from-blue-800 to-indigo-900 hover:bg-blue-700 text-white font-semibold py-3 px-12 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 flex items-center justify-center gap-2"
              >
                <FaSignInAlt className="text-base" />
                <span>Sign In</span>
              </button>
            </div>

            <div className="mx-auto text-center mt-2 flex items-center flex-col md:flex-row gap-2">
              <p className="text-base text-gray-600">
                Don&apos;t have an account?
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-2 text-white font-semibold hover:text-white bg-gradient-to-r from-rose-700 to-pink-600 hover:bg-blue-600 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaUserPlus className="text-lg" />
                <span>Register Now</span>
              </Link>
            </div>

            {msg && (
              <div
                className={`mb-4 text-center p-2 rounded-lg ${
                  msg.includes("Success")
                    ? "text-green-800 bg-green-100"
                    : "text-red-800 bg-red-100"
                }`}
              >
                {msg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
