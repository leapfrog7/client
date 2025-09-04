import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Helmet } from "react-helmet-async";

const SearchWorkAllocation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  //   const BASE_URL = "http://localhost:5000/api/v1/";

  // Debounced function to fetch results
  const debouncedFetchResults = debounce(async (query) => {
    if (query.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}MDO_WorkAllocation/lookup`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setResults(response.data);
      setError(null);
    } catch (error) {
      setError("Error fetching search results");
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  // Handle input change
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedFetchResults(value);
  };

  useEffect(() => {
    // Cleanup the debounce function on component unmount
    return () => {
      debouncedFetchResults.cancel();
    };
  }, []);

  // Function to highlight the matching string
  const highlightMatch = (text, highlight) => {
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 rounded-sm">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 bg-white shadow-lg rounded-lg">
      <Helmet>
        <title>AoBR - UnderSigned</title>
        <meta
          name="description"
          content="Search the work items allocated to various Ministries/ Department as per AoBR 1961"
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/quiz/paper-i/lookup"
        />
        <meta property="og:title" content="AoBR - UnderSigned" />
        <meta
          property="og:description"
          content="Allocation of Business Rules 1961... search as you type"
        />
        <meta
          property="og:url"
          content="https://undersigned.in/pages/quiz/paper-i/lookup"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold bg-blue-200 text-center rounded-lg p-2 mb-2 text-gray-700">
          AoBR Lookup
        </h1>
        <label className="block text-gray-800 font-bold mb-2">
          Search Work Allocation:
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-400 focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-blue-100 sm:text-sm rounded-md"
            placeholder="Enter search term..."
          />
          <small className="text-gray-500 text-xs md:text-sm">
            Type at least 3 characters to search
          </small>
        </label>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {results.length === 0 && searchTerm.length >= 3 && !loading && (
        <div className="text-center text-gray-500">
          No matching results found
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-6">
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
                {result.name}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                {result.allocatedWork.map((work, idx) => (
                  <li key={idx} className="text-gray-700">
                    {highlightMatch(work.description, searchTerm)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWorkAllocation;
