import { useState } from "react";
import { Helmet } from "react-helmet-async";

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
      question: "What is the Pricing Structure?",
      answer:
        "We currently offer a single subscription plan priced at ₹1,199/-. This subscription includes access to all topics under Paper I and Paper II, as listed on our website, along with Previous Year Questions. Additionally, any updates or new content added to the portal will be accessible at no extra charge. Please note that the pricing is subject to change without prior notice.",
    },
    {
      question: "What is the validity period of my account?",
      answer:
        "Your account will remain valid until the next LDCE exam, with a maximum limit of two years from the date of purchase. This ensures your subscription won’t expire right before the exam, eliminating the need for any further renewals.",
    },
    {
      question: "When can I expect Discounts?",
      answer:
        "Our subscription is already offered at a discounted rate of ₹999/-. Given this competitive pricing, we are unable to provide any further discounts.",
    },
    {
      question: "Is there any discounts for renewal of subscription?",
      answer:
        "Yes, we offer a 50% discount to our previous subscribers if they choose to renew their subscription within 3 months after it expires. ",
    },
    {
      question: "When should I buy this subscription?",
      answer:
        "If you are eligible to appear for the next LDCE exam, it’s best to purchase the subscription now. The price will remain unchanged until the exam date, and your subscription will remain valid until the next LDCE exam, subject to a maximum duration of two years from the date of purchase.",
    },
    {
      question: "How do I make a payment?",
      answer:
        "Currently, we only accept payments through UPI. You need to make the payment via UPI and share a screenshot of the transaction on the provided WhatsApp number.",
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
      <Helmet>
        <title>FAQ - UnderSigned</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about UnderSigned. Questions like How to Register and Subscribe. How to make payment. Features or Tools available for MCQs etc."
        />
        <link rel="canonical" href="https://undersigned.in/FAQs" />
        <meta property="og:title" content="FAQ - UnderSigned" />
        <meta
          property="og:description"
          content="Find answers to frequently asked questions about UnderSigned."
        />
        <meta property="og:url" content="https://undersigned.in/FAQs" />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1 className="bg-white rounded-md text-lg md:text-xl lg:text-2xl font-bold mb-6 text-center text-gray-700 flex gap-2 items-center justify-center">
        <span className="text-customBlue">Frequently Asked Questions</span>{" "}
        <img src="/faq.png" width={60} height={60} />
      </h1>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <div
            onClick={() => toggleQuestion(index)}
            className="cursor-pointer bg-gradient-to-r from-red-50 to-yellow-50 p-4 rounded-lg shadow-md hover:bg-blue-300 transition duration-300 text-red-800"
          >
            <h2 className="text-sm md:text-base xl:text-lg font-semibold">
              {faq.question}
            </h2>
          </div>
          {openQuestionIndex === index && (
            <div className="bg-white p-4 border-b-4 border-red-200 text-yellow-800 rounded-r-lg shadow-inner text-sm md:text-base xl:text-lg">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
