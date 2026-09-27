import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, User, GraduationCap, ArrowRight, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both identifier and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please verify your username and password.');
      }
    } catch (err) {
      setError('Login failed: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newRole) => {
    setRole(newRole);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f5f9', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '24px 16px' 
    }}>
      {/* Central Login Card Container */}
      <div style={{ maxWidth: '440px', width: '100%' }}>
        
        {/* Top Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            marginBottom: '12px'
          }}>
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
            MAHADBT Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Scholarship Management & Tracking System
          </p>
        </div>

        {/* Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          padding: '32px 28px', 
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
          border: '1px solid #e2e8f0'
        }}>
          
          {/* Tab Selector */}
          <div style={{ display: 'flex', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
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
                boxShadow: role === 'student' ? '0 2px 6px rgba(37,99,235,0.25)' : 'none'
              }}
            >
              <User size={16} /> Student Portal
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
                boxShadow: role === 'admin' ? '0 2px 6px rgba(124,58,237,0.25)' : 'none'
              }}
            >
              <Shield size={16} /> Officer / Admin
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
              {role === 'student' ? 'Student Sign In' : 'Administrative Login'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              {role === 'student' 
                ? 'Enter your registered Email or Student PRN' 
                : 'Enter your verification officer credentials'}
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: '12px 14px', 
              backgroundColor: '#fef2f2', 
              color: '#991b1b', 
              borderRadius: '8px', 
              marginBottom: '18px', 
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #fee2e2'
            }}>
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                {role === 'student' ? 'Email or PRN' : 'Officer Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Mail size={16} />
                </span>
                <input 
                  type="text" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. rohan@demo.com or STU2026004' : 'admin@demo.com'}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px 10px 38px', 
                    fontSize: '14px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#ffffff'
                  }}
                  onFocus={e => e.target.style.borderColor = role === 'student' ? '#2563eb' : '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px 40px 10px 38px', 
                    fontSize: '14px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: '#ffffff'
                  }}
                  onFocus={e => e.target.style.borderColor = role === 'student' ? '#2563eb' : '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '11px', 
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
                boxShadow: role === 'student' ? '0 2px 8px rgba(37,99,235,0.25)' : '0 2px 8px rgba(124,58,237,0.25)',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Authenticating...' : `Sign in to ${role === 'student' ? 'Student' : 'Admin'} Portal`}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

        </div>

        {/* Minimal Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
          Government of Maharashtra • MahaDBT Scholarship System
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
