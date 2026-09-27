import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { APPLICATION_STAGES, getStageIndex } from '../../utils/statusHelpers';
import { CheckCircle, Circle, XCircle, FileBadge, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackStatus = () => {
  const { applications } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  
  const myApp = applications.find(a => 
    (a.studentId === user?.id || a.student_prn === user?.prn || a.studentId === user?.prn || a.student_prn === user?.id)
  );

  if (!myApp) {
    return (
      <Layout>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Track Status</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 20px 0' }}>
            No scholarship application found for your student profile.
          </p>
          <Link to="/student/application" className="btn btn-primary">
            Create Application Now
          </Link>
        </div>
      </Layout>
    );
  }

  const currentIdx = getStageIndex(myApp.status);
  const remarksList = myApp.adminRemarks || [];

  return (
    <Layout>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Application Tracking & Timeline</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Real-time status updates from College & Social Welfare Department.
          </p>
        </div>
        <Link to="/student/documents" className="btn btn-secondary">
          <FileBadge size={16} /> Manage Documents
        </Link>
      </div>

      {/* Application Snapshot Card */}
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Application ID</div>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--color-primary)' }}>{myApp.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Scheme Name</div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{myApp.scholarshipName || myApp.scholarship_name || 'Post-Matric Scholarship'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Current Status</div>
            <div style={{ marginTop: '4px' }}><StatusBadge status={myApp.status} /></div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Payment Status</div>
            <div style={{ marginTop: '4px' }}><StatusBadge status={myApp.paymentStatus || myApp.payment_status || 'Not Started'} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline (Spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              Verification Lifecycle
            </h3>
            <div style={{ position: 'relative', paddingLeft: '16px' }}>
              <div style={{ position: 'absolute', top: '10px', bottom: '20px', left: '25px', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
              
              {APPLICATION_STAGES.map((stage, idx) => {
                const isCompleted = idx < currentIdx || (idx === currentIdx && myApp.status !== "Rejected" && myApp.status !== "Document Verification" && myApp.status !== "Under Review" && myApp.status !== "Payment Processing");
                const isActive = idx === currentIdx;
                const isRejected = myApp.status === 'Rejected' && idx === 4;

                return (
                  <div key={stage} style={{ display: 'flex', gap: '20px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '50%' }}>
                      {isCompleted ? (
                        <CheckCircle size={22} color="var(--color-success)" />
                      ) : isRejected ? (
                        <XCircle size={22} color="var(--color-error)" />
                      ) : isActive ? (
                        <Circle size={22} color="var(--color-primary)" fill="rgba(59,130,246,0.2)" />
                      ) : (
                        <Circle size={22} color="#cbd5e1" />
                      )}
                    </div>
                    <div style={{ flex: 1, marginTop: '-2px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: isActive ? 'var(--color-primary)' : (isCompleted ? 'var(--color-text)' : 'var(--color-text-muted)') }}>
                        {stage === "Approved/Rejected" && myApp.status === "Rejected" ? "Application Rejected" : stage === "Approved/Rejected" && isCompleted ? "Application Approved" : stage}
                      </h4>
                      
                      {idx === 0 && (
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          Application submitted on {new Date(myApp.submittedDate || myApp.submitted_date || Date.now()).toLocaleString()}
                        </p>
                      )}
                      
                      {isActive && myApp.status === "Document Verification" && (
                        <p style={{ fontSize: '13px', color: 'var(--color-warning)', marginTop: '4px' }}>
                          Scrutiny team is inspecting your uploaded certificates and DigiLocker documents.
                        </p>
                      )}

                      {isActive && myApp.status === "Under Review" && (
                        <p style={{ fontSize: '13px', color: '#6366f1', marginTop: '4px' }}>
                          Institute Principal / Scholarship Officer is performing final eligibility validation.
                        </p>
                      )}

                      {isActive && myApp.status === "Approved" && (
                        <p style={{ fontSize: '13px', color: 'var(--color-success)', marginTop: '4px' }}>
                          Your scholarship application is approved and sent for DBT treasury disbursement!
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Admin Remarks & Notes Panel (Right Column) */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--color-primary)" /> Official Remarks
            </h3>
            
            {remarksList.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', backgroundColor: 'var(--color-bg)', borderRadius: '8px' }}>
                No administrative remarks posted yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {remarksList.map((r, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '14px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px', 
                      borderLeft: '4px solid var(--color-primary)',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>
                      "{r.text}"
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>👤 {r.author || 'Scholarship Officer'}</span>
                      <span>{r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}</span>
                    </div>
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

export default TrackStatus;
