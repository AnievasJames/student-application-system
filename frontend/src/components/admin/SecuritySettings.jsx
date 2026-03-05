import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    encryptionMethod: 'AES-256',
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      expiryDays: 90,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    accessControl: {
      ipWhitelist: false,
      allowedIPs: [],
      apiKeyRotationDays: 30,
      sessionLimit: 3,
      requireMFA: false
    },
    logging: {
      auditLogging: true,
      loginAttempts: true,
      dataAccessLogs: true,
      retentionDays: 90
    }
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editMode, setEditMode] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [newIP, setNewIP] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await adminService.getSecuritySettings();
      if (response?.data?.settings) {
        setSettings(response.data.settings);
        setTempSettings(response.data.settings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching security settings:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    let obj = { ...tempSettings };
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setTempSettings(obj);
  };

  const handleToggle = (path) => {
    const keys = path.split('.');
    let obj = { ...tempSettings };
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = !current[keys[keys.length - 1]];
    setTempSettings(obj);
  };

  const handleAddIP = () => {
    if (newIP && /^(\d{1,3}\.){3}\d{1,3}$/.test(newIP)) {
      setTempSettings((prev) => ({
        ...prev,
        accessControl: {
          ...prev.accessControl,
          allowedIPs: [...prev.accessControl.allowedIPs, newIP]
        }
      }));
      setNewIP('');
    }
  };

  const handleRemoveIP = (ip) => {
    setTempSettings((prev) => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        allowedIPs: prev.accessControl.allowedIPs.filter((item) => item !== ip)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSecuritySettings(tempSettings);
      setSettings(tempSettings);
      setEditMode(false);
      setMessage({ type: 'success', text: 'Security settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update security settings' });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setEditMode(false);
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
      Loading security settings...
    </div>
  );

  const currentSettings = editMode ? tempSettings : settings;

  const SectionCard = ({ title, icon, children }) => (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: '#1f2937',
        fontSize: '1.1rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, disabled }) => (
    <label style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }}>
      <div style={{ position: 'relative', width: '48px', height: '26px', marginRight: '0.5rem' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <div style={{
          position: 'absolute',
          cursor: disabled ? 'not-allowed' : 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: checked ? '#10b981' : '#d1d5db',
          borderRadius: '26px',
          transition: '0.3s'
        }}>
          <div style={{
            position: 'absolute',
            height: '20px',
            width: '20px',
            left: checked ? '26px' : '3px',
            bottom: '3px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: '0.3s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>
    </label>
  );

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>🔒 Security Settings</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Configure system security policies and access controls
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {editMode && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {saving ? '⏳ Saving...' : '✓ Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✕ Cancel
              </button>
            </>
          )}
          {!editMode && (
            <button
              onClick={() => {
                setTempSettings(settings);
                setEditMode(true);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ✎ Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          borderRadius: '8px',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#065f46' : '#7f1d1d'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gap: '0' }}>
        {/* Encryption Settings */}
        <SectionCard title="Encryption Settings" icon="🔐">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Encryption Method
              </label>
              {editMode ? (
                <select
                  value={currentSettings.encryptionMethod}
                  onChange={(e) => handleInputChange('encryptionMethod', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="AES-128">AES-128</option>
                  <option value="AES-256">AES-256</option>
                  <option value="AES-512">AES-512</option>
                  <option value="RSA-2048">RSA-2048</option>
                </select>
              ) : (
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {currentSettings.encryptionMethod}
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Authentication Settings */}
        <SectionCard title="Authentication Settings" icon="🔑">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#374151' }}>Two-Factor Authentication</span>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Require 2FA for all admin users
                </p>
              </div>
              <Toggle
                checked={currentSettings.twoFactorAuth}
                onChange={() => editMode && handleToggle('twoFactorAuth')}
                disabled={!editMode}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Session Timeout (minutes)
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={currentSettings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {currentSettings.sessionTimeout} minutes
                </span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Password Policy */}
        <SectionCard title="Password Policy" icon="🔐">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Minimum Password Length
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={currentSettings.passwordPolicy.minLength}
                  onChange={(e) => handleInputChange('passwordPolicy.minLength', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <span style={{ color: '#6b7280', fontWeight: '600' }}>
                  {currentSettings.passwordPolicy.minLength} characters
                </span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Password Expiry (days)
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={currentSettings.passwordPolicy.expiryDays}
                  onChange={(e) => handleInputChange('passwordPolicy.expiryDays', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <span style={{ color: '#6b7280', fontWeight: '600' }}>
                  {currentSettings.passwordPolicy.expiryDays} days
                </span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Require Uppercase</span>
              <Toggle
                checked={currentSettings.passwordPolicy.requireUppercase}
                onChange={() => editMode && handleToggle('passwordPolicy.requireUppercase')}
                disabled={!editMode}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Require Numbers</span>
              <Toggle
                checked={currentSettings.passwordPolicy.requireNumbers}
                onChange={() => editMode && handleToggle('passwordPolicy.requireNumbers')}
                disabled={!editMode}
              />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Require Special Characters</span>
              <Toggle
                checked={currentSettings.passwordPolicy.requireSpecialChars}
                onChange={() => editMode && handleToggle('passwordPolicy.requireSpecialChars')}
                disabled={!editMode}
              />
            </div>
          </div>
        </SectionCard>

        {/* Access Control */}
        <SectionCard title="Access Control" icon="🚀">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#374151' }}>IP Whitelist</span>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Restrict access to specific IP addresses
                </p>
              </div>
              <Toggle
                checked={currentSettings.accessControl.ipWhitelist}
                onChange={() => editMode && handleToggle('accessControl.ipWhitelist')}
                disabled={!editMode}
              />
            </div>

            {currentSettings.accessControl.ipWhitelist && (
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
                  Whitelisted IPs
                </label>
                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                  {currentSettings.accessControl.allowedIPs.map((ip) => (
                    <div
                      key={ip}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        borderLeft: '3px solid #3b82f6'
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: '#374151' }}>{ip}</span>
                      {editMode && (
                        <button
                          onClick={() => handleRemoveIP(ip)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {currentSettings.accessControl.allowedIPs.length === 0 && (
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                      No IPs added yet
                    </p>
                  )}
                </div>
                {editMode && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                      placeholder="e.g., 192.168.1.1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddIP()}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      onClick={handleAddIP}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Add IP
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  API Key Rotation (days)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={currentSettings.accessControl.apiKeyRotationDays}
                    onChange={(e) => handleInputChange('accessControl.apiKeyRotationDays', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>
                    {currentSettings.accessControl.apiKeyRotationDays} days
                  </span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Max Sessions
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={currentSettings.accessControl.sessionLimit}
                    onChange={(e) => handleInputChange('accessControl.sessionLimit', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>
                    {currentSettings.accessControl.sessionLimit} sessions
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#374151' }}>Require MFA for Admins</span>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  Multi-factor authentication required
                </p>
              </div>
              <Toggle
                checked={currentSettings.accessControl.requireMFA}
                onChange={() => editMode && handleToggle('accessControl.requireMFA')}
                disabled={!editMode}
              />
            </div>
          </div>
        </SectionCard>

        {/* Audit & Logging */}
        <SectionCard title="Audit & Logging" icon="📋">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Audit Logging</span>
              <Toggle
                checked={currentSettings.logging.auditLogging}
                onChange={() => editMode && handleToggle('logging.auditLogging')}
                disabled={!editMode}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Login Attempts</span>
              <Toggle
                checked={currentSettings.logging.loginAttempts}
                onChange={() => editMode && handleToggle('logging.loginAttempts')}
                disabled={!editMode}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Data Access Logs</span>
              <Toggle
                checked={currentSettings.logging.dataAccessLogs}
                onChange={() => editMode && handleToggle('logging.dataAccessLogs')}
                disabled={!editMode}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Log Retention (days)
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={currentSettings.logging.retentionDays}
                  onChange={(e) => handleInputChange('logging.retentionDays', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  {currentSettings.logging.retentionDays} days
                </span>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SecuritySettings;

