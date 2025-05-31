import "tailwindcss/tailwind.css";
import { FaWhatsapp } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { MdAppRegistration, MdPayment, MdCheckCircle } from "react-icons/md";

const Subscribe = () => {
  const upiLink =
    "upi://pay?pa=7827097711@ptyes&pn=SeemaBhardwaj&am=999.00&cu=INR&tn=Payment%20for%20Undersigned%20registration";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200 text-white p-6">
      <Helmet>
        <title>Subscription - UnderSigned</title>
        <link rel="canonical" href="https://undersigned.in/subscribe" />
        <meta
          name="description"
          content="Subscribe to our platform to gain access to exclusive quizzes tailored for the SO LDCE exam. We offer MCQ-based quizzes for Paper I and Paper II, with explanations for each concept or rule."
        />
      </Helmet>

      <div className="max-w-2xl w-full bg-white text-gray-900 shadow-2xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600">
          Steps to Subscribe
        </h1>

        <div className="space-y-8">
          <div className="flex items-start text-lg">
            <MdAppRegistration className="text-blue-600 text-3xl" />
            <span className="ml-4">
              Go to the
              <a
                className="text-blue-700 font-semibold underline ml-2 hover:text-blue-900 transition"
                href="/register"
              >
                Registration Page
              </a>
              and register yourself. Your mobile number will be your login ID.
            </span>
          </div>

          <div className="flex flex-col items-start text-lg">
            <div className="flex items-start">
              <MdPayment className="text-blue-600 text-3xl" />
              <span className="ml-4">
                After successful registration, make payment and share a
                screenshot via WhatsApp.
                <a
                  href="https://wa.me/918368371597"
                  className="text-green-700 flex items-center font-semibold underline mt-2 hover:text-green-900 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact on WhatsApp <FaWhatsapp className="ml-2 text-2xl" />
                </a>
              </span>
            </div>
            <div className="mt-4 text-center">
              <a
                href={upiLink}
                className="hover:scale-110 transition-transform"
              >
                <img
                  src="/QRcode.png"
                  alt="QR Code"
                  className="w-48 h-48 mx-auto border-4 border-blue-500 rounded-lg shadow-lg hover:shadow-2xl transition transform duration-300"
                />
              </a>
              <p className="text-lg font-semibold mt-2">
                <a
                  className="text-blue-700 underline hover:text-blue-900 transition"
                  href={upiLink}
                >
                  Click Here
                </a>{" "}
                or Scan the QR code to make a payment
              </p>
            </div>
          </div>

          <div className="flex items-start text-lg">
            <MdCheckCircle className="text-blue-600 text-3xl" />
            <span className="ml-4">
              Your account will be activated within a few minutes, giving you
              access to all the topics.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
