import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserDashboard from "../pages/UserDashboard";
import ProtectedRoute from "../pages/ProtectedRoute";
import ResetPassword from "../pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute >
          {(user) => <UserDashboard User={user} />}
        </ProtectedRoute>
      } />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;