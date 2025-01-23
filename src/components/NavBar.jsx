// className={`absolute left-full top-0 mt-1 w-48 bg-white rounded-md shadow-lg p-2 ${
//         hoveredSubItem === subIndex ? "block" : "hidden"

import { useState } from "react";
import { navItems } from "../data/menuItems";
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function NavBar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
    setHoveredSubItem(null); // Reset the hovered sub-item when a new item is hovered
  };

  const handleSubItemMouseEnter = (subIndex) => {
    setHoveredSubItem(subIndex);
  };

  const renderSubmenu = (submenu, subIndex) => {
    return (
      <div
        className={`absolute left-full top-0 mt-1 w-48 bg-white rounded-md shadow-lg p-2 ${
          hoveredSubItem === subIndex ? "block" : "hidden"
        }`}
      >
        {submenu.map((subItem, index) => (
          <Link
            key={index}
            to={subItem.path}
            className="px-4 py-2 text-gray-700 hover:bg-yellow-200 rounded-md flex gap-2 items-center"
          >
            <subItem.icon />
            {subItem.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-2 hidden md:flex space-x-4  rounded-lg">
      {navItems.map((item, index) => (
        <div
          key={index}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link
            to={item.path}
            className="text-gray-100 flex items-center space-x-2  hover:text-yellow-400  px-2  py-1 hover:rounded-md"
          >
            <item.icon />
            <span>{item.label}</span>
            {item.submenu && <IoChevronForward className="ml-auto" />}
          </Link>
          {item.submenu && (
            <div
              className={`absolute left-0 w-48 bg-white rounded-md shadow-lg z-10 pb-2 ${
                hoveredItem === index ? "block" : "hidden"
              }`}
            >
              {item.submenu.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  className="relative group"
                  onMouseEnter={() => handleSubItemMouseEnter(subIndex)}
                  onMouseLeave={() => setHoveredSubItem(null)}
                >
                  <Link
                    to={subItem.path}
                    className="px-4 py-2 text-gray-700 hover:bg-yellow-200 rounded-md flex gap-2 items-center"
                  >
                    <subItem.icon />
                    {subItem.label}
                    {subItem.submenu && (
                      <IoChevronForward className="ml-auto" />
                    )}
                  </Link>
                  {subItem.submenu && renderSubmenu(subItem.submenu, subIndex)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
