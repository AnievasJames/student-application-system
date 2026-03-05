import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: '/student/dashboard', label: 'Home', icon: 'home' },
    { path: '/student/apply', label: 'Application', icon: 'edit_document' },
    { path: '/student/applications', label: 'Status', icon: 'fact_check' },
    { path: '/student/profile', label: 'Profile', icon: 'person' }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/applications', label: 'Applications', icon: 'description' },
    { path: '/admin/ai-rankings', label: 'AI Rankings', icon: 'smart_toy' },
    { path: '/admin/manage-users', label: 'Manage Users', icon: 'people' },
    { path: '/admin/security-settings', label: 'Security', icon: 'security' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-logo" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard')}>
          <div className="logo-icon">✱</div>
          <span>Student Application System</span>
        </div>
        <div className="top-bar-right">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-badge">{isAdmin ? 'Admin' : 'Student'}</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="material-symbols-rounded">school</span>
          </div>
          <div className="sidebar-title">
            {isAdmin ? 'Admin' : 'Student'}<br/>Portal
          </div>
        </div>

        <div className="sidebar-nav">
          {links.map((link) => (
            <div
              key={link.path}
              className={`sidebar-item ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              <span className="sidebar-icon material-symbols-rounded">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-logout-btn">
            <span className="sidebar-icon material-symbols-rounded">logout</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
