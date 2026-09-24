import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CloudRain, CheckCircle, AlertCircle, FileText, DownloadCloud } from 'lucide-react';

const Documents = () => {
  const { documents, updateDocumentStatus, applications } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  
  const myApp = applications.find(a => a.studentId === user.id);
  const myDocs = documents.filter(d => d.applicationId === myApp?.id);

  const [digiModal, setDigiModal] = useState(false);
  const [digiState, setDigiState] = useState('idle'); // idle, loading, success

  if (!myApp) {
    return (
      <Layout>
        <div className="card">
          <h2>Documents</h2>
          <p>You need to create an application first before uploading documents.</p>
        </div>
      </Layout>
    );
  }

  const handleSimulateUpload = (docId) => {
    updateDocumentStatus(docId, "Pending", "");
  };

  const handleDigiLocker = () => {
    setDigiState('loading');
    setTimeout(() => {
      setDigiState('success');
    }, 1500);
  };

  const renderDocRow = (doc) => (
    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText size={24} color="var(--color-primary)" />
        <div>
          <div style={{ fontWeight: '500' }}>{doc.type}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doc.name}</div>
          {doc.remark && doc.status === 'Correction Required' && (
            <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}><strong>Admin Remark:</strong> {doc.remark}</div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <StatusBadge status={doc.status} />
        {doc.status !== 'Verified' && (
          <button className="btn btn-secondary" style={{ fontSize: '12px' }} onClick={() => handleSimulateUpload(doc.id)}>
            <CloudRain size={14} /> Simulate Upload
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Document Upload</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Demo Module - No real files are uploaded to the server.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setDigiModal(true)}>
          <DownloadCloud size={16} /> Fetch from DigiLocker
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Permanent Documents</h3>
        </div>
        {myDocs.filter(d => d.category === 'Permanent').map(renderDocRow)}
        {myDocs.filter(d => d.category === 'Permanent').length === 0 && <div style={{padding:'16px'}}>No documents found.</div>}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Yearly/Academic Documents</h3>
        </div>
        {myDocs.filter(d => d.category === 'Yearly').map(renderDocRow)}
        {myDocs.filter(d => d.category === 'Yearly').length === 0 && <div style={{padding:'16px'}}>No documents found.</div>}
      </div>

      {digiModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>DigiLocker Integration (Simulated)</h3>
            
            {digiState === 'idle' && (
              <>
                <p style={{ marginBottom: '24px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Connect to DigiLocker to securely fetch your permanent documents like Aadhaar, Domicile, and Income Certificates.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => setDigiModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleDigiLocker}>Connect DigiLocker</button>
                </div>
              </>
            )}

            {digiState === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
                <div style={{ border: '4px solid var(--color-bg)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                <p>Authenticating with DigiLocker...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {digiState === 'success' && (
              <>
                <div style={{ padding: '16px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={20} />
                  Demo DigiLocker connection successful!
                </div>
                <p style={{ fontSize: '14px', marginBottom: '12px' }}>The following documents could be fetched:</p>
                <ul style={{ fontSize: '14px', marginBottom: '24px', paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                  <li>Aadhaar Card (UIDAI)</li>
                  <li>Income Certificate (Revenue Dept)</li>
                  <li>HSC Marksheet (State Board)</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => {setDigiModal(false); setDigiState('idle');}}>Close</button>
                  <button className="btn btn-primary" disabled>Import Documents (Demo)</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Documents;
