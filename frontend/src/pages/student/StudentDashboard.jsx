import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { FileText, FileBadge, Activity, Bell } from 'lucide-react';
import { APPLICATION_STAGES, getStageIndex } from '../../utils/statusHelpers';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const { applications, documents, notifications } = useContext(AppDataContext);

  const myApp = applications.find(a => 
    (a.studentId === user?.id || a.student_prn === user?.prn || a.studentId === user?.prn || a.student_prn === user?.id)
  );
  const myDocs = documents.filter(d => 
    (d.applicationId === myApp?.id || d.application_id === myApp?.id || d.student_prn === user?.prn || d.student_prn === user?.id)
  );
  const unreadCount = notifications.filter(n => 
    (!n.read && !n.is_read) && (n.userId === user?.id || n.studentPrn === user?.prn || n.student_prn === user?.prn || n.userId === 'all')
  ).length;

  const docStats = {
    total: myDocs.length,
    verified: myDocs.filter(d => d.status === 'Verified').length,
    pending: myDocs.filter(d => d.status === 'Pending' || d.status === 'In Progress').length,
    correction: myDocs.filter(d => d.status === 'Correction Required').length,
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome back, {user.name}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Here's an overview of your scholarship application.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '8px' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Application Status</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp ? <StatusBadge status={myApp.status} /> : 'Not Submitted'}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px' }}>
            <FileBadge size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Document Status</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {docStats.total > 0 ? `${docStats.verified} / ${docStats.total} Verified` : 'No Documents'}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Payment Status</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp ? <StatusBadge status={myApp.paymentStatus} /> : 'N/A'}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '8px' }}>
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Unread Notifications</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{unreadCount} New</div>
          </div>
        </div>
      </div>

      {myApp && (
        <div className="card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Progress Tracker</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '4px', backgroundColor: 'var(--color-border)', zIndex: 1 }}></div>
            
            {APPLICATION_STAGES.map((stage, idx) => {
              const currentIdx = getStageIndex(myApp.status);
              const isCompleted = idx <= currentIdx;
              const isActive = idx === currentIdx;
              const isRejected = myApp.status === 'Rejected' && idx === 4;

              let color = 'var(--color-border)';
              if (isCompleted) color = 'var(--color-success)';
              if (isActive) color = 'var(--color-primary)';
              if (isRejected) color = 'var(--color-error)';

              return (
                <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '120px' }}>
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '50%', 
                    backgroundColor: color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '12px',
                    border: '4px solid var(--color-surface)',
                    boxShadow: isActive ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none'
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '8px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {stage === "Approved/Rejected" && myApp.status === "Rejected" ? "Rejected" : stage === "Approved/Rejected" && isCompleted ? "Approved" : stage}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6" style={{ marginTop: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!myApp ? (
              <Link to="/student/application" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <FileText size={18} /> Create New Application
              </Link>
            ) : (
              <Link to="/student/application" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <FileText size={18} /> View My Application
              </Link>
            )}
            <Link to="/student/documents" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <FileBadge size={18} /> Upload / Manage Documents
            </Link>
            <Link to="/student/track" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Activity size={18} /> Track Detailed Status
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Pending Actions</h3>
          {docStats.correction > 0 ? (
            <div style={{ padding: '16px', backgroundColor: '#ffedd5', borderRadius: '8px', border: '1px solid #fed7aa', color: '#9a3412' }}>
              <strong>Correction Required!</strong>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>You have {docStats.correction} document(s) that need to be re-uploaded. Please check the Documents section.</p>
              <Link to="/student/documents" className="btn btn-danger" style={{ marginTop: '12px' }}>Go to Documents</Link>
            </div>
          ) : !myApp ? (
            <div style={{ padding: '16px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Please create an application to get started.
            </div>
          ) : docStats.pending > 0 ? (
             <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e' }}>
              <strong>Upload Pending</strong>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>You have {docStats.pending} document(s) waiting to be uploaded.</p>
              <Link to="/student/documents" className="btn" style={{ marginTop: '12px', backgroundColor: '#b45309', color: 'white' }}>Upload Documents</Link>
            </div>
          ) : (
            <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0', color: '#166534', textAlign: 'center' }}>
              No pending actions. You're all set!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
