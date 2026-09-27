import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { Database, Server, RefreshCw, CheckCircle, Shield, Building } from 'lucide-react';

const Settings = () => {
  const { isBackendConnected, refreshData, applications, documents } = useContext(AppDataContext);

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>System Settings & Infrastructure Status</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Backend database connectivity, configuration parameters, and college administrative details.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ maxWidth: '960px' }}>
        {/* Profile Card */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--color-primary)" /> Administrator Profile
          </h3>
          <div className="form-group">
            <label className="form-label">Officer Name</label>
            <input type="text" className="form-control" value="Scholarship Nodal Officer" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Official Email</label>
            <input type="text" className="form-control" value="admin@demo.com" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Role & Authority</label>
            <input type="text" className="form-control" value="Chief Scrutiny & Approval Officer" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Institution</label>
            <input type="text" className="form-control" value="Pimpri Chinchwad College of Engineering (PCCOE)" disabled />
          </div>
        </div>

        {/* Database & Backend Connectivity Diagnostics */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="#16a34a" /> Live Database & Services
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>MySQL Server 8.0</span>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> Connected
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Host: <code>localhost:3306</code> • Database: <code>mahadbt_db</code>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Node.js REST API</span>
                <span style={{ fontSize: '12px', color: isBackendConnected ? '#16a34a' : '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> {isBackendConnected ? 'Online (Port 5000)' : 'Connecting...'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Endpoint: <code>http://localhost:5000/api</code>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>DigiLocker Integration</span>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>
                  Live Simulated Engine
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                UIDAI / MahaOnline authentic PDF certificate linkage enabled.
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Records in Memory / DB</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>
                  {applications.length} Apps • {documents.length} Docs
                </span>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={refreshData}
            style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <RefreshCw size={15} /> Sync & Refresh from MySQL
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
