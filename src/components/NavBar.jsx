import { useState } from "react";
import { navItems } from "../data/menuItems";
import { Link } from "react-router-dom";
import { IoChevronForward, IoChevronDown } from "react-icons/io5";

export default function NavBar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
    setHoveredSubItem(null);
  };

  const renderSubmenu = (submenu, subIndex) => {
    const open = hoveredSubItem === subIndex;

    return (
      <div
        className={`z-20 absolute left-full top-0 ml-2 min-w-[220px] rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2
          transition-all duration-150 ${
            open
              ? "opacity-100 translate-x-0 visible"
              : "opacity-0 translate-x-1 invisible"
          }`}
      >
        {submenu.map((subItem, i) => (
          <Link
            key={i}
            to={subItem.path}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700
                       hover:bg-slate-50 hover:text-slate-900"
          >
            <subItem.icon className="text-slate-500" />
            <span className="truncate">{subItem.label}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-2 hidden md:flex lg:space-x-4 space-x-1 rounded-lg z-20 items-center text-sm lg:text-base">
      {navItems.map((item, index) => {
        const open = hoveredItem === index;
        const hasSub = !!item.submenu;

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Top level */}
            {item.path ? (
              <Link
                to={item.path}
                className="text-white flex items-center gap-2 hover:text-yellow-400 px-1 py-1 rounded-md"
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="text-white flex items-center gap-2 hover:text-yellow-400 px-2 py-1 rounded-md"
                aria-haspopup={hasSub ? "menu" : undefined}
                aria-expanded={hasSub ? open : undefined}
              >
                <item.icon />
                <span>{item.label}</span>
                {hasSub && (
                  <IoChevronDown
                    className={`ml-1 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            )}

            {/* First dropdown */}
            {hasSub && (
              <div
                className={`absolute left-0 top-full mt-2 min-w-[230px] rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2
                  transition-all duration-150 ${
                    open
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-1 invisible"
                  }`}
              >
                {item.submenu.map((subItem, subIndex) => {
                  const hasNested = !!subItem.submenu;
                  return (
                    <div
                      key={subIndex}
                      className="relative"
                      onMouseEnter={() => setHoveredSubItem(subIndex)}
                      onMouseLeave={() => setHoveredSubItem(null)}
                    >
                      <Link
                        to={subItem.path || "#"}
                        onClick={(e) => {
                          if (!subItem.path) e.preventDefault();
                        }}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700
                                   hover:bg-slate-50 hover:text-slate-900"
                      >
                        <subItem.icon className="text-slate-500" />
                        <span className="truncate">{subItem.label}</span>
                        {hasNested && (
                          <IoChevronForward className="ml-auto text-slate-400" />
                        )}
                      </Link>

                      {hasNested && renderSubmenu(subItem.submenu, subIndex)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
