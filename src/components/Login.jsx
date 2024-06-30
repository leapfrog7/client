import Input from "./Input";
import Label from "./Label";
import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import Loading from "./Loading";
import { Helmet } from "react-helmet";

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
        <link rel="canonical" href="https://undersigned.netlify.app/login" />
        <meta property="og:title" content="Login - UnderSigned" />
        <meta
          property="og:description"
          content="Log in to UnderSigned to continue taking quizzes and tracking your progress. Enter your registered email and password to access your account."
        />
        <meta
          property="og:url"
          content="https://undersigned.netlify.app/login"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      {loading && <Loading />} {/* Render the loading spinner if loading */}
      {/* Render this component if not loading */}
      <div className="flex flex-col items-center justify-center p-4">
        {!loading && (
          <div className="w-11/12 md:w-2/5 flex flex-col gap-4 mt-8 mx-auto shadow-lg rounded-lg space-y-6 p-10 bg-white">
            <h2 className="text-center text-xl font-bold text-customBlue">
              Login Page
            </h2>
            <div className="relative h-11 w-full min-w-[200px]">
              <Input onChange={handleUserInput} value={userInput} />
              <Label labelText="Mobile" />
            </div>
            <div className="relative h-11 w-full min-w-[200px]">
              <Input
                type="password"
                onChange={handlePasswordInput}
                value={passwordInput}
              />
              <Label labelText="Password" />
            </div>
            <div className="text-center" onClick={handleCredentialCheck}>
              <Button buttonText="Sign In" />
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
