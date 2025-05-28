import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAdminStatsStore } from "../store/useAdminStatsStore";
import { db } from "../components/firebase";

const useAdminStatsData = () => {
  const { setAdminStats } = useAdminStatsStore();

  useEffect(() => {
    const fetchAdminStats = async () => {
      const adminStatsRef = collection(db, "Admin");
      const snapshot = await getDocs(adminStatsRef);
      const adminStats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;

      setAdminStats(adminStats);
    };

    fetchAdminStats();
  }, [setAdminStats]);
};

export default useAdminStatsData;
