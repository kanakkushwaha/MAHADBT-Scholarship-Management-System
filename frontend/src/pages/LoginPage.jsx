import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, User } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Please check the demo credentials below.');
    }
  };

  const setDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('student@demo.com');
      setPassword('student123');
    } else {
      setEmail('admin@demo.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '8px' }}>MAHADBT Portal</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '14px' }}>Demo Prototype System</p>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button 
            className="btn" 
            style={{ flex: 1, backgroundColor: role === 'student' ? 'var(--color-primary-light)' : 'transparent', color: role === 'student' ? 'white' : 'var(--color-text)' }}
            onClick={() => setDemoCredentials('student')}
            type="button"
          >
            <User size={16} /> Student
          </button>
          <button 
            className="btn" 
            style={{ flex: 1, backgroundColor: role === 'admin' ? 'var(--color-primary-light)' : 'transparent', color: role === 'admin' ? 'white' : 'var(--color-text)' }}
            onClick={() => setDemoCredentials('admin')}
            type="button"
          >
            <Shield size={16} /> Admin
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px dashed #9ca3af' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', marginBottom: '12px' }}>DEMO CREDENTIALS</h4>
          <div style={{ fontSize: '13px', marginBottom: '8px' }}>
            <strong>Student:</strong> student@demo.com / student123
          </div>
          <div style={{ fontSize: '13px' }}>
            <strong>Admin:</strong> admin@demo.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
