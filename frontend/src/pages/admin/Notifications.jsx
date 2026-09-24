import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Send } from 'lucide-react';

const AdminNotifications = () => {
  const { notifications, addNotification } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  const adminNotifs = notifications.filter(n => n.userId === 'admin' || n.userId === 'all');

  const handleSend = (e) => {
    e.preventDefault();
    if (!message) return;
    
    addNotification({
      userId: 'all',
      message: message,
      date: new Date().toISOString(),
      read: false,
      type: type
    });
    
    // Also add to admin's own view as a record
    addNotification({
      userId: 'admin',
      message: `Broadcast Sent: ${message}`,
      date: new Date().toISOString(),
      read: true,
      type: 'success'
    });
    
    setMessage('');
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Notifications & Announcements</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>System Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--color-border)' }}>
              {adminNotifs.length === 0 ? (
                <div style={{ padding: '24px', backgroundColor: 'var(--color-surface)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No notifications found.</div>
              ) : (
                adminNotifs.map(notif => (
                  <div key={notif.id} style={{ padding: '16px', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ fontWeight: '500' }}>{notif.message}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {new Date(notif.date).toLocaleString()} • {notif.type}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Send Announcement</h3>
            <form onSubmit={handleSend}>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message to broadcast to all students..."
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <Send size={16} /> Broadcast Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminNotifications;
