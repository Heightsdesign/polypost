import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Gallery";
import Scheduler from "./pages/Scheduler";
import Account from "./pages/Account";
import Gallery from "./pages/Gallery";
import RegisterPage from "./pages/register/RegisterPage";
import Landing from "./pages/Landing";
import UseCasesPage from "./pages/UseCasesPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PricingPage from "./pages/PricingPage";
import SupportPage from "./pages/SupportPage";



export default function App() {
  return (
    <div className="min-h-screen bg-offwhite text-dark flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />


          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scheduler"
            element={
              <ProtectedRoute>
                <Scheduler />
              </ProtectedRoute>
            }
          />


          {/* Catch-all: redirect unknown routes to landing or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

