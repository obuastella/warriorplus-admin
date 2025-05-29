import { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  Filter,
  Users,
  Pill,
  Activity,
  FileText,
  Database,
  AlertCircle,
} from "lucide-react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase";

const ExportTools = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedDataType, setSelectedDataType] = useState("comprehensive");
  const [exportFormat, setExportFormat] = useState("json");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [firebaseData, setFirebaseData] = useState<any>({
    adminStats: null,
    globalMedications: [],
    userMedications: [],
    painJournalEntries: [],
    users: [],
  });

  // Fetch data from Firebase
  const fetchFirebaseData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch Admin Stats
      const adminStatsRef = doc(db, "Admin", "stats");
      const adminStatsSnap = await getDoc(adminStatsRef);
      const adminStats = adminStatsSnap.exists() ? adminStatsSnap.data() : null;

      // Fetch Global Medications
      const globalMedsRef = collection(db, "GlobalMedications");
      const globalMedsSnap = await getDocs(globalMedsRef);
      const globalMedications = globalMedsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all Users and their subcollections
      const usersRef = collection(db, "Users");
      const usersSnap = await getDocs(usersRef);
      const users = [];
      const allUserMedications: any = [];
      const allPainJournalEntries: any = [];

      for (const userDoc of usersSnap.docs) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        users.push(userData);

        // Fetch user's medications
        const userMedsRef = collection(db, "Users", userDoc.id, "medications");
        const userMedsSnap = await getDocs(userMedsRef);
        userMedsSnap.docs.forEach((medDoc) => {
          allUserMedications.push({
            id: medDoc.id,
            userId: userDoc.id,
            ...medDoc.data(),
          });
        });

        // Fetch user's pain journal entries
        const painJournalRef = collection(
          db,
          "Users",
          userDoc.id,
          "painJournal"
        );
        const painJournalSnap = await getDocs(painJournalRef);
        painJournalSnap.docs.forEach((entryDoc) => {
          allPainJournalEntries.push({
            id: entryDoc.id,
            userId: userDoc.id,
            ...entryDoc.data(),
          });
        });
      }

      // Set the REAL data instead of placeholder data
      setFirebaseData({
        adminStats: adminStats || {
          crisisEvents: "0",
          mediationsRecorded: "0",
          totalMembers: "0",
        }, // Use real data or fallback to defaults
        globalMedications: globalMedications, // Real data
        userMedications: allUserMedications, // Real data
        painJournalEntries: allPainJournalEntries, // Real data
        users: users, // Real data
      });

      console.log("Successfully fetched Firebase data");
    } catch (err) {
      console.error("Error fetching Firebase data:", err);
      setError(
        "Failed to fetch data from Firebase. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  // Filter data based on selected timeframe
  const filterDataByTimeframe = (data: any, timeframe: any) => {
    const now = new Date();
    let startDate: any;

    switch (timeframe) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return {
      ...data,
      globalMedications: data.globalMedications.filter(
        (med: any) => new Date(med.createdAt.toDate()) >= startDate
      ),
      userMedications: data.userMedications.filter(
        (med: any) => new Date(med.createdAt.toDate()) >= startDate
      ),
      painJournalEntries: data.painJournalEntries.filter(
        (entry: any) => new Date(entry.date) >= startDate
      ),
    };
  };

  // Generate pharmaceutical research report
  const generatePharmaceuticalReport = (data: any) => {
    const drugEffectivenessMap: any = {};
    const drugSideEffectsMap: any = {};

    // Analyze user medications for real-world effectiveness
    data.userMedications.forEach((med: any) => {
      if (!drugEffectivenessMap[med.name]) {
        drugEffectivenessMap[med.name] = [];
        drugSideEffectsMap[med.name] = [];
      }
      drugEffectivenessMap[med.name].push(med.effectiveness);
      if (med.sideEffects && med.sideEffects !== "none") {
        drugSideEffectsMap[med.name].push(med.sideEffects);
      }
    });

    // Combine with global medications data
    const medicationAnalysis = data.globalMedications.map((globalMed: any) => {
      const userReports = drugEffectivenessMap[globalMed.name] || [];
      const userSideEffects = drugSideEffectsMap[globalMed.name] || [];

      return {
        drugName: globalMed.name,
        globalAvgEfficacy: globalMed.avgEfficacy1,
        globalPatientCount: globalMed.patientCount,
        globalSideEffectPercentage: globalMed.sideEffectPercentage,
        userReportedEffectiveness:
          userReports.length > 0
            ? userReports.reduce((sum: any, eff: any) => sum + eff, 0) /
              userReports.length
            : null,
        userReportedSideEffects: userSideEffects,
        totalUserReports: userReports.length,
        lastUpdated: globalMed.lastUpdated,
        createdAt: globalMed.createdAt,
        recommendationLevel:
          globalMed.avgEfficacy1 >= 3 ? "Recommended" : "Monitor Closely",
        riskProfile:
          globalMed.sideEffectPercentage > 25
            ? "High Risk"
            : globalMed.sideEffectPercentage > 10
            ? "Moderate Risk"
            : "Low Risk",
      };
    });

    // Crisis correlation analysis
    const medicationCrisisCorrelation = data.userMedications.map((med: any) => {
      const userCrises = data.painJournalEntries.filter(
        (crisis: any) => crisis.userId === med.userId
      );
      return {
        medication: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        effectiveness: med.effectiveness,
        userCrisisCount: userCrises.length,
        averageCrisisSeverity:
          userCrises.length > 0
            ? userCrises.reduce((sum: any, crisis: any) => {
                const severityMap: any = { Mild: 1, Moderate: 2, Severe: 3 };
                return sum + (severityMap[crisis.severity] || 0);
              }, 0) / userCrises.length
            : 0,
      };
    });

    return {
      reportMetadata: {
        generatedAt: new Date().toISOString(),
        timeframe: selectedTimeframe,
        totalPatients: data.users.length,
        totalMedications: data.globalMedications.length,
        totalUserReports: data.userMedications.length,
        totalCrisisEvents: data.painJournalEntries.length,
      },
      medicationEfficacyAnalysis: medicationAnalysis,
      realWorldEvidence: medicationCrisisCorrelation,
      crisisPatterns: {
        totalCrises: data.painJournalEntries.length,
        severityDistribution: data.painJournalEntries.reduce(
          (acc: any, crisis: any) => {
            acc[crisis.severity] = (acc[crisis.severity] || 0) + 1;
            return acc;
          },
          {}
        ),
        averageDuration:
          data.painJournalEntries.length > 0
            ? data.painJournalEntries.reduce(
                (sum: any, crisis: any) =>
                  sum + parseFloat(crisis.duration || 0),
                0
              ) / data.painJournalEntries.length
            : 0,
        commonDescriptions: data.painJournalEntries
          .map((c: any) => c.description)
          .filter((d: any) => d),
      },
      drugSafetySignals: medicationAnalysis.filter(
        (med: any) =>
          med.globalSideEffectPercentage > 15 ||
          med.userReportedSideEffects.length > 0
      ),
      treatmentRecommendations: {
        highlyEffective: medicationAnalysis.filter(
          (med: any) => med.globalAvgEfficacy >= 4
        ),
        requiresMonitoring: medicationAnalysis.filter(
          (med: any) => med.riskProfile !== "Low Risk"
        ),
        underPerforming: medicationAnalysis.filter(
          (med: any) => med.globalAvgEfficacy < 2
        ),
      },
    };
  };

  // Generate hospital analytics report
  const generateHospitalReport = (data: any) => {
    const patientMedicationMap: any = {};
    data.userMedications.forEach((med: any) => {
      if (!patientMedicationMap[med.userId]) {
        patientMedicationMap[med.userId] = [];
      }
      patientMedicationMap[med.userId].push(med);
    });

    const patientCrisisMap: any = {};
    data.painJournalEntries.forEach((crisis: any) => {
      if (!patientCrisisMap[crisis.userId]) {
        patientCrisisMap[crisis.userId] = [];
      }
      patientCrisisMap[crisis.userId].push(crisis);
    });

    return {
      hospitalMetadata: {
        generatedAt: new Date().toISOString(),
        reportPeriod: selectedTimeframe,
        activePatients: data.users.length,
        adminStats: data.adminStats,
      },
      patientCareMetrics: {
        totalCrisisEvents: data.painJournalEntries.length,
        crisisSeverityBreakdown: data.painJournalEntries.reduce(
          (acc: any, crisis: any) => {
            acc[crisis.severity] = (acc[crisis.severity] || 0) + 1;
            return acc;
          },
          {}
        ),
        averageCrisisDuration:
          data.painJournalEntries.length > 0
            ? data.painJournalEntries.reduce(
                (sum: any, crisis: any) =>
                  sum + parseFloat(crisis.duration || 0),
                0
              ) / data.painJournalEntries.length
            : 0,
        highRiskPatients: Object.keys(patientCrisisMap).filter(
          (userId) => patientCrisisMap[userId].length > 5
        ).length,
      },
      medicationManagement: {
        totalActivePrescriptions: data.userMedications.length,
        medicationAdherence: data.userMedications.map((med: any) => ({
          patientId: med.userId,
          medication: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          effectiveness: med.effectiveness,
          sideEffects: med.sideEffects,
          notes: med.notes,
        })),
        prescriptionPatterns: data.globalMedications.map((med: any) => ({
          medication: med.name,
          globalPatientCount: med.patientCount,
          avgEfficacy: med.avgEfficacy1,
          sideEffectRate: med.sideEffectPercentage,
        })),
      },
      patientOutcomes: Object.keys(patientMedicationMap).map((userId) => ({
        patientId: userId,
        medicationCount: patientMedicationMap[userId].length,
        crisisCount: patientCrisisMap[userId]?.length || 0,
        averageMedicationEffectiveness:
          patientMedicationMap[userId].length > 0
            ? patientMedicationMap[userId].reduce(
                (sum: any, med: any) => sum + med.effectiveness,
                0
              ) / patientMedicationMap[userId].length
            : 0,
        mostSevereCrisis:
          patientCrisisMap[userId]?.reduce((max: any, crisis: any) => {
            const severityMap: any = { Mild: 1, Moderate: 2, Severe: 3 };
            return severityMap[crisis.severity] > severityMap[max]
              ? crisis.severity
              : max;
          }, "None") || "None",
      })),
      treatmentProtocols: {
        effectiveTreatments: data.globalMedications
          .filter((med: any) => med.avgEfficacy1 >= 3.5)
          .map((med: any) => ({
            name: med.name,
            efficacy: med.avgEfficacy1,
            patientCount: med.patientCount,
          })),
        highRiskTreatments: data.globalMedications
          .filter((med: any) => med.sideEffectPercentage > 20)
          .map((med: any) => ({
            name: med.name,
            riskPercentage: med.sideEffectPercentage,
            patientCount: med.patientCount,
          })),
      },
    };
  };

  // Handle export functionality
  const handleExport = async () => {
    if (isLoading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    setIsExporting(true);

    try {
      const filteredData = filterDataByTimeframe(
        firebaseData,
        selectedTimeframe
      );
      let exportData;
      let filename;

      switch (selectedDataType) {
        case "pharmaceutical":
          exportData = generatePharmaceuticalReport(filteredData);
          filename = `pharmaceutical_research_${selectedTimeframe}_${Date.now()}`;
          break;
        case "hospital":
          exportData = generateHospitalReport(filteredData);
          filename = `hospital_analytics_${selectedTimeframe}_${Date.now()}`;
          break;
        case "comprehensive":
          exportData = {
            pharmaceuticalResearch: generatePharmaceuticalReport(filteredData),
            hospitalAnalytics: generateHospitalReport(filteredData),
            rawData: {
              adminStats: filteredData.adminStats,
              globalMedications: filteredData.globalMedications,
              userMedications: filteredData.userMedications,
              painJournalEntries: filteredData.painJournalEntries,
              totalUsers: filteredData.users.length,
            },
          };
          filename = `comprehensive_sickle_cell_report_${selectedTimeframe}_${Date.now()}`;
          break;
        default:
          exportData = filteredData;
          filename = `sickle_cell_raw_data_${selectedTimeframe}_${Date.now()}`;
      }

      if (exportFormat === "json") {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === "csv") {
        const csvData = convertToCSV(exportData);
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      alert("Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Convert data to CSV format
  const convertToCSV = (data: any) => {
    if (data.pharmaceuticalResearch || data.medicationEfficacyAnalysis) {
      const medData = data.pharmaceuticalResearch
        ? data.pharmaceuticalResearch.medicationEfficacyAnalysis
        : data.medicationEfficacyAnalysis;

      const headers = [
        "Drug Name",
        "Global Avg Efficacy",
        "Patient Count",
        "Side Effect %",
        "User Reported Effectiveness",
        "User Reports Count",
        "Risk Profile",
        "Recommendation",
      ];

      const rows = medData.map((med: any) => [
        med.drugName,
        med.globalAvgEfficacy,
        med.globalPatientCount,
        med.globalSideEffectPercentage,
        med.userReportedEffectiveness || "N/A",
        med.totalUserReports,
        med.riskProfile,
        med.recommendationLevel,
      ]);

      return [headers, ...rows].map((row) => row.join(",")).join("\n");
    }
    return "Drug Name,Efficacy,Patient Count,Side Effects\nNo data available for CSV export";
  };

  const stats = {
    totalUsers: firebaseData.users.length,
    totalMedications: firebaseData.userMedications.length,
    totalCrisisEvents: firebaseData.painJournalEntries.length,
    uniqueDrugs: firebaseData.globalMedications.length,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchFirebaseData}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Database className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Sickle Cell Data Export Tools
              </h1>
              <p className="text-gray-600">
                Generate comprehensive reports for pharmaceutical research and
                hospital analytics
              </p>
              {isLoading && (
                <p className="text-sm text-orange-600 mt-1">Loading data...</p>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Total Patients</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Pill className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Global Drugs</p>
                  <p className="text-2xl font-bold">{stats.uniqueDrugs}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Crisis Events</p>
                  <p className="text-2xl font-bold">
                    {stats.totalCrisisEvents}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">User Medications</p>
                  <p className="text-2xl font-bold">{stats.totalMedications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Filter className="w-6 h-6 text-indigo-600" />
            Export Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Time Frame Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Time Frame
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            {/* Data Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4 inline mr-2" />
                Report Type
              </label>
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="comprehensive">Comprehensive Report</option>
                <option value="pharmaceutical">Pharmaceutical Research</option>
                <option value="hospital">Hospital Analytics</option>
                <option value="raw">Raw Data Only</option>
              </select>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Download className="w-4 h-4 inline mr-2" />
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="json">JSON (Detailed)</option>
                <option value="csv">CSV (Excel Compatible)</option>
              </select>
            </div>
          </div>

          {/* Report Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Pharmaceutical Research Report
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Drug efficacy analysis from GlobalMedications</li>
                <li>• Real-world evidence from user reports</li>
                <li>• Side effect correlation patterns</li>
                <li>• Crisis-medication relationship analysis</li>
                <li>• Treatment recommendations for R&D</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Hospital Analytics Report
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Patient care metrics and outcomes</li>
                <li>• Medication adherence patterns</li>
                <li>• Crisis frequency and severity trends</li>
                <li>• High-risk patient identification</li>
                <li>• Treatment protocol effectiveness</li>
              </ul>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={handleExport}
              disabled={isExporting || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              <Download className="w-5 h-5" />
              {isExporting
                ? "Generating Export..."
                : "Generate & Download Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportTools;
