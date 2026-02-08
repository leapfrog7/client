// import {
//   FaHome,
//   FaInfo,
//   FaUserPlus,
//   FaWhatsapp,
//   FaInstagram,
//   FaFacebook,
// } from "react-icons/fa";
// import { BiLogoGmail } from "react-icons/bi";
// import { MdOutlineFeaturedPlayList } from "react-icons/md";

// const Footer = () => {
//   return (
//     <footer className="bg-customBlue text-white py-8">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-center  text-center">
//           {/* Footer Links */}
//           <div className="mb-4 md:mb-0 mx-auto">
//             <h2 className="text-lg font-bold mb-2">Quick Links</h2>
//             <ul className="sm:text-base grid grid-cols-2 md:grid-cols-1 gap-2 ">
//               <li className="flex items-center justify-center ">
//                 <FaHome className="mr-2" />
//                 <a href="/" className="hover:text-yellow-500">
//                   Home
//                 </a>
//               </li>
//               <li className="flex items-center justify-center">
//                 <FaInfo className="mr-2" />
//                 <a href="/about" className="hover:text-yellow-500">
//                   About
//                 </a>
//               </li>
//               <li className="flex items-center justify-center">
//                 <FaUserPlus className="mr-2" />
//                 <a href="/register" className="hover:text-yellow-500">
//                   Register
//                 </a>
//               </li>
//               <li className="flex items-center justify-center">
//                 <MdOutlineFeaturedPlayList className="mr-2" />
//                 <a href="/FAQs" className="hover:text-yellow-500">
//                   FAQs
//                 </a>
//               </li>
//               <li className="flex items-center justify-center">
//                 <MdOutlineFeaturedPlayList className="mr-2" />
//                 <a href="/PrivacyPolicy" className="hover:text-yellow-500">
//                   Privacy Policy
//                 </a>
//               </li>
//             </ul>
//           </div>
//           {/* Contact Information */}
//           <div className="mb-4 md:mb-0 mx-auto text-center">
//             <h2 className="text-xl font-bold mb-2">Contact Us</h2>
//             <p className="flex justify-center items-center gap-2 mb-2">
//               <a
//                 href="mailto:leapfrog.testseries@gmail.com"
//                 className="hover:text-yellow-500 flex items-center"
//               >
//                 <BiLogoGmail className="mr-2" />
//                 leapfrog.testseries@gmail.com
//               </a>
//             </p>
//             <p className="flex justify-center items-center gap-2 mb-2">
//               <a
//                 href="https://wa.me/918368371597"
//                 className="hover:text-yellow-500 flex items-center"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaWhatsapp className="mr-2" />
//                 +91 8368371597
//               </a>
//             </p>

//             {/* Facebook */}
//             <p className="flex justify-center items-center gap-2 mb-2">
//               <a
//                 href="https://facebook.com/share/1KMR86RCkT/"
//                 className="hover:text-yellow-500 flex items-center"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaFacebook className="mr-2 text-lg text-white" />
//                 Facebook
//               </a>
//             </p>

//             {/* Instagram */}
//             <p className="flex justify-center items-center gap-2 mb-2">
//               <a
//                 href="https://instagram.com/_undersigned?igsh=MXd4aWhqcDVlbnZ1aA=="
//                 className="hover:text-yellow-500 flex items-center"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaInstagram className="mr-2 text-lg text-white" />
//                 Instagram
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { useState } from "react";
import {
  FaHome,
  FaInfo,
  FaUserPlus,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { BiLogoGmail } from "react-icons/bi";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function FooterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      {/* Mobile: accordion header | Desktop: title only */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold tracking-wide text-white">
          {title}
        </span>
        <span className="text-white/80 text-lg">{open ? "–" : "+"}</span>
      </button>

      <h2 className="hidden md:block text-base font-semibold tracking-wide text-white">
        {title}
      </h2>

      {/* Mobile collapsible | Desktop always visible */}
      <div
        className={`${open ? "block" : "hidden"} md:block p-2 rounded-lg  bg-blue-100 md:bg-customBlue `}
      >
        {children}
      </div>
    </div>
  );
}

FooterSection.propTypes = {
  // optional, if you want prop-types here too
};

const Footer = () => {
  const year = new Date().getFullYear();

  const linkClass =
    "inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 md:text-slate-50 md:hover:text-yellow-50 transition-colors";
  const iconBtnClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition";

  return (
    <footer className="bg-customBlue text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Top: Brand row (compact on mobile) */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-xl md:text-2xl font-semibold tracking-wide">
              UnderSigned <br />
              <span className="text-sm font-normal">
                A platform for Govt. Officers
              </span>
            </span>
          </div>

          {/* <p className="mt-2 text-xs md:text-sm leading-relaxed text-white/85">
            LDCE-focused tools, quizzes and previous-year papers — designed for
            busy government professionals.
          </p> */}

          {/* Social icons */}
          <div className="mt-4 flex justify-center md:justify-start gap-2">
            <a
              className={iconBtnClass}
              href="https://wa.me/918368371597"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
            </a>
            <a
              className={iconBtnClass}
              href="https://facebook.com/share/1KMR86RCkT/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Facebook"
              title="Facebook"
            >
              <FaFacebook className="text-lg" />
            </a>
            <a
              className={iconBtnClass}
              href="https://instagram.com/_undersigned?igsh=MXd4aWhqcDVlbnZ1aA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Instagram"
              title="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
            <a
              className={iconBtnClass}
              href="https://x.com/undersigned_css"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X (Twitter)"
              title="X (Twitter)"
            >
              <FaXTwitter className="text-lg" />
            </a>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-5 md:mt-8 grid gap-2 md:gap-10 md:grid-cols-3">
          {/* Quick Links */}
          <FooterSection title="Quick Links ">
            <ul className="my-2 md:mt-4 space-y-3">
              <li>
                <Link to="/" className={linkClass}>
                  <FaHome />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  <FaInfo />
                  About
                </Link>
              </li>
              <li>
                <Link to="/register" className={linkClass}>
                  <FaUserPlus />
                  Register
                </Link>
              </li>
              <li>
                <Link to="/FAQs" className={linkClass}>
                  <MdOutlineFeaturedPlayList />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/PrivacyPolicy" className={linkClass}>
                  <MdOutlineFeaturedPlayList />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="Contact Us ">
            <div className="my-2 md:mt-4 space-y-3">
              <a
                href="mailto:leapfrog.testseries@gmail.com"
                className={linkClass}
                aria-label="Send email"
              >
                <BiLogoGmail className="text-xl" />
                <span className="break-all">leapfrog.testseries@gmail.com</span>
              </a>

              <a
                href="https://wa.me/918368371597"
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
              >
                <FaWhatsapp />
                +91 8368371597
              </a>

              <p className="text-xs md:text-sm text-slate-600 md:text-white/75 leading-relaxed">
                For support, feedback, or corrections in questions—drop a
                message anytime.
              </p>
            </div>
          </FooterSection>

          {/* On desktop, keep a third column; on mobile it stays collapsed to avoid height */}
          <FooterSection title="More " defaultOpen={false}>
            <div className="my-2 md:mt-4 flex flex-col gap-3">
              <Link to="/PrivacyPolicy" className={linkClass}>
                🔒Privacy
              </Link>
              <Link to="/FAQs" className={linkClass}>
                ℹ️ Help
              </Link>
              <a
                href="mailto:leapfrog.testseries@gmail.com"
                className={linkClass}
              >
                📧 Email
              </a>
            </div>
          </FooterSection>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 md:mt-10 border-t border-white/20 pt-4">
          <p className="text-center md:text-left text-[11px] md:text-xs text-white/75">
            © {year} UnderSigned. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

FooterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

export default Footer;
