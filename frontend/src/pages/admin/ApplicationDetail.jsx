import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, MessageSquare, ArrowLeft, Eye, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, documents, updateApplicationStatus, updateDocumentStatus, addNotification } = useContext(AppDataContext);

  const app = applications.find(a => a.id === id);
  const appDocs = documents.filter(d => (d.applicationId === id || d.application_id === id));

  const [remarkText, setRemarkText] = useState('');
  const [docRemark, setDocRemark] = useState({});
  const [actionSuccess, setActionSuccess] = useState('');

  if (!app) {
    return (
      <Layout>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Application Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 20px 0' }}>The requested application ID does not exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/applications')}>
            Back to All Applications
          </button>
        </div>
      </Layout>
    );
  }

  const handleDocAction = async (docId, status) => {
    const remark = docRemark[docId] || (status === 'Correction Required' ? 'Discrepancy detected: Please upload a clearer copy.' : '');
    await updateDocumentStatus(docId, status, remark);
    
    // Clear remark input for that doc
    setDocRemark(prev => ({ ...prev, [docId]: '' }));
    setActionSuccess(`Document marked as "${status}" in MySQL database.`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleAppAction = async (status) => {
    const remarkObj = remarkText.trim() ? {
      text: remarkText.trim(),
      date: new Date().toISOString(),
      author: 'Scholarship Admin'
    } : null;

    await updateApplicationStatus(id, status, remarkObj);
    
    // Notify student
    await addNotification({
      studentPrn: app.studentId || app.student_prn,
      userId: app.studentId || app.student_prn,
      title: `Application Status Changed: ${status}`,
      message: `Your application (${app.id}) status has been updated to "${status}".${remarkText ? ` Note: "${remarkText}"` : ''}`,
      date: new Date().toISOString(),
      read: false,
      type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info'
    });
    
    setRemarkText('');
    setActionSuccess(`Application status successfully updated to "${status}".`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  return (
    <Layout>
      {/* Top Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/applications')} style={{ padding: '8px' }} title="Back to Applications">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2>Application Details</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Application ID: <strong>{app.id}</strong> • Student: <strong>{app.studentName || app.student_name}</strong>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusBadge status={app.status} />
        </div>
      </div>

      {actionSuccess && (
        <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {actionSuccess}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Columns: Student Info & Uploaded Documents */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Student Info Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Full Name</div>
                <div style={{ fontWeight: '600' }}>{app.studentName || app.student_name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Student PRN</div>
                <div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{app.studentId || app.student_prn}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Department</div>
                <div style={{ fontWeight: '500' }}>{app.department}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Academic Class</div>
                <div style={{ fontWeight: '500' }}>{app.year}</div>
              </div>
            </div>
            
            <h3 style={{ marginBottom: '16px', marginTop: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Scholarship Scheme
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Scheme Name</div>
                <div style={{ fontWeight: '600' }}>{app.scholarshipName || app.scholarship_name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Academic Session</div>
                <div style={{ fontWeight: '500' }}>{app.academicYear || app.academic_year || '2025-2026'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Submission Date</div>
                <div style={{ fontWeight: '500' }}>
                  {app.submittedDate || app.submitted_date ? new Date(app.submittedDate || app.submitted_date).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Payment Status</div>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={app.paymentStatus || app.payment_status || 'Not Started'} />
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Scrutiny Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Student Uploaded Documents ({appDocs.length})</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Inspect PDFs and verify or request corrections
              </span>
            </div>

            {appDocs.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg)', borderRadius: '8px' }}>
                No documents uploaded for this application yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appDocs.map(doc => {
                  const filePath = doc.filePath || doc.file_path;
                  return (
                    <div 
                      key={doc.id} 
                      style={{ 
                        padding: '16px', 
                        border: '1px solid var(--color-border)', 
                        borderRadius: '8px', 
                        backgroundColor: doc.status === 'Correction Required' ? '#fffaf8' : 'white'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} color="var(--color-primary)" />
                            {doc.type} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>({doc.category})</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            📄 {doc.name} • Uploaded: {new Date(doc.uploadDate || doc.upload_date || Date.now()).toLocaleDateString()}
                          </div>
                          <div style={{ marginTop: '6px' }}>
                            <StatusBadge status={doc.status} />
                          </div>
                        </div>
                        
                        {/* Action buttons (View PDF, Verify, Reject) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {filePath && (
                            <a 
                              href={`http://localhost:5000${filePath}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', color: '#0052cc', fontWeight: 600 }}
                              title="View actual uploaded PDF"
                            >
                              <Eye size={15} /> View PDF
                            </a>
                          )}

                          <button 
                            className="btn" 
                            style={{ padding: '6px 12px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: 600 }} 
                            onClick={() => handleDocAction(doc.id, 'Verified')}
                          >
                            <Check size={14} /> Verify
                          </button>

                          <button 
                            className="btn" 
                            style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: 600 }} 
                            onClick={() => handleDocAction(doc.id, 'Correction Required')}
                          >
                            <X size={14} /> Reject / Discrepancy
                          </button>
                        </div>
                      </div>

                      {/* Remark / Discrepancy Input & Active Remark Callout */}
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)' }}>
                        {doc.remark && (
                          <div style={{ 
                            fontSize: '12px', 
                            padding: '8px 12px', 
                            borderRadius: '6px', 
                            backgroundColor: doc.status === 'Correction Required' ? '#fef2f2' : '#f0fdf4',
                            border: `1px solid ${doc.status === 'Correction Required' ? '#fca5a5' : '#bbf7d0'}`,
                            color: doc.status === 'Correction Required' ? '#991b1b' : '#166534',
                            marginBottom: '8px'
                          }}>
                            <strong>Current Remark:</strong> {doc.remark}
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Type specific correction instructions for student..." 
                            style={{ fontSize: '12px', padding: '6px 10px' }}
                            value={docRemark[doc.id] || ''}
                            onChange={(e) => setDocRemark({ ...docRemark, [doc.id]: e.target.value })}
                          />
                          <button 
                            className="btn btn-secondary" 
                            style={{ fontSize: '11px', padding: '6px 10px', whiteSpace: 'nowrap' }}
                            onClick={() => handleDocAction(doc.id, 'Correction Required')}
                          >
                            Send Remark
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Decision & Status Actions */}
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Application Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn" 
                style={{ justifyContent: 'flex-start', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }} 
                onClick={() => handleAppAction('Document Verification')}
              >
                Mark Document Verification
              </button>
              <button 
                className="btn" 
                style={{ justifyContent: 'flex-start', backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: 600 }} 
                onClick={() => handleAppAction('Under Review')}
              >
                Move to Under Review
              </button>
              <button 
                className="btn" 
                style={{ justifyContent: 'flex-start', backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }} 
                onClick={() => handleAppAction('Approved')}
              >
                <Check size={16} /> Approve Application
              </button>
              <button 
                className="btn btn-danger" 
                style={{ justifyContent: 'flex-start', fontWeight: 600 }} 
                onClick={() => handleAppAction('Rejected')}
              >
                <X size={16} /> Reject Application
              </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Decision Remarks (Sent to Student)</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter overall remark before changing application status..."
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
