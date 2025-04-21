import { useState } from "react";
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
import { Pill } from "lucide-react";

// Medication data
const medicationUsageData = [
  { name: "Hydroxyurea", patients: 87, efficacy: 76, sideEffects: 12 },
  { name: "Crizanlizumab", patients: 45, efficacy: 82, sideEffects: 19 },
  { name: "Voxelotor", patients: 62, efficacy: 74, sideEffects: 15 },
  { name: "L-glutamine", patients: 38, efficacy: 68, sideEffects: 7 },
  { name: "Penicillin", patients: 72, efficacy: 65, sideEffects: 5 },
];

export default function MedicationAnalysis() {
  const [medicationView, setMedicationView] = useState("usage"); // 'usage', 'efficacy', 'trends'
  // Find most used medication
  const mostUsedMedication = [...medicationUsageData].sort(
    (a, b) => b.patients - a.patients
  )[0];
  const mostEffectiveMedication = [...medicationUsageData].sort(
    (a, b) => b.efficacy - a.efficacy
  )[0];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Pill className="mr-2 h-6 w-6 text-secondary" />
        Medication Analysis
      </h2>

      {/* Medication View Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "usage", name: "Usage Distribution" },
            { id: "efficacy", name: "Efficacy & Side Effects" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMedicationView(tab.id)}
              className={`py-4 px-1 ${
                medicationView === tab.id
                  ? "border-b-2 border-secondary font-medium text-secondary"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Medication Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Most Prescribed Medication
          </h3>
          <p className="mt-1 text-xl font-semibold text-secondary">
            {mostUsedMedication.name}
          </p>
          <p className="text-sm text-gray-600">
            {mostUsedMedication.patients} patients (
            {((mostUsedMedication.patients / 164) * 100).toFixed(1)}% of total)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Most Effective Medication
          </h3>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {mostEffectiveMedication.name}
          </p>
          <p className="text-sm text-gray-600">
            {mostEffectiveMedication.efficacy}% reported effectiveness
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Multi-medication Treatment
          </h3>
          <p className="mt-1 text-xl font-semibold text-purple-600">43%</p>
          <p className="text-sm text-gray-600">
            of patients use combination therapy
          </p>
        </div>
      </div>

      {/* Medication Content based on selected view */}
      <div className="bg-white p-6 rounded-lg shadow">
        {medicationView === "usage" && (
          <>
            <h3 className="text-lg font-medium mb-4">
              Medication Usage Distribution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={medicationUsageData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" name="Patient Count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                <h4 className="font-medium">Key Insights</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>
                      Hydroxyurea remains the most prescribed medication, with
                      87 patients currently using it
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>
                      Crizanlizumab shows the highest efficacy rating (82%)
                      despite lower usage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>
                      Pediatric patients are more likely to be on Penicillin
                      prophylaxis (92% of 0-12 age group)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>
                      L-glutamine has the lowest side effect profile (7%) but
                      moderate efficacy
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {medicationView === "efficacy" && (
          <>
            <h3 className="text-lg font-medium mb-4">
              Medication Efficacy vs Side Effects
            </h3>
            <ResponsiveContainer width="100%" height={350}>
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
          </>
        )}
      </div>
    </div>
  );
}
