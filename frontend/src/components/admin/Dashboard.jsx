import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [appsResponse, statsResponse] = await Promise.all([
        adminService.getAllApplications({ status: filter !== 'all' ? filter : undefined }),
        adminService.getStatistics()
      ]);
      
      setApplications(appsResponse.data.applications);
      setStatistics(statsResponse.data.statistics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading dashboard...</div>;

  return (
    <div style={{padding: '2rem'}}>
      <h2>Admin Dashboard</h2>

      {statistics && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '0.875rem', color: '#6b7280'}}>Total Applications</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{statistics.totalApplications}</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '0.875rem', color: '#6b7280'}}>Submitted</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{statistics.statusCounts.submitted}</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '0.875rem', color: '#6b7280'}}>Under Review</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{statistics.statusCounts.under_review}</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '0.875rem', color: '#6b7280'}}>Accepted</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>{statistics.statusCounts.accepted}</div>
          </div>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '0.875rem', color: '#6b7280'}}>Average AI Score</h3>
            <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{statistics.averageAIScore}</div>
          </div>
        </div>
      )}

      <div style={{marginBottom: '1rem'}}>
        <label>Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding: '0.5rem', marginLeft: '0.5rem'}}>
          <option value="all">All Applications</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="evaluated">Evaluated</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden'}}>
        <h3 style={{padding: '1rem', margin: 0, background: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>Applications List</h3>
        {applications.length === 0 ? (
          <p style={{padding: '1rem'}}>No applications found.</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f9fafb'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Name</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Email</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Major</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>GPA</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Status</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Submitted</th>
                <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{app.full_name}</td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{app.email}</td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{app.intended_major}</td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{app.high_school_gpa || 'N/A'}</td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                    <span style={{padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '9999px', fontSize: '0.75rem'}}>
                      {formatStatus(app.status)}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{formatDate(app.submitted_at)}</td>
                  <td style={{padding: '0.75rem'}}>
                    <button 
                      onClick={() => navigate(`/admin/applications/${app.id}`)}
                      style={{padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.875rem'}}
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
