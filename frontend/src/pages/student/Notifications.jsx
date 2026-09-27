import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, CheckCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);

  const myNotifications = notifications.filter(n => 
    n.userId === user?.id || 
    n.studentPrn === user?.prn || 
    n.student_prn === user?.prn || 
    n.userId === user?.prn || 
    n.userId === 'all' || 
    n.studentPrn === 'all'
  );

  const unreadCount = myNotifications.filter(n => !n.read && !n.is_read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={22} color="var(--color-success)" />;
      case 'warning': return <AlertTriangle size={22} color="var(--color-warning)" />;
      case 'error': return <XCircle size={22} color="var(--color-error)" />;
      default: return <Info size={22} color="var(--color-primary-light)" />;
    }
  };

  const handleMarkAllRead = () => {
    if (user?.prn || user?.id) {
      markAllNotificationsRead(user.prn || user.id);
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Notifications & Official Alerts</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            System updates, verification notices, and scholarship announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            className="btn btn-secondary" 
            onClick={handleMarkAllRead}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <CheckCheck size={16} /> Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {myNotifications.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Bell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          myNotifications.map(notif => {
            const isRead = notif.read || notif.is_read;
            return (
              <div 
                key={notif.id} 
                onClick={() => !isRead && markNotificationRead(notif.id)}
                style={{ 
                  padding: '18px 24px', 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: isRead ? 'transparent' : '#f8fafc',
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  cursor: isRead ? 'default' : 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  {notif.title && (
                    <div style={{ fontWeight: '600', fontSize: '14.5px', color: '#0f172a', marginBottom: '3px' }}>
                      {notif.title}
                    </div>
                  )}
                  <div style={{ fontSize: '13.5px', color: isRead ? 'var(--color-text-muted)' : '#1e293b', lineHeight: 1.4 }}>
                    {notif.message}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {new Date(notif.date).toLocaleString()}
                    </span>
                    {notif.type === 'warning' && (
                      <Link 
                        to="/student/documents" 
                        style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Go to Documents <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                </div>
                {!isRead && (
                  <div 
                    style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '8px', flexShrink: 0 }} 
                    title="Unread notification"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
