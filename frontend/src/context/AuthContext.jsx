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

    // Fail-safe fallback if backend is not running
    if (email === 'student@demo.com' && password === 'student123') {
      const studentUser = { role: 'student', id: 'STU2026001', prn: 'STU2026001', name: 'Sharvari Bangar' };
      setUser(studentUser);
      localStorage.setItem('mahadbt_demo_user', JSON.stringify(studentUser));
      return true;
    } else if (email === 'admin@demo.com' && password === 'admin123') {
      const adminUser = { role: 'admin', id: 'admin', name: 'System Admin' };
      setUser(adminUser);
      localStorage.setItem('mahadbt_demo_user', JSON.stringify(adminUser));
      return true;
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
