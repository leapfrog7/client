// import { useState } from "react";

// const AccountActivationNotice = () => {
//   const [isQrVisible, setIsQrVisible] = useState(false);

//   // UPI payment link with provided details
//   const upiLink = `upi://pay?pa=7827097711@ptyes&pn=Seema%20Bhardwaj&am=699.00&cu=INR&tn=Payment%20for%20Undersigned%20registration`;

//   // Function to detect mobile device
//   const isMobileDevice = () => {
//     return /Mobi|Android/i.test(navigator.userAgent);
//   };

//   return (
//     <div className="bg-blue-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
//       <h2 className="text-xl font-semibold text-blue-800 mb-4">
//         Account Activation Pending
//       </h2>
//       <p className="text-gray-700 mb-4">
//         Your account is yet to be fully activated. If you have not made the
//         payment, please follow the steps below:
//       </p>
//       <ol className="list-decimal list-inside text-gray-700 mb-4">
//         <li>Make a payment using the UPI ID provided below.</li>
//         <li>
//           Share a screenshot of the payment confirmation with the provided
//           number on WhatsApp.
//         </li>
//         <li>
//           Your account will be activated within a few minutes after
//           verification.
//         </li>
//       </ol>
//       <button
//         onClick={() => setIsQrVisible(!isQrVisible)}
//         className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//       >
//         {isQrVisible ? "Hide QR Code" : "Show QR Code"}
//       </button>
//       {isQrVisible && (
//         <div className="mt-4 text-center">
//           {isMobileDevice() ? (
//             <a href={upiLink}>
//               <img
//                 src="/QRcode.png"
//                 alt="QR Code"
//                 className="w-40 h-40 mx-auto"
//               />
//             </a>
//           ) : (
//             <div>
//               <p className="text-gray-700">
//                 Scan the QR code using your UPI app on your mobile device.
//               </p>
//               <img
//                 src="/QRcode.png"
//                 alt="QR Code"
//                 className="w-80 h-80 mx-auto"
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountActivationNotice;
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaHospital,
  FaFilePdf,
  FaTasks,
  FaLock,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

const AccountActivationNotice = () => {
  const [isQrVisible, setIsQrVisible] = useState(false);

  const upiLink =
    "upi://pay?pa=7827097711@ptyes&pn=Seema%20Bhardwaj&am=699.00&cu=INR&tn=Payment%20for%20Undersigned%20registration";

  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

  const freeLinks = useMemo(
    () => [
      {
        to: "/pages/public/cghs-rates",
        title: "CGHS Rate Finder",
        desc: "Check package rates, entitlements and billing rules.",
        icon: <FaHospital className="text-blue-700" />,
      },
      {
        to: "/pages/public/cghs-units",
        title: "CGHS Units",
        desc: "Find CGHS units with city filter & directions.",
        icon: <FaHospital className="text-blue-700" />,
      },
      {
        to: "/pages/public/pdf-utility",
        title: "PDF Tools",
        desc: "Merge, split, rotate and basic PDF utilities.",
        icon: <FaFilePdf className="text-blue-700" />,
      },
      {
        to: "/pages/tools/task-tracker",
        title: "Task Tracker",
        desc: "Simple tracker for eOffice-style follow-ups.",
        icon: <FaTasks className="text-blue-700" />,
      },
    ],
    [],
  );

  return (
    <div className="mx-auto mt-8 w-full lg:w-11/12">
      <div className="bg-blue-100 border border-blue-200 shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 md:px-8 md:py-7 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-blue-700">
              <FaLock className="text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                Account Activation Pending
              </h2>
              <p className="text-gray-700 mt-1 md:text-base">
                Your paid features are locked until activation. Meanwhile, you
                can continue using these{" "}
                <span className="font-semibold">free tools</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Body: 2-column on desktop */}
        <div className="p-4 md:px-8 md:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left: Activation */}
          <div className="bg-white/60 border border-blue-100 rounded-2xl p-5 md:p-6">
            <p className="text-gray-800 font-semibold mb-3">
              Activate your account (optional):
            </p>

            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Make payment via UPI using the QR code below.</li>
              <li>Send payment screenshot on WhatsApp for verification.</li>
              <li className="flex items-center gap-2">
                3. Activation is usually done within a few minutes.
              </li>
            </ol>

            <button
              onClick={() => setIsQrVisible((v) => !v)}
              className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm"
            >
              {isQrVisible ? "Hide QR Code" : "Show QR Code"}
            </button>

            {isQrVisible && (
              <div className="mt-4 text-center">
                {isMobileDevice() ? (
                  <a href={upiLink} className="inline-block">
                    <img
                      src="/QRcode.png"
                      alt="UPI QR Code"
                      className="w-44 h-44 mx-auto rounded-xl border border-gray-200 bg-white"
                    />
                    <p className="mt-2 text-xs text-gray-600">
                      Tap QR to open your UPI app
                    </p>
                  </a>
                ) : (
                  <div>
                    <p className="text-gray-700 text-sm">
                      Scan this QR code using your UPI app on mobile.
                    </p>
                    <img
                      src="/QRcode.png"
                      alt="UPI QR Code"
                      className="w-72 h-72 mx-auto rounded-xl mt-2 border border-gray-200 bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* <div className="mt-4 text-[12px] text-gray-600">
              Prefer exploring first? You can activate later anytime.
            </div> */}
          </div>

          {/* Right: Free tools */}
          <div className="bg-white/60 border border-blue-100 rounded-2xl p-3 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-gray-800 font-semibold">
                Try these free tools (no payment needed):
              </p>
              <span className="hidden md:inline-flex text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                FREE
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1  gap-3">
              {freeLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-blue-300 hover:shadow-sm transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-800 truncate">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.desc}
                    </p>

                    <p className="mt-2 text-xs text-blue-700 inline-flex items-center gap-2">
                      Open <FaRegArrowAltCircleRight />
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-[12px] text-gray-600">
              Activate anytime to unlock the full test series and premium
              modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivationNotice;
