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

  const login = (email, password) => {
    if (email === 'student@demo.com' && password === 'student123') {
      const studentUser = { role: 'student', id: 'STU2026001', name: 'Sharvari Bangar' };
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
