import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/student/Profile';
import ApplicationForm from './components/student/ApplicationForm';
import ApplicationStatus from './components/student/ApplicationStatus';
import ApplicationDetail from './components/student/ApplicationDetail';
import DocumentUpload from './components/student/DocumentUpload';
import Dashboard from './components/admin/Dashboard';
import ApplicationsList from './components/admin/ApplicationsList';
import AdminApplicationDetail from './components/admin/ApplicationDetail';
import Navigation from './components/Navigation';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/student/dashboard" replace />;

  return children;
};

const HeadlineSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
const slides = [
    {
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=675&fit=crop',
      title: 'Welcome to Student Portal',
      description: 'Your journey to academic excellence starts here'
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=675&fit=crop',
      title: 'Easy Application Process',
      description: 'Submit your applications with just a few clicks'
    },
    {
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=675&fit=crop',
      title: 'Track Your Progress',
      description: 'Monitor your application status in real-time'
    },
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop',
      title: 'Connect with Advisors',
      description: 'Get guidance from experienced academic advisors'
    },
    {
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=675&fit=crop',
      title: 'Digital Document Upload',
      description: 'Securely upload and manage your documents online'
    },
    {
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=675&fit=crop',
      title: 'Instant Notifications',
      description: 'Receive updates about your application instantly'
    },
    {
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=675&fit=crop',
      title: 'Success Stories',
      description: 'Join thousands of successful students worldwide'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="slideshow-container">
      <div className="slideshow-wrapper">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="slide-image"
            />
            <div className="slide-overlay">
              <h3 className="slide-title">{slide.title}</h3>
              <p className="slide-description">{slide.description}</p>
            </div>
          </div>
        ))}
        
        <button 
          className="slide-nav-button slide-prev" 
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
        
        <button 
          className="slide-nav-button slide-next" 
          onClick={goToNext}
          aria-label="Next slide"
        >
          &#8250;
        </button>
        
        <div className="slide-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{padding: '2rem'}}>
      <h2>Student Dashboard</h2>
      <HeadlineSlideshow />
      <div className="student-dashboard">
        <div className="student-card">
          <h3>New Application</h3>
          <p>Submit a new application for admission</p>
          <button onClick={() => navigate('/student/apply')} className="student-card-button apply">
            Apply Now
          </button>
        </div>
        <div className="student-card">
          <h3>My Applications</h3>
          <p>View status of your submitted applications</p>
          <button onClick={() => navigate('/student/applications')} className="student-card-button">
            View Applications
          </button>
        </div>
        <div className="student-card">
          <h3>My Profile</h3>
          <p>View and update your personal information</p>
          <button onClick={() => navigate('/student/profile')} className="student-card-button">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {isAuthenticated && !isAuthPage && <Navigation />}
      
      <div className={isAuthenticated && !isAuthPage ? 'content-with-sidebar' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/student/apply" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute><ApplicationStatus /></ProtectedRoute>} />
          <Route path="/student/applications/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
          <Route path="/student/applications/:applicationId/documents" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute requireAdmin={true}><ApplicationsList /></ProtectedRoute>} />
          <Route path="/admin/applications/:id" element={<ProtectedRoute requireAdmin={true}><AdminApplicationDetail /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
