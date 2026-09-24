import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
  const { applications, submitApplication } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const existingApp = applications.find(a => a.studentId === user.id);

  const [formData, setFormData] = useState({
    scholarshipName: 'Post-Matric Scholarship',
    category: 'OBC',
    income: '150000',
    aadhaar: '123456789012',
    bankAccount: '1234567890',
    ifsc: 'SBIN0001234'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = submitApplication({
      studentId: user.id,
      studentName: user.name,
      department: 'Information Technology', // mock fixed for demo
      year: 'Third Year',
      academicYear: '2025-2026',
      scholarshipName: formData.scholarshipName
    });
    navigate('/student/acknowledgement', { state: { appId: id } });
  };

  if (existingApp) {
    return (
      <Layout>
        <div className="card">
          <h2>My Application</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>You have already submitted an application.</p>
          <div className="grid grid-cols-2 gap-4" style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px' }}>
            <div><span style={{color:'var(--color-text-muted)'}}>Application ID:</span> <strong>{existingApp.id}</strong></div>
            <div><span style={{color:'var(--color-text-muted)'}}>Scholarship:</span> <strong>{existingApp.scholarshipName}</strong></div>
            <div><span style={{color:'var(--color-text-muted)'}}>Status:</span> <strong>{existingApp.status}</strong></div>
            <div><span style={{color:'var(--color-text-muted)'}}>Submitted On:</span> <strong>{new Date(existingApp.submittedDate).toLocaleDateString()}</strong></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/student/track')}>
            Track Status
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Create New Application</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Fill out the details below to apply for a scholarship.</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={user.name} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar Number</label>
              <input type="text" name="aadhaar" className="form-control" value={formData.aadhaar} onChange={handleChange} required pattern="[0-9]{12}" title="12 digit Aadhaar" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                <option value="Open">Open</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="VJNT">VJNT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Annual Family Income (₹)</label>
              <input type="number" name="income" className="form-control" value={formData.income} onChange={handleChange} required />
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Academic & Scholarship Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-control" value="Information Technology" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <input type="text" className="form-control" value="Third Year" disabled />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Select Scholarship Scheme</label>
              <select name="scholarshipName" className="form-control" value={formData.scholarshipName} onChange={handleChange} required>
                <option value="Post-Matric Scholarship">Post-Matric Scholarship</option>
                <option value="EBC Concession">Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (EBC)</option>
                <option value="Dr. Punjabrao Deshmukh Hostel Allowance">Dr. Punjabrao Deshmukh Hostel Allowance</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginBottom: '16px', marginTop: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Bank Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Bank Account Number</label>
              <input type="text" name="bankAccount" className="form-control" value={formData.bankAccount} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input type="text" name="ifsc" className="form-control" value={formData.ifsc} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">Submit Application</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ApplicationForm;
