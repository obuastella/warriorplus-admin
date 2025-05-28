import { Pill } from "lucide-react";
import TopMedicationsUsed from "../../charts/TopMedicationsUsed";
import MedicationStats from "./components/MedicationStats";

export default function MedicationAnalysis() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Pill className="mr-2 h-6 w-6 text-secondary" />
        Medication Analysis
      </h2>

      <MedicationStats />
      <div className="mb-14 md:mb-0">
        <TopMedicationsUsed />
      </div>
    </div>
  );
}
