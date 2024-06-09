import { useState } from "react";

const AccountActivationNotice = () => {
  const [isQrVisible, setIsQrVisible] = useState(false);

  // UPI payment link with provided details
  const upiLink = `upi://pay?pa=7827097711@paytm&pn=Seema%20Bhardwaj&am=999.00&cu=INR&tn=Payment%20for%20Undersigned%20registration`;

  // Function to detect mobile device
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        Account Activation Pending
      </h2>
      <p className="text-gray-700 mb-4">
        Your account is yet to be fully activated. If you have not made the
        payment, please follow the steps below:
      </p>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>Make a payment using the UPI ID provided below.</li>
        <li>
          Share a screenshot of the payment confirmation with the provided
          number on WhatsApp.
        </li>
        <li>
          Your account will be activated within a few minutes after
          verification.
        </li>
      </ol>
      <button
        onClick={() => setIsQrVisible(!isQrVisible)}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        {isQrVisible ? "Hide QR Code" : "Show QR Code"}
      </button>
      {isQrVisible && (
        <div className="mt-4 text-center">
          {isMobileDevice() ? (
            <a href={upiLink}>
              <img
                src="/QRcode.png"
                alt="QR Code"
                className="w-40 h-40 mx-auto"
              />
            </a>
          ) : (
            <div>
              <p className="text-gray-700">
                Scan the QR code using your UPI app on your mobile device.
              </p>
              <img
                src="/QRcode.png"
                alt="QR Code"
                className="w-80 h-80 mx-auto"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountActivationNotice;
