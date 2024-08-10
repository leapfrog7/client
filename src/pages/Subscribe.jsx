import "tailwindcss/tailwind.css";
import { FaWhatsapp } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Subscribe = () => {
  const upiLink =
    "upi://pay?pa=7827097711@ptyes&pn=Seema%Bhardwaj&am=999.00&cu=INR&tn=Payment%20for%20Undersigned%20registration";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-gray-100 sm:text-sm">
      <Helmet>
        <title>Subscription - UnderSigned</title>
        <meta
          name="description"
          content="Subscribe to our platform to gain access to exclusive quizzes tailored for the SO LDCE exam. We offer MCQ based quiz for Paper I and Paper II and each questions have the explanation of the underlying concept or Rule which makes our series more effective. You can bookmark your quiz for viewing them later and you can track your progress easily and in real time."
        />
        <link
          rel="canonical"
          href="https://undersigned.netlify.app/subscription"
        />
        <meta property="og:title" content="Subscription - UnderSigned" />
        <meta
          property="og:description"
          content="Subscribe to our platform to gain access to exclusive quizzes tailored for the SO LDCE exam. We offer MCQ based quiz for Paper I and Paper II and each questions have the explanation of the underlying concept or Rule which makes our series more effective. You can bookmark your quiz for viewing them later and you can track your progress easily and in real time."
        />
        <meta
          property="og:url"
          content="https://undersigned.netlify.app/subscription"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/path/to/subscription-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Subscription - UnderSigned Platform"
        />
        <meta
          name="twitter:description"
          content="Subscribe to our platform to gain access to exclusive quizzes tailored for the SO LDCE exam. We offer MCQ based quiz for Paper I and Paper II and each questions have the explanation of the underlying concept or Rule which makes our series more effective. You can bookmark your quiz for viewing them later and you can track your progress easily and in real time."
        />
        <meta
          name="twitter:image"
          content="https://yourwebsite.com/path/to/subscription-image.jpg"
        />
      </Helmet>

      <div className="max-w-screen-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Steps to subscribe
        </h1>
        <div className="space-y-8">
          <div className="flex items-start text-lg text-gray-700">
            <p>1.</p>
            <span className="ml-4 ">
              Go to the{" "}
              <a className="text-blue-700 font-semibold" href="/register">
                Registration Page
              </a>{" "}
              and Register yourself. Your Mobile number is going to be your
              login ID.
            </span>
          </div>
          <div className="flex flex-col items-start text-lg text-gray-700">
            <div className="flex items-start">
              <p>2.</p>
              <span className="ml-4">
                Upon successful registration, make payment and share a
                screenshot with the provided number on Whatsapp.
                <a
                  href="https://wa.me/918368371597"
                  className="hover:text-green-700 flex items-center text-green-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click Here <FaWhatsapp className="ml-1" />
                  {/* <FaWhatsapp className="ml-2 text-green-700" />
                    +91 8368371597 */}
                </a>
              </span>
            </div>
            <div className="mt-2 text-center mx-auto">
              <a href={upiLink}>
                <img
                  src="/QRcode.png"
                  alt="QR Code"
                  className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto"
                />
              </a>
              <p className="text-lg font-semibold text-gray-700">
                <a className="text-blue-700" href={upiLink}>
                  Click
                </a>{" "}
                or Scan the QR code above to make a payment
              </p>
            </div>
          </div>
          <div className="flex items-start text-lg text-gray-700">
            <p>3. </p>
            <span className="ml-4 ">
              Your account will be activated within a few minutes, and you will
              have access to all the topics mentioned.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
