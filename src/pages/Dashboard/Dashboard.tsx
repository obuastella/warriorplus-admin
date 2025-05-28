import { FileDown } from "lucide-react";
import { Link } from "react-router-dom";
import AdminStats from "./components/AdminStats";
import TopMedicationsUsed from "../../charts/TopMedicationsUsed";
import AdminManagement from "./components/AdminManagement";

export default function OverviewPanel() {
  return (
    <div className="mb-20 md:mb-0 space-y-6">
      <div className="flex flex-wrap gap-y-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

        <div className="flex items-center space-x-3">
          <button className="bg-secondary hover:bg-secondary/80 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm">
            <FileDown size={16} />
            <Link to="/export">Export Data</Link>
          </button>
        </div>
      </div>
      <AdminStats />
      <TopMedicationsUsed />
      <AdminManagement />
    </div>
  );
}
