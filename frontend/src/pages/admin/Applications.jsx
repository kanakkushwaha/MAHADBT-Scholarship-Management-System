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
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredApps = applications.filter(app => {
    const name = (app.studentName || app.student_name || '').toLowerCase();
    const id = (app.id || '').toLowerCase();
    const prn = (app.studentId || app.student_prn || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = id.includes(search) || name.includes(search) || prn.includes(search);
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesDept = deptFilter === 'All' || app.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>All Scholarship Applications</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Showing {filteredApps.length} of {applications.length} total applications from MySQL database.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by ID, Name, or PRN..." 
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
          <select 
            className="form-control" 
            style={{ paddingLeft: '36px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Document Verification">Document Verification</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Payment Processing">Payment Processing</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '180px' }}>
          <select 
            className="form-control"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="ENTC">ENTC</option>
            <option value="Mechanical">Mechanical</option>
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
