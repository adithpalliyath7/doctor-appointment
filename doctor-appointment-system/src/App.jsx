import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
// Placeholder for Toaster if needed later

// Layouts
import AuthLayout from './layouts/AuthLayout';
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import LoginSelection from './pages/auth/LoginSelection';
import PatientLogin from './pages/auth/PatientLogin';
import PatientRegister from './pages/auth/PatientRegister';
import DoctorLogin from './pages/auth/DoctorLogin';
import AdminLogin from './pages/auth/AdminLogin';
import ForgotPassword from './pages/auth/ForgotPassword';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import LiveToken from './pages/patient/LiveToken';
import Ambulance from './pages/patient/Ambulance';
import Medicines from './pages/patient/Medicines';
import Reports from './pages/patient/Reports';
import Profile from './pages/patient/Profile';
import AppointmentSuccess from './pages/patient/AppointmentSuccess';
import MedicineSuccess from './pages/patient/MedicineSuccess';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPatients from './pages/admin/AdminPatients';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminPayments from './pages/admin/AdminPayments';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'patient') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginSelection />} />
        <Route path="login/patient" element={<PatientLogin />} />
        <Route path="register/patient" element={<PatientRegister />} />
        <Route path="login/doctor" element={<DoctorLogin />} />
        <Route path="login/admin" element={<AdminLogin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Patient Routes */}
      <Route path="/patient" element={
        <ProtectedRoute allowedRole="patient">
          <PatientLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<DoctorSearch />} />
        <Route path="live-token" element={<LiveToken />} />
        <Route path="ambulance" element={<Ambulance />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointment-success" element={<AppointmentSuccess />} />
        <Route path="medicine-success" element={<MedicineSuccess />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={
        <ProtectedRoute allowedRole="doctor">
          <DoctorLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="payments" element={<AdminPayments />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <AppRoutes />
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
