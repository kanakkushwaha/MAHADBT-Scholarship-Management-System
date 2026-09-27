import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { applications, documents } = useContext(AppDataContext);
  const navigate = useNavigate();

  const stats = {
    total: applications.length,
    pendingVerif: applications.filter(a => a.status === 'Document Verification').length,
    underReview: applications.filter(a => a.status === 'Under Review').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    paymentPending: applications.filter(a => a.paymentStatus === 'Pending').length,
  };

  const statusData = [
    { name: 'Submitted', value: applications.filter(a => a.status === 'Submitted').length },
    { name: 'Verifying', value: stats.pendingVerif },
    { name: 'Reviewing', value: stats.underReview },
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected },
  ].filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

  const recentApps = [...applications].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, 5);

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Overview of all scholarship applications.</p>
      </div>

      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Total Applications</p>
              <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{stats.total}</h2>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '50%' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Pending Verification</p>
              <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{stats.pendingVerif}</h2>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '50%' }}>
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Approved</p>
              <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{stats.approved}</h2>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%' }}>
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Payment Pending</p>
              <h2 style={{ fontSize: '28px', marginTop: '4px' }}>{stats.paymentPending}</h2>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '50%' }}>
              <IndianRupee size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Recent Applications</h3>
            <Link to="/admin/applications" className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/applications/${app.id}`)}>
                    <td style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{app.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app.studentName || app.student_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{app.department}</div>
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{new Date(app.lastUpdated || app.last_updated || app.submittedDate || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Application Status</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {statusData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '50%' }}></div>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
