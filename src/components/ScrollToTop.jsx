// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import PropTypes from "prop-types";

// const ScrollToTop = ({ children }) => {
//   const { pathname } = useLocation();
//   const [fadeKey, setFadeKey] = useState(0);

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });

//     // Trigger a small fade animation
//     setFadeKey((prev) => prev + 1);
//   }, [pathname]);

//   return (
//     <div key={fadeKey} className="animate-fade-in">
//       {children}
//     </div>
//   );
// };
// ScrollToTop.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default ScrollToTop;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
