import { useState } from "react";

const FAQPage = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the purpose of this website?",
      answer:
        "Our website is designed to help LDCE (Limited Departmental Competitive Exam) aspirants excel in their exams with a wide range of quizzes tailored specifically for the exam conducted by UPSC for Section Officers (SO).",
    },
    {
      question: "What topics are covered in the quizzes?",
      answer:
        "We cover topics for both Paper I and Paper II as listed on our website. The quizzes are structured to cover all essential topics comprehensively. Only the topics mentioned on our website are available at present.",
    },
    {
      question: "How can I track my progress?",
      answer:
        "You can track your progress through the user dashboard, which provides an overview of your quiz completion status and topic wise quiz attempted so far.",
    },
    {
      question: "Can I bookmark important questions?",
      answer:
        "Yes, you can bookmark any quiz question. These bookmarks will appear under the bookmarks tab for the specific topic, allowing easy access to important questions.",
    },
    {
      question: "What are the quiz options available?",
      answer:
        "You have the option to choose from unattempted questions to ensure no quiz is repeated. Alternatively, you can select randomized questions, which will fetch 10 questions randomly from the chosen topic.",
    },
    {
      question: "Why is there sometimes a delay in loading questions?",
      answer:
        "Since the questions are stored in a cloud database and accessed through the server, there can be a slight delay. We recommend having a high-speed internet connection for the best experience.",
    },
    {
      question: "How do I make a payment?",
      answer:
        "Currently, we only accept payments through UPI. You need to make the payment via UPI and share a screenshot of the transaction on the provided WhatsApp number.",
    },
    {
      question: "How long does it take to activate my account after payment?",
      answer:
        "Account activation may take a few minutes, but sometimes we are also occupied in other tasks and it might take longer to activate the account. But Rest assured, your account will be activated for sure. We are available through WhatsApp to answer any query you may have.",
    },
    {
      question: "How will I know if my account is activated?",
      answer:
        "Once your account is activated, we will convey a confirmation through WhatsApp and you will need to log back in afresh. You can also approach us via WhatsApp for any queries or confirmation.",
    },
    {
      question: "What is the validity period of my account?",
      answer:
        "The account validity is one year from the time of activation. You will have access to all features and quizzes during this period. Any future updation or addition of any topic will also be available",
    },
    {
      question: "What should I do if I have any issues or need clarification?",
      answer:
        "For any queries or clarifications, feel free to reach out to us on WhatsApp. We are here to help and ensure you have a smooth experience.",
    },
    {
      question: "Can I get a refund if I decide to cancel my subscription?",
      answer:
        "Currently, we do not offer refunds once the payment is made and the account is activated.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <h1 className="bg-slate-50 rounded-md text-lg md:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-700 flex gap-2 items-center justify-center">
        <span>Frequently Asked Questions</span>{" "}
        <img src="/faq.png" width={60} height={60} />
      </h1>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <div
            onClick={() => toggleQuestion(index)}
            className="cursor-pointer bg-gradient-to-r from-rose-600 to-pink-600 p-4 rounded-lg shadow-md hover:bg-pink-300 transition duration-300 text-white"
          >
            <h2 className="text-sm md:text-base xl:text-lg font-semibold">
              {faq.question}
            </h2>
          </div>
          {openQuestionIndex === index && (
            <div className="bg-white p-4 border-l-4 border-pink-700 text-gray-600 rounded-r-lg shadow-inner">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
