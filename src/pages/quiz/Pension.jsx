import Tabs from "../../components/Tabs";
import useAuthGuard from "../../assets/useAuthGuard";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

Pension.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function Pension({ progress, quizAttempted }) {
  const userId = useAuthGuard(); // <- handles all redirects/expiry

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"Pension Rules"}
        progress={progress}
        quizAttempted={quizAttempted}
      />
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
