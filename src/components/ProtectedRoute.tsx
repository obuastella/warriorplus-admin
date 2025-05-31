import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { role, setUserRole }: any = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);

      if (currentUser) {
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserRole(userData.role || "");
          } else {
            // User document doesn't exist, not an admin
            setUserRole("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole("");
        }
      } else {
        setUserRole("");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUserRole]);

  // Show loader while checking auth and fetching user data
  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} className="animate-spin text-secondary" />
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect if user is authenticated but not an admin
  if (user && role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin privileges.</p>
          <button
            onClick={() => auth.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Render protected children only if user is admin
  return <>{children}</>;
};

export default ProtectedRoute;
