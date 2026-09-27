import React, { useContext, useState } from 'react';
import { Layout } from '../../components/common/Layout';
import { AppDataContext } from '../../context/AppDataContext';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Send, CheckCircle2, Megaphone } from 'lucide-react';

const AdminNotifications = () => {
  const { notifications, addNotification } = useContext(AppDataContext);
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [toast, setToast] = useState('');

  const adminNotifs = notifications.filter(n => n.userId === 'admin' || n.userId === 'all' || n.studentPrn === 'all');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message) return;
    
    await addNotification({
      studentPrn: 'all',
      userId: 'all',
      title: title || 'Official Announcement',
      message: message,
      date: new Date().toISOString(),
      read: false,
      type: type
    });
    
    setToast('Announcement broadcasted to all enrolled students and saved to MySQL!');
    setTimeout(() => setToast(''), 4000);
    setTitle('');
    setMessage('');
  };

  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Notifications & Announcements</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Broadcast alerts and scholarship deadlines to all enrolled students.</p>
      </div>

      {toast && (
        <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Sent Announcements & System Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--color-border)' }}>
              {adminNotifs.length === 0 ? (
                <div style={{ padding: '24px', backgroundColor: 'var(--color-surface)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No notifications found.</div>
              ) : (
                adminNotifs.map(notif => (
                  <div key={notif.id} style={{ padding: '16px', backgroundColor: 'var(--color-surface)' }}>
                    {notif.title && <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a', marginBottom: '2px' }}>{notif.title}</div>}
                    <div style={{ fontSize: '13px', color: '#334155' }}>{notif.message}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {new Date(notif.date).toLocaleString()} • Recipient: {notif.userId || notif.studentPrn || 'All Students'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={18} color="var(--color-primary)" /> Broadcast Announcement
            </h3>
            <form onSubmit={handleSend}>
              <div className="form-group">
                <label className="form-label">Announcement Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Scrutiny Deadline Extended" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Broadcast Message</label>
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
                <label className="form-label">Urgency / Category</label>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="info">General Information</option>
                  <option value="warning">Important Warning / Deadline</option>
                  <option value="success">Success / Verification Update</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <Send size={16} /> Broadcast to Students
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminNotifications;
