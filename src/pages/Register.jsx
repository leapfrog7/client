// import Input from "../components/Input";
// import Label from "../components/Label";
// import { useState } from "react";
// import axios from "axios";
// ///import { jwtDecode } from "jwt-decode";
// import Confetti from "react-confetti";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import TermsAndConditions from "../components/TermsAndConditions";
// import {
//   FaUser,
//   FaMobileAlt,
//   FaEnvelope,
//   FaCalendarAlt,
//   FaLock,
//   FaCheckCircle,
// } from "react-icons/fa";

// import Button from "../components/Button";
// import RegistrationSteps from "../components/RegistrationSteps";
// export default function Register() {
//   const [name, setName] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");
//   const [batch, setBatch] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [data, setData] = useState("");
//   const [msg, setMsg] = useState("");
//   //const [decodedToken, setDecodedToken] = useState(null);
//   //const [username, setUsername] = useState(null);
//   const [error, setError] = useState(""); //to handle error from server
//   const [errors, setErrors] = useState({}); //This will store the validation error that may happen on frontend
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [runConfetti, setRunConfetti] = useState(false);

//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   //States for the input fields
//   const [isNameFocused, setIsNameFocused] = useState(false);
//   const [isMobileFocused, setIsMobileFocused] = useState(false);
//   const [isEmailFocused, setIsEmailFocused] = useState(false);
//   const [isBatchFocused, setIsBatchFocused] = useState(false);
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
//   const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
//     useState(false);

//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

//   function handleNameChange(event) {
//     setName(event.target.value);
//   }

//   function handleMobileChange(event) {
//     setMobile(event.target.value);
//   }

//   function handleEmailChange(event) {
//     setEmail(event.target.value);
//   }

//   function handleBatchChange(event) {
//     setBatch(event.target.value);
//   }

//   function handlePasswordChange(event) {
//     setPassword(event.target.value);
//   }

//   function handleConfirmPasswordChange(event) {
//     setConfirmPassword(event.target.value);
//   }

//   const validateForm = () => {
//     const newErrors = {};
//     if (!name) newErrors.name = "Name is required";
//     if (!mobile) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (mobile.length !== 10) {
//       newErrors.mobile = "Mobile number must be 10 digits";
//     } else if (!/^[5-9]\d{9}$/.test(mobile)) {
//       newErrors.mobile = "Mobile number must start with 5 or higher digit";
//     }
//     if (!email) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Invalid email format";
//     }
//     // if (!batch) newErrors.batch = "Batch year is required";
//     if (!password) newErrors.password = "Password is required";
//     if (password !== confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     if (!agreeTerms)
//       newErrors.agreeTerms = "You must agree to the Terms & Conditions";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const registerUser = async () => {
//     if (!validateForm()) return;

//     try {
//       const response = await axios.post(BASE_URL + "/register", {
//         name: name,
//         password: password,
//         mobile: mobile,
//         batch: batch,
//         email: email,
//       });

//       //clearing the fields on successful response
//       setName("");
//       setPassword("");
//       setMobile("");
//       setBatch("");
//       setEmail("");
//       setConfirmPassword("");

//       //retrieving token from response
//       //const { token } = response.data; // Extract token from response
//       setData(response.data);
//       console.log(data);
//       console.log(response.data);
//       setMsg("Registered Successfully!");

//       //Decoding the Token Received
//       //const decoded = jwtDecode(token);
//       //setDecodedToken(decoded);
//       //console.log(decoded); // Log the decoded token
//       //console.log(decodedToken);

//       // setting the UserName in Front End
//       //setUsername(decoded.name);
//       // Set registration status to true to hide the form and show confetti
//       setIsRegistered(true);
//       //Show Confetti on successful registration
//       setShowConfetti(true);
//       setRunConfetti(true);
//       // Stop confetti after 2-3 seconds and let it fall gracefully
//       //setTimeout(() => {
//       // setRunConfetti(false);
//       setTimeout(() => setShowConfetti(false), 2000); // Let the confetti fall gracefully
//       //}, 2000);
//     } catch (error) {
//       setError(error.response.data.msg);
//     }
//   };

//   return (
//     <>
//       {showConfetti && (
//         <Confetti
//           run={runConfetti}
//           recycle={false}
//           numberOfPieces={400}
//           gravity={0.3}
//         />
//       )}
//       <div className="container mx-auto md:w-2/3 lg:w-1/2 shadow-xl p-4 rounded-lg">
//         <Helmet>
//           <title>Register - UnderSigned</title>
//           <meta
//             name="description"
//             content="Create an account on UnderSigned to start taking quizzes and tracking your progress. Registration is quick and easy."
//           />
//           <link rel="canonical" href="https://undersigned.in/register" />
//           <meta property="og:title" content="Register - UnderSigned" />
//           <meta
//             property="og:description"
//             content="Create an account on UnderSigned to start taking quizzes and tracking your progress. Registration is quick and easy."
//           />
//           <meta property="og:url" content="https://undersigned.in/register" />
//           <meta property="og:type" content="website" />
//         </Helmet>
//         {/* {username && <div> Hi, {username}</div>} */}
//         {!isRegistered && (
//           <>
//             <h2 className="text-2xl font-bold text-center mt-8 p-2 bg-gradient-to-r from-emerald-200 to-cyan-200 rounded-lg text-gray-600">
//               Create an Account
//             </h2>
//             <p className="text-center text-gray-600 mt-2 mb-8">
//               Register and start your journey today!
//             </p>

//             {/* <p className="m-3 font-bold text-blue-700">Registration</p> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
//                 <FaUser
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isNameFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="text"
//                   onChange={handleNameChange}
//                   value={name}
//                   onFocus={() => setIsNameFocused(true)}
//                   onBlur={() => setIsNameFocused(false)}
//                 />
//                 <Label labelText="Name"></Label>
//                 {errors.name && (
//                   <div className="text-red-600 text-xs">{errors.name}</div>
//                 )}
//               </div>

//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
//                 <FaMobileAlt
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isMobileFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="text"
//                   onChange={handleMobileChange}
//                   value={mobile}
//                   onFocus={() => setIsMobileFocused(true)}
//                   onBlur={() => setIsMobileFocused(false)}
//                 />
//                 <Label labelText="Mobile"></Label>
//                 {errors.mobile && (
//                   <div className="text-red-600 text-xs">{errors.mobile}</div>
//                 )}
//               </div>

//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
//                 <FaEnvelope
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isEmailFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="text"
//                   onChange={handleEmailChange}
//                   value={email}
//                   className="pl-10"
//                   onFocus={() => setIsEmailFocused(true)}
//                   onBlur={() => setIsEmailFocused(false)}
//                 />
//                 <Label labelText="Email"></Label>
//                 {errors.email && (
//                   <div className="text-red-600 text-xs">{errors.email}</div>
//                 )}
//               </div>

//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
//                 <FaCalendarAlt
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isBatchFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="text"
//                   onChange={handleBatchChange}
//                   value={batch}
//                   className="pl-10"
//                   onFocus={() => setIsBatchFocused(true)}
//                   onBlur={() => setIsBatchFocused(false)}
//                 />
//                 <Label labelText="Batch Year"></Label>
//                 {errors.batch && (
//                   <div className="text-red-600 text-xs">{errors.batch}</div>
//                 )}
//               </div>

//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
//                 <FaLock
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isPasswordFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="password"
//                   onChange={handlePasswordChange}
//                   value={password}
//                   className="pl-10"
//                   onFocus={() => setIsPasswordFocused(true)}
//                   onBlur={() => setIsPasswordFocused(false)}
//                 />
//                 <Label labelText="Password"></Label>
//                 {errors.password && (
//                   <div className="text-red-600 text-xs">{errors.password}</div>
//                 )}
//               </div>

//               <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
//                 <FaCheckCircle
//                   className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                     isConfirmPasswordFocused ? "text-blue-500" : "text-gray-400"
//                   }`}
//                 />
//                 <Input
//                   type="password"
//                   onChange={handleConfirmPasswordChange}
//                   value={confirmPassword}
//                   className="pl-10"
//                   onFocus={() => setIsConfirmPasswordFocused(true)}
//                   onBlur={() => setIsConfirmPasswordFocused(false)}
//                 />
//                 <Label labelText="Confirm Password"></Label>
//                 {errors.confirmPassword && (
//                   <div className="text-red-600 text-xs">
//                     {errors.confirmPassword}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center my-4">
//               <input
//                 type="checkbox"
//                 id="agreeTerms"
//                 checked={agreeTerms}
//                 onChange={() => setAgreeTerms(!agreeTerms)}
//                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="agreeTerms" className="ml-2 text-gray-600">
//                 I agree to the
//                 <button
//                   type="button"
//                   onClick={() => setShowTermsModal(true)}
//                   className="text-blue-500 underline ml-1 hover:text-blue-700"
//                 >
//                   Terms & Conditions
//                 </button>
//               </label>
//             </div>
//             {errors.agreeTerms && (
//               <div className="text-red-600 text-xs">{errors.agreeTerms}</div>
//             )}

//             <div className="text-center" onClick={registerUser}>
//               <Button buttonText="Register" />
//             </div>
//           </>
//         )}

//         {showTermsModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2/3 max-h-[95vh] overflow-y-auto relative">
//               <button
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
//                 onClick={() => setShowTermsModal(false)}
//               >
//                 ✕
//               </button>

//               <div className=" p-2 overflow-y-auto border-t border-gray-200">
//                 <TermsAndConditions />
//               </div>
//               <div className="text-right mt-4">
//                 <button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
//                   onClick={() => setShowTermsModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {msg && (
//           <div className="mt-6 text-center p-4 bg-green-100 text-green-800 rounded-lg">
//             <p className="text-lg font-semibold">{msg}</p>
//             <Link
//               to="/login"
//               className="text-blue-700 underline mt-2 inline-block"
//             >
//               Click Here to Login
//             </Link>
//           </div>
//         )}

//         {error && !isRegistered && (
//           <div className="mt-6 text-center p-4 bg-red-100 text-red-800 rounded-lg">
//             <p className="text-lg font-semibold">
//               The Mobile Number or Email already exist!
//             </p>
//           </div>
//         )}

//         {!isRegistered && <RegistrationSteps />}
//       </div>
//     </>
//   );
// }

import Input from "../components/Input";
import Label from "../components/Label";
import { useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TermsAndConditions from "../components/TermsAndConditions";
import {
  FaUser,
  FaMobileAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaLock,
  FaCheckCircle,
  FaClock,
  FaCrown,
  FaBookOpen,
} from "react-icons/fa";
import Button from "../components/Button";
import RegistrationSteps from "../components/RegistrationSteps";

export default function Register() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(""); // server error
  const [errors, setErrors] = useState({}); // client-side validation
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isBatchFocused, setIsBatchFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1";

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleMobileChange(e) {
    setMobile(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handleBatchChange(e) {
    setBatch(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
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
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms)
      newErrors.agreeTerms = "You must agree to the Terms & Conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(BASE_URL + "/register", {
        name,
        password,
        mobile,
        batch,
        email,
      });

      // clear fields
      setName("");
      setPassword("");
      setMobile("");
      setBatch("");
      setEmail("");
      setConfirmPassword("");

      // optional: log if you still want to inspect the payload
      // console.log(response.data);

      setMsg(
        "Registered Successfully! Your 24-hour free trial will start on your first login."
      );
      setIsRegistered(true);

      setShowConfetti(true);
      setRunConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.msg || "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          run={runConfetti}
          recycle={false}
          numberOfPieces={400}
          gravity={0.3}
        />
      )}

      <div className="container mx-auto md:w-2/3 lg:w-1/2 shadow-xl p-4 rounded-lg">
        <Helmet>
          <title>Register - UnderSigned</title>
          <meta
            name="description"
            content="Create an account on UnderSigned to start your 24-hour full-access trial. Practice quizzes, Previous Year Questions, and more."
          />
          <link rel="canonical" href="https://undersigned.in/register" />
          <meta property="og:title" content="Register - UnderSigned" />
          <meta
            property="og:description"
            content="Register to unlock a 24-hour full-access trial: dashboard, quizzes, PYQ, and progress reset included."
          />
          <meta property="og:url" content="https://undersigned.in/register" />
          <meta property="og:type" content="website" />
        </Helmet>

        {!isRegistered && (
          <>
            <h2 className="text-2xl font-bold text-center mt-8 p-2 bg-gradient-to-r from-emerald-200 to-cyan-200 rounded-lg text-gray-600">
              Create an Account
            </h2>
            <p className="text-center text-gray-600 mt-2 mb-4">
              Register and start your journey today!
            </p>

            {/* Trial highlight */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <FaCrown className="shrink-0" />
                <span>Enjoy a 24-hour Full-Access Trial</span>
              </div>
              <ul className="mt-3 text-sm text-amber-900 space-y-2 list-disc list-inside">
                <li className="flex items-start gap-2">
                  <FaClock className="mt-[2px] shrink-0" />
                  <span>
                    Trial starts on your <strong>first login</strong> and ends
                    automatically after 24 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaBookOpen className="mt-[2px] shrink-0" />
                  <span>
                    Includes <strong>Dashboard</strong>,{" "}
                    <strong>All Quizzes</strong>, and{" "}
                    <strong>Previous Year Questions</strong>.
                  </span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <FaCheckCircle className="mt-[2px] shrink-0" />
                  <span>
                    <strong>Reset progress</strong> is enabled during the trial
                    as well.
                  </span>
                </li> */}
              </ul>
              <p className="mt-3 text-xs text-amber-700">
                Upgrade anytime to keep full access after your trial ends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <FaUser
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isNameFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="text"
                  onChange={handleNameChange}
                  value={name}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
                <Label labelText="Name" />
                {errors.name && (
                  <div className="text-red-600 text-xs">{errors.name}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <FaMobileAlt
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isMobileFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="text"
                  onChange={handleMobileChange}
                  value={mobile}
                  onFocus={() => setIsMobileFocused(true)}
                  onBlur={() => setIsMobileFocused(false)}
                />
                <Label labelText="Mobile" />
                {errors.mobile && (
                  <div className="text-red-600 text-xs">{errors.mobile}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
                <FaEnvelope
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isEmailFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="text"
                  onChange={handleEmailChange}
                  value={email}
                  className="pl-10"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                <Label labelText="Email" />
                {errors.email && (
                  <div className="text-red-600 text-xs">{errors.email}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px] my-2">
                <FaCalendarAlt
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isBatchFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="text"
                  onChange={handleBatchChange}
                  value={batch}
                  className="pl-10"
                  onFocus={() => setIsBatchFocused(true)}
                  onBlur={() => setIsBatchFocused(false)}
                />
                <Label labelText="Batch Year" />
                {errors.batch && (
                  <div className="text-red-600 text-xs">{errors.batch}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <FaLock
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isPasswordFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="password"
                  onChange={handlePasswordChange}
                  value={password}
                  className="pl-10"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <Label labelText="Password" />
                {errors.password && (
                  <div className="text-red-600 text-xs">{errors.password}</div>
                )}
              </div>

              <div className="relative h-11 sm:min-w-[50px] mx-2 md:min-w-[200px]">
                <FaCheckCircle
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isConfirmPasswordFocused ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="password"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  className="pl-10"
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <Label labelText="Confirm Password" />
                {errors.confirmPassword && (
                  <div className="text-red-600 text-xs">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center my-4">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-gray-600">
                I agree to the
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-blue-500 underline ml-1 hover:text-blue-700"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>
            {errors.agreeTerms && (
              <div className="text-red-600 text-xs">{errors.agreeTerms}</div>
            )}

            <div className="text-center" onClick={registerUser}>
              <Button buttonText="Register" />
            </div>
          </>
        )}

        {showTermsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2/3 max-h-[95vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowTermsModal(false)}
              >
                ✕
              </button>

              <div className="p-2 overflow-y-auto border-t border-gray-200">
                <TermsAndConditions />
              </div>
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setShowTermsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {msg && (
          <div className="mt-6 text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="text-lg font-semibold">{msg}</p>
            <p className="text-sm mt-1">Log in now to begin your trial.</p>
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
              The Mobile Number or Email already exist!
            </p>
          </div>
        )}

        {!isRegistered && <RegistrationSteps />}
      </div>
    </>
  );
}
