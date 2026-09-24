import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, MessageSquare, ArrowLeft } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, documents, updateApplicationStatus, updateDocumentStatus, addNotification } = useContext(AppDataContext);

  const app = applications.find(a => a.id === id);
  const appDocs = documents.filter(d => d.applicationId === id);

  const [remarkText, setRemarkText] = useState('');
  const [docRemark, setDocRemark] = useState({});

  if (!app) {
    return (
      <Layout>
        <div className="card">Application not found.</div>
      </Layout>
    );
  }

  const handleDocAction = (docId, status) => {
    updateDocumentStatus(docId, status, docRemark[docId] || "");
    // If all docs are verified, update application status if it was in Document Verification
    // Simplified for demo
  };

  const handleAppAction = (status) => {
    if (remarkText) {
      updateApplicationStatus(id, status, { text: remarkText, date: new Date().toISOString(), author: 'System Admin' });
    } else {
      updateApplicationStatus(id, status, null);
    }
    
    // Notify student
    addNotification({
      userId: app.studentId,
      message: `Your application ${app.id} status is now ${status}.`,
      date: new Date().toISOString(),
      read: false,
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info'
    });
    
    setRemarkText('');
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/applications')} style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>Application Details</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{app.id}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={app.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Name</div><div style={{fontWeight:'500'}}>{app.studentName}</div></div>
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Student ID</div><div style={{fontWeight:'500'}}>{app.studentId}</div></div>
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Department</div><div style={{fontWeight:'500'}}>{app.department}</div></div>
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Year</div><div style={{fontWeight:'500'}}>{app.year}</div></div>
            </div>
            
            <h3 style={{ marginBottom: '16px', marginTop: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Scholarship Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Scheme Name</div><div style={{fontWeight:'500'}}>{app.scholarshipName}</div></div>
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Academic Year</div><div style={{fontWeight:'500'}}>{app.academicYear}</div></div>
              <div><div style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Submission Date</div><div style={{fontWeight:'500'}}>{app.submittedDate ? new Date(app.submittedDate).toLocaleString() : 'N/A'}</div></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Uploaded Documents</h3>
            {appDocs.length === 0 ? <p>No documents uploaded yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appDocs.map(doc => (
                  <div key={doc.id} style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{doc.type} ({doc.category})</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{doc.name} • {new Date(doc.uploadDate).toLocaleDateString()}</div>
                      <div style={{ marginTop: '4px' }}><StatusBadge status={doc.status} /></div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      {doc.status !== 'Verified' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Add remark..." 
                            style={{ fontSize: '12px', padding: '4px 8px', width: '150px' }}
                            value={docRemark[doc.id] || ''}
                            onChange={(e) => setDocRemark({...docRemark, [doc.id]: e.target.value})}
                          />
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn" style={{ padding: '4px 8px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px' }} onClick={() => handleDocAction(doc.id, 'Verified')}>
                              <Check size={14} /> Verify
                            </button>
                            <button className="btn" style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12px' }} onClick={() => handleDocAction(doc.id, 'Correction Required')}>
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Application Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#fef3c7', color: '#92400e' }} onClick={() => handleAppAction('Document Verification')}>
                Move to Doc Verification
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#e0e7ff', color: '#3730a3' }} onClick={() => handleAppAction('Under Review')}>
                Move to Under Review
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', backgroundColor: '#dcfce7', color: '#166534' }} onClick={() => handleAppAction('Approved')}>
                <Check size={16} /> Approve Application
              </button>
              <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }} onClick={() => handleAppAction('Rejected')}>
                <X size={16} /> Reject Application
              </button>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <label className="form-label">Add Note / Remark (Visible to Student)</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter remark here before changing status..."
              ></textarea>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Past Remarks</h3>
            {app.adminRemarks.length === 0 ? <p style={{ color: 'var(--color-text-muted)' }}>No remarks added yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {app.adminRemarks.map((remark, idx) => (
                  <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                    <div style={{ fontSize: '13px' }}>"{remark.text}"</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px' }}>- {remark.author} on {new Date(remark.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetail;
