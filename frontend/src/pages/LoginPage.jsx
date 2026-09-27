import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Shield, User, GraduationCap, ArrowRight, CheckCircle2, 
  AlertCircle, Clock, Key, Sparkles, Building2, ChevronRight
} from 'lucide-react';

const STUDENTS_LIST = [
  {
    name: 'Sharvari Bangar',
    prn: 'STU2026001',
    email: 'student@demo.com',
    dept: 'Information Technology (3rd Year)',
    scheme: 'Post-Matric Scholarship',
    status: 'Under Review',
    statusColor: '#d97706',
    statusBg: '#fef3c7'
  },
  {
    name: 'Rohan Deshmukh',
    prn: 'STU2026004',
    email: 'rohan@demo.com',
    altEmail: 'RohanDeshmukh@demo.com',
    dept: 'Mechanical Engg (1st Year)',
    scheme: 'EBC Concession',
    status: 'Submitted',
    statusColor: '#2563eb',
    statusBg: '#dbeafe'
  },
  {
    name: 'Ananya Kulkarni',
    prn: 'STU2026003',
    email: 'ananya@demo.com',
    dept: 'ENTC (2nd Year)',
    scheme: 'Post-Matric Scholarship',
    status: 'Correction Required',
    statusColor: '#dc2626',
    statusBg: '#fee2e2'
  },
  {
    name: 'Aarav Patil',
    prn: 'STU2026002',
    email: 'aarav@demo.com',
    dept: 'Computer Engg (Final Year)',
    scheme: 'Post-Matric Scholarship',
    status: 'Approved',
    statusColor: '#16a34a',
    statusBg: '#dcfce7'
  },
  {
    name: 'Priya Sharma',
    prn: 'STU2026005',
    email: 'priya@demo.com',
    dept: 'Information Technology (Final Year)',
    scheme: 'Post-Matric Scholarship',
    status: 'Payment Processing',
    statusColor: '#9333ea',
    statusBg: '#f3e8ff'
  },
  {
    name: 'Vikram Singh',
    prn: 'STU2026006',
    email: 'vikram@demo.com',
    dept: 'Computer Engg (2nd Year)',
    scheme: 'EBC Concession',
    status: 'Rejected',
    statusColor: '#4b5563',
    statusBg: '#f3f4f6'
  }
];

const ADMINS_LIST = [
  {
    name: 'Scholarship Officer',
    email: 'admin@demo.com',
    roleDesc: 'Chief Verifier & Sanctioning Authority',
    badge: 'Approver'
  },
  {
    name: 'Admin Verifier 1',
    email: 'verifier@demo.com',
    roleDesc: 'Document Scrutiny Desk Verifier',
    badge: 'Verifier'
  }
];

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Password is "student123" for students and "admin123" for admins.');
      }
    } catch (err) {
      setError('Login failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedEmail, selectedPass, selectedRole) => {
    setRole(selectedRole);
    setEmail(selectedEmail);
    setPassword(selectedPass);
    setError('');
    setLoading(true);
    try {
      const success = await login(selectedEmail, selectedPass);
      if (!success) {
        setError('Could not auto-login. Please verify backend is running.');
      }
    } catch (err) {
      setError('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setRole(tab);
    setError('');
    if (tab === 'student') {
      setEmail('student@demo.com');
      setPassword('student123');
    } else {
      setEmail('admin@demo.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '30px 16px' 
    }}>
      {/* Top Header Branding */}
      <div style={{ textAlign: 'center', marginBottom: '28px', maxWidth: '800px', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
          <Sparkles size={16} /> MahaDBT Scholarship Management Prototype
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
          Government of Maharashtra
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Direct Benefit Transfer & Scholarship Automation Portal
        </p>
      </div>

      {/* Main 2-Column Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(320px, 390px) minmax(360px, 580px)', 
        gap: '24px', 
        maxWidth: '1020px', 
        width: '100%',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Sign In Card */}
        <div className="card" style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => switchTab('student')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: role === 'student' ? '#2563eb' : 'transparent',
                color: role === 'student' ? '#ffffff' : '#64748b',
                boxShadow: role === 'student' ? '0 2px 6px rgba(37,99,235,0.3)' : 'none'
              }}
            >
              <GraduationCap size={16} /> Student Portal
            </button>
            <button
              type="button"
              onClick={() => switchTab('admin')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: role === 'admin' ? '#7c3aed' : 'transparent',
                color: role === 'admin' ? '#ffffff' : '#64748b',
                boxShadow: role === 'admin' ? '0 2px 6px rgba(124,58,237,0.3)' : 'none'
              }}
            >
              <Shield size={16} /> Officer / Admin
            </button>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
            {role === 'student' ? 'Student Sign In' : 'Administrative Login'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            {role === 'student' 
              ? 'Enter your Email, Student PRN (e.g. STU2026004), or Name.' 
              : 'Enter verification officer credentials.'}
          </p>

          {error && (
            <div style={{ 
              padding: '12px 14px', 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              borderRadius: '8px', 
              marginBottom: '18px', 
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                {role === 'student' ? 'Email / PRN / Username' : 'Admin Email'}
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'student' ? 'e.g. rohan@demo.com or STU2026004' : 'admin@demo.com'}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  fontSize: '14px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Password</label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Default: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{role === 'student' ? 'student123' : 'admin123'}</code>
                </span>
              </div>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  fontSize: '14px', 
                  borderRadius: '8px', 
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: role === 'student' ? '#2563eb' : '#7c3aed', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {loading ? 'Authenticating...' : `Sign in to ${role === 'student' ? 'Student' : 'Admin'} Portal`}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick info footer */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={14} color="#64748b" />
            <span>Tip: Click any student profile on the right for instant 1-click access!</span>
          </div>
        </div>

        {/* Right Column: Interactive 1-Click Accounts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>
                Quick 1-Click Demo Profiles
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Select any profile to test different scholarship workflow stages:
              </p>
            </div>
            <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
              {STUDENTS_LIST.length} Students Active
            </span>
          </div>

          {/* Student Profiles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {STUDENTS_LIST.map((stu) => {
              const isCurrent = email.toLowerCase() === stu.email.toLowerCase() || email.toUpperCase() === stu.prn;
              return (
                <div 
                  key={stu.prn}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: isCurrent ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '34px', height: '34px', borderRadius: '8px', 
                        background: '#eff6ff', color: '#2563eb', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '13px'
                      }}>
                        {stu.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', lineHeight: 1.2 }}>{stu.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', fontWeight: '600' }}>{stu.prn}</div>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      padding: '2px 8px', 
                      borderRadius: '10px', 
                      background: stu.statusBg, 
                      color: stu.statusColor 
                    }}>
                      {stu.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', lineHeight: 1.3 }}>
                    <div>📚 {stu.dept}</div>
                    <div style={{ color: '#0284c7' }}>📄 {stu.scheme}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(stu.email, 'student123', 'student')}
                      style={{
                        flex: 1,
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      title={`Log in as ${stu.name}`}
                    >
                      <span>1-Click Sign In</span>
                      <ChevronRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('student');
                        setEmail(stu.email);
                        setPassword('student123');
                      }}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      title="Fill into form"
                    >
                      Fill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Demo Profiles */}
          <div style={{ 
            backgroundColor: '#faf5ff', 
            borderRadius: '12px', 
            padding: '14px 16px', 
            border: '1px solid #e9d5ff',
            marginTop: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="#7c3aed" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#581c87' }}>
                  Administrative Verifier Accounts (Password: <code>admin123</code>)
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {ADMINS_LIST.map((admin) => (
                <div 
                  key={admin.email}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid #f3e8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{admin.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{admin.roleDesc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(admin.email, 'admin123', 'admin')}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Login
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Summary Table for User Reference */}
      <div style={{ 
        maxWidth: '1020px', 
        width: '100%', 
        marginTop: '24px', 
        padding: '16px 20px', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#475569'
      }}>
        <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={16} color="#2563eb" /> Credentials & Database Overview
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
          <div>🔑 <strong>Student Passwords:</strong> <code>student123</code></div>
          <div>🔑 <strong>Admin Passwords:</strong> <code>admin123</code></div>
          <div>💡 <strong>Flexible Login:</strong> You can enter email (<code>rohan@demo.com</code> or <code>RohanDeshmukh@demo.com</code>) OR Student PRN (<code>STU2026004</code>)!</div>
          <div>🗄️ <strong>Database:</strong> Live MySQL <code>mahadbt_db</code></div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
