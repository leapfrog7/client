import { FiUserPlus, FiBriefcase } from "react-icons/fi";
import { FaGavel } from "react-icons/fa";
import { LuFileSearch } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { GrGroup } from "react-icons/gr";
import { SlCalender } from "react-icons/sl";
import { MdOutlineHandshake } from "react-icons/md";
import { FaPersonCane } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { IoNewspaperOutline } from "react-icons/io5";

export const navItems = [
  {
    label: "Paper I",
    path: "",
    icon: IoNewspaperOutline,
    submenu: [
      {
        label: "Constitution",
        path: "/pages/quiz/paper-i/Constitution",
        icon: FaGavel,
      },
      {
        label: "RTI Act",
        path: "/pages/quiz/paper-i/rti-act",
        icon: LuFileSearch,
      },
      { label: "DFPR", path: "/pages/quiz/paper-i/dfpr", icon: GiReceiveMoney },
      {
        label: "Parliamentary Procedure",
        path: "/pages/quiz/paper-i/parliamentary-procedure",
        icon: GrGroup,
      },
    ],
  },
  {
    label: "Paper II",
    path: "",
    icon: IoNewspaperOutline,
    submenu: [
      {
        label: "Leave Rules",
        path: "/pages/quiz/paper-ii/leave-rules",
        icon: SlCalender,
      },
      {
        label: "CCS CCA Rules",
        path: "/pages/quiz/paper-ii/ccs-cca-rules",
        icon: TbReportSearch,
      },
      {
        label: "Pension Rules",
        path: "/pages/quiz/paper-ii/pension-rules",
        icon: FaPersonCane,
      },
      {
        label: "Conduct Rules",
        path: "pages/quiz/paper-ii/conduct-rules",
        icon: MdOutlineHandshake,
      },
      { label: "GFR", path: "/pages/quiz/paper-ii/gfr", icon: GiPayMoney },
      {
        label: "Office Procedure",
        path: "/pages/quiz/paper-ii/csmop",
        icon: FiBriefcase,
      },
    ],
  },

  {
    label: "Register",
    path: "/register",
    icon: FiUserPlus,
  },
];
