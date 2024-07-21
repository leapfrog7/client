import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Modal from "../../components/Modal";

const AddQuestionForm = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [year, setYear] = useState("2023");
  const [paperType, setPaperType] = useState("Paper I");
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const token = localStorage.getItem("jwtToken");

  const BASE_URL = "http://localhost:5000/api/v1/";

  useEffect(() => {
    checkAdminStatus();
    fetchQuestions();
  }, [year, paperType, currentPage, searchTerm]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const checkAdminStatus = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.userType === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}prevYearManagement/questions/${year}/${paperType}`,
        config
      );
      let filteredQuestions = response.data;
      if (searchTerm) {
        filteredQuestions = filteredQuestions.filter((question) =>
          question.questionText.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the correct answer matches any of the options
    if (!options.includes(correctAnswer)) {
      alert("The correct answer must match one of the options.");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (editingQuestionId) {
        await axios.put(
          `${BASE_URL}prevYearManagement/question/${editingQuestionId}`,
          {
            questionText,
            options,
            correctAnswer,
            explanation,
          },
          config
        );
        alert("Question updated successfully!");
      } else {
        await axios.post(
          `${BASE_URL}prevYearManagement/add-question/${year}/${paperType}`,
          {
            questionText,
            options,
            correctAnswer,
            explanation,
          },
          config
        );
        alert("Question added successfully!");
      }
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setExplanation("");
      setEditingQuestionId(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error adding/updating question:", error);
      alert("Error adding/updating question");
    }
    setLoading(false);
    setIsModalOpen(false); // Close the modal after submit
  };

  const handleEdit = (question) => {
    setEditingQuestionId(question._id);
    setQuestionText(question.questionText);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);
    setExplanation(question.explanation);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `${BASE_URL}prevYearManagement/question/${id}`,
        config
      );
      alert("Question deleted successfully!");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error deleting question");
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(questions.length / questionsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4">
        <span className="text-3xl bg-red-100 text-red-800 py-6">
          Unauthorized Access
        </span>
        <a href="/" className="text-blue-500 text-xl">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">
          {editingQuestionId ? "Edit Question" : "Add Question"}
        </h2>
        <div className="mb-4">
          <label className="block mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="2015">2015</option>
            <option value="2016-17">2016-17</option>
            <option value="2018">2018</option>
            <option value="2019-20">2019-20</option>
            <option value="2021-22">2021-22</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Paper Type</label>
          <select
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="Paper I">Paper I</option>
            <option value="Paper II">Paper II</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Question Text</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Options</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full p-2 mb-2 border"
              placeholder={`Option ${index + 1}`}
            />
          ))}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Correct Answer</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Explanation</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full p-2 border"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editingQuestionId ? "Update Question" : "Add Question"}
        </button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}

      <div className="mt-8">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border"
            placeholder="Search questions..."
          />
        </div>
        <h2 className="text-2xl mb-4">Questions List</h2>
        <ul>
          {currentQuestions.map((question) => (
            <li key={question._id} className="mb-4 p-4 border rounded">
              <p>{question.questionText}</p>
              <button
                className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                onClick={() => handleEdit(question)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(question._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-4">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4">Edit Question</h2>
          <div className="mb-4">
            <label className="block mb-1">Question Text</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Options</label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-2 mb-2 border"
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Correct Answer</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Explanation</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update Question
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddQuestionForm;
