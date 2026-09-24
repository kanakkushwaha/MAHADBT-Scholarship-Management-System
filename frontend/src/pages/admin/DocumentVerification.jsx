import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Check, X, FileBadge } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentVerification = () => {
  const { documents, applications, updateDocumentStatus } = useContext(AppDataContext);
  
  const pendingDocs = documents.filter(d => d.status === 'Pending' || d.status === 'In Progress');
  const [remarks, setRemarks] = useState({});

  const handleAction = (docId, status) => {
    updateDocumentStatus(docId, status, remarks[docId] || "");
    const newRemarks = {...remarks};
    delete newRemarks[docId];
    setRemarks(newRemarks);
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Document Verification Queue</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Global queue of all pending documents across applications.</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student</th>
                <th>Document Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDocs.map(doc => {
                const app = applications.find(a => a.id === doc.applicationId);
                return (
                  <tr key={doc.id}>
                    <td>
                      <Link to={`/admin/applications/${doc.applicationId}`} style={{ fontWeight: '500' }}>
                        {doc.applicationId}
                      </Link>
                    </td>
                    <td>{app?.studentName}</td>
                    <td>
                      <div>{doc.type}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doc.name}</div>
                    </td>
                    <td><StatusBadge status={doc.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Remark..." 
                          style={{ fontSize: '12px', padding: '4px 8px', width: '120px' }}
                          value={remarks[doc.id] || ''}
                          onChange={(e) => setRemarks({...remarks, [doc.id]: e.target.value})}
                        />
                        <button className="btn" style={{ padding: '6px', backgroundColor: '#dcfce7', color: '#166534' }} onClick={() => handleAction(doc.id, 'Verified')} title="Verify">
                          <Check size={14} />
                        </button>
                        <button className="btn" style={{ padding: '6px', backgroundColor: '#fee2e2', color: '#991b1b' }} onClick={() => handleAction(doc.id, 'Correction Required')} title="Reject / Correction">
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pendingDocs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                      <FileBadge size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>No documents pending verification.</p>
                      <p style={{ fontSize: '14px' }}>All caught up!</p>
                    </div>
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

export default DocumentVerification;
