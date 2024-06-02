import Input from "./Input";
import Label from "./Label";
import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import { PropTypes } from "prop-types";

Login.propTypes = {
  verifyToken: PropTypes.func,
};

export default function Login({ verifyToken }) {
  const [data, setData] = useState(null);
  //const [error, setError] = useState(null);

  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [msg, setMsg] = useState("");

  //function to check credentials when sing In button is clicked
  const handleCredentialCheck = async () => {
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
      console.log(response.data);
      console.log(data);
    } catch (error) {
      console.log(error);
      //on encountering any error, this msg will show
      setMsg(error.response.data.msg);
    }
    //clearing the login  fields
    setUserInput("");
    setPasswordInput("");
    setData(null);
  };

  // Function to set the User Input Field
  function handleUserInput(event) {
    console.log(event.target.value);
    setUserInput(event.target.value);
  }

  // Function to set the User Password Field
  function handlePasswordInput(event) {
    console.log(event.target.value);
    setPasswordInput(event.target.value);
  }

  return (
    <div className="w-1/3 flex flex-col gap-4 mt-8 mx-auto ">
      <h2>Login Page</h2>

      <div className="relative h-11 w-full min-w-[200px] ">
        <Input onChange={handleUserInput} value={userInput} />
        <Label labelText="Name"></Label>
      </div>

      <div className="relative h-11 w-full min-w-[200px]">
        <Input
          type="password"
          onChange={handlePasswordInput}
          value={passwordInput}
        />
        <Label labelText="Password"></Label>
      </div>

      <div className="text-center" onClick={handleCredentialCheck}>
        <Button buttonText="Sign In"></Button>
      </div>
      {msg && (
        <div
          className={`mb-4 text-center ${
            msg.includes("Success")
              ? "text-green-800 bg-green-100"
              : "text-red-800 bg-red-100"
          } p-2 rounded-lg`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
