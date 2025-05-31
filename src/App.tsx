import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ExportTools from "./pages/Export/ExportTools";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { auth } from "./components/firebase";
import MedicationAnalysis from "./pages/MedicationAnalysis/MedicationAnalysis";
import Settings from "./pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setUser(user);
      setLoading(false); // Set loading to false once we get the auth state
    });

    return () => unsubscribe();
  }, []);

  // Show loader while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          element={user ? <Navigate to="/dashboard" /> : <Login />}
          path="/"
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/analytics"
          element={
            <Layout>
              <UserAnalytics />
            </Layout>
          }
        /> */}
        <Route
          path="/medication-analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <MedicationAnalysis />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/export"
          element={
            <ProtectedRoute>
              <Layout>
                <ExportTools />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
