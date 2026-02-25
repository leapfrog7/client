// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Link, useNavigate } from "react-router-dom";
// import SignOutButton from "./SignOutButton";
// import SignInButton from "./SignInButton";
// import { navItems } from "../data/menuItems";
// import Logo from "./Logo";
// import {
//   IoMdCloseCircle,
//   IoMdArrowDropdown,
//   IoMdArrowDropright,
// } from "react-icons/io";
// import { BiLogoGmail } from "react-icons/bi";
// import { FaWhatsapp } from "react-icons/fa";

// SideBar.propTypes = {
//   isSidebarOpen: PropTypes.bool,
//   toggleSidebar: PropTypes.func,
//   isLoggedIn: PropTypes.bool,
//   verifyToken: PropTypes.func,
// };

// export default function SideBar({
//   isSidebarOpen,
//   toggleSidebar,
//   isLoggedIn,
//   verifyToken,
// }) {
//   const [expanded, setExpanded] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [subExpanded, setSubExpanded] = useState(null);

//   const navigate = useNavigate();

//   const handleToggle = (index) => {
//     setExpanded(expanded === index ? null : index);
//     setSubExpanded(null); // Reset sub-menu expansion when a new main item is expanded
//   };

//   const handleSubToggle = (subIndex) => {
//     setSubExpanded(subExpanded === subIndex ? null : subIndex);
//   };

//   const handleItemClick = (index, path) => {
//     setSelectedItem(index);

//     if (!path) return;
//     navigate(path); // Navigate to the path if it exists
//     toggleSidebar(); // Close sidebar on item click
//   };

//   // To stop the scrolling when Side Bar is open
//   useEffect(() => {
//     if (isSidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto"; // Clean up when component unmounts
//     };
//   }, [isSidebarOpen]);

//   return (
//     <>
//       <div
//         className={`fixed inset-0 bg-gray-700 bg-opacity-80 z-50 transform ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform lg:hidden md:hidden`}
//       >
//         <div className="p-4 w-4/5 bg-gray-800 h-full overflow-y-auto">
//           {/* Logo in Sidebar with close button */}
//           <div className="flex items-center justify-between mb-8 mt-1">
//             <div className="flex items-center space-x-2">
//               <Logo />
//             </div>
//             {/* close button icon */}
//             <button className="text-white" onClick={toggleSidebar}>
//               <IoMdCloseCircle className="text-3xl" />
//             </button>
//           </div>

//           {/* SideBar Menu */}
//           <div className="mt-4 flex flex-col space-y-4 gap-4">
//             {navItems.map((item, index) => (
//               <div key={index} className="relative text-base">
//                 <button
//                   className="text-white flex items-center space-x-2 hover:text-yellow-400 w-full text-left"
//                   onClick={() => {
//                     handleToggle(index);
//                     handleItemClick(index, item.path);
//                   }}
//                 >
//                   <item.icon />
//                   <span>{item.label}</span>
//                   {item.submenu && (
//                     <span className="ml-auto">
//                       {expanded === index ? (
//                         <IoMdArrowDropdown />
//                       ) : (
//                         <IoMdArrowDropright />
//                       )}
//                     </span>
//                   )}
//                 </button>
//                 {item.submenu && (
//                   <div
//                     className={`pl-4 flex flex-col text-base ${
//                       expanded === index
//                         ? "max-h-full opacity-100"
//                         : "max-h-0 opacity-0"
//                     } overflow-hidden`}
//                   >
//                     {item.submenu.map((subItem, subIndex) => (
//                       <div key={subIndex} className="relative">
//                         <button
//                           className={`text-gray-300 py-2 px-4 rounded-md mt-3 flex items-center space-x-2 hover:text-yellow-400 w-full text-left ${
//                             selectedItem === `${index}-${subIndex}`
//                               ? "bg-gray-700 text-yellow-400"
//                               : ""
//                           }`}
//                           onClick={() => {
//                             if (subItem.submenu) {
//                               handleSubToggle(subIndex);
//                             } else {
//                               handleItemClick(
//                                 `${index}-${subIndex}`,
//                                 subItem.path
//                               );
//                             }
//                           }}
//                         >
//                           <subItem.icon className="mr-2" />
//                           <span>{subItem.label}</span>
//                           {subItem.submenu && (
//                             <span className="ml-auto">
//                               {subExpanded === subIndex ? (
//                                 <IoMdArrowDropdown />
//                               ) : (
//                                 <IoMdArrowDropright />
//                               )}
//                             </span>
//                           )}
//                         </button>
//                         {subItem.submenu && (
//                           <div
//                             className={`pl-4 flex flex-col space-y-2 text-sm ${
//                               subExpanded === subIndex
//                                 ? "max-h-full opacity-100"
//                                 : "max-h-0 opacity-0"
//                             } overflow-hidden`}
//                           >
//                             {subItem.submenu.map((nestedItem, nestedIndex) => (
//                               <Link
//                                 key={nestedIndex}
//                                 to={nestedItem.path}
//                                 className={`text-gray-300 py-2 px-4 rounded-md mt-3 flex items-center space-x-2 hover:text-yellow-400 ${
//                                   selectedItem ===
//                                   `${index}-${subIndex}-${nestedIndex}`
//                                     ? "bg-gray-700 text-yellow-400"
//                                     : ""
//                                 }`}
//                                 onClick={() =>
//                                   handleItemClick(
//                                     `${index}-${subIndex}-${nestedIndex}`,
//                                     nestedItem.path
//                                   )
//                                 }
//                               >
//                                 <nestedItem.icon className="mr-2" />
//                                 <span>{nestedItem.label}</span>
//                               </Link>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//             {/* {!isLoggedIn ? (
//               <div className="p-4 bg-gray-200 rounded-lg shadow-lg text-center">
//                 <h2 className="text-lg font-bold mb-1 text-gray-800">
//                   Ready to Challenge Yourself?
//                 </h2>
//                 <p className="text-gray-600 mb-4">
//                   Take our sample quiz and test your knowledge now!
//                 </p>
//                 <a
//                   className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
//                   href="/pages/quiz/SampleQuiz"
//                 >
//                   Sample Quiz
//                 </a>
//               </div>
//             ) : (
//               <div></div>
//             )} */}

//             {!isLoggedIn ? (
//               <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-md text-center">
//                 <h2 className="text-lg font-bold mb-1 text-gray-800">
//                   Try it free for 24 hours and see if it’s right for you.
//                 </h2>
//                 <p className="text-gray-600 mb-4 text-sm">
//                   Register now and unlock to all quizzes, PYQs, and dashboard
//                   tools.
//                 </p>
//                 <a
//                   href="/register"
//                   className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full shadow-md font-medium text-sm sm:text-base transition duration-300 inline-flex items-center justify-center gap-2 w-full"
//                 >
//                   Start Free Trial
//                 </a>
//                 <p className="mt-2 text-xs text-gray-500">No payment needed.</p>
//               </div>
//             ) : (
//               <div></div>
//             )}

//             <div onClick={toggleSidebar}>
//               {isLoggedIn ? (
//                 <SignOutButton verifyToken={verifyToken} />
//               ) : (
//                 <div className="flex justify-center items-center h-full">
//                   <SignInButton />
//                 </div>
//               )}
//             </div>
//             <div className="shadow-lg bg-slate-600 px-2 py-4 rounded-lg text-center transform transition-transform hover:scale-105">
//               <h2 className="text-slate-100 text-xl font-bold mb-4">
//                 Contact Us
//               </h2>
//               <div className="text-gray-100 flex flex-col gap-4 text-center">
//                 <a
//                   href="mailto:leapfrog.testseries@gmail.com"
//                   className="hover:text-yellow-500 flex items-center justify-center text-sm bg-slate-200 text-gray-700 rounded-xl py-2"
//                 >
//                   <BiLogoGmail className="mr-1 text-xl text-red-700" />
//                   leapfrog.testseries@gmail.com
//                 </a>
//                 <a
//                   href="https://wa.me/918368371597"
//                   className="hover:text-yellow-500 flex items-center justify-center text-base bg-slate-200 text-gray-700 rounded-xl py-1"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FaWhatsapp className="mr-2 text-xl text-green-600" />
//                   +91 8368371597
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  verifyToken: PropTypes.func,
};

export default function SideBar({
  isSidebarOpen,
  toggleSidebar,
  isLoggedIn,
  verifyToken,
}) {
  const [expanded, setExpanded] = useState(null);
  const [subExpanded, setSubExpanded] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Helpers
  const closeSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const makeKey = (...parts) => parts.filter(Boolean).join("-");

  const handleToggle = (index) => {
    setExpanded((prev) => (prev === index ? null : index));
    setSubExpanded(null);
  };

  const handleSubToggle = (subIndex) => {
    setSubExpanded((prev) => (prev === subIndex ? null : subIndex));
  };

  const handleNavigate = (key, path) => {
    setSelectedKey(key);
    if (!path) return;
    navigate(path);
    closeSidebar();
  };

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isSidebarOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeSidebar();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  // Optional: keep "selected" in sync with route (nice UX)
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden md:hidden ${
        isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gray-700/80 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeSidebar}
      />

      {/* Panel */}
      <div
        className={`relative h-full w-4/5 max-w-sm bg-gray-800 overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={stop}
        onMouseDown={stop}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <button
              className="text-white"
              onClick={closeSidebar}
              aria-label="Close menu"
              type="button"
            >
              <IoMdCloseCircle className="text-3xl" />
            </button>
          </div>

          {/* Menu */}
          <div className="mt-2 flex flex-col gap-3">
            {navItems.map((item, index) => {
              const hasSub = !!item.submenu;
              const isOpen = expanded === index;

              return (
                <div key={index} className="relative text-base">
                  <button
                    type="button"
                    className="text-white flex items-center gap-2 hover:text-yellow-400 w-full text-left py-2"
                    onClick={() => {
                      if (hasSub) handleToggle(index);
                      else handleNavigate(item.path || item.label, item.path);
                    }}
                    aria-expanded={hasSub ? isOpen : undefined}
                  >
                    <item.icon />
                    <span>{item.label}</span>

                    {hasSub && (
                      <span className="ml-auto">
                        {isOpen ? (
                          <IoMdArrowDropdown />
                        ) : (
                          <IoMdArrowDropright />
                        )}
                      </span>
                    )}
                  </button>

                  {hasSub && (
                    <div
                      className={`pl-3 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
                        isOpen
                          ? "max-h-[70vh] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.submenu.map((subItem, subIndex) => {
                        const subHasNested = !!subItem.submenu;
                        const subOpen = subExpanded === subIndex;
                        const subKey = makeKey(item.label, subItem.label);

                        const selected =
                          selectedKey === subItem.path ||
                          selectedKey === subKey;

                        return (
                          <div key={subIndex} className="relative">
                            <button
                              type="button"
                              className={`text-gray-200 py-2 px-3 rounded-lg mt-1 flex items-center gap-2 hover:text-yellow-400 w-full text-left ${
                                selected ? "bg-gray-700 text-yellow-400" : ""
                              }`}
                              onClick={() => {
                                if (subHasNested) {
                                  handleSubToggle(subIndex);
                                } else {
                                  handleNavigate(
                                    subItem.path || subKey,
                                    subItem.path,
                                  );
                                }
                              }}
                              aria-expanded={subHasNested ? subOpen : undefined}
                            >
                              <subItem.icon className="text-base" />
                              <span className="text-sm">{subItem.label}</span>

                              {subHasNested && (
                                <span className="ml-auto">
                                  {subOpen ? (
                                    <IoMdArrowDropdown />
                                  ) : (
                                    <IoMdArrowDropright />
                                  )}
                                </span>
                              )}
                            </button>

                            {subHasNested && (
                              <div
                                className={`pl-4 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
                                  subOpen
                                    ? "max-h-[60vh] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                {subItem.submenu.map(
                                  (nestedItem, nestedIndex) => {
                                    const nestedKey = makeKey(
                                      item.label,
                                      subItem.label,
                                      nestedItem.label,
                                    );
                                    const nestedSelected =
                                      selectedKey === nestedItem.path ||
                                      selectedKey === nestedKey;

                                    return (
                                      <Link
                                        key={nestedIndex}
                                        to={nestedItem.path}
                                        className={`text-gray-200 py-2 px-3 rounded-lg mt-1 flex items-center gap-2 hover:text-yellow-400 ${
                                          nestedSelected
                                            ? "bg-gray-700 text-yellow-400"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleNavigate(
                                            nestedItem.path || nestedKey,
                                            nestedItem.path,
                                          )
                                        }
                                      >
                                        <nestedItem.icon className="text-base" />
                                        <span className="text-sm">
                                          {nestedItem.label}
                                        </span>
                                      </Link>
                                    );
                                  },
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Trial CTA */}
            {!isLoggedIn && (
              <div className="p-4 mt-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-bold mb-1 text-gray-800">
                  Try it free for 24 hours
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Register now and unlock quizzes, PYQs, and dashboard tools.
                </p>
                <Link
                  to="/register"
                  onClick={closeSidebar}
                  className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-full shadow-md font-medium text-sm sm:text-base transition duration-300 inline-flex items-center justify-center gap-2 w-full"
                >
                  Start Free Trial
                </Link>
                <p className="mt-2 text-xs text-gray-500">No payment needed.</p>
              </div>
            )}

            {/* Auth buttons */}
            <div onClick={closeSidebar}>
              {isLoggedIn ? (
                <SignOutButton verifyToken={verifyToken} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <SignInButton />
                </div>
              )}
            </div>

            {/* Contact card */}
            <div className="shadow-lg bg-slate-600 px-3 py-4 rounded-lg text-center">
              <h2 className="text-slate-100 text-xl font-bold mb-4">
                Contact Us
              </h2>
              <div className="text-gray-100 flex flex-col gap-3 text-center">
                <a
                  href="mailto:leapfrog.testseries@gmail.com"
                  className="hover:text-yellow-500 flex items-center justify-center text-sm bg-slate-200 text-gray-700 rounded-xl py-2"
                >
                  <BiLogoGmail className="mr-1 text-xl text-red-700" />
                  leapfrog.testseries@gmail.com
                </a>
                <a
                  href="https://wa.me/918368371597"
                  className="hover:text-yellow-500 flex items-center justify-center text-base bg-slate-200 text-gray-700 rounded-xl py-2"
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
    </div>
  );
}
