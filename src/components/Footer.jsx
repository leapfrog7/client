import { FaHome, FaInfo, FaUserPlus, FaWhatsapp } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { MdOutlineFeaturedPlayList } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-customBlue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center  text-center">
          {/* Footer Links */}
          <div className="mb-4 md:mb-0 mx-auto">
            <h2 className="text-lg font-bold mb-2">Quick Links</h2>
            <ul className="sm:text-base grid grid-cols-2 md:grid-cols-1 gap-2 ">
              <li className="flex items-center justify-center ">
                <FaHome className="mr-2" />
                <a href="/" className="hover:text-yellow-500">
                  Home
                </a>
              </li>
              <li className="flex items-center justify-center">
                <FaInfo className="mr-2" />
                <a href="/about" className="hover:text-yellow-500">
                  About
                </a>
              </li>
              <li className="flex items-center justify-center">
                <FaUserPlus className="mr-2" />
                <a href="/register" className="hover:text-yellow-500">
                  Register
                </a>
              </li>
              <li className="flex items-center justify-center">
                <MdOutlineFeaturedPlayList className="mr-2" />
                <a href="/FAQs" className="hover:text-yellow-500">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Information */}
          <div className="mb-4 md:mb-0 mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="flex justify-center items-center gap-2">
              <a
                href="mailto:leapfrog.testseries@gmail.com"
                className="hover:text-yellow-500 flex items-center"
              >
                <BiLogoGmail className="mr-2" />
                leapfrog.testseries@gmail.com
              </a>
            </p>
            <p className="flex justify-center items-center gap-2">
              <a
                href="https://wa.me/918368371597"
                className="hover:text-yellow-500 flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2" />
                +91 8368371597
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
