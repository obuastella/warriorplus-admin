import {
  Shield,
  UserPlus,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import FetchAdmins from "../functions/FetchAdmins";

export default function AdminManagement() {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [admins, setAdmins] = useState([
    { id: 1, email: "admin@company.com", role: "Super Admin" },
    { id: 2, email: "manager@company.com", role: "Manager" },
  ]);

  // Function to send email using EmailJS
  const sendAdminInviteEmail = async (email: any) => {
    try {
      if (!emailjs) {
        throw new Error(
          "EmailJS not loaded. Please add EmailJS script to your HTML."
        );
      }

      const templateParams = {
        to_email: email,
        to_name: email.split("@")[0], // Use part before @ as name
        default_password: "Qwerty123!",
      };

      const result = await emailjs.send(
        "service_cr4n2q6",
        "template_255ucet",
        templateParams,
        "4xPiL1wQeLNDbAqoI"
      );

      return result;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  };

  // Show notification
  const showNotification = (type: any, message: any) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 5000);
  };

  // Function to create admin user in Firebase Auth + Firestore
  const createAdminUser = async (email: any) => {
    try {
      const defaultPassword = "Qwerty123!";

      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        defaultPassword
      );
      const user = userCredential.user;
      // Step 2: Do ALL Firestore writes BEFORE signing out
      // Main user document
      await setDoc(doc(db, "Users", user.uid), {
        email: email,
        firstName: "",
        lastName: "",
        isVerified: true,
        role: "admin",
        createdAt: new Date(),
        needsPasswordChange: true,
      });

      // Update admin stats
      const adminStats = doc(db, "Admin", "stats");
      await setDoc(
        adminStats,
        {
          totalMembers: increment(1),
        },
        { merge: true }
      );
      // Create statistics subcollection
      await setDoc(doc(db, "Users", user.uid, "statistics", "summary"), {
        painJournalEntries: 0,
        remindersCount: 0,
        painCrisisLevel: "None",
      });

      // Create tracker subcollection
      await setDoc(doc(db, "Users", user.uid, "tracker", "data"), {
        emergencyContact: "None",
        community: "None",
        bloodCount: [],
      });

      toast.success("Admin user created successfully");
      return { id: user.uid, email };
    } catch (error) {
      console.error("Admin creation failed:", error);
      throw error;
    }
  };

  // Updated handleAddAdmin function
  const handleAddAdmin = async (e: any) => {
    e.preventDefault();

    if (!adminEmail || !adminEmail.includes("@")) {
      showNotification("error", "Please enter a valid email address");
      return;
    }

    // Check if admin already exists in local state
    if (admins.some((admin) => admin.email === adminEmail)) {
      showNotification("error", "This email is already an admin");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create user in Firebase Auth and Firestore
      await createAdminUser(adminEmail);

      // Step 2: Send invitation email
      await sendAdminInviteEmail(adminEmail);

      // Step 3: Add to local state
      const newAdmin = {
        id: Date.now(),
        email: adminEmail,
        role: "Admin",
      };
      setAdmins([...admins, newAdmin]);

      // Reset form
      setAdminEmail("");
      setShowAddAdmin(false);

      showNotification(
        "success",
        `Admin invitation sent successfully to ${adminEmail}`
      );
    } catch (error: any) {
      console.error("Error adding admin:", error);

      let errorMessage = "Failed to add admin. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. User may already exist.";
      }

      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.message && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="text-indigo-600 mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Admin Management
            </h3>
          </div>
          <button
            onClick={() => setShowAddAdmin(true)}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-md"
          >
            <UserPlus size={18} />
            <span>Add Admin</span>
          </button>
        </div>

        <FetchAdmins />

        {/* Add Admin Form */}
        {showAddAdmin && (
          <div className="border-t pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email address"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleAddAdmin(e);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddAdmin}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  <span>{isLoading ? "Adding Admin..." : "Add Admin"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddAdmin(false);
                    setAdminEmail("");
                  }}
                  disabled={isLoading}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
