import { Link } from "react-router-dom";
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

export default function TopMedicationsUsed() {
  // Medication data
  const medicationUsageData = [
    { name: "Hydroxyurea", patients: 87, efficacy: 76, sideEffects: 12 },
    { name: "Crizanlizumab", patients: 45, efficacy: 82, sideEffects: 19 },
    { name: "Voxelotor", patients: 62, efficacy: 74, sideEffects: 15 },
    { name: "L-glutamine", patients: 38, efficacy: 68, sideEffects: 7 },
    { name: "Penicillin", patients: 72, efficacy: 65, sideEffects: 5 },
  ];
  return (
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
  );
}
