import React, { createContext, useState, useEffect } from 'react';
import { mockApplications } from '../data/mockApplications';
import { mockDocuments } from '../data/mockDocuments';
import { mockNotifications } from '../data/mockNotifications';

export const AppDataContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const AppDataProvider = ({ children }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [documents, setDocuments] = useState(mockDocuments);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch initial live data from MySQL via Express backend
  const fetchAllData = async () => {
    try {
      const [appsRes, docsRes, notifsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/applications`),
        fetch(`${API_BASE_URL}/documents`),
        fetch(`${API_BASE_URL}/notifications`)
      ]);

      if (appsRes.ok && docsRes.ok) {
        const appsData = await appsRes.json();
        const docsData = await docsRes.json();
        setApplications(appsData);
        setDocuments(docsData);
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(notifsData);
        }
        setIsBackendConnected(true);
        console.log(' Live MySQL data loaded successfully from backend');
      }
    } catch (err) {
      console.warn('Backend not responding yet, using local mock data:', err.message);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addNotification = async (notif) => {
    const tempId = notif.id || `NOTIF${Date.now()}`;
    setNotifications(prev => [{ ...notif, id: tempId }, ...prev]);
    try {
      await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
    } catch (err) {
      console.warn('Notification sync error:', err.message);
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, is_read: true } : n));
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PUT' });
    } catch (err) {
      console.warn('Mark read error:', err.message);
    }
  };

  const markAllNotificationsRead = async (studentPrn) => {
    setNotifications(prev => prev.map(n => (n.studentPrn === studentPrn || n.userId === studentPrn) ? { ...n, read: true, is_read: true } : n));
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all/${studentPrn}`, { method: 'PUT' });
    } catch (err) {
      console.warn('Mark all read error:', err.message);
    }
  };

  // Submit Application with live MySQL persistence
  const submitApplication = async (appData) => {
    const tempId = `MH-SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      ...appData,
      id: tempId,
      status: "Submitted",
      documentStatus: "Pending",
      paymentStatus: "Not Started",
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      adminRemarks: [],
      documents: []
    };

    // Optimistic UI update
    setApplications(prev => [newApp, ...prev]);
    addNotification({
      userId: appData.studentId,
      message: `Your application ${newApp.id} has been submitted successfully.`,
      date: new Date().toISOString(),
      read: false,
      type: "success"
    });

    // Send to MySQL backend
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          setApplications(prev => prev.map(a => a.id === tempId ? data.application : a));
          return data.application.id;
        }
      }
    } catch (err) {
      console.warn('Could not persist to MySQL backend, saved in memory:', err.message);
    }

    return tempId;
  };

  // Verify/update document status with live MySQL persistence
  const updateDocumentStatus = async (docId, status, remark) => {
    // Optimistic local state update
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status, remark: remark !== undefined ? remark : doc.remark };
      }
      return doc;
    }));

    // Send to MySQL backend
    try {
      await fetch(`${API_BASE_URL}/documents/${docId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remark: remark || '' })
      });
    } catch (err) {
      console.warn('Document update MySQL sync error:', err.message);
    }
  };

  // Update application status & remarks with live MySQL persistence
  const updateApplicationStatus = async (appId, status, remarkObj) => {
    // Optimistic local state update
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedApp = { 
          ...app, 
          status, 
          lastUpdated: new Date().toISOString() 
        };
        if (remarkObj) {
          updatedApp.adminRemarks = [...app.adminRemarks, remarkObj];
        }
        if (status === "Approved") {
          updatedApp.paymentStatus = "Pending";
        }
        return updatedApp;
      }
      return app;
    }));

    // Send to MySQL backend
    try {
      await fetch(`${API_BASE_URL}/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          remark: remarkObj?.text || '',
          author: remarkObj?.author || 'Scholarship Admin'
        })
      });
    } catch (err) {
      console.warn('Application status MySQL sync error:', err.message);
    }
  };

  // Fetch verified documents from DigiLocker API & save into MySQL
  const fetchDigiLockerDocs = async (studentPrn, appId, selectedTypes, aadhaarNo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/digilocker-fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentPrn, applicationId: appId, selectedTypes, aadhaarNo })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          setDocuments(prev => {
            const updatedIds = data.documents.map(d => d.id);
            const untouched = prev.filter(d => !updatedIds.includes(d.id));
            return [...data.documents, ...untouched];
          });
        }
        return true;
      }
    } catch (err) {
      console.warn('DigiLocker MySQL sync error:', err.message);
    }
    return false;
  };

  // Upload document file (Multer + MySQL)
  const uploadDocument = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const newDoc = await res.json();
        setDocuments(prev => {
          const index = prev.findIndex(d => d.id === newDoc.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = newDoc;
            return updated;
          }
          return [newDoc, ...prev];
        });
        return newDoc;
      }
    } catch (err) {
      console.error('Upload document error:', err);
    }
    return null;
  };

  // Delete document (MySQL + State)
  const deleteDocument = async (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    try {
      await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Delete document error:', err);
    }
  };

  return (
    <AppDataContext.Provider value={{
      applications, setApplications,
      documents, setDocuments,
      notifications, setNotifications,
      isBackendConnected,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      submitApplication,
      updateDocumentStatus,
      updateApplicationStatus,
      fetchDigiLockerDocs,
      uploadDocument,
      deleteDocument,
      refreshData: fetchAllData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
