import { Users, Pill, Activity } from "lucide-react";
import useAdminStatsData from "../../../hooks/useAdminStatsData";
import { useAdminStatsStore } from "../../../store/useAdminStatsStore";

export default function AdminStats() {
  useAdminStatsData();
  const { stats } = useAdminStatsStore();
  const kpiCards = [
    {
      title: "Total Users",
      value: stats[0]?.totalMembers,
      change: "+14%",
      icon: <Users size={20} className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Medications Tracked",
      value: stats[0]?.medicationsRecorded,
      change: "+6%",
      icon: <Pill size={20} className="text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: "Crisis Events",
      value: stats[0]?.crisisEvents,
      change: "+8%",
      icon: <Activity size={20} className="text-red-500" />,
      color: "bg-red-100",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiCards.map((card, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
