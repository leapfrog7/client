import { FiUserPlus, FiBriefcase } from "react-icons/fi";
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

// export const navItems = [
//   {
//     label: "Paper I & II",
//     path: null,
//     icon: IoNewspaperOutline,
//     submenu: [
//       // Submenu for Paper I
//       {
//         label: "Paper I",
//         path: null,
//         icon: IoNewspaperOutline,
//         submenu: [
//           {
//             label: "Constitution",
//             path: "/pages/quiz/paper-i/Constitution",
//             icon: FaGavel,
//           },
//           {
//             label: "RTI Act",
//             path: "/pages/quiz/paper-i/rti-act",
//             icon: LuFileSearch,
//           },
//           {
//             label: "DFPR",
//             path: "/pages/quiz/paper-i/dfpr-2024",
//             icon: GiReceiveMoney,
//           },
//           {
//             label: "Parliamentary Procedure",
//             path: "/pages/quiz/paper-i/parliamentary-procedure",
//             icon: GrGroup,
//           },
//           {
//             label: "AoBR",
//             path: null,
//             icon: IoFolderOpenOutline,
//             submenu: [
//               {
//                 label: "AoBR Quiz",
//                 path: "/pages/quiz/paper-i/AoBR",
//                 icon: FaQuestionCircle,
//               },
//               {
//                 label: "AoBR Full",
//                 path: "/pages/aobr/complete",
//                 icon: FaBook,
//               },
//               {
//                 label: "AoBR Lookup",
//                 path: "/pages/aobr/lookup",
//                 icon: FaSearch,
//               },
//             ],
//           },
//         ],
//       },
//       // Submenu for Paper II
//       {
//         label: "Paper II",
//         path: null,
//         icon: IoNewspaperOutline,
//         submenu: [
//           {
//             label: "Leave Rules",
//             path: "/pages/quiz/paper-ii/leave-rules",
//             icon: SlCalender,
//           },
//           {
//             label: "CCS CCA Rules",
//             path: "/pages/quiz/paper-ii/ccs-cca-rules",
//             icon: TbReportSearch,
//           },
//           {
//             label: "Pension Rules",
//             path: "/pages/quiz/paper-ii/pension-rules",
//             icon: FaPersonCane,
//           },
//           {
//             label: "Conduct Rules",
//             path: "pages/quiz/paper-ii/conduct-rules",
//             icon: MdOutlineHandshake,
//           },
//           { label: "GFR", path: "/pages/quiz/paper-ii/gfr", icon: GiPayMoney },
//           {
//             label: "Office Procedure",
//             path: "/pages/quiz/paper-ii/csmop",
//             icon: FiBriefcase,
//           },
//         ],
//       },
//     ],
//   },

//   {
//     label: "Register",
//     path: "/register",
//     icon: FiUserPlus,
//   },
// ];

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
    ],
  },

  {
    label: "Register",
    path: "/register",
    icon: FiUserPlus,
  },
];
