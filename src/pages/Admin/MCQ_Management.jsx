import { useState, useEffect } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";

const MCQManagement = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    topic: selectedTopic,
  });
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const questionsPerPage = 10;
  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "http://localhost:5000/api/v1/";

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchQuestions();
      setNewQuestion({ ...newQuestion, topic: selectedTopic }); // Set topic in new question
    }
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}mcqManagement/topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}mcqManagement`, {
        params: { topicId: selectedTopic },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleQuestionClick = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingQuestion({ ...editingQuestion, [name]: value });
  };

  const handleSaveClick = async () => {
    // Check if any text element is empty
    if (
      !editingQuestion.questionText ||
      !editingQuestion.correctAnswer ||
      !editingQuestion.explanation ||
      editingQuestion.options.some((option) => !option)
    ) {
      alert("All fields must be filled out.");
      return;
    }

    // Check if correct answer matches one of the options
    if (!editingQuestion.options.includes(editingQuestion.correctAnswer)) {
      alert("Correct answer must match one of the options.");
      return;
    }
    try {
      await axios.put(
        `${BASE_URL}mcqManagement/${editingQuestion._id}`,
        editingQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question", error);
    }
  };

  const filteredQuestions = questions.filter((question) =>
    question.questionText.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      currentPage - Math.floor(maxPageNumbersToShow / 2),
      1
    );
    let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-700 transition duration-200`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const handleAddQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleAddOptionChange = (index, value) => {
    const options = [...newQuestion.options];
    options[index] = value;
    setNewQuestion({ ...newQuestion, options });
  };

  const handleAddQuestion = async () => {
    // Check if any text element is empty
    if (
      !newQuestion.questionText ||
      !newQuestion.correctAnswer ||
      !newQuestion.explanation ||
      newQuestion.options.some((option) => !option)
    ) {
      alert("All fields must be filled out.");
      return;
    }

    // Check if correct answer matches one of the options
    if (!newQuestion.options.includes(newQuestion.correctAnswer)) {
      alert("Correct answer must match one of the options.");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(`${BASE_URL}mcqManagement`, newQuestion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowAddQuestionModal(false);
      fetchQuestions(); // Refresh questions list
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
  };

  const confirmDeleteQuestion = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${BASE_URL}mcqManagement/${questionToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestionToDelete(null);
      fetchQuestions(); // Refresh questions list
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">MCQ Management</h2>

      <div className="mb-4 flex gap-2 text-sm md:text-base justify-around items-center">
        <div className="flex flex-col md:flex-row gap-2">
          <label className="mr-4">Select Topic: </label>
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="p-2 border rounded"
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-green-700 text-white px-2 py-2 md:px-4 rounded hover:bg-green-800 transition duration-200 flex items-center gap-1"
          onClick={() => setShowAddQuestionModal(true)}
        >
          <span>Question</span>
          <CiCirclePlus />
        </button>
      </div>

      {selectedTopic && (
        <div className="mb-4 flex gap-4 items-center">
          <h3 className="text-sm md:text-base font-semibold text-customFuchsia">
            Topic: {topics.find((topic) => topic._id === selectedTopic)?.title}
          </h3>
          <p className="text-sm md:text-base font-semibold text-customPink">
            Total Questions: {questions.length}
          </p>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchText}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        {currentQuestions.map((question) => (
          <div
            key={question._id}
            className="mb-4 border px-4 py-2 shadow-md bg-white rounded"
          >
            <div
              className={`cursor-pointer text-sm md:text-base font-semibold whitespace-pre-line p-2 ${
                expandedQuestionId === question._id
                  ? "bg-teal-50"
                  : " hover:bg-blue-50"
              }`}
              onClick={() => handleQuestionClick(question._id)}
            >
              {question.questionText}
            </div>
            {expandedQuestionId === question._id && (
              <div className="mt-2">
                <div className="mt-2 text-sm md:text-base">
                  <strong>Options:</strong>
                  <ul className="list-disc list-inside">
                    {question.options.map((option, index) => (
                      <li key={index} className="ml-4">
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-sm md:text-base">
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </div>
                <div className="mt-2 text-sm md:text-base whitespace-pre-line">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
                <div className="mt-4 flex gap-6 text-sm md:text-base">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded ml-2 hover:bg-yellow-700 transition duration-200"
                    onClick={() => handleEditClick(question)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-700 transition duration-200"
                    onClick={() => handleDeleteClick(question)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingQuestion && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Question</h3>
            <div className="mb-2">
              <label className="block">Question Text</label>
              <textarea
                name="questionText"
                value={editingQuestion.questionText}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block">Options</label>
              {editingQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  name={`option-${index}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...editingQuestion.options];
                    newOptions[index] = e.target.value;
                    setEditingQuestion({
                      ...editingQuestion,
                      options: newOptions,
                    });
                  }}
                  className="p-2 border rounded w-full mb-1"
                />
              ))}
            </div>
            <div className="mb-2">
              <label className="block">Correct Answer</label>
              <input
                type="text"
                name="correctAnswer"
                value={editingQuestion.correctAnswer}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block">Explanation</label>
              <textarea
                name="explanation"
                value={editingQuestion.explanation}
                onChange={handleEditChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setEditingQuestion(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for Adding Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add Question</h3>
            <div className="mb-2">
              <label className="block">Question Text</label>
              <textarea
                name="questionText"
                value={newQuestion.questionText}
                onChange={handleAddQuestionChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block">Options</label>
              {newQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  name={`option-${index}`}
                  value={option}
                  onChange={(e) => handleAddOptionChange(index, e.target.value)}
                  className="p-2 border rounded w-full mb-1"
                />
              ))}
            </div>
            <div className="mb-2">
              <label className="block">Correct Answer</label>
              <input
                type="text"
                name="correctAnswer"
                value={newQuestion.correctAnswer}
                onChange={handleAddQuestionChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block">Explanation</label>
              <textarea
                name="explanation"
                value={newQuestion.explanation}
                onChange={handleAddQuestionChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition duration-200"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for seeking confirmation for delete */}
      {questionToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmDeleteQuestion}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setQuestionToDelete(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-center items-center">
          {renderPagination()}
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCQManagement;
