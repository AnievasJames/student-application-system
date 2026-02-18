import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/api';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    highSchoolName: '',
    highSchoolGpa: '',
    graduationYear: '',
    intendedMajor: '',
    extracurricularActivities: '',
    personalStatement: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await applicationService.createApplication(formData);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setTimeout(() => navigate('/student/applications'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to submit application' });
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h2>Submit Application</h2>
      
      {message.text && (
        <div style={{padding: '1rem', marginBottom: '1rem', background: message.type === 'success' ? '#d1fae5' : '#fee2e2', borderRadius: '8px'}}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Personal Information</h3>
        <div style={{display: 'grid', gap: '1rem', marginBottom: '2rem'}}>
          <div>
            <label>Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Date of Birth *</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Address *</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" style={{width: '100%', padding: '0.5rem'}} />
          </div>
        </div>

        <h3>Academic Information</h3>
        <div style={{display: 'grid', gap: '1rem', marginBottom: '2rem'}}>
          <div>
            <label>High School Name *</label>
            <input type="text" name="highSchoolName" value={formData.highSchoolName} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>GPA</label>
            <input type="number" step="0.01" min="0" max="4.0" name="highSchoolGpa" value={formData.highSchoolGpa} onChange={handleChange} style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Graduation Year *</label>
            <input type="number" min="2015" max="2030" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Intended Major *</label>
            <input type="text" name="intendedMajor" value={formData.intendedMajor} onChange={handleChange} required style={{width: '100%', padding: '0.5rem'}} />
          </div>
        </div>

        <h3>Additional Information</h3>
        <div style={{display: 'grid', gap: '1rem', marginBottom: '2rem'}}>
          <div>
            <label>Extracurricular Activities</label>
            <textarea name="extracurricularActivities" value={formData.extracurricularActivities} onChange={handleChange} rows="4" style={{width: '100%', padding: '0.5rem'}} />
          </div>
          <div>
            <label>Personal Statement</label>
            <textarea name="personalStatement" value={formData.personalStatement} onChange={handleChange} rows="6" style={{width: '100%', padding: '0.5rem'}} />
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button type="submit" disabled={loading} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button type="button" onClick={() => navigate('/student/dashboard')} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
