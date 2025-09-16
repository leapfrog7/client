import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";
import { navItems } from "../data/menuItems";
import Logo from "./Logo";
import {
  IoMdCloseCircle,
  IoMdArrowDropdown,
  IoMdArrowDropright,
} from "react-icons/io";
import { BiLogoGmail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

SideBar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  verifyToken: PropTypes.func,
};

export default function SideBar({
  isSidebarOpen,
  toggleSidebar,
  isLoggedIn,
  verifyToken,
}) {
  const [expanded, setExpanded] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subExpanded, setSubExpanded] = useState(null);

  const navigate = useNavigate();

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
    setSubExpanded(null); // Reset sub-menu expansion when a new main item is expanded
  };

  const handleSubToggle = (subIndex) => {
    setSubExpanded(subExpanded === subIndex ? null : subIndex);
  };

  const handleItemClick = (index, path) => {
    setSelectedItem(index);

    if (!path) return;
    navigate(path); // Navigate to the path if it exists
    toggleSidebar(); // Close sidebar on item click
  };

  // To stop the scrolling when Side Bar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up when component unmounts
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-700 bg-opacity-80 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:hidden md:hidden`}
      >
        <div className="p-4 w-4/5 bg-gray-800 h-full overflow-y-auto">
          {/* Logo in Sidebar with close button */}
          <div className="flex items-center justify-between mb-8 mt-1">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            {/* close button icon */}
            <button className="text-white" onClick={toggleSidebar}>
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          {/* SideBar Menu */}
          <div className="mt-4 flex flex-col space-y-4 gap-4">
            {navItems.map((item, index) => (
              <div key={index} className="relative text-base">
                <button
                  className="text-white flex items-center space-x-2 hover:text-yellow-400 w-full text-left"
                  onClick={() => {
                    handleToggle(index);
                    handleItemClick(index, item.path);
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <span className="ml-auto">
                      {expanded === index ? (
                        <IoMdArrowDropdown />
                      ) : (
                        <IoMdArrowDropright />
                      )}
                    </span>
                  )}
                </button>
                {item.submenu && (
                  <div
                    className={`pl-4 flex flex-col text-base ${
                      expanded === index
                        ? "max-h-full opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <div key={subIndex} className="relative">
                        <button
                          className={`text-gray-300 py-2 px-4 rounded-md mt-3 flex items-center space-x-2 hover:text-yellow-400 w-full text-left ${
                            selectedItem === `${index}-${subIndex}`
                              ? "bg-gray-700 text-yellow-400"
                              : ""
                          }`}
                          onClick={() => {
                            if (subItem.submenu) {
                              handleSubToggle(subIndex);
                            } else {
                              handleItemClick(
                                `${index}-${subIndex}`,
                                subItem.path
                              );
                            }
                          }}
                        >
                          <subItem.icon className="mr-2" />
                          <span>{subItem.label}</span>
                          {subItem.submenu && (
                            <span className="ml-auto">
                              {subExpanded === subIndex ? (
                                <IoMdArrowDropdown />
                              ) : (
                                <IoMdArrowDropright />
                              )}
                            </span>
                          )}
                        </button>
                        {subItem.submenu && (
                          <div
                            className={`pl-4 flex flex-col space-y-2 text-sm ${
                              subExpanded === subIndex
                                ? "max-h-full opacity-100"
                                : "max-h-0 opacity-0"
                            } overflow-hidden`}
                          >
                            {subItem.submenu.map((nestedItem, nestedIndex) => (
                              <Link
                                key={nestedIndex}
                                to={nestedItem.path}
                                className={`text-gray-300 py-2 px-4 rounded-md mt-3 flex items-center space-x-2 hover:text-yellow-400 ${
                                  selectedItem ===
                                  `${index}-${subIndex}-${nestedIndex}`
                                    ? "bg-gray-700 text-yellow-400"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleItemClick(
                                    `${index}-${subIndex}-${nestedIndex}`,
                                    nestedItem.path
                                  )
                                }
                              >
                                <nestedItem.icon className="mr-2" />
                                <span>{nestedItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* {!isLoggedIn ? (
              <div className="p-4 bg-gray-200 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-bold mb-1 text-gray-800">
                  Ready to Challenge Yourself?
                </h2>
                <p className="text-gray-600 mb-4">
                  Take our sample quiz and test your knowledge now!
                </p>
                <a
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                  href="/pages/quiz/SampleQuiz"
                >
                  Sample Quiz
                </a>
              </div>
            ) : (
              <div></div>
            )} */}

            {!isLoggedIn ? (
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-bold mb-1 text-gray-800">
                  Try it free for 24 hours and see if it’s right for you.
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Register now and unlock to all quizzes, PYQs, and dashboard
                  tools.
                </p>
                <a
                  href="/register"
                  className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full shadow-md font-medium text-sm sm:text-base transition duration-300 inline-flex items-center justify-center gap-2 w-full"
                >
                  Start Free Trial
                </a>
                <p className="mt-2 text-xs text-gray-500">No payment needed.</p>
              </div>
            ) : (
              <div></div>
            )}

            <div onClick={toggleSidebar}>
              {isLoggedIn ? (
                <SignOutButton verifyToken={verifyToken} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <SignInButton />
                </div>
              )}
            </div>
            <div className="shadow-lg bg-slate-600 px-2 py-4 rounded-lg text-center transform transition-transform hover:scale-105">
              <h2 className="text-slate-100 text-xl font-bold mb-4">
                Contact Us
              </h2>
              <div className="text-gray-100 flex flex-col gap-4 text-center">
                <a
                  href="mailto:leapfrog.testseries@gmail.com"
                  className="hover:text-yellow-500 flex items-center justify-center text-sm bg-slate-200 text-gray-700 rounded-xl py-2"
                >
                  <BiLogoGmail className="mr-1 text-xl text-red-700" />
                  leapfrog.testseries@gmail.com
                </a>
                <a
                  href="https://wa.me/918368371597"
                  className="hover:text-yellow-500 flex items-center justify-center text-base bg-slate-200 text-gray-700 rounded-xl py-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-2 text-xl text-green-600" />
                  +91 8368371597
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
