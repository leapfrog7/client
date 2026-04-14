import { NavLink } from "react-router-dom";
import {
  FaHouse,
  FaLayerGroup,
  FaRegFolderOpen,
  FaSliders,
  FaBookOpen,
} from "react-icons/fa6";

const navItems = [
  {
    to: "/pages/tools/drafting",
    label: "Home",
    end: true,
    icon: FaHouse,
  },
  {
    to: "/pages/tools/drafting/templates",
    label: "Templates",
    icon: FaLayerGroup,
  },
  {
    to: "/pages/tools/drafting/drafts",
    label: "Drafts",
    icon: FaRegFolderOpen,
  },
  {
    to: "/pages/tools/drafting/paragraph-bank",
    label: "Paragraph Bank",
    icon: FaBookOpen,
  },
  {
    to: "/pages/tools/drafting/preferences",
    label: "Preferences",
    icon: FaSliders,
  },
];

function linkClasses(isActive) {
  return [
    "group inline-flex items-center gap-1 rounded-xl pl-4 pr-8 py-2",
    "text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-sky-200 text-sky-800 font-semibold shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-sky-900",
  ].join(" ");
}

export default function SideNav() {
  return (
    <nav
      aria-label="Drafting navigation"
      className="flex items-center gap-2 md:gap-8 overflow-x-auto py-3 scrollbar-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => linkClasses(isActive)}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    isActive
                      ? "bg-white/12 text-sky-800"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white"
                  }`}
                >
                  <Icon className="text-sm" />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
