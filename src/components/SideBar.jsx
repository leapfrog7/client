import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";
import { navItems } from "../data/menuItems";
import Logo from "./Logo";
import { IoMdCloseCircle } from "react-icons/io";

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

  const navigate = useNavigate();

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
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
        <div className="p-4 w-4/5 bg-gray-800 h-full">
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
                </button>
                {item.submenu && (
                  <div
                    className={`pl-4 flex flex-col space-y-2 text-sm ${
                      expanded === index
                        ? "max-h-full opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`text-gray-300 py-2 px-4 rounded-md mt-3 flex items-center space-x-2 hover:text-yellow-400 ${
                          selectedItem === `${index}-${subIndex}`
                            ? "bg-gray-700 text-yellow-400"
                            : ""
                        }`}
                        onClick={() =>
                          handleItemClick(`${index}-${subIndex}`, subItem.path)
                        }
                        // When the element is clicked, the onClick event handler calls handleItemClick with the unique identifier of the current item, updating the component state to mark this item as selected.
                      >
                        <subItem.icon className="mr-2" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div onClick={toggleSidebar}>
              {isLoggedIn ? (
                <SignOutButton verifyToken={verifyToken} />
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
