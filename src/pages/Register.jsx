import Input from "../components/Input";
import Label from "../components/Label";
import { useState } from "react";
import axios from "axios";
///import { jwtDecode } from "jwt-decode";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";

import Button from "../components/Button";
export default function Register() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  //const [decodedToken, setDecodedToken] = useState(null);
  //const [username, setUsername] = useState(null);
  const [error, setError] = useState(""); //to handle error from server
  const [errors, setErrors] = useState({}); //This will store the validation error that may happen on frontend
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleMobileChange(event) {
    setMobile(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleBatchChange(event) {
    setBatch(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    } else if (!/^[5-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must start with 5 or higher digit";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    // if (!batch) newErrors.batch = "Batch year is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(BASE_URL + "/register", {
        name: name,
        password: password,
        mobile: mobile,
        batch: batch,
        email: email,
      });

      //clearing the fields on successful response
      setName("");
      setPassword("");
      setMobile("");
      setBatch("");
      setEmail("");
      setConfirmPassword("");

      //retrieving token from response
      //const { token } = response.data; // Extract token from response
      setData(response.data);
      console.log(data);
      console.log(response.data);
      setMsg("Registered Successfully!");

      //Decoding the Token Received
      //const decoded = jwtDecode(token);
      //setDecodedToken(decoded);
      //console.log(decoded); // Log the decoded token
      //console.log(decodedToken);

      // setting the UserName in Front End
      //setUsername(decoded.name);
      // Set registration status to true to hide the form and show confetti
      setIsRegistered(true);
      //Show Confetti on successful registration
      setShowConfetti(true);
      setRunConfetti(true);
      // Stop confetti after 2-3 seconds and let it fall gracefully
      //setTimeout(() => {
      // setRunConfetti(false);
      setTimeout(() => setShowConfetti(false), 2000); // Let the confetti fall gracefully
      //}, 2000);
    } catch (error) {
      setError(error.response.data.msg);
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          run={runConfetti}
          recycle={false}
          numberOfPieces={400}
          gravity={0.2}
        />
      )}
      <div className="container mx-auto md:w-2/3 lg:w-1/2">
        {/* {username && <div> Hi, {username}</div>} */}
        {!isRegistered && (
          <>
            <p className="m-3 font-bold text-blue-700">Registration</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <Input type="text" onChange={handleNameChange} value={name} />
                <Label labelText="Name"></Label>
                {errors.name && (
                  <div className="text-red-600 text-xs">{errors.name}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <Input
                  type="text"
                  onChange={handleMobileChange}
                  value={mobile}
                />
                <Label labelText="Mobile"></Label>
                {errors.mobile && (
                  <div className="text-red-600 text-xs">{errors.mobile}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
                <Input type="text" onChange={handleEmailChange} value={email} />
                <Label labelText="Email"></Label>
                {errors.email && (
                  <div className="text-red-600 text-xs">{errors.email}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
                <Input type="text" onChange={handleBatchChange} value={batch} />
                <Label labelText="Batch Year"></Label>
                {errors.batch && (
                  <div className="text-red-600 text-xs">{errors.batch}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <Input
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                />
                <Label labelText="Password"></Label>
                {errors.password && (
                  <div className="text-red-600 text-xs">{errors.password}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <Input
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                />
                <Label labelText="Confirm Password"></Label>
                {errors.confirmPassword && (
                  <div className="text-red-600 text-xs">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center" onClick={registerUser}>
              <Button buttonText="Register" />
            </div>
          </>
        )}
        {msg && (
          <div className="mt-6 text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="text-lg font-semibold">{msg}</p>
            <Link
              to="/login"
              className="text-blue-700 underline mt-2 inline-block"
            >
              Click Here to Login
            </Link>
          </div>
        )}

        {error && !isRegistered && (
          <div className="mt-6 text-center p-4 bg-red-100 text-red-800 rounded-lg">
            <p className="text-lg font-semibold">
              The Mobile Number already exists
            </p>
          </div>
        )}
      </div>
    </>
  );
}
