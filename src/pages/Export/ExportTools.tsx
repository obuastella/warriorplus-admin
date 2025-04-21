import { useState } from "react";
import {
  FileDown,
  FileText,
  FileJson,
  FileSpreadsheet,
  Calendar,
  Lock,
  Users,
  File,
  Pill,
  Activity,
  BarChart2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ExportTools() {
  const [dateRange, setDateRange] = useState("last30days");
  const [dataType, setDataType] = useState("userMetrics");
  const [anonymizationLevel, setAnonymizationLevel] = useState("full");

  const exportData = () => {
    // In a real application, this would trigger an API call to generate the export
    console.log("Exporting data:", { dateRange, dataType, anonymizationLevel });
    toast.success(
      "Export initiated! The file will be available for download shortly."
    );
  };

  const exportOptions = [
    {
      id: "userMetrics",
      title: "User Metrics",
      description: "Demographics, activity levels, engagement data",
      icon: <Users size={20} className="text-blue-500" />,
    },
    {
      id: "medicationData",
      title: "Medication Usage",
      description: "Types, frequency, effectiveness ratings",
      icon: <Pill size={20} className="text-green-500" />,
    },
    {
      id: "crisisEvents",
      title: "Crisis Events",
      description: "Duration, frequency, triggers, resolution methods",
      icon: <Activity size={20} className="text-red-500" />,
    },
    {
      id: "timelineData",
      title: "User Timelines",
      description: "Anonymized user journeys and patterns",
      icon: <Calendar size={20} className="text-purple-500" />,
    },
    {
      id: "aggregateStats",
      title: "Aggregate Statistics",
      description: "Platform-wide trends and statistics",
      icon: <BarChart2 size={20} className="text-orange-500" />,
    },
  ];

  const fileFormats = [
    { id: "csv", label: "CSV", icon: <File size={20} /> },
    { id: "excel", label: "Excel", icon: <FileSpreadsheet size={20} /> },
    { id: "json", label: "JSON", icon: <FileJson size={20} /> },
    { id: "pdf", label: "PDF Report", icon: <FileText size={20} /> },
  ];

  return (
    <div className="max-w-4xl mb-18 md:mb-0 mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          Export Data for Partnerships
        </h2>

        <div className="space-y-6">
          {/* Data Type Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">1. Select Data Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    dataType === option.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setDataType(option.id)}
                >
                  <div className="flex items-center space-x-3">
                    {option.icon}
                    <div>
                      <h4 className="font-medium">{option.title}</h4>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">2. Select Date Range</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === "last7days"
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDateRange("last7days")}
              >
                Last 7 days
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === "last30days"
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDateRange("last30days")}
              >
                Last 30 days
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === "last90days"
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDateRange("last90days")}
              >
                Last 90 days
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === "lastYear"
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDateRange("lastYear")}
              >
                Last year
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === "custom"
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDateRange("custom")}
              >
                Custom range
              </button>
            </div>

            {dateRange === "custom" && (
              <div className="mt-3 flex space-x-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start date
                  </label>
                  <input type="date" className="border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End date
                  </label>
                  <input type="date" className="border rounded-lg px-3 py-2" />
                </div>
              </div>
            )}
          </div>

          {/* Anonymization Level */}
          <div>
            <h3 className="text-lg font-medium mb-3">3. Anonymization Level</h3>
            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  anonymizationLevel === "full"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setAnonymizationLevel("full")}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Lock size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Full Anonymization</h4>
                    <p className="text-sm text-gray-500">
                      All personal identifiers removed, data aggregated and
                      impossible to trace back to individuals
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  anonymizationLevel === "partial"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setAnonymizationLevel("partial")}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Lock size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Partial Anonymization</h4>
                    <p className="text-sm text-gray-500">
                      Personal identifiers removed but individual journey
                      patterns preserved with randomized IDs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Format Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">4. Select File Format</h3>
            <div className="flex flex-wrap gap-3">
              {fileFormats.map((format) => (
                <button
                  key={format.id}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {format.icon}
                  <span>{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Data Export Ready</h4>
                <p className="text-sm text-gray-500">
                  All selections have been applied to your export
                </p>
              </div>
              <button
                onClick={exportData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <FileDown size={20} />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Policy Reminder */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Data Privacy Reminder
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                All exported data complies with our privacy policy and data
                sharing agreements. User data is anonymized according to HIPAA
                guidelines and healthcare data protection standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
