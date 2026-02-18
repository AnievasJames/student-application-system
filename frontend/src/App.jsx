import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/student/Profile';
import ApplicationForm from './components/student/ApplicationForm';
import ApplicationStatus from './components/student/ApplicationStatus';
import DocumentUpload from './components/student/DocumentUpload';
import Dashboard from './components/admin/Dashboard';
import ApplicationDetail from './components/admin/ApplicationDetail';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/student/dashboard" />;

  return children;
};

const Navigation = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav style={{padding: '1rem', background: '#2563eb', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>Student Application System</div>
      <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <span>{user?.firstName} {user?.lastName} ({isAdmin ? 'Admin' : 'Student'})</span>
        <button onClick={logout} style={{padding: '0.5rem 1rem', background: 'white', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const StudentDashboard = () => {
  return (
    <div style={{padding: '2rem'}}>
      <h2>Student Dashboard</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem'}}>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>My Profile</h3>
          <p>View and update your personal information</p>
          <a href="/student/profile" style={{display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>View Profile</a>
        </div>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>My Applications</h3>
          <p>View status of your submitted applications</p>
          <a href="/student/applications" style={{display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>View Applications</a>
        </div>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
          <h3>New Application</h3>
          <p>Submit a new application for admission</p>
          <a href="/student/apply" style={{display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>Apply Now</a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/student/apply" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              <Route path="/student/applications" element={<ProtectedRoute><ApplicationStatus /></ProtectedRoute>} />
              <Route path="/student/applications/:applicationId/documents" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />

              <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/applications/:id" element={<ProtectedRoute requireAdmin={true}><ApplicationDetail /></ProtectedRoute>} />

              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
