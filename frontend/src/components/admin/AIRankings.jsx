import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const AIRankings = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await adminService.getAllApplications();
      // Sort by AI score descending and filter out applications without AI scores
      const ranked = response.data.applications
        .filter(app => app.ai_score !== null && app.ai_score !== undefined)
        .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
      
      setApplications(ranked);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 50) return '#ef5350';
    return '#6b7280';
  };

  const getHighlightStyle = (index) => {
    const baseStyle = {
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };

    if (index === 0) {
      return { ...baseStyle, background: '#fef3c7', color: '#92400e' };
    } else if (index === 1) {
      return { ...baseStyle, background: '#fed7aa', color: '#9a3412' };
    } else if (index === 2) {
      return { ...baseStyle, background: '#fbcfe8', color: '#831843' };
    }
    return baseStyle;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Modern styles matching ApplicationDetail.jsx
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: 'white',
      color: '#64748b',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1.5rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    headerIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    },
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    headerSubtitle: {
      color: '#64748b',
      fontSize: '0.95rem',
    },
    statsBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1rem',
      background: 'white',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#64748b',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '0.875rem 0.75rem',
      textAlign: 'left',
      fontWeight: '700',
      color: '#64748b',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: '#f8fafc',
      borderBottom: '2px solid #e2e8f0',
    },
    thCenter: {
      textAlign: 'center',
    },
    td: {
      padding: '0.875rem 0.75rem',
      color: '#374151',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem',
    },
    tdCenter: {
      textAlign: 'center',
    },
    rankCell: {
      fontWeight: '700',
      fontSize: '1.1rem',
      width: '60px',
    },
    nameCell: {
      fontWeight: '600',
      color: '#1e293b',
    },
    scoreCell: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    scoreBadge: (score) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '10px',
      fontWeight: '700',
      fontSize: '1rem',
      color: '#92400e',
      boxShadow: '0 2px 8px rgba(254, 243, 199, 0.5)',
      minWidth: '60px',
    }),
    scoreLabel: (score) => ({
      fontSize: '0.75rem',
      fontWeight: '600',
      color: getScoreColor(score),
      textTransform: 'uppercase',
    }),
    reviewButton: {
      padding: '0.6rem 1.25rem',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(81, 130, 236, 0.3)',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#9ca3af',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
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
      borderTop: '4px solid #8b5cf6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  const getRowBackground = (index) => {
    // Very pale yellow for top 3
    if (index < 3) return { background: '#fffbeb' };
    return { background: 'white' };
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
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>🤖</div>
            <div>
              <h1 style={styles.headerTitle}>AI Rankings</h1>
              <p style={styles.headerSubtitle}>
                Applications ranked by AI evaluation score (highest to lowest)
              </p>
            </div>
          </div>
          <div style={styles.statsBadge}>
            📊 {applications.length} Application{applications.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table Card */}
        <div style={styles.card}>
          {applications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>No Applications Found</h3>
              <p style={{ color: '#9ca3af' }}>No applications with AI scores available</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, ...styles.thCenter }}>Rank</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Major</th>
                    <th style={styles.th}>GPA</th>
                    <th style={{ ...styles.th, ...styles.thCenter }}>AI Score</th>
                    <th style={styles.th}>Submitted</th>
                    <th style={{ ...styles.th, ...styles.thCenter }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr
                      key={app.id}
                      style={{
                        ...getRowBackground(index),
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        if (index >= 3) {
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = getRowBackground(index).background;
                      }}
                    >
                      <td style={{ ...styles.td, ...styles.rankCell, ...styles.tdCenter }}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && index + 1}
                      </td>
                      <td style={{ ...styles.td, ...styles.nameCell }}>
                        {app.user?.first_name} {app.user?.last_name}
                      </td>
                      <td style={styles.td}>
                        {app.intended_major || 'N/A'}
                      </td>
                      <td style={styles.td}>
                        {app.high_school_gpa || 'N/A'}
                      </td>
                      <td style={{ ...styles.td, ...styles.tdCenter }}>
                        <div style={styles.scoreCell}>
                          <span style={styles.scoreBadge(app.ai_score)}>
                            {Math.round(app.ai_score)}
                          </span>
                          <span style={styles.scoreLabel(app.ai_score)}>
                            {getScoreLabel(app.ai_score)}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {formatDate(app.submitted_at)}
                      </td>
                      <td style={{ ...styles.td, ...styles.tdCenter }}>
                        <button
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                          style={styles.reviewButton}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(81, 130, 236, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(81, 130, 236, 0.3)';
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRankings;
