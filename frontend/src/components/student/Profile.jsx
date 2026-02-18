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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile(user.id);
      const { user: userData, profile: profileData } = response.data;
      
      setProfile(profileData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: profileData?.phone || '',
        address: profileData?.address || '',
        dateOfBirth: profileData?.date_of_birth || '',
        gender: profileData?.gender || '',
        nationality: profileData?.nationality || ''
      });
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
      setLoading(false);
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
      await profileService.updateProfile(user.id, formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    }
    setSaving(false);
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading profile...</div>;

  return (
    <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <h2>My Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div style={{padding: '1rem', marginBottom: '1rem', background: message.type === 'success' ? '#d1fae5' : '#fee2e2', borderRadius: '8px'}}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{display: 'grid', gap: '1rem'}}>
          <div>
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} required style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} required style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} required style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing} style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} style={{width: '100%', padding: '0.5rem'}}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Nationality</label>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing} style={{width: '100%', padding: '0.5rem'}} />
          </div>

          <div>
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} rows="3" style={{width: '100%', padding: '0.5rem'}} />
          </div>
        </div>

        {isEditing && (
          <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
            <button type="submit" disabled={saving} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => { setIsEditing(false); fetchProfile(); }} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
