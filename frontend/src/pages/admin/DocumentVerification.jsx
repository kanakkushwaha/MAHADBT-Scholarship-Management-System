import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Check, X, FileBadge, Eye, Filter, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentVerification = () => {
  const { documents, applications, updateDocumentStatus } = useContext(AppDataContext);
  
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [remarks, setRemarks] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const filteredDocs = documents.filter(d => {
    const statusMatch = filterStatus === 'All' 
      ? true 
      : (filterStatus === 'Pending' ? (d.status === 'Pending' || d.status === 'In Progress') : d.status === filterStatus);
    const typeMatch = filterType === 'All' || d.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleAction = async (docId, status) => {
    const remark = remarks[docId] || (status === 'Correction Required' ? 'Discrepancy: Please submit a clearer copy.' : '');
    await updateDocumentStatus(docId, status, remark);
    
    const newRemarks = { ...remarks };
    delete newRemarks[docId];
    setRemarks(newRemarks);

    setToastMessage(`Document successfully marked as "${status}".`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Document Scrutiny & Verification Queue</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Central administrative verification queue for student submitted certificates.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--color-text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter Queue:</span>
        </div>

        <div style={{ minWidth: '160px' }}>
          <select 
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Pending">Pending / In Progress</option>
            <option value="Correction Required">Correction Required</option>
            <option value="Verified">Verified</option>
            <option value="All">All Documents ({documents.length})</option>
          </select>
        </div>

        <div style={{ minWidth: '200px' }}>
          <select 
            className="form-control"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Document Types</option>
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="Income Certificate">Income Certificate</option>
            <option value="Caste Certificate">Caste Certificate</option>
            <option value="Domicile Certificate">Domicile Certificate</option>
            <option value="Previous Year Marksheet">Previous Year Marksheet</option>
            <option value="Fee Receipt">Fee Receipt</option>
            <option value="Bonafide Certificate">Bonafide Certificate</option>
            <option value="Bank Passbook">Bank Passbook</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Showing <strong>{filteredDocs.length}</strong> items in queue
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student</th>
                <th>Document Details</th>
                <th>Status</th>
                <th>Preview PDF</th>
                <th style={{ minWidth: '280px' }}>Verification Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => {
                const appId = doc.applicationId || doc.application_id;
                const app = applications.find(a => a.id === appId);
                const filePath = doc.filePath || doc.file_path;

                return (
                  <tr key={doc.id}>
                    <td>
                      <Link to={`/admin/applications/${appId}`} style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                        {appId || 'General'}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app?.studentName || app?.student_name || doc.student_prn || 'Student'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{app?.department || 'PCCOE'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{doc.type}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {doc.name} • {doc.category}
                      </div>
                      {doc.remark && (
                        <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '2px' }}>
                          Remark: {doc.remark}
                        </div>
                      )}
                    </td>
                    <td><StatusBadge status={doc.status} /></td>
                    <td>
                      {filePath ? (
                        <a 
                          href={`http://localhost:5000${filePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ fontSize: '11.5px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0052cc', fontWeight: 600 }}
                          title="Open PDF"
                        >
                          <Eye size={13} /> View PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>No file</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Discrepancy remark..." 
                          style={{ fontSize: '12px', padding: '5px 8px', flex: 1 }}
                          value={remarks[doc.id] || ''}
                          onChange={(e) => setRemarks({ ...remarks, [doc.id]: e.target.value })}
                        />
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: 600 }} 
                          onClick={() => handleAction(doc.id, 'Verified')} 
                          title="Mark Verified"
                        >
                          <Check size={14} /> Verify
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: 600 }} 
                          onClick={() => handleAction(doc.id, 'Correction Required')} 
                          title="Request Correction"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                      <FileBadge size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>Queue is Empty</h4>
                      <p style={{ fontSize: '13px' }}>No documents found matching the selected filter criteria.</p>
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
