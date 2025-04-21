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
import UserAnalytics from "./pages/Users/UserAnalytics";
import MedicationAnalysis from "./pages/MedicationAnalysis/MedicationAnalysis";
import Settings from "./pages/Settings/Settings";

export default function App() {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      setUser(user);
    });
  });
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
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <UserAnalytics />
            </Layout>
          }
        />
        <Route
          path="/medication-analysis"
          element={
            <Layout>
              <MedicationAnalysis />
            </Layout>
          }
        />
        <Route
          path="/export"
          element={
            <Layout>
              <ExportTools />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
