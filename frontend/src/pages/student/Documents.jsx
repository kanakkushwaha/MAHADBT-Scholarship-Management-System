import React, { useContext, useState, useRef } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CheckCircle, AlertCircle, FileText, DownloadCloud, 
  Upload, Shield, KeyRound, Smartphone, Eye, RefreshCw, X, Trash2, 
  AlertTriangle, ExternalLink, PlusCircle 
} from 'lucide-react';

// Master list of all documents officially required for MAHADBT Scholarships
const REQUIRED_MAHADBT_DOCS = [
  // Permanent Documents (Reused till graduation)
  { type: 'Aadhaar Card', category: 'Permanent', required: true, issuer: 'UIDAI', desc: 'e-Aadhaar card linked with mobile & bank account', digiEligible: true },
  { type: 'Caste Certificate', category: 'Permanent', required: true, issuer: 'Social Justice Dept, Maharashtra', desc: 'Competent authority certificate for category quota (SC/ST/OBC/VJNT)', digiEligible: true },
  { type: 'Domicile Certificate', category: 'Permanent', required: true, issuer: 'Revenue Dept, Maharashtra', desc: 'Proof of continuous residence in Maharashtra state', digiEligible: true },
  { type: 'Caste Validity Certificate', category: 'Permanent', required: false, issuer: 'Divisional Scrutiny Committee', desc: 'Required for Professional Engineering Degree courses', digiEligible: false },
  { type: 'Ration Card / Family Proof', category: 'Permanent', required: false, issuer: 'Civil Supplies Dept', desc: 'Family unit & beneficiary proof', digiEligible: false },

  // Yearly / Academic Documents (Renewed every academic year)
  { type: 'Income Certificate', category: 'Yearly', required: true, issuer: 'Office of the Tahsildar', desc: 'Current Financial Year (2025-26) certificate showing family income under limit', digiEligible: true },
  { type: 'Previous Year Marksheet', category: 'Yearly', required: true, issuer: 'SPPU Pune University', desc: 'Passed marksheet of previous semester/academic year', digiEligible: false },
  { type: 'Fee Receipt', category: 'Yearly', required: true, issuer: 'PCCOE Accounts Section', desc: 'College official tuition & development fee payment receipt for 2025-26', digiEligible: false },
  { type: 'Bonafide Certificate', category: 'Yearly', required: true, issuer: 'PCCOE Registrar Office', desc: 'Current academic year college bonafide certificate', digiEligible: false },
  { type: 'Bank Passbook', category: 'Yearly', required: true, issuer: 'Nationalized Bank', desc: 'Student savings account passbook with active Aadhaar DBT seeding', digiEligible: false },
  { type: 'Self Declaration / Undertaking', category: 'Yearly', required: false, issuer: 'Student & Parent', desc: 'Undertaking for not availing duplicate scholarships', digiEligible: false }
];

const Documents = () => {
  const { documents, updateDocumentStatus, applications, fetchDigiLockerDocs, uploadDocument, deleteDocument, refreshData } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);
  
  const myApp = applications.find(a => (a.studentId || a.student_prn) === (user?.id || user?.prn));
  
  // Filter docs matching application (handle both camelCase and snake_case)
  const myDocs = documents.filter(d => 
    (d.applicationId || d.application_id) === myApp?.id ||
    (d.studentId || d.student_prn) === (user?.id || user?.prn)
  );

  // DigiLocker Modal State
  const [digiModal, setDigiModal] = useState(false);
  const [digiStep, setDigiStep] = useState(1);
  const [aadhaarOrMobile, setAadhaarOrMobile] = useState('7890 1234 5678');
  const [securityPin, setSecurityPin] = useState('123456');
  const [otp, setOtp] = useState('123456');
  const [selectedDocs, setSelectedDocs] = useState([
    'Aadhaar Card',
    'Income Certificate',
    'Caste Certificate',
    'Domicile Certificate'
  ]);
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [digiLoading, setDigiLoading] = useState(false);
  const [digiSuccess, setDigiSuccess] = useState(false);

  // Manual Upload Modal State
  const [uploadModal, setUploadModal] = useState(false);
  const [manualCategory, setManualCategory] = useState('Yearly');
  const [manualType, setManualType] = useState('Previous Year Marksheet');
  const [manualFile, setManualFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Direct row file upload input refs
  const fileInputRefs = useRef({});

  if (!myApp) {
    return (
      <Layout>
        <div className="card">
          <h2>Documents Management</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
            You need to create or submit a scholarship application first before managing documents.
          </p>
        </div>
      </Layout>
    );
  }

  // Handle DigiLocker Flow
  const handleDigiLogin = (e) => {
    e.preventDefault();
    if (!aadhaarOrMobile || !securityPin) return;
    setDigiStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) return;
    setDigiStep(3);
  };

  const toggleDocSelection = (docType) => {
    setSelectedDocs(prev => 
      prev.includes(docType) ? prev.filter(t => t !== docType) : [...prev, docType]
    );
  };

  const handleGrantConsentAndFetch = async () => {
    if (!consentAgreed || selectedDocs.length === 0) return;
    setDigiLoading(true);
    setDigiStep(4);

    try {
      await fetchDigiLockerDocs(
        user?.id || user?.prn || 'STU2026001',
        myApp.id,
        selectedDocs,
        aadhaarOrMobile
      );
      setDigiLoading(false);
      setDigiSuccess(true);
    } catch (err) {
      console.error(err);
      setDigiLoading(false);
    }
  };

  const closeDigiModal = () => {
    setDigiModal(false);
    setDigiStep(1);
    setDigiSuccess(false);
    setDigiLoading(false);
  };

  // Handle Manual Modal Upload
  const handleManualUploadSubmit = async (e) => {
    e.preventDefault();
    if (!manualFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', manualFile);
    formData.append('applicationId', myApp.id);
    formData.append('studentPrn', user?.id || user?.prn || 'STU2026001');
    formData.append('type', manualType);
    formData.append('category', manualCategory);

    await uploadDocument(formData);
    setUploading(false);
    setUploadModal(false);
    setManualFile(null);
  };

  // Handle Direct Row Upload / Re-upload
  const handleDirectRowUpload = async (docDefinition, file, existingDocId) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (existingDocId) {
      formData.append('docId', existingDocId);
    }
    formData.append('applicationId', myApp.id);
    formData.append('studentPrn', user?.id || user?.prn || 'STU2026001');
    formData.append('type', docDefinition.type);
    formData.append('category', docDefinition.category);

    await uploadDocument(formData);
  };

  // Handle Document Delete
  const handleDeleteDoc = async (docId, docName) => {
    if (window.confirm(`Are you sure you want to remove "${docName}"? You can re-upload it anytime.`)) {
      await deleteDocument(docId);
    }
  };

  // Render a document card based on the MAHADBT master checklist
  const renderDocCard = (def) => {
    const existingDoc = myDocs.find(d => d.type === def.type);
    const isUploaded = !!existingDoc;
    const status = existingDoc ? existingDoc.status : 'Not Uploaded';
    const filePath = existingDoc ? (existingDoc.filePath || existingDoc.file_path) : null;
    const remark = existingDoc ? existingDoc.remark : null;

    return (
      <div 
        key={def.type} 
        style={{ 
          borderBottom: '1px solid var(--color-border)', 
          padding: '20px 24px',
          backgroundColor: status === 'Correction Required' ? '#fff5f5' : 'transparent',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Document Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '8px', 
              backgroundColor: isUploaded ? (status === 'Verified' ? '#dcfce7' : (status === 'Correction Required' ? '#fee2e2' : '#eff6ff')) : '#f1f5f9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={24} color={isUploaded ? (status === 'Verified' ? '#166534' : (status === 'Correction Required' ? '#dc2626' : '#2563eb')) : '#94a3b8'} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>{def.type}</span>
                {def.required && (
                  <span style={{ fontSize: '10px', background: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    Mandatory
                  </span>
                )}
                {def.digiEligible && (
                  <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    DigiLocker Available
                  </span>
                )}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                {def.desc} • <em>Issued by: {def.issuer}</em>
              </div>

              {existingDoc && (
                <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px', fontWeight: 500 }}>
                  📄 File: <strong>{existingDoc.name}</strong> 
                  {(existingDoc.uploadDate || existingDoc.upload_date) && ` (Uploaded: ${new Date(existingDoc.uploadDate || existingDoc.upload_date).toLocaleDateString()})`}
                </div>
              )}

              {/* INDIVIDUAL ADMIN COMMENT / REMARK BOX */}
              {remark && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px 14px', 
                  borderRadius: '6px', 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  backgroundColor: status === 'Correction Required' ? '#fef2f2' : (status === 'Verified' ? '#f0fdf4' : '#f8fafc'),
                  border: `1px solid ${status === 'Correction Required' ? '#fca5a5' : (status === 'Verified' ? '#bbf7d0' : '#e2e8f0')}`,
                  color: status === 'Correction Required' ? '#991b1b' : (status === 'Verified' ? '#166534' : '#334155')
                }}>
                  {status === 'Correction Required' ? (
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <strong>{status === 'Correction Required' ? 'Admin Discrepancy Remark: ' : 'Verification Note: '}</strong>
                    {remark}
                    {status === 'Correction Required' && (
                      <div style={{ fontSize: '11px', marginTop: '4px', color: '#dc2626' }}>
                        * Please review the comment and click <strong>"Re-upload File"</strong> to submit the corrected document.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge & Document Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <StatusBadge status={status} />

            {/* Hidden File Input for direct row upload */}
            <input 
              type="file" 
              ref={el => fileInputRefs.current[def.type] = el}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleDirectRowUpload(def, e.target.files[0], existingDoc?.id);
                }
              }}
            />

            {/* View PDF Button (opens real PDF in browser) */}
            {filePath && (
              <a 
                href={`http://localhost:5000${filePath}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0052cc', fontWeight: 600 }}
                title="View actual document PDF"
              >
                <Eye size={15} color="#0052cc" /> View PDF
              </a>
            )}

            {/* Manual Upload or Re-upload Button */}
            <button 
              className={isUploaded ? "btn btn-secondary" : "btn btn-primary"} 
              style={{ 
                fontSize: '12px', 
                padding: '7px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                backgroundColor: isUploaded ? 'transparent' : 'var(--color-primary)' 
              }}
              onClick={() => fileInputRefs.current[def.type]?.click()}
              title={isUploaded ? "Replace/Re-upload document from computer" : "Upload document file manually"}
            >
              <Upload size={14} /> {isUploaded ? 'Re-upload' : 'Upload Manually'}
            </button>

            {/* Quick Single-Doc DigiLocker Fetch button (if eligible & not yet verified via DigiLocker) */}
            {def.digiEligible && status !== 'Verified' && (
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '12px', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0052cc' }}
                onClick={() => {
                  setSelectedDocs([def.type]);
                  setDigiStep(1);
                  setDigiModal(true);
                }}
                title={`Fetch only ${def.type} via DigiLocker`}
              >
                <DownloadCloud size={14} color="#0052cc" /> DigiLocker
              </button>
            )}

            {/* Delete Button (if document was uploaded) */}
            {isUploaded && (
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '12px', padding: '7px 10px', color: '#dc2626', borderColor: '#fca5a5' }}
                onClick={() => handleDeleteDoc(existingDoc.id, existingDoc.name || def.type)}
                title="Delete this uploaded document"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

        </div>
      </div>
    );
  };

  const permanentList = REQUIRED_MAHADBT_DOCS.filter(d => d.category === 'Permanent');
  const yearlyList = REQUIRED_MAHADBT_DOCS.filter(d => d.category === 'Yearly');

  const permanentVerified = permanentList.filter(d => myDocs.some(md => md.type === d.type && md.status === 'Verified')).length;
  const yearlyVerified = yearlyList.filter(d => myDocs.some(md => md.type === d.type && md.status === 'Verified')).length;

  return (
    <Layout>
      {/* Top Header & Actions */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2>MAHADBT Scholarship Document Checklist</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Application ID: <strong>{myApp.id}</strong> • Scheme: <strong>{myApp.scholarshipName || 'Post-Matric Scholarship'}</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={refreshData} title="Sync latest status from database">
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={() => setUploadModal(true)}>
            <PlusCircle size={15} /> Manual Upload
          </button>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#0052cc', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setDigiModal(true)}
          >
            <DownloadCloud size={16} /> Fetch from DigiLocker
          </button>
        </div>
      </div>

      {/* Overview Progress Banner */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Overall Document Verification Progress</div>
          <div style={{ fontSize: '13px', color: '#0052cc', fontWeight: 600 }}>
            {permanentVerified + yearlyVerified} / {REQUIRED_MAHADBT_DOCS.length} Documents Verified
          </div>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${((permanentVerified + yearlyVerified) / REQUIRED_MAHADBT_DOCS.length) * 100}%`, 
              height: '100%', 
              backgroundColor: '#16a34a',
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
      </div>

      {/* SECTION 1: PERMANENT DOCUMENTS */}
      <div className="card" style={{ padding: 0, marginBottom: '28px' }}>
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-h)' }}>1. Permanent Documents (One-time Upload)</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Aadhaar, Caste, and Domicile certificates are stored securely and reused until graduation without repeated uploads.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: permanentVerified === permanentList.length ? '#16a34a' : 'var(--color-primary)' }}>
            {permanentVerified} / {permanentList.length} Verified
          </span>
        </div>
        {permanentList.map(renderDocCard)}
      </div>

      {/* SECTION 2: YEARLY DOCUMENTS */}
      <div className="card" style={{ padding: 0, marginBottom: '28px' }}>
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-h)' }}>2. Yearly / Academic Documents (Annual Renewal)</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Tahsil Income certificate, fee receipts, marksheets, and bonafide must be submitted every academic year.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: yearlyVerified === yearlyList.length ? '#16a34a' : 'var(--color-primary)' }}>
            {yearlyVerified} / {yearlyList.length} Verified
          </span>
        </div>
        {yearlyList.map(renderDocCard)}
      </div>

      {/* ================================================================= */}
      {/* DIGILOCKER MULTI-STEP MODAL                                       */}
      {/* ================================================================= */}
      {digiModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ 
            maxWidth: '520px', 
            width: '95%', 
            padding: 0, 
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            borderRadius: '12px'
          }}>
            
            {/* Header */}
            <div style={{ backgroundColor: '#003366', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={24} color="#60a5fa" />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>DigiLocker Integration</div>
                  <div style={{ fontSize: '11px', color: '#93c5fd' }}>National e-Governance Division (NeGD) • Govt of India</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a 
                  href="https://www.digilocker.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#bfdbfe', fontSize: '11px', textDecoration: 'underline', marginRight: '6px' }}
                >
                  Official Portal ↗
                </a>
                <button 
                  onClick={closeDigiModal}
                  style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Steps bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', padding: '10px 20px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: digiStep >= 1 ? '#0052cc' : 'var(--color-text-muted)', marginRight: '16px' }}>1. Sign In</span>
              <span style={{ color: digiStep >= 2 ? '#0052cc' : 'var(--color-text-muted)', marginRight: '16px' }}>2. OTP Verification</span>
              <span style={{ color: digiStep >= 3 ? '#0052cc' : 'var(--color-text-muted)' }}>3. Consent & Fetch</span>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {digiStep === 1 && (
                <form onSubmit={handleDigiLogin}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    Enter your Aadhaar Number or Registered Mobile Number and 6-digit PIN to authenticate with DigiLocker.
                  </p>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      <Smartphone size={15} /> Aadhaar / Mobile Number
                    </label>
                    <input 
                      type="text" 
                      className="input" 
                      value={aadhaarOrMobile}
                      onChange={(e) => setAadhaarOrMobile(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      <KeyRound size={15} /> 6-Digit Security PIN
                    </label>
                    <input 
                      type="password" 
                      maxLength="6"
                      className="input" 
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      required
                    />
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Demo default: 123456</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary" onClick={closeDigiModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0052cc' }}>
                      Sign In & Request OTP
                    </button>
                  </div>
                </form>
              )}

              {digiStep === 2 && (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                      <Smartphone size={22} color="#0052cc" />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>Enter DigiLocker OTP</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      One-time password (OTP) sent to mobile linked with Aadhaar ending in <strong>****3210</strong>
                    </p>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <input 
                      type="text" 
                      maxLength="6"
                      className="input" 
                      style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setDigiStep(1)}>Back</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0052cc' }}>
                      Verify OTP
                    </button>
                  </div>
                </form>
              )}

              {digiStep === 3 && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Student Consent for Document Access</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    Select the certificates you consent to retrieve directly from government authorities:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { type: 'Aadhaar Card', issuer: 'UIDAI Govt of India' },
                      { type: 'Income Certificate', issuer: 'Revenue Dept, Govt of Maharashtra' },
                      { type: 'Caste Certificate', issuer: 'Social Justice Dept, Govt of Maharashtra' },
                      { type: 'Domicile Certificate', issuer: 'Revenue Dept, Govt of Maharashtra' }
                    ].map(item => (
                      <label 
                        key={item.type}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--color-border)',
                          backgroundColor: selectedDocs.includes(item.type) ? '#eff6ff' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedDocs.includes(item.type)} 
                          onChange={() => toggleDocSelection(item.type)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.type}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.issuer}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: '#1e40af', marginBottom: '16px' }}>
                    💡 <strong>Flexible Choice:</strong> You can select only 1 document (e.g. only Aadhaar). Any unselected document can easily be <strong>uploaded manually</strong> from your computer on the documents page!
                  </div>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={consentAgreed} 
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      style={{ marginTop: '2px' }}
                    />
                    <span>
                      I hereby voluntarily provide consent to DigiLocker to share the selected digitally signed certificates with PCCOE Scholarship Section.
                    </span>
                  </label>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setDigiStep(2)}>Back</button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      style={{ backgroundColor: '#0052cc', fontWeight: 600 }}
                      disabled={!consentAgreed || selectedDocs.length === 0}
                      onClick={handleGrantConsentAndFetch}
                    >
                      Grant Consent & Fetch ({selectedDocs.length})
                    </button>
                  </div>
                </div>
              )}

              {digiStep === 4 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  {digiLoading && (
                    <div>
                      <div style={{ border: '4px solid var(--color-bg)', borderTop: '4px solid #0052cc', borderRadius: '50%', width: '44px', height: '44px', animation: 'spin 1s linear infinite', margin: '0 auto 14px auto' }} />
                      <h4 style={{ margin: 0, fontSize: '15px' }}>Fetching from DigiLocker API...</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                        Retrieving authenticated PDFs from UIDAI & Maharashtra State Data Centers.
                      </p>
                      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                  )}

                  {digiSuccess && (
                    <div>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                        <CheckCircle size={28} color="#166534" />
                      </div>
                      <h3 style={{ margin: 0, color: '#166534', fontSize: '17px' }}>Documents Verified & PDFs Linked!</h3>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px', marginBottom: '20px' }}>
                        {selectedDocs.length} authentic PDF certificates have been digitally imported and verified in MySQL. You can now view and download the PDFs directly.
                      </p>

                      <button 
                        className="btn btn-primary" 
                        style={{ backgroundColor: '#0052cc', padding: '10px 24px', fontWeight: 600 }}
                        onClick={closeDigiModal}
                      >
                        Done & View Documents
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MANUAL DOCUMENT UPLOAD MODAL                                      */}
      {/* ================================================================= */}
      {uploadModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Manual Document Upload</h3>
              <button 
                onClick={() => setUploadModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualUploadSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Document Category
                </label>
                <select 
                  className="input" 
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                >
                  <option value="Yearly">Yearly / Academic Document (Marksheet, Fee Receipt, Bonafide)</option>
                  <option value="Permanent">Permanent Document (Aadhaar, Caste, Domicile, PAN)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Document Type
                </label>
                <select 
                  className="input" 
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                >
                  {REQUIRED_MAHADBT_DOCS.map(d => (
                    <option key={d.type} value={d.type}>{d.type}</option>
                  ))}
                  <option value="Other Supporting Document">Other Supporting Document</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
                  Select File (PDF, JPG, PNG)
                </label>
                <input 
                  type="file" 
                  className="input" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setManualFile(e.target.files[0])}
                  required
                />
                {manualFile && (
                  <div style={{ fontSize: '12px', color: '#0052cc', marginTop: '6px' }}>
                    Selected: {manualFile.name} ({(manualFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setUploadModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploading || !manualFile}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Documents;
