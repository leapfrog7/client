import { ImSpinner8 } from "react-icons/im";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-2">
        <ImSpinner8 className="animate-spin text-blue-700 text-3xl" />
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    </div>
  );
}
