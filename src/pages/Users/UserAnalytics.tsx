//@ts-nocheck
import { useState } from "react";
import {
  Users,
  Clock,
  Activity,
  UserCheck,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Thermometer,
  Wind,
  Filter,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function UserAnalytics() {
  const [dateRange, setDateRange] = useState("last30");
  const [activeTab, setActiveTab] = useState("behavior");

  // Sample data - in a real app, this would come from your API
  const userStats = {
    totalUsers: 8549,
    activeUsers: 3721,
    newUsers: 427,
    returningUsers: 2104,
    averageAge: 34,
    genderDistribution: {
      male: 42,
      female: 51,
      other: 7,
    },
    topLocations: [
      { name: "California", count: 1204 },
      { name: "New York", count: 986 },
      { name: "Texas", count: 753 },
      { name: "Florida", count: 621 },
      { name: "Illinois", count: 412 },
    ],
    retentionRate: 76,
    avgSessionDuration: "18 min",
    sessionsPerUser: 3.7,
    engagementScore: 7.8,
  };

  // Tabs for different analysis views
  const analyticsTabs = [{ id: "behavior", label: "User Behavior" }];
  const sessionData = [
    { name: "Engaged", value: 15 },
    { name: "Idle", value: 5 },
  ];
  const triggerData = [
    { name: "Weather Changes", value: 35 },
    { name: "Dehydration", value: 25 },
    { name: "Physical Exertion", value: 20 },
    { name: "Stress", value: 15 },
    { name: "Other", value: 5 },
  ];
  const COLORS = ["#a65553", "#93C5FD", "#FFBB28", "#FF8042", "#8884d8"];
  return (
    <div className="space-y-6 mb-20 md:mb-0">
      {/* Header area with title and filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Analytics</h2>

        <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">
                {userStats.totalUsers.toLocaleString()}
              </h3>
              <div className="flex items-center mt-1 text-green-500">
                <span className="text-xs">+{userStats.newUsers} new users</span>
              </div>
            </div>
            <div className="p-2 h-10 rounded-lg bg-blue-100">
              <Users size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <h3 className="text-2xl font-bold mt-1">
                {userStats.activeUsers.toLocaleString()}
              </h3>
              <div className="flex items-center mt-1 text-green-500">
                <span className="text-xs">
                  {Math.round(
                    (userStats.activeUsers / userStats.totalUsers) * 100
                  )}
                  % of total
                </span>
              </div>
            </div>
            <div className="p-2 h-10 rounded-lg bg-green-100">
              <UserCheck size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Retention Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {userStats.retentionRate}%
              </h3>
              <div className="flex items-center mt-1 text-green-500">
                <span className="text-xs">+2.4% vs last period</span>
              </div>
            </div>
            <div className="p-2 h-10 rounded-lg bg-amber-100">
              <RefreshCw size={20} className="text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Engagement Score</p>
              <h3 className="text-2xl font-bold mt-1">
                {userStats.engagementScore}/10
              </h3>
              <div className="flex items-center mt-1 text-green-500">
                <span className="text-xs">Above average</span>
              </div>
            </div>
            <div className="p-2 h-10 rounded-lg bg-purple-100">
              <Activity size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-primary">
          <nav className="flex overflow-x-auto">
            {analyticsTabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-purple-500 text-purple-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* User Behavior Tab Content */}
          {activeTab === "behavior" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Session Duration */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Session Duration</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Average Session</p>
                        <h3 className="text-2xl font-bold">
                          {userStats.avgSessionDuration}
                        </h3>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <Clock size={24} className="text-blue-500" />
                      </div>
                    </div>
                    <div className="h-40 flex items-center justify-center">
                      {/* In a real app, you would render a chart here */}
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={sessionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {sessionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* <p className="text-gray-500">Session Duration Chart</p> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Growth Over Time */}
              <div className="bg-white p-6 rounded-lg shadow col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
                    Common Crisis Triggers
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={triggerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {triggerData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="p-4">
                    <h3 className="font-medium mb-2">Common Patterns</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Wind className="mr-2 h-5 w-5 text-blue-600 mt-0.5" />
                        <span>
                          Weather changes correlate with 35% of crisis events
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Thermometer className="mr-2 h-5 w-5 text-blue-600 mt-0.5" />
                        <span>
                          Temperature drops below 50°F increase crisis risk by
                          27%
                        </span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="mr-2 h-5 w-5 text-blue-600 mt-0.5" />
                        <span>
                          Interventions reduce hospitalization time by 15% on
                          average
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Usage Patterns */}
              <div>
                <h3 className="text-lg font-medium mb-4">Usage Patterns</h3>
                <div className="bg-white border border-primary rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usage Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Time Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Crisis Tracker
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">78%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">5.3 min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500">↑ 4.2%</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Medication Log
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">64%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">3.7 min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500">↑ 2.8%</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Journal
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">42%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">8.1 min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">― 0.3%</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Resource Library
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">29%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">4.5 min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-500">↓ 1.7%</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Community Forums
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">35%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">12.3 min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500">↑ 8.9%</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
