// import { Shield, UserPlus, Users, X, Mail } from "lucide-react";
// import { useState } from "react";

// export default function AdminManagement() {
//   const [showAddAdmin, setShowAddAdmin] = useState(false);
//   const [adminEmail, setAdminEmail] = useState("");
//   const [admins, setAdmins] = useState([
//     { id: 1, email: "admin@company.com", role: "Super Admin" },
//     { id: 2, email: "manager@company.com", role: "Manager" },
//   ]);

//   const handleAddAdmin = (e: any) => {
//     e.preventDefault();
//     if (adminEmail && adminEmail.includes("@")) {
//       const newAdmin = {
//         id: Date.now(),
//         email: adminEmail,
//         role: "Admin",
//       };
//       setAdmins([...admins, newAdmin]);
//       setAdminEmail("");
//       setShowAddAdmin(false);
//     }
//   };

//   const removeAdmin = (id: any) => {
//     setAdmins(admins.filter((admin) => admin.id !== id));
//   };
//   return (
//     <div className="space-y-6">
//       {/* Admin Management Section */}
//       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center">
//             <Shield className="text-indigo-600 mr-3" size={24} />
//             <h3 className="text-xl font-bold text-gray-800">
//               Admin Management
//             </h3>
//           </div>
//           <button
//             onClick={() => setShowAddAdmin(true)}
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-md"
//           >
//             <UserPlus size={18} />
//             <span>Add Admin</span>
//           </button>
//         </div>

//         {/* Current Admins List */}
//         <div className="space-y-3 mb-6">
//           {admins.map((admin) => (
//             <div
//               key={admin.id}
//               className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <div className="flex items-center">
//                 <div className="bg-indigo-100 p-2 rounded-full mr-3">
//                   <Users size={16} className="text-indigo-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-800">{admin.email}</p>
//                   <p className="text-sm text-gray-500">{admin.role}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => removeAdmin(admin.id)}
//                 className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
//                 title="Remove admin"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Add Admin Form */}
//         {showAddAdmin && (
//           <div className="border-t pt-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Admin Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={adminEmail}
//                     onChange={(e) => setAdminEmail(e.target.value)}
//                     placeholder="Enter admin email address"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         handleAddAdmin(e);
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleAddAdmin}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Add Admin
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddAdmin(false);
//                     setAdminEmail("");
//                   }}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// added
import {
  Shield,
  UserPlus,
  Users,
  X,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../components/firebase";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

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

  // Function to save user to Firestore Users collection
  const saveUserToFirestore = async (email: any) => {
    try {
      // Check if user already exists in Firestore
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("User already exists in database");
      }

      // Add new admin user to Firestore
      const docRef = await addDoc(collection(db, "Users"), {
        email: email,
        isVerified: true,
        role: "admin",
        createdAt: new Date(),
        defaultPassword: "Qwerty123!", // Store this for reference, but user should change it
      });

      return { id: docRef.id, email };
    } catch (error) {
      console.error("Firestore save failed:", error);
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

  const handleAddAdmin = async (e: any) => {
    e.preventDefault();

    if (!adminEmail || !adminEmail.includes("@")) {
      showNotification("error", "Please enter a valid email address");
      return;
    }

    // Check if admin already exists
    if (admins.some((admin) => admin.email === adminEmail)) {
      showNotification("error", "This email is already an admin");
      return;
    }

    setIsLoading(true);

    try {
      console.log("user email", adminEmail);
      // Step 1: Save user to Firestore
      await saveUserToFirestore(adminEmail);

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
      toast.success(`Admin invitation sent successfully to ${adminEmail}`);
    } catch (error) {
      console.error("Error adding admin:", error);
      showNotification("error", "Admin User already exist");
      toast.error("Admin User already exist");
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = (id: any) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
    showNotification("success", "Admin removed successfully");
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

        {/* Current Admins List */}
        <div className="space-y-3 mb-6">
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
                  <p className="text-sm text-gray-500">{admin.role}</p>
                </div>
              </div>
              <button
                onClick={() => removeAdmin(admin.id)}
                disabled={isLoading}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
                title="Remove admin"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

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
