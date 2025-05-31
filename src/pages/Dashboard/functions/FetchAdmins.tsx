import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../../../components/firebase";
import { Users, X } from "lucide-react";
import { ConfirmRemovalModal } from "../modals/ConfirmRemoveModal";
interface Admin {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt?: any;
}

export default function FetchAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    adminId: "",
    adminEmail: "",
  });

  // Alternative: Real-time listener for admin users
  const setupAdminListener = () => {
    const q = query(collection(db, "Users"), where("role", "==", "admin"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const adminsList: Admin[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          adminsList.push({
            id: doc.id,
            email: data.email,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: data.createdAt,
          });
        });

        setAdmins(adminsList);
        setIsLoadingAdmins(false);
      },
      (error) => {
        console.error("Error listening to admins:", error);
        // toast.error("Failed to load admin users");
        setIsLoadingAdmins(false);
      }
    );

    return unsubscribe;
  };

  // Initialize data fetching
  useEffect(() => {
    // Option 1: One-time fetch
    // fetchAdmins();

    // Option 2: Real-time listener (recommended)
    const unsubscribe = setupAdminListener();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  // Handle admin removal
  const handleRemoveAdmin = (adminId: string, adminEmail: string) => {
    setConfirmModal({
      isOpen: true,
      adminId,
      adminEmail,
    });
  };
  // Confirm admin removal
  const confirmRemoveAdmin = async () => {
    try {
      setIsLoading(true);

      const userRef = doc(db, "Users", confirmModal.adminId);

      // Update the user's role to "user"
      await updateDoc(userRef, {
        role: "user",
      });

      toast.success(`Admin access removed for ${confirmModal.adminEmail}`);

      // Close modal
      setConfirmModal({
        isOpen: false,
        adminId: "",
        adminEmail: "",
      });

      // If using one-time fetch, refetch the data
      // await fetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin access");
    } finally {
      setIsLoading(false);
    }
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      adminId: "",
      adminEmail: "",
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Current Admins
      </h3>

      {isLoadingAdmins ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading admins...</span>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-2 opacity-50" />
          <p>No admin users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <Users size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{admin.email}</p>
                  <p className="text-sm text-gray-500">
                    {admin.firstName && admin.lastName
                      ? `${admin.firstName} ${admin.lastName} • ${admin.role}`
                      : admin.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                disabled={isLoading}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
                title="Remove admin access"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmRemovalModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmRemoveAdmin}
        adminEmail={confirmModal.adminEmail}
        isLoading={isLoading}
      />
    </div>
  );
}
