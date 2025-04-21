import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import {
  Users,
  Pill,
  Clock,
  Calendar,
  TrendingUp,
  Filter,
  Activity,
  FileDown,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OverviewPanel() {
  const [dateRange, setDateRange] = useState("last30");

  // In a real app, you would fetch this data from your API
  const stats = {
    totalUsers: "8,549",
    activeUsers: "3,721",
    avgCrisisDuration: "42 min",
    medicationsRecorded: "124",
    mostCommonMedication: "Alprazolam",
    crisisEvents: "12,456",
    growthRate: "+12.4%",
  };

  // Sample KPI cards that would be important for partnerships
  const kpiCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+14%",
      icon: <Users size={20} className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Medications Tracked",
      value: stats.medicationsRecorded,
      change: "+6%",
      icon: <Pill size={20} className="text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: "Avg. Crisis Duration",
      value: stats.avgCrisisDuration,
      change: "-3%",
      icon: <Clock size={20} className="text-amber-500" />,
      color: "bg-amber-100",
    },
    {
      title: "Crisis Events",
      value: stats.crisisEvents,
      change: "+8%",
      icon: <Activity size={20} className="text-red-500" />,
      color: "bg-red-100",
    },
  ];
  const usersData = [
    { name: "", patients: 87, efficacy: 76, sideEffects: 12 },
    { name: "", patients: 45, efficacy: 82, sideEffects: 19 },
  ];
  // Medication data
  const medicationUsageData = [
    { name: "Hydroxyurea", patients: 87, efficacy: 76, sideEffects: 12 },
    { name: "Crizanlizumab", patients: 45, efficacy: 82, sideEffects: 19 },
    { name: "Voxelotor", patients: 62, efficacy: 74, sideEffects: 15 },
    { name: "L-glutamine", patients: 38, efficacy: 68, sideEffects: 7 },
    { name: "Penicillin", patients: 72, efficacy: 65, sideEffects: 5 },
  ];

  return (
    <div className="mb-20 md:mb-0 space-y-6">
      <div className="flex flex-wrap gap-y-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border-none focus:ring-0 focus:outline-none"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="lastYear">Last year</option>
              <option value="allTime">All time</option>
            </select>
          </div>

          <button className="bg-secondary hover:bg-secondary/80 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm">
            <FileDown size={16} />
            <Link to="/export">Export Data</Link>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                <div className="flex items-center mt-1">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-500">
                    {card.change} since last period
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">User Growth</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span>New Users</span>
              <span className="w-3 h-3 rounded-full bg-blue-300 ml-2"></span>
              <span>Active Users</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center rounded">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={usersData}
                margin={{ top: 20, right: 30, left: 2, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#a65553" />
                <YAxis yAxisId="right" orientation="right" stroke="#93C5FD" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="efficacy"
                  name="New Users"
                  fill="#a65553"
                />
                <Bar
                  yAxisId="right"
                  dataKey="sideEffects"
                  name="Active Users %"
                  fill="#93C5FD"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medication Usage Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Top Medications Used</h3>
            <Link
              to="/medication-analysis"
              className="hover:border-b border-b-purple-600 text-sm text-purple-600"
            >
              View All
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center rounded">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={medicationUsageData}
                margin={{ top: 20, right: 30, left: 2, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#9333EA" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="efficacy"
                  name="Efficacy %"
                  fill="#9333EA"
                />
                <Bar
                  yAxisId="right"
                  dataKey="sideEffects"
                  name="Side Effects %"
                  fill="#1D4ED8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Key Insights for Partnerships
        </h3>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-medium">User Engagement Increasing</h4>
              <p className="text-gray-600 text-sm">
                Average session duration has increased by 18% over the past
                month, indicating stronger user engagement with the platform.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <Pill size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium">Medication Effectiveness</h4>
              <p className="text-gray-600 text-sm">
                Users reporting alprazolam use show 27% shorter crisis durations
                compared to the platform average.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-amber-100 p-2 rounded-lg mr-4">
              <Calendar size={20} className="text-amber-500" />
            </div>
            <div>
              <h4 className="font-medium">Seasonal Patterns</h4>
              <p className="text-gray-600 text-sm">
                Crisis events increase by approximately 22% during winter
                months, suggesting potential seasonal effectiveness
                considerations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
