import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService, documentService } from '../../services/api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const [appResponse, docsResponse] = await Promise.all([
        applicationService.getApplicationById(id),
        documentService.getDocumentsByApplication(id)
      ]);
      
      setApplication(appResponse.data.application);
      setDocuments(docsResponse.data.documents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    headerIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.75rem',
      boxShadow: '0 4px 16px rgba(81, 130, 236, 0.3)',
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
    statusBadge: (status) => {
      const colors = getStatusColor(status);
      return {
        padding: '0.6rem 1.25rem',
        background: colors.bg,
        color: colors.text,
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      };
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '1.75rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f1f5f9',
    },
    cardIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    cardDescription: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
    },
    infoLabel: {
      fontSize: '0.8rem',
      color: '#9ca3af',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    infoValue: {
      fontSize: '1rem',
      color: '#374151',
      fontWeight: '500',
    },
    fullWidthItem: {
      gridColumn: '1 / -1',
    },
    aiScoreBox: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '14px',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#92400e',
      boxShadow: '0 2px 8px rgba(254, 243, 199, 0.5)',
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem',
    },
    textContent: {
      fontSize: '0.95rem',
      color: '#4b5563',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
    },
    documentsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f1f5f9',
    },
    documentsList: {
      display: 'grid',
      gap: '0.75rem',
    },
    documentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 1.25rem',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    },
    documentIcon: {
      width: '44px',
      height: '44px',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    documentType: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    emptyDocuments: {
      textAlign: 'center',
      padding: '2rem',
      color: '#9ca3af',
    },
    uploadButton: {
      padding: '0.6rem 1.25rem',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(81, 130, 236, 0.3)',
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
    notFound: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
  };

  if (loading) return (
    <div style={styles.pageContainer}>
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    </div>
  );

  if (!application) return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.notFound}>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🔍</div>
          <h2 style={{color: '#1e293b', marginBottom: '0.5rem'}}>Application Not Found</h2>
          <p style={{color: '#64748b'}}>The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/student/applications')}
            style={{...styles.uploadButton, marginTop: '1.5rem'}}
          >
            Back to Applications
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/student/applications')}
          style={styles.backButton}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#5182ec';
            e.target.style.color = '#5182ec';
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.color = '#64748b';
          }}
        >
          ← Back to Applications
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>📄</div>
            <div>
              <h1 style={styles.headerTitle}>Application Details</h1>
              <p style={styles.headerSubtitle}>
                Application ID: #{application.id}
              </p>
            </div>
          </div>
          <span style={styles.statusBadge(application.status)}>
            {formatStatus(application.status)}
          </span>
        </div>

        {/* Status & Score Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>📊</div>
            <div>
              <h3 style={styles.cardTitle}>Application Status</h3>
              <p style={styles.cardDescription}>Current status and evaluation</p>
            </div>
          </div>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Submitted</span>
              <span style={styles.infoValue}>{formatDate(application.submitted_at)}</span>
            </div>
            {application.ai_score && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>AI Score</span>
                <span style={styles.aiScoreBox}>✨ {application.ai_score}/100</span>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>👤</div>
            <div>
              <h3 style={styles.cardTitle}>Personal Information</h3>
              <p style={styles.cardDescription}>Your basic information</p>
            </div>
          </div>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Full Name</span>
              <span style={styles.infoValue}>{application.full_name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{application.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Phone</span>
              <span style={styles.infoValue}>{application.phone}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Date of Birth</span>
              <span style={styles.infoValue}>{formatDate(application.date_of_birth)}</span>
            </div>
            <div style={{...styles.infoItem, ...styles.fullWidthItem}}>
              <span style={styles.infoLabel}>Address</span>
              <span style={styles.infoValue}>{application.address}</span>
            </div>
          </div>
        </div>

        {/* Academic Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>🏫</div>
            <div>
              <h3 style={styles.cardTitle}>Academic Information</h3>
              <p style={styles.cardDescription}>Your educational background</p>
            </div>
          </div>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>High School</span>
              <span style={styles.infoValue}>{application.high_school_name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>GPA</span>
              <span style={styles.infoValue}>{application.high_school_gpa || 'Not provided'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Graduation Year</span>
              <span style={styles.infoValue}>{application.graduation_year}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Intended Major</span>
              <span style={styles.infoValue}>{application.intended_major}</span>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>✨</div>
            <div>
              <h3 style={styles.cardTitle}>Additional Information</h3>
              <p style={styles.cardDescription}>Optional details you provided</p>
            </div>
          </div>
          
          {application.extracurricular_activities ? (
            <div style={{marginBottom: '1.5rem'}}>
              <h4 style={styles.sectionTitle}>Extracurricular Activities</h4>
              <p style={styles.textContent}>{application.extracurricular_activities}</p>
            </div>
          ) : null}
          
          {application.personal_statement ? (
            <div>
              <h4 style={styles.sectionTitle}>Personal Statement</h4>
              <p style={styles.textContent}>{application.personal_statement}</p>
            </div>
          ) : !application.extracurricular_activities ? (
            <p style={{color: '#9ca3af', fontStyle: 'italic'}}>No additional information provided</p>
          ) : null}
        </div>

        {/* Documents Card */}
        <div style={styles.card}>
          <div style={styles.documentsHeader}>
            <div>
              <h3 style={styles.cardTitle}>📎 Uploaded Documents</h3>
              <p style={styles.cardDescription}>{documents.length} document(s) attached</p>
            </div>
            <button 
              onClick={() => navigate(`/student/applications/${id}/documents`)}
              style={styles.uploadButton}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(81, 130, 236, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(81, 130, 236, 0.3)';
              }}
            >
              Upload Documents
            </button>
          </div>
          
          {documents.length === 0 ? (
            <div style={styles.emptyDocuments}>
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div style={styles.documentsList}>
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  style={styles.documentItem}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#5182ec';
                    e.currentTarget.style.background = '#f0f7ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                >
                  <div style={styles.documentIcon}>📄</div>
                  <div style={styles.documentInfo}>
                    <div style={styles.documentName}>{doc.original_filename}</div>
                    <div style={styles.documentType}>{doc.document_type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
