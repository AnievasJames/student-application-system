import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, aiService } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, appsResponse] = await Promise.all([
        adminService.getStatistics(),
        adminService.getAllApplications()
      ]);
      
      setStatistics(statsResponse.data.statistics);
      setApplications(appsResponse.data.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEvaluateAll = async () => {
    if (!window.confirm('Evaluate all pending applications with AI? This will update their scores.')) {
      return;
    }

    setEvaluating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await aiService.evaluateAllApplications();
      setMessage({ type: 'success', text: response.data.message });
      fetchData(); // Refresh data
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to evaluate applications' });
    }
    setEvaluating(false);
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Admin Dashboard</h2>
        <button 
          onClick={handleEvaluateAll}
          disabled={evaluating}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: evaluating ? 'not-allowed' : 'pointer',
            opacity: evaluating ? 0.6 : 1
          }}
        >
          {evaluating ? '🤖 Evaluating...' : '🤖 AI Evaluate All'}
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          borderRadius: '8px',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Statistics and Visual Cards Container */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem'}}>
        
        {/* Statistics Cards - Matches Visual Container Height */}
        <div style={{
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{marginTop: 0, marginBottom: '1rem', fontSize: '1rem', color: '#374151'}}>Quick Stats</h3>
          {statistics && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1}}>
              <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '1.75rem', fontWeight: '700', color: '#2563eb'}}>{statistics.totalApplications}</div>
                <div style={{color: '#6b7280', fontSize: '0.875rem'}}>Total</div>
              </div>
              <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b'}}>{statistics.statusCounts.submitted}</div>
                <div style={{color: '#6b7280', fontSize: '0.875rem'}}>Submitted</div>
              </div>
              <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '1.75rem', fontWeight: '700', color: '#8b5cf6'}}>{statistics.statusCounts.evaluated}</div>
                <div style={{color: '#6b7280', fontSize: '0.875rem'}}>Evaluated</div>
              </div>
              <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{fontSize: '1.75rem', fontWeight: '700', color: '#10b981'}}>{statistics.statusCounts.accepted}</div>
                <div style={{color: '#6b7280', fontSize: '0.875rem'}}>Accepted</div>
              </div>
              <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{fontSize: '1.75rem', fontWeight: '700', color: '#8b5cf6'}}>
                  {statistics.averageAIScore || 'N/A'}
                  {statistics.averageAIScore && '/100'}
                </div>
                <div style={{color: '#6b7280', fontSize: '0.875rem'}}>Avg AI Score</div>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Cards - 2x2 Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          
          {/* Status Distribution Chart */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.75rem', fontSize: '0.9rem', color: '#374151'}}>Status Distribution</h3>
            {statistics && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {Object.entries(statistics.statusCounts).map(([status, count]) => {
                  const percentage = statistics.totalApplications > 0 ? (count / statistics.totalApplications) * 100 : 0;
                  const colors = {
                    submitted: '#f59e0b',
                    evaluated: '#8b5cf6',
                    accepted: '#10b981',
                    rejected: '#ef4444',
                    pending: '#6b7280'
                  };
                  return (
                    <div key={status}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem', fontSize: '0.7rem'}}>
                        <span style={{color: '#6b7280', textTransform: 'capitalize'}}>{status.replace(/_/g, ' ')}</span>
                        <span style={{fontWeight: '600', color: '#374151'}}>{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div style={{background: '#e5e7eb', borderRadius: '3px', height: '6px', overflow: 'hidden'}}>
                        <div style={{
                          width: `${percentage}%`,
                          background: colors[status] || '#6366f1',
                          height: '100%',
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Score Distribution */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.75rem', fontSize: '0.9rem', color: '#374151'}}>AI Score Distribution</h3>
            {(() => {
              const scoreRanges = [
                { label: '86-100', min: 86, max: 100, color: '#10b981' },
                { label: '71-85', min: 71, max: 85, color: '#22c55e' },
                { label: '51-70', min: 51, max: 70, color: '#f59e0b' },
                { label: '31-50', min: 31, max: 50, color: '#f97316' },
                { label: '0-30', min: 0, max: 30, color: '#ef4444' }
              ];
              const scores = applications.filter(a => a.ai_score !== null).map(a => a.ai_score);
              const total = scores.length;
              
              return (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                  {scoreRanges.map(range => {
                    const count = scores.filter(s => s >= range.min && s <= range.max).length;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={range.label} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span style={{fontSize: '0.65rem', color: '#6b7280', width: '45px'}}>{range.label}</span>
                        <div style={{flex: 1, background: '#e5e7eb', borderRadius: '3px', height: '6px', overflow: 'hidden'}}>
                          <div style={{
                            width: `${percentage}%`,
                            background: range.color,
                            height: '100%',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{fontSize: '0.75rem', fontWeight: '600', color: '#374151', width: '25px', textAlign: 'right'}}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Acceptance Rate Gauge */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151'}}>Acceptance Rate</h3>
            {statistics && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0'}}>
                <svg width="80" height="80" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle 
                    cx="70" 
                    cy="70" 
                    r="60" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(statistics.statusCounts.accepted / Math.max(statistics.totalApplications, 1)) * 377} 377`}
                    transform="rotate(-90 70 70)"
                    style={{transition: 'stroke-dasharray 0.5s ease'}}
                  />
                </svg>
                <div style={{marginTop: '0.25rem', fontSize: '1.5rem', fontWeight: '700', color: '#10b981'}}>
                  {statistics.totalApplications > 0 
                    ? Math.round((statistics.statusCounts.accepted / statistics.totalApplications) * 100) 
                    : 0}%
                </div>
                <div style={{color: '#6b7280', fontSize: '0.75rem'}}>
                  {statistics.statusCounts.accepted} / {statistics.totalApplications}
                </div>
              </div>
            )}
          </div>

          {/* Evaluated vs Pending Pie Chart */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151'}}>Evaluation Progress</h3>
            {statistics && (() => {
              const evaluated = statistics.statusCounts.evaluated || 0;
              const pending = statistics.statusCounts.submitted || 0;
              const total = evaluated + pending;
              const evaluatedPercent = total > 0 ? (evaluated / total) * 100 : 0;
              const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
              
              const evaluatedDash = (evaluatedPercent / 100) * 100;
              const pendingDash = (pendingPercent / 100) * 100;
              
              return (
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0'}}>
                  <svg width="70" height="70" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.9" 
                      fill="transparent" 
                      stroke="#8b5cf6" 
                      strokeWidth="3"
                      strokeDasharray={`${evaluatedDash} ${100 - evaluatedDash}`}
                      transform="rotate(-90 18 18)"
                      style={{transition: 'stroke-dasharray 0.5s ease'}}
                    />
                  </svg>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                      <div style={{width: '10px', height: '10px', background: '#8b5cf6', borderRadius: '2px'}} />
                      <span style={{fontSize: '0.75rem', color: '#6b7280'}}>Evaluated</span>
                      <span style={{fontSize: '0.75rem', fontWeight: '600', color: '#374151', marginLeft: 'auto'}}>{evaluated}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                      <div style={{width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px'}} />
                      <span style={{fontSize: '0.75rem', color: '#6b7280'}}>Pending</span>
                      <span style={{fontSize: '0.75rem', fontWeight: '600', color: '#374151', marginLeft: 'auto'}}>{pending}</span>
                    </div>
                    <div style={{paddingTop: '0.25rem', borderTop: '1px solid #e5e7eb'}}>
                      <span style={{fontSize: '0.75rem', color: '#6b7280'}}>Progress: </span>
                      <span style={{fontSize: '0.75rem', fontWeight: '600', color: '#8b5cf6'}}>{evaluatedPercent.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h3>Recent Applications</h3>
          <button 
            onClick={() => navigate('/admin/applications')}
            style={{padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            View All
          </button>
        </div>

        {applications.length === 0 ? (
          <p style={{textAlign: 'center', color: '#6b7280'}}>No applications yet</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Name</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Major</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>AI Score</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Status</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Submitted</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '700'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '0.75rem'}}>{app.full_name}</td>
                  <td style={{padding: '0.75rem'}}>{app.intended_major}</td>
                  <td style={{padding: '0.75rem'}}>
                    {app.ai_score ? (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: app.ai_score >= 70 ? '#d1fae5' : app.ai_score >= 50 ? '#fef3c7' : '#fee2e2',
                        color: app.ai_score >= 70 ? '#065f46' : app.ai_score >= 50 ? '#92400e' : '#991b1b',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {app.ai_score}/100
                      </span>
                    ) : (
                      <span style={{color: '#6b7280'}}>Not evaluated</span>
                    )}
                  </td>
                  <td style={{padding: '0.75rem'}}>
                    <span style={{padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '600'}}>
                      {formatStatus(app.status)}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem'}}>{formatDate(app.submitted_at)}</td>
                  <td style={{padding: '0.75rem'}}>
                    <button 
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      style={{padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
