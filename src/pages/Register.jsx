import Input from "../components/Input";
import Label from "../components/Label";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import Button from "../components/Button";
const serverURL = "http://localhost:5000/api/v1/";
export default function Register() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [username, setUsername] = useState(null);

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

  const registerUser = async () => {
    try {
      const response = await axios.post(serverURL + "register", {
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

      //retrieving token from response
      const { token } = response.data; // Extract token from response
      setData(response.data);
      console.log(data);
      console.log(response.data);
      setMsg("Registered Successfully!");

      //Decoding the Token Received
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      console.log(decoded); // Log the decoded token
      console.log(decodedToken);

      // setting the UserName in Front End
      setUsername(decoded.name);
    } catch (error) {
      setData("Registration Failed. Please try again");
    }
  };

  return (
    <>
      <div className="container mx-auto md:w-2/3 lg:w-1/2">
        {username && <div> Hi, {username}</div>}
        <p className="m-3 font-bold text-blue-700">Registration</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          <div className="relative h-11  sm:min-w-[50px] mx-2 md:min-w-[200px]">
            <Input type="text" onChange={handleNameChange} value={name} />
            <Label labelText="Name"></Label>
          </div>

          <div className="relative h-11  sm:min-w-[50px] mx-2 md:min-w-[200px]">
            <Input type="text" onChange={handleMobileChange} value={mobile} />
            <Label labelText="Mobile"></Label>
          </div>

          <div className="relative h-11  sm:min-w-[50px] mx-2 md:min-w-[200px]">
            <Input type="text" onChange={handleEmailChange} value={email} />
            <Label labelText="Email"></Label>
          </div>

          <div className="relative h-11  sm:min-w-[50px] mx-2 md:min-w-[200px]">
            <Input type="text" onChange={handleBatchChange} value={batch} />
            <Label labelText="Batch Year"></Label>
          </div>

          <div className="relative h-11  sm:min-w-[50px] mx-2 md:min-w-[200px]">
            <Input
              type="password"
              onChange={handlePasswordChange}
              value={password}
            />
            <Label labelText="Password"></Label>
          </div>
        </div>
        <div className="text-center " onClick={registerUser}>
          <Button buttonText="Register" />
        </div>

        {msg && <div>{msg}</div>}
      </div>
    </>
  );
}
