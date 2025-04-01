import AddCghsUnitForm from "./cghsComponents/AddCghsUnitForm";
import CghsUnitList from "./cghsComponents/CghsUnitList";
import EditCghsUnitModal from "./cghsComponents/EditCghsUnitModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CghsUnitManagement = () => {
  const [editingUnit, setEditingUnit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/cghsUnitManagement";
  // const BASE_URL = "http://localhost:5000/api/v1/cghsUnitManagement";

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUnits = async () => {
    try {
      const res = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnits(res.data);
    } catch (err) {
      console.error("Error fetching CGHS units", err);
      setError("Failed to fetch CGHS units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleDeleteUnit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnits((prev) => prev.filter((unit) => unit._id !== id));
      toast.success("Unit deleted successfully!");
    } catch (error) {
      console.error("Error deleting unit", error);
      toast.error("Failed to delete the unit.");
    }
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUnit(null);
  };

  const handleUpdateUnit = () => {
    fetchUnits(); // Refresh the list
    handleCloseModal();
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-bold">CGHS Unit Management</h2>
      <AddCghsUnitForm fetchUnits={fetchUnits} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CghsUnitList
          units={units}
          onEdit={handleEditUnit}
          onDelete={handleDeleteUnit}
        />
      )}
      <EditCghsUnitModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        unit={editingUnit}
        onUpdate={handleUpdateUnit}
      />
    </div>
  );
};

export default CghsUnitManagement;
