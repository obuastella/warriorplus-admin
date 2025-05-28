import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../components/firebase";

export default function MedicationStats() {
  const [medicationUsageData, setMedicationUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [medicationView, setMedicationView] = useState("usage");

  // Fetch medication data from Firestore
  useEffect(() => {
    const fetchMedicationData = async () => {
      try {
        setLoading(true);
        const medicationsRef = collection(db, "GlobalMedications");
        const snapshot = await getDocs(medicationsRef);

        const medications: any = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            patients: data.patientCount || 0,
            efficacy: data.avgEfficacy || 0,
            sideEffects: data.sideEffectPercentage || 0,
            sideEffectCount: data.sideEffectCount || 0,
            totalEfficacy: data.totalEfficacy || 0,
            createdAt: data.createdAt,
            lastUpdatedAt: data.lastUpdatedAt,
          };
        });

        setMedicationUsageData(medications);
      } catch (err) {
        console.error("Error fetching medication data:", err);
        setError("Failed to load medication data");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationData();
  }, []);

  // Calculate derived stats
  const totalPatients = medicationUsageData.reduce(
    (sum: any, med: any) => sum + med.patients,
    0
  );

  const mostUsedMedication: any =
    medicationUsageData.length > 0
      ? [...medicationUsageData].sort(
          (a: any, b: any) => b.patients - a.patients
        )[0]
      : null;

  const mostEffectiveMedication: any =
    medicationUsageData.length > 0
      ? [...medicationUsageData].sort(
          (a: any, b: any) => b.efficacy - a.efficacy
        )[0]
      : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading medication statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  if (medicationUsageData.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800">No medication data available</div>
      </div>
    );
  }

  return (
    <>
      {/* Medication View Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[{ id: "usage", name: "Usage Distribution" }].map((tab) => (
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
          {mostUsedMedication ? (
            <>
              <p className="mt-1 text-xl font-semibold text-secondary">
                {mostUsedMedication.name}
              </p>
              <p className="text-sm text-gray-600">
                {mostUsedMedication.patients} patients
                {totalPatients > 0 && (
                  <span>
                    {" "}
                    (
                    {(
                      (mostUsedMedication.patients / totalPatients) *
                      100
                    ).toFixed(1)}
                    % of total)
                  </span>
                )}
              </p>
            </>
          ) : (
            <p className="mt-1 text-xl font-semibold text-gray-400">No data</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Most Effective Medication
          </h3>
          {mostEffectiveMedication ? (
            <>
              <p className="mt-1 text-xl font-semibold text-green-600">
                {mostEffectiveMedication.name}
              </p>
              <p className="text-sm text-gray-600">
                {mostEffectiveMedication.efficacy.toFixed(1)}% reported
                effectiveness
              </p>
            </>
          ) : (
            <p className="mt-1 text-xl font-semibold text-gray-400">No data</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Medications Tracked
          </h3>
          <p className="mt-1 text-xl font-semibold text-purple-600">
            {medicationUsageData.length}
          </p>
          <p className="text-sm text-gray-600">Active medications in system</p>
        </div>
      </div>

      {/* Optional: Display medication list */}
      <div className="my-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Medication Overview
          </h3>
          <div className="space-y-3">
            {medicationUsageData
              .sort((a: any, b: any) => b.patients - a.patients)
              .slice(0, 5)
              .map((medication: any, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">
                      {medication.name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {medication.patients} patients
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {medication.efficacy.toFixed(1)}% effective
                    </div>
                    <div className="text-xs text-red-500">
                      {medication.sideEffects.toFixed(1)}% side effects
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
