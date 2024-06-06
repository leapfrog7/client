import Tabs from "../../components/Tabs";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Constitution() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getUserId();
  }, []);

  function getUserId() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        console.log(decodedToken, currentTime);
        if (decodedToken.exp < currentTime) {
          // Check if the token is expired
          console.log("Token expired");
          localStorage.removeItem("jwtToken");
        } else {
          console.log(decodedToken.userId);
          setUserId(decodedToken.userId);
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("jwtToken");
      }
    } else {
      console.log("User is logged out");
    }
  }

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
          Constitution
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
          <div className="flex text-sm md:text-base items-center gap-2">
            <span className="font-semibold text-gray-700">
              Questions Attempted:
            </span>
            <span className="text-gray-900">123</span>
          </div>
          <div className="flex text-sm md:text-base items-center gap-2">
            <span className="font-semibold text-gray-700">Progress:</span>
            <span className="text-gray-900">67%</span>
          </div>
        </div>
      </div>
      <Tabs userId={userId} topicName={"Constitution"} />
    </div>
  );
}
