import Tabs from "../../components/Tabs";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Pension() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
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
          navigate("/pages/TokenExpired");
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
      navigate("/pages/NotLoggedIn");
    }
  }

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <p> This is Pension Page</p>
      <Tabs userId={userId} topicName={"Pension_Rules"} />
    </div>
  );
}

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Loading from "../../components/Loading";

// const Pension = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("jwtToken");
//   useEffect(() => {
//     console.log(token);
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/v1/quiz/pension",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setData(response.data); // Update the state with the fetched data
//       } catch (error) {
//         setError(error.message); // Update the state with the error message
//       } finally {
//         setLoading(false); // Set loading to false once data is fetched or an error occurs
//       }
//     };

//     fetchData();
//   }, [token]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <Loading />;
//   }

//   return (
//     <div>
//       <h1>Pension Data</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default Pension;
