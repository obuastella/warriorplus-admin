import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
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
import { db } from "../components/firebase";
import useAdminStatsData from "../hooks/useAdminStatsData";
import { useAdminStatsStore } from "../store/useAdminStatsStore";

export default function TopMedicationsUsed() {
  useAdminStatsData();
  const { stats } = useAdminStatsStore();
  const [medicationData, setMedicationData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Fetch medication data from Firestore
  useEffect(() => {
    const fetchMedicationData = async () => {
      try {
        setLoading(true);

        // Query to get top medications ordered by patient count
        const medicationsQuery = query(
          collection(db, "GlobalMedications"),
          orderBy("patientCount", "desc"),
          limit(10) // Get top 10 medications
        );

        const querySnapshot = await getDocs(medicationsQuery);
        const medications: any = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          medications.push({
            name: data.name,
            patients: data.patientCount,
            efficacy: data.avgEfficacy,
            sideEffects: data.sideEffectPercentage,
          });
        });

        setMedicationData(medications);
        setError(null);
      } catch (err) {
        console.error("Error fetching medication data:", err);
        setError("Failed to load medication data");
        setMedicationData([]); // Keep empty array, no sample data
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationData();
  }, []);

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-purple-600">Efficacy: {payload[0]?.value}%</p>
          <p className="text-blue-600">Side Effects: {payload[1]?.value}%</p>
          <p className="text-gray-600">
            Patients:{" "}
            {medicationData.find((med: any) => med.name === label)?.patients ||
              0}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
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
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">Top Medications Used</h3>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <Link
          to="/medication-analysis"
          className="hover:border-b border-b-purple-600 text-sm text-purple-600"
        >
          View All
        </Link>
      </div>

      {medicationData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <h4 className="text-lg font-medium mb-2">
            No Medication Data Available
          </h4>
          <p className="text-sm text-center max-w-sm">
            {error
              ? "There was an error loading the medication data. Please try refreshing the page."
              : "No medications have been recorded yet. Data will appear here once users start adding their medications."}
          </p>
          {!error && (
            <div className="mt-4 text-xs text-gray-400">
              Waiting for user data...
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="h-64 flex items-center justify-center rounded">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={medicationData}
                margin={{ top: 20, right: 30, left: 2, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={12}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#9333EA" />
                <YAxis yAxisId="right" orientation="right" stroke="#1D4ED8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="efficacy"
                  name="Efficacy %"
                  fill="#9333EA"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="sideEffects"
                  name="Side Effects %"
                  fill="#1D4ED8"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Medications: {medicationData.length}</span>
              <span>Total Patients:s {stats[0]?.totalMembers}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
