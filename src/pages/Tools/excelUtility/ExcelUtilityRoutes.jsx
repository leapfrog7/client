import { Routes, Route, Navigate } from "react-router-dom";
import ExcelUtilityHome from "./ExcelUtilityHome";

export default function ExcelUtilityRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ExcelUtilityHome />} />
      <Route
        path="*"
        element={<Navigate to="/pages/tools/excel-utility" replace />}
      />
    </Routes>
  );
}
