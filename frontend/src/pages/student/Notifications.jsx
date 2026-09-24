import React, { useContext } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

const Notifications = () => {
  const { notifications, markNotificationRead } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);

  const myNotifications = notifications.filter(n => n.userId === user.id || n.userId === 'all');

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="var(--color-success)" />;
      case 'warning': return <AlertTriangle size={20} color="var(--color-warning)" />;
      case 'error': return <XCircle size={20} color="var(--color-error)" />;
      default: return <Info size={20} color="var(--color-primary-light)" />;
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Notifications</h2>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {myNotifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No notifications.</div>
        ) : (
          myNotifications.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => !notif.read && markNotificationRead(notif.id)}
              style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: notif.read ? 'transparent' : 'var(--color-bg)',
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                cursor: notif.read ? 'default' : 'pointer'
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: notif.read ? 'normal' : '600' }}>{notif.message}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {new Date(notif.date).toLocaleString()}
                </div>
              </div>
              {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
