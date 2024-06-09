import { useState } from "react";

export default function RegistrationSteps() {
  const [isQrVisible, setIsQrVisible] = useState(false);

  // UPI payment link with provided details
  const upiLink = `upi://pay?pa=7827097711@paytm&pn=Seema%20Bhardwaj&am=999.00&cu=INR&tn=Payment%20for%20Undersigned%20registration`;

  return (
    <div className="bg-gradient-to-r from-emerald-100 to-cyan-100 p-4 rounded-lg my-8">
      <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
      <ol className="list-decimal list-inside text-gray-600">
        <li>Your Mobile Number is going to be your Login Id.</li>
        <li>
          Upon successful registration, make payment and share a screenshot with
          the provided number on WhatsApp.
          <button
            onClick={() => setIsQrVisible(!isQrVisible)}
            className="ml-2 text-custom underline"
          >
            {isQrVisible ? "Hide QR Code" : "Show QR Code"}
          </button>
          {isQrVisible && (
            <div className="mt-2 text-center">
              <a href={upiLink}>
                <img
                  src="/QRcode.png"
                  alt="QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </a>
            </div>
          )}
        </li>
        <li>
          Your account will be activated within a few minutes, and you will have
          access to all the topics mentioned.
        </li>
      </ol>
    </div>
  );
}
