import {
  FiHome,
  FiInfo,
  FiUserPlus,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

export const navItems = [
  {
    label: "Paper I",
    path: "",
    icon: FiHome,
    submenu: [
      {
        label: "Constitution",
        path: "/pages/quiz/paper-i/Constitution",
        icon: FiBriefcase,
      },
      {
        label: "RTI Act",
        path: "/pages/quiz/paper-i/rti-act",
        icon: FiBriefcase,
      },
      { label: "DFPR", path: "/pages/quiz/paper-i/dfpr", icon: FiBriefcase },
      {
        label: "Parliamentary Procedure",
        path: "/pages/quiz/paper-i/parliamentary-procedure",
        icon: FiBriefcase,
      },
    ],
  },
  {
    label: "Paper II",
    path: "",
    icon: FiInfo,
    submenu: [
      {
        label: "Leave Rules",
        path: "/pages/quiz/paper-ii/leave-rules",
        icon: FiUser,
      },
      {
        label: "CCS CCA Rules",
        path: "/pages/quiz/paper-ii/ccs-cca-rules",
        icon: FiUser,
      },
      {
        label: "Pension Rules",
        path: "/pages/quiz/paper-ii/pension-rules",
        icon: FiUser,
      },
      {
        label: "Conduct Rules",
        path: "pages/quiz/paper-ii/conduct-rules",
        icon: FiUser,
      },
      { label: "GFR", path: "/pages/quiz/paper-ii/gfr", icon: FiUser },
      {
        label: "Office Procedure",
        path: "/pages/quiz/paper-ii/csmop",
        icon: FiUser,
      },
    ],
  },

  {
    label: "Register",
    path: "/register",
    icon: FiUserPlus,
  },
];
