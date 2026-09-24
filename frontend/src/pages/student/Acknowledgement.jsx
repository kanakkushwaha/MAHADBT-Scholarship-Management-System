import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';

const Acknowledgement = () => {
  const { applications } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const myApp = applications.find(a => a.studentId === user.id);

  if (!myApp) {
    return (
      <Layout>
        <div className="card">
          <h2>Acknowledgement</h2>
          <p>No application found to print.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }} className="no-print">
        <h2>Application Acknowledgement</h2>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print Acknowledgement
        </button>
      </div>

      <div className="card print-section" style={{ backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px' }}>MAHADBT Portal</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Government of Maharashtra</p>
          <h3 style={{ marginTop: '16px' }}>Application Acknowledgement Receipt</h3>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '32px' }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Application ID</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp.id}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Submission Date</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{new Date(myApp.submittedDate).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Applicant Name</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp.studentName}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Department & Year</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp.department} - {myApp.year}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Applied Scheme</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{myApp.scholarshipName} ({myApp.academicYear})</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
          <p>This is a system generated acknowledgement. Signature is not required.</p>
          <p>Please keep this Application ID for future reference and tracking.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Acknowledgement;
