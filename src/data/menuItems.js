import { FiBriefcase } from "react-icons/fi";
import { FaGavel, FaQuestionCircle, FaBook, FaSearch } from "react-icons/fa";
import { LuFileSearch } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { GrGroup } from "react-icons/gr";
import { SlCalender } from "react-icons/sl";
import { MdOutlineHandshake } from "react-icons/md";
import { FaPersonCane } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { IoNewspaperOutline, IoFolderOpenOutline } from "react-icons/io5";
import { TfiAgenda } from "react-icons/tfi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { CiHospital1 } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import { VscTable } from "react-icons/vsc";
import { LuNotebookText } from "react-icons/lu";
import { MdModeOfTravel } from "react-icons/md";
import { TbInvoice } from "react-icons/tb";
import { TbPigMoney } from "react-icons/tb";
import { GoTasklist } from "react-icons/go";

export const navItems = [
  {
    label: "Paper I",
    path: null,
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
      {
        label: "DFPR",
        path: "/pages/quiz/paper-i/dfpr-2024",
        icon: GiReceiveMoney,
      },
      {
        label: "Parliamentary Procedure",
        path: "/pages/quiz/paper-i/parliamentary-procedure",
        icon: GrGroup,
      },
      {
        label: "AoBR",
        path: null,
        icon: IoFolderOpenOutline, // You can choose an appropriate icon
        submenu: [
          {
            label: "AoBR Quiz",
            path: "/pages/quiz/paper-i/AoBR",
            icon: FaQuestionCircle,
          },
          {
            label: "AoBR Full",
            path: "/pages/aobr/complete",
            icon: FaBook,
          },
          {
            label: "AoBR Lookup",
            path: "/pages/aobr/lookup",
            icon: FaSearch,
          },
        ],
      },
      {
        label: "FR",
        path: "/pages/quiz/paper-ii/fr_sr",
        icon: TfiAgenda,
      },
      {
        label: "Economy",
        path: "/pages/quiz/paper-i/CA_Economy",
        icon: HiOutlineBanknotes,
      },

      {
        label: "Govt. Schemes",
        path: "/pages/quiz/paper-i/CA_Schemes",
        icon: LiaHandsHelpingSolid,
      },
    ],
  },
  {
    label: "Paper II",
    path: null,
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
      {
        label: "TA Rules",
        path: "pages/quiz/paper-ii/ta-rules",
        icon: MdModeOfTravel,
      },
      {
        label: "NPS Rules",
        path: "pages/quiz/paper-ii/nps-rules",
        icon: TbPigMoney,
      },
    ],
  },

  // {
  //   label: "Register",
  //   path: "/register",
  //   icon: FiUserPlus,
  // },
  {
    label: "Utilities",
    path: null,
    icon: AiOutlineAppstoreAdd, // You can change the icon to something else if you'd like
    submenu: [
      {
        label: "NPS or UPS",
        path: "/pages/public/nps-or-ups",
        icon: GiTakeMyMoney, // Matching your Economy icon style
      },
      {
        label: "CGHS Units",
        path: "/pages/public/cghs-units",
        icon: CiHospital1, // Matching your Economy icon style
      },
      {
        label: "CGHS Rates",
        path: "/pages/public/cghs-rates",
        icon: TbInvoice, // Matching your Economy icon style
      },
      {
        label: "Pay Matrix",
        path: "/pages/public/7thCPC-paymatrix",
        icon: VscTable, // Matching your Economy icon style
      },
      {
        label: "PDF Tools",
        path: "/pages/public/pdf-utility", // 👈 NEW ENTRY
        icon: LuFileSearch, // You can change this to any relevant icon
      },
      {
        label: "Task Manager",
        path: "/pages/tools/task-tracker", // 👈 NEW ENTRY
        icon: GoTasklist, // You can change this to any relevant icon
      },
    ],
  },
  {
    label: "Resources",
    path: "/pages/public/resources",
    icon: LuNotebookText,
  },
];
