import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { APPLICATION_STAGES, getStageIndex } from '../../utils/statusHelpers';
import { CheckCircle, Circle, XCircle } from 'lucide-react';

const TrackStatus = () => {
  const { applications } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  
  const myApp = applications.find(a => a.studentId === user.id);

  if (!myApp) {
    return (
      <Layout>
        <div className="card">
          <h2>Track Status</h2>
          <p>No active application found.</p>
        </div>
      </Layout>
    );
  }

  const currentIdx = getStageIndex(myApp.status);

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Application Timeline</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Application ID: {myApp.id}</p>
      </div>

      <div className="card">
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '29px', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
          
          {APPLICATION_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIdx || (idx === currentIdx && myApp.status !== "Rejected" && myApp.status !== "Document Verification" && myApp.status !== "Under Review" && myApp.status !== "Payment Processing");
            const isActive = idx === currentIdx;
            const isRejected = myApp.status === 'Rejected' && idx === 4;

            return (
              <div key={stage} style={{ display: 'flex', gap: '20px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                <div style={{ backgroundColor: 'var(--color-surface)' }}>
                  {isCompleted ? (
                    <CheckCircle size={20} color="var(--color-success)" />
                  ) : isRejected ? (
                    <XCircle size={20} color="var(--color-error)" />
                  ) : isActive ? (
                    <Circle size={20} color="var(--color-primary)" fill="var(--color-primary-light)" style={{opacity: 0.5}} />
                  ) : (
                    <Circle size={20} color="var(--color-text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1, marginTop: '-2px' }}>
                  <h4 style={{ margin: 0, color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                    {stage === "Approved/Rejected" && myApp.status === "Rejected" ? "Rejected" : stage === "Approved/Rejected" && isCompleted ? "Approved" : stage}
                  </h4>
                  
                  {idx === 1 && isCompleted && (
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Submitted on: {new Date(myApp.submittedDate).toLocaleString()}</p>
                  )}
                  
                  {isActive && myApp.status === "Document Verification" && (
                     <p style={{ fontSize: '13px', color: 'var(--color-warning)', marginTop: '4px' }}>Your documents are currently being verified by the college admin.</p>
                  )}

                  {myApp.adminRemarks.length > 0 && isActive && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                      <strong style={{ fontSize: '13px' }}>Admin Remarks:</strong>
                      {myApp.adminRemarks.map((remark, rIdx) => (
                        <div key={rIdx} style={{ fontSize: '13px', marginTop: '8px' }}>
                          <div>"{remark.text}"</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px' }}>- {remark.author} on {new Date(remark.date).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TrackStatus;
