import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';

const Applications = () => {
  const { applications } = useContext(AppDataContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>All Applications</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage and track all student scholarship applications.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by ID or Student Name..." 
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: '250px', position: 'relative' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
          <select 
            className="form-control" 
            style={{ paddingLeft: '36px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Created">Created</option>
            <option value="Submitted">Submitted</option>
            <option value="Document Verification">Document Verification</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Payment Processing">Payment Processing</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student Name</th>
                <th>Scholarship</th>
                <th>App Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.id}</td>
                  <td>
                    <div>{app.studentName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{app.department}</div>
                  </td>
                  <td>{app.scholarshipName}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td><StatusBadge status={app.paymentStatus} /></td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => navigate(`/admin/applications/${app.id}`)}>
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ color: 'var(--color-text-muted)' }}>No applications found matching your criteria.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Applications;
