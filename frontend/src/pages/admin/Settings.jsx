import React from 'react';
import { Layout } from '../../components/common/Layout';

const Settings = () => {
  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>System Settings</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your profile and prototype settings.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '16px' }}>Profile Information</h3>
        <div className="form-group">
          <label className="form-label">Admin Name</label>
          <input type="text" className="form-control" value="System Admin" disabled />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="text" className="form-control" value="admin@demo.com" disabled />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <input type="text" className="form-control" value="Super Administrator" disabled />
        </div>
        
        <h3 style={{ marginBottom: '16px', marginTop: '32px' }}>Prototype Controls</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: '500' }}>Simulate Network Delays</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Adds artificial delay to data fetching to mimic real-world conditions.</div>
          </div>
          <div>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
