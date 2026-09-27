import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mahadbt_demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('mahadbt_demo_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.warn('Backend login connection error, using fallback:', err.message);
    }

    // Fail-safe fallback if backend is offline or network fails
    const cleanId = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();
    const rawHandle = cleanId.replace(/@.*$/, '').replace(/[\s._-]/g, '');

    const fallbackStudents = [
      { id: 'STU2026001', prn: 'STU2026001', name: 'Sharvari Bangar', email: 'student@demo.com', department: 'Information Technology', year: 'Third Year', academicYear: '2025-2026', phone: '9876543210', role: 'student' },
      { id: 'STU2026002', prn: 'STU2026002', name: 'Aarav Patil', email: 'aarav@demo.com', department: 'Computer Engineering', year: 'Final Year', academicYear: '2025-2026', phone: '9876543211', role: 'student' },
      { id: 'STU2026003', prn: 'STU2026003', name: 'Ananya Kulkarni', email: 'ananya@demo.com', department: 'ENTC', year: 'Second Year', academicYear: '2025-2026', phone: '9876543212', role: 'student' },
      { id: 'STU2026004', prn: 'STU2026004', name: 'Rohan Deshmukh', email: 'rohan@demo.com', department: 'Mechanical', year: 'First Year', academicYear: '2025-2026', phone: '9876543213', role: 'student' },
      { id: 'STU2026005', prn: 'STU2026005', name: 'Priya Sharma', email: 'priya@demo.com', department: 'Information Technology', year: 'Final Year', academicYear: '2025-2026', phone: '9876543214', role: 'student' },
      { id: 'STU2026006', prn: 'STU2026006', name: 'Vikram Singh', email: 'vikram@demo.com', department: 'Computer Engineering', year: 'Second Year', academicYear: '2025-2026', phone: '9876543215', role: 'student' }
    ];

    if (cleanPass === 'student123') {
      const match = fallbackStudents.find(s => 
        s.email.toLowerCase() === cleanId ||
        s.prn.toLowerCase() === cleanId ||
        s.name.toLowerCase().replace(/\s+/g, '') === rawHandle ||
        s.name.toLowerCase().split(' ')[0] === rawHandle ||
        s.email.split('@')[0] === rawHandle
      );
      if (match) {
        setUser(match);
        localStorage.setItem('mahadbt_demo_user', JSON.stringify(match));
        return true;
      }
    }

    const fallbackAdmins = [
      { id: 'admin', name: 'Scholarship Officer', email: 'admin@demo.com', role: 'admin' },
      { id: 'verifier', name: 'Admin Verifier 1', email: 'verifier@demo.com', role: 'admin' }
    ];

    if (cleanPass === 'admin123') {
      const match = fallbackAdmins.find(a => 
        a.email.toLowerCase() === cleanId ||
        a.id.toLowerCase() === cleanId ||
        a.name.toLowerCase().replace(/\s+/g, '').includes(rawHandle) ||
        rawHandle.includes('admin') ||
        rawHandle.includes('verifier')
      );
      if (match) {
        setUser(match);
        localStorage.setItem('mahadbt_demo_user', JSON.stringify(match));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mahadbt_demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
