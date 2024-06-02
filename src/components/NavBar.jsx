import { navItems } from "../data/menuItems";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="hidden md:flex space-x-4">
      {navItems.map((item, index) => (
        <div key={index} className="relative group">
          <Link
            to={item.path}
            className="text-white flex items-center space-x-2 hover:text-gray-400 p-2"
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
          {item.submenu && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg hidden group-hover:block p-2 -translate-y-2">
              {item.submenu.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md flex gap-2 items-center"
                >
                  <subItem.icon />
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
