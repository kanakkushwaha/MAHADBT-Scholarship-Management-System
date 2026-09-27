import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Printer, CheckCircle, ShieldCheck, ArrowLeft, Activity, FileBadge } from 'lucide-react';

const Acknowledgement = () => {
  const { applications } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const myApp = applications.find(a => 
    (a.studentId === user?.id || a.student_prn === user?.prn || a.studentId === user?.prn || a.student_prn === user?.id)
  );

  if (!myApp) {
    return (
      <Layout>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Acknowledgement Receipt</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 20px 0' }}>
            No submitted scholarship application found to print.
          </p>
          <Link to="/student/application" className="btn btn-primary">
            Submit Application
          </Link>
        </div>
      </Layout>
    );
  }

  const submissionDate = myApp.submittedDate || myApp.submitted_date || new Date().toISOString();
  const studentName = myApp.studentName || myApp.student_name || user?.name || 'Sharvari Bangar';
  const prn = myApp.studentId || myApp.student_prn || user?.prn || user?.id || 'STU2026001';
  const scheme = myApp.scholarshipName || myApp.scholarship_name || 'Post-Matric Scholarship Scheme (Government of Maharashtra)';
  const dept = myApp.department || user?.department || 'Information Technology';
  const year = myApp.year || user?.year || 'Third Year';

  return (
    <Layout>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }} className="no-print">
        <div>
          <h2>Application Acknowledgement</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Official electronic acknowledgement receipt for AY 2025-26.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/student/track" className="btn btn-secondary">
            <Activity size={16} /> Track Status
          </Link>
          <Link to="/student/documents" className="btn btn-secondary">
            <FileBadge size={16} /> Documents
          </Link>
          <button 
            className="btn btn-primary" 
            onClick={() => window.print()}
            style={{ backgroundColor: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} /> Print Receipt (PDF)
          </button>
        </div>
      </div>

      {/* Official Government Receipt Sheet */}
      <div 
        className="card print-section" 
        style={{ 
          backgroundColor: '#ffffff', 
          maxWidth: '820px', 
          margin: '0 auto', 
          padding: '40px 48px',
          border: '2px solid #0f172a',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        {/* Emblem & Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px double #0f172a', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', color: '#475569' }}>
            GOVERNMENT OF MAHARASHTRA
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Directorate of Higher & Technical Education / Social Justice & Special Assistance Department
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '10px 0 4px 0', letterSpacing: '-0.5px' }}>
            MAHADBT SCHOLARSHIP PORTAL
          </h1>
          <div style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff', padding: '3px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Official Application Acknowledgement Receipt (AY 2025-26)
          </div>
        </div>

        {/* Top QR & Quick Identifiers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Application ID</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '0.5px' }}>{myApp.id}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Submission Date & Time: <strong>{new Date(submissionDate).toLocaleString()}</strong>
            </div>
          </div>

          {/* Simulated QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '68px', height: '68px', 
              border: '2px solid #0f172a', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'white', padding: '4px' 
            }}>
              <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px' }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{ backgroundColor: (i % 2 === 0 || i % 7 === 0) ? '#0f172a' : 'transparent', borderRadius: '1px' }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '100px', lineHeight: 1.2 }}>
              Digitally Signed e-Acknowledgement
            </div>
          </div>
        </div>

        {/* Applicant Details Table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '12px' }}>
            1. Applicant Particulars
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', width: '25%', borderBottom: '1px solid #f1f5f9' }}>Applicant Full Name:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>{studentName}</td>
                <td style={{ padding: '6px 8px', color: '#64748b', width: '20%', borderBottom: '1px solid #f1f5f9' }}>Permanent PRN:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>{prn}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>College / Institute:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                  Pimpri Chinchwad College of Engineering (PCCOE, Pune)
                </td>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>Institute Code:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>EN6175</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>Department:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>{dept}</td>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>Current Year:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>{year}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scheme & Verification Details */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '12px' }}>
            2. Applied Scheme & Verification Summary
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', width: '25%', borderBottom: '1px solid #f1f5f9' }}>Scholarship Scheme:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }} colSpan="3">
                  {scheme}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>Academic Session:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>2025 - 2026</td>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>Current Status:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#16a34a', borderBottom: '1px solid #f1f5f9' }}>
                  {myApp.status} (In Scrutiny)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>DigiLocker Integration:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0284c7', borderBottom: '1px solid #f1f5f9' }}>
                  Connected & Verified (UIDAI / MahaOnline)
                </td>
                <td style={{ padding: '6px 8px', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>DBT Payment Mode:</td>
                <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>Aadhaar Seeding / PFMS</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Stamp & Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #94a3b8', paddingTop: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ border: '2px solid #16a34a', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={28} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a', textTransform: 'uppercase' }}>
                DIGITALLY VERIFIED DOCUMENT
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Verified via MahaDBT & National DigiLocker Gateway
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
              AUTHENTICATED ELECTRONIC RECORD
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
              Nodal Officer - Scholarship Section
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              PCCOE Pune, Maharashtra
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '20px', paddingTop: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '10.5px' }}>
          This is a computer-generated official acknowledgement and does not require a physical signature under the IT Act 2000. 
          Please preserve this Application ID for tracking and communication.
        </div>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print, header, aside, .sidebar { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          .print-section { 
            box-shadow: none !important; 
            border: 1px solid #000 !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            padding: 20px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Acknowledgement;
