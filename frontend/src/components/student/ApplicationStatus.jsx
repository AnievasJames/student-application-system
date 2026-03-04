import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getUserApplications();
      setApplications(response.data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
      case 'rejected':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      case 'evaluated':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'under_review':
        return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Modern styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    headerIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 8px 24px rgba(81, 130, 236, 0.35)',
      fontSize: '2.5rem',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      color: '#64748b',
      fontSize: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    emptyText: {
      color: '#64748b',
      fontSize: '1rem',
      marginBottom: '1.5rem',
    },
    applicationsList: {
      display: 'grid',
      gap: '1.25rem',
    },
    applicationCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.25rem',
    },
    majorTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    schoolName: {
      fontSize: '0.9rem',
      color: '#64748b',
    },
    statusBadge: (status) => {
      const colors = getStatusColor(status);
      return {
        padding: '0.5rem 1rem',
        background: colors.bg,
        color: colors.text,
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: `1px solid ${colors.border}`,
      };
    },
    cardDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #f1f5f9',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    detailLabel: {
      fontSize: '0.8rem',
      color: '#9ca3af',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    detailValue: {
      fontSize: '0.95rem',
      color: '#374151',
      fontWeight: '600',
    },
    aiScore: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.25rem 0.75rem',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#92400e',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1.5rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #f1f5f9',
    },
    primaryButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(81, 130, 236, 0.3)',
    },
    secondaryButton: {
      padding: '0.75rem 1.5rem',
      background: 'white',
      color: '#64748b',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #5182ec',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  if (loading) return (
    <div style={styles.pageContainer}>
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>📋</div>
          <h1 style={styles.headerTitle}>My Applications</h1>
          <p style={styles.headerSubtitle}>
            Track the status of your submitted applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎓</div>
            <h3 style={styles.emptyTitle}>No Applications Yet</h3>
            <p style={styles.emptyText}>
              You haven't submitted any applications. Start your journey by submitting your first application.
            </p>
            <button
              onClick={() => navigate('/student/apply')}
              style={styles.primaryButton}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(81, 130, 236, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(81, 130, 236, 0.3)';
              }}
            >
              Submit Your First Application
            </button>
          </div>
        ) : (
          <div style={styles.applicationsList}>
            {applications.map((app) => (
              <div 
                key={app.id} 
                style={styles.applicationCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.majorTitle}>{app.intended_major}</h3>
                    <p style={styles.schoolName}>{app.high_school_name}</p>
                  </div>
                  <span style={styles.statusBadge(app.status)}>
                    {formatStatus(app.status)}
                  </span>
                </div>
                
                <div style={styles.cardDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Full Name</span>
                    <span style={styles.detailValue}>{app.full_name}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>GPA</span>
                    <span style={styles.detailValue}>{app.high_school_gpa || 'N/A'}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Submitted</span>
                    <span style={styles.detailValue}>{formatDate(app.submitted_at)}</span>
                  </div>
                  {app.ai_score && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>AI Score</span>
                      <span style={styles.aiScore}>✨ {app.ai_score}/100</span>
                    </div>
                  )}
                </div>

                <div style={styles.buttonGroup}>
                  <button 
                    onClick={() => navigate(`/student/applications/${app.id}`)}
                    style={styles.primaryButton}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(81, 130, 236, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(81, 130, 236, 0.3)';
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate('/student/apply')}
                    style={styles.secondaryButton}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#5182ec';
                      e.target.style.color = '#5182ec';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.color = '#64748b';
                    }}
                  >
                    New Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
