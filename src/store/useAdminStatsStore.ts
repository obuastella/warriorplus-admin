import { create } from "zustand";

type AdminStats = {
  totalMembers: number;
  medicationsRecorded: number;
  crisisEvents: number;
};

interface AdminStatsStore {
  stats: AdminStats[];
  setAdminStats: (stats: AdminStats[]) => void;
}

export const useAdminStatsStore = create<AdminStatsStore>((set) => ({
  stats: [],
  setAdminStats: (stats) => set({ stats }),
}));
