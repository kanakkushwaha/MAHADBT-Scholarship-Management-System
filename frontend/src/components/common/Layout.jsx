import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppDataContext } from '../../context/AppDataContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, FileText, FileBadge, Activity, Bell, HelpCircle, 
  ExternalLink, Menu, LogOut, X, PieChart, CheckSquare, Settings,
  Shield, GraduationCap, Award, Users
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { user, login, logout } = useContext(AuthContext);
  const { notifications } = useContext(AppDataContext);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => {
    const isUnread = !n.read && !n.is_read;
    if (!isUnread) return false;
    if (user?.role === 'admin') {
      return n.userId === 'admin' || n.studentPrn === 'all' || n.student_prn === 'all';
    }
    return n.userId === user?.id || n.studentPrn === user?.prn || n.student_prn === user?.prn || n.userId === 'all';
  }).length;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <Home size={18} /> },
    { name: 'My Application', path: '/student/application', icon: <FileText size={18} /> },
    { name: 'Documents', path: '/student/documents', icon: <FileBadge size={18} /> },
    { name: 'Track Status', path: '/student/track', icon: <Activity size={18} /> },
    { name: 'Notifications', path: '/student/notifications', icon: <Bell size={18} />, badge: unreadCount },
    { name: 'Help & FAQ', path: '/student/help', icon: <HelpCircle size={18} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <PieChart size={18} /> },
    { name: 'Applications', path: '/admin/applications', icon: <FileText size={18} /> },
    { name: 'Verification Queue', path: '/admin/verification', icon: <CheckSquare size={18} /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} />, badge: unreadCount },
    { name: 'System Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const links = user?.role === 'student' ? studentLinks : adminLinks;

  const [mahadbtModal, setMahadbtModal] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);

  const SWITCH_STUDENTS = [
    { prn: 'STU2026001', name: 'Sharvari Bangar', email: 'student@demo.com', status: 'Under Review', statusBg: '#fef3c7', statusColor: '#d97706', dept: 'IT (3rd Yr)' },
    { prn: 'STU2026004', name: 'Rohan Deshmukh', email: 'rohan@demo.com', status: 'Submitted', statusBg: '#dbeafe', statusColor: '#2563eb', dept: 'Mech (1st Yr)' },
    { prn: 'STU2026003', name: 'Ananya Kulkarni', email: 'ananya@demo.com', status: 'Correction Required', statusBg: '#fee2e2', statusColor: '#dc2626', dept: 'ENTC (2nd Yr)' },
    { prn: 'STU2026002', name: 'Aarav Patil', email: 'aarav@demo.com', status: 'Approved', statusBg: '#dcfce7', statusColor: '#16a34a', dept: 'Comp (Final Yr)' },
    { prn: 'STU2026005', name: 'Priya Sharma', email: 'priya@demo.com', status: 'Payment Processing', statusBg: '#f3e8ff', statusColor: '#9333ea', dept: 'IT (Final Yr)' },
    { prn: 'STU2026006', name: 'Vikram Singh', email: 'vikram@demo.com', status: 'Rejected', statusBg: '#f3f4f6', statusColor: '#4b5563', dept: 'Comp (2nd Yr)' }
  ];

  const SWITCH_ADMINS = [
    { name: 'Scholarship Officer', email: 'admin@demo.com', role: 'Chief Verifier' },
    { name: 'Admin Verifier 1', email: 'verifier@demo.com', role: 'Document Verifier' }
  ];

  const handleSwitchUser = async (targetEmail, pass, targetRole) => {
    await login(targetEmail, pass);
    setSwitchModal(false);
    navigate(targetRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff', // clean white background
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0,
        left: sidebarOpen ? 0 : '-260px',
        transition: 'left 0.25s ease-in-out',
        zIndex: 100,
        borderRight: '1px solid #e2e8f0',
        boxShadow: '2px 0 10px rgba(0,0,0,0.03)'
      }}>
        {/* Brand Header */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '8px', 
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37,99,235,0.25)'
            }}>
              <Award size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0, letterSpacing: '0.5px' }}>MAHADBT</h2>
              <div style={{ fontSize: '11px', color: '#64748b' }}>PCCOE Portal • 2025-26</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Card inside Sidebar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#2563eb', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold', fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                {user?.role === 'admin' ? (
                  <><Shield size={11} color="#7c3aed" /> Administrator</>
                ) : (
                  <><GraduationCap size={11} color="#2563eb" /> PRN: {user?.prn || user?.id || 'STU2026001'}</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '14px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map(link => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '8px',
                  color: isActive ? '#ffffff' : '#475569',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => { if (isMobile) setSidebarOpen(false); }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {link.icon}
                  <span>{link.name}</span>
                </div>
                {link.badge > 0 && (
                  <span style={{ 
                    backgroundColor: isActive ? '#ffffff' : '#ef4444', 
                    color: isActive ? '#2563eb' : '#ffffff', 
                    borderRadius: '999px', 
                    padding: '2px 7px', 
                    fontSize: '11px', 
                    fontWeight: 'bold' 
                  }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {user?.role === 'student' && (
            <button 
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                color: '#475569', backgroundColor: 'transparent', border: 'none', width: '100%',
                textAlign: 'left', cursor: 'pointer', fontSize: '13.5px', borderRadius: '8px',
                marginTop: '8px', transition: 'background-color 0.15s ease'
              }}
              onClick={() => { setMahadbtModal(true); if (isMobile) setSidebarOpen(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ExternalLink size={18} /> Official MahaDBT
            </button>
          )}
        </div>

        {/* Bottom Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              color: '#dc2626', background: 'transparent', border: 'none', 
              cursor: 'pointer', fontSize: '13px', fontWeight: '600', width: '100%', padding: '6px 0'
            }}
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: (!isMobile && sidebarOpen) ? '260px' : 0, 
        transition: 'margin-left 0.25s ease-in-out',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar Header */}
        <header style={{ 
          height: '62px', 
          backgroundColor: 'var(--color-surface)', 
          borderBottom: '1px solid var(--color-border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 24px', 
          position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: 'var(--color-text)' }}
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              {links.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* Notifications Bell */}
            <div 
              style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}
              onClick={() => navigate(`/${user?.role}/notifications`)}
              title="View notifications"
            >
              <Bell size={20} style={{ color: unreadCount > 0 ? '#2563eb' : 'var(--color-text-muted)' }} />
              {unreadCount > 0 && (
                <div style={{ 
                  position: 'absolute', top: 2, right: 2, 
                  background: '#ef4444', color: 'white', 
                  borderRadius: '50%', width: '16px', height: '16px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '10px', fontWeight: 'bold' 
                }}>
                  {unreadCount}
                </div>
              )}
            </div>

            {/* Switch User Quick Action */}
            <button 
              onClick={() => setSwitchModal(true)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                backgroundColor: '#eff6ff', color: '#1d4ed8', 
                border: '1px solid #bfdbfe', borderRadius: '8px', 
                padding: '6px 12px', fontSize: '12px', fontWeight: '600', 
                cursor: 'pointer', transition: 'all 0.2s' 
              }}
              title="Quickly switch between students or admins"
            >
              <Users size={14} />
              <span>Switch User</span>
            </button>

            {/* User Info Capsule */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', 
                backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#2563eb', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', fontSize: '12px' 
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ lineHeight: '1.2' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', display: 'block' }}>{user?.name || 'User'}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {user?.role === 'admin' ? 'Officer' : (user?.department || 'Student')}
                </span>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '6px' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Official Mahadbt External Portal Modal */}
      {mahadbtModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3 style={{ marginBottom: '12px' }}>Official MAHADBT Portal Redirect</h3>
            <p style={{ marginBottom: '12px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
              You are navigating to the official Government of Maharashtra scholarship website:
            </p>
            <div style={{ padding: '10px 14px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
              🌐 https://mahadbt.maharashtra.gov.in
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setMahadbtModal(false)}>Cancel</button>
              <a 
                href="https://mahadbt.maharashtra.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary" 
                style={{ backgroundColor: '#2563eb' }}
                onClick={() => setMahadbtModal(false)}
              >
                Proceed to MahaDBT
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Switch Demo User Modal */}
      {switchModal && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>Switch Demo Account</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Select any student or officer to instantly switch context and test their portal state:
                </p>
              </div>
              <button 
                onClick={() => setSwitchModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#475569', marginBottom: '10px' }}>
                Students ({SWITCH_STUDENTS.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {SWITCH_STUDENTS.map(s => {
                  const isCurrent = user?.prn === s.prn || user?.id === s.prn || user?.email === s.email;
                  return (
                    <div 
                      key={s.prn}
                      onClick={() => handleSwitchUser(s.email, 'student123', 'student')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isCurrent ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: isCurrent ? '#f0f7ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{s.name}</div>
                        <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '8px', background: s.statusBg, color: s.statusColor, fontWeight: '600' }}>
                          {s.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{s.dept}</span>
                        <code style={{ fontSize: '10px' }}>{s.prn}</code>
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>✓ Currently Active</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#475569', marginBottom: '10px' }}>
                Administrative Officers (2)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {SWITCH_ADMINS.map(a => {
                  const isCurrent = user?.role === 'admin' && (user?.email === a.email || user?.name === a.name);
                  return (
                    <div 
                      key={a.email}
                      onClick={() => handleSwitchUser(a.email, 'admin123', 'admin')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isCurrent ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                        backgroundColor: isCurrent ? '#faf5ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{a.role}</div>
                      </div>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#f3e8ff', color: '#7c3aed', fontWeight: '600' }}>
                        {isCurrent ? 'Active' : 'Switch'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSwitchModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
