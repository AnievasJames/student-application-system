import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nationality: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile(user.id);
      
      const userData = response.data.user || user;
      const profileData = response.data.profile || {};
      
      setProfile(profileData);
      setFormData({
        firstName: userData.firstName || user.firstName || '',
        lastName: userData.lastName || user.lastName || '',
        email: userData.email || user.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        dateOfBirth: profileData.date_of_birth || '',
        gender: profileData.gender || '',
        nationality: profileData.nationality || ''
      });
      setLoading(false);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Profile fetch error:', error);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        nationality: ''
      });
      setLoading(false);
      setMessage({ type: 'info', text: 'Complete your profile information below' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Updating profile with:', formData);
      const response = await profileService.updateProfile(user.id, formData);
      console.log('Update response:', response);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Don't refetch - just update state with saved data
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error details:', error.response?.data);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    }
    setSaving(false);
  };

  // Modern input styles
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    transition: 'all 0.2s ease',
    backgroundColor: isEditing ? '#fff' : '#f9fafb',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#374151',
  });

  // Focus handler for input styles
  const handleFocus = (e) => {
    if (isEditing) {
      e.target.style.borderColor = '#5182ec';
      e.target.style.boxShadow = '0 0 0 4px rgba(81, 130, 236, 0.15)';
      e.target.style.transform = 'scale(1.01)';
    }
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
    e.target.style.transform = 'scale(1)';
  };

  // Styles
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
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f1f5f9',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    cardIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
    },
    formGroup: {
      marginBottom: '0',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.9rem',
    },
    required: {
      color: '#ef4444',
      marginLeft: '2px',
    },
    selectArrow: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '20px',
      appearance: 'none',
      paddingRight: '40px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #f1f5f9',
    },
    editButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(81, 130, 236, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    submitButton: {
      padding: '14px 32px',
      background: 'linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: saving ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(81, 130, 236, 0.35)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cancelButton: {
      padding: '14px 32px',
      background: 'white',
      color: '#64748b',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    alert: (type) => ({
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      background: type === 'success' 
        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
        : type === 'error'
          ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
          : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      color: type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : '#1e40af',
      border: `1px solid ${type === 'success' ? '#a7f3d0' : type === 'error' ? '#fecaca' : '#bfdbfe'}`,
    }),
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

  const renderInput = (name, label, type = 'text', required = false, placeholder = '') => {
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={!isEditing}
          placeholder={placeholder}
          required={required}
          style={{...getInputStyle(name), ...styles.selectArrow}}
        />
      </div>
    );
  };

  const renderSelect = (name, label, options, required = false) => {
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={!isEditing}
          style={{...getInputStyle(name), ...styles.selectArrow}}
        >
          {options}
        </select>
      </div>
    );
  };

  const renderTextarea = (name, label, required = false, placeholder = '', rows = 3) => {
    return (
      <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={!isEditing}
          placeholder={placeholder}
          rows={rows}
          style={{...getInputStyle(name), resize: 'vertical', minHeight: '100px'}}
        />
      </div>
    );
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
          <div style={styles.headerIcon}>👤</div>
          <h1 style={styles.headerTitle}>My Profile</h1>
          <p style={styles.headerSubtitle}>
            Manage your personal information and application details
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div style={styles.alert(message.type)}>
            {message.type === 'success' ? '✅' : message.type === 'error' ? '⚠️' : 'ℹ️'} {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}>📋</span>
              Personal Information
            </h2>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                style={styles.editButton}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(81, 130, 236, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(81, 130, 236, 0.3)';
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {renderInput('firstName', 'First Name', 'text', true, 'Enter your first name')}
              {renderInput('lastName', 'Last Name', 'text', true, 'Enter your last name')}
              {renderInput('email', 'Email Address', 'email', true, 'your.email@example.com')}
              {renderInput('phone', 'Phone Number', 'tel', false, '+63 912 345 6789')}
              {renderInput('dateOfBirth', 'Date of Birth', 'date', false)}
              {renderSelect(
                'gender', 
                'Gender', 
                <>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </>,
                false
              )}
              {renderInput('nationality', 'Nationality', 'text', false, 'Filipino')}
              {renderTextarea('address', 'Address', false, '123 Main St, City, Philippines', 3)}
            </div>

            {isEditing && (
              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={() => { 
                    setIsEditing(false); 
                    setMessage({ type: '', text: '' });
                  }}
                  style={styles.cancelButton}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#5182ec';
                    e.target.style.color = '#5182ec';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.color = '#64748b';
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={styles.submitButton}
                  onMouseOver={(e) => {
                    if (!saving) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(81, 130, 236, 0.45)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(81, 130, 236, 0.35)';
                  }}
                >
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Profile Summary Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}>📊</span>
              Profile Summary
            </h2>
          </div>
          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
              <span style={{...styles.label, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Full Name</span>
              <span style={{display: 'block', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b'}}>
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div style={{...styles.formGroup, padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
              <span style={{...styles.label, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Email</span>
              <span style={{display: 'block', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b'}}>
                {formData.email || 'Not set'}
              </span>
            </div>
            <div style={{...styles.formGroup, padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
              <span style={{...styles.label, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Phone</span>
              <span style={{display: 'block', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b'}}>
                {formData.phone || 'Not set'}
              </span>
            </div>
            <div style={{...styles.formGroup, padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
              <span style={{...styles.label, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Profile Status</span>
              <span style={{display: 'block', fontSize: '1.1rem', fontWeight: '600', color: profile?.phone ? '#10b981' : '#f59e0b'}}>
                {profile?.phone ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
