import React, { createContext, useState, useEffect } from 'react';
import { mockApplications } from '../data/mockApplications';
import { mockDocuments } from '../data/mockDocuments';
import { mockNotifications } from '../data/mockNotifications';

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [documents, setDocuments] = useState(mockDocuments);
  const [notifications, setNotifications] = useState(mockNotifications);

  // In a real app, we'd persist to local storage or DB. 
  // For this prototype, we'll just keep it in state, which resets on reload.
  // To make it persist across hot-reloads, we could use localStorage, 
  // but state is fine for a demo session as long as we don't refresh.

  const addNotification = (notif) => {
    setNotifications(prev => [{ ...notif, id: `NOTIF${Date.now()}` }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const submitApplication = (appData) => {
    const newApp = {
      ...appData,
      id: `MH-SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Submitted",
      documentStatus: "Pending",
      paymentStatus: "Not Started",
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      adminRemarks: [],
      documents: [] // will be linked later
    };
    setApplications(prev => [newApp, ...prev]);
    addNotification({
      userId: appData.studentId,
      message: `Your application ${newApp.id} has been submitted successfully.`,
      date: new Date().toISOString(),
      read: false,
      type: "success"
    });
    return newApp.id;
  };

  const updateDocumentStatus = (docId, status, remark) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status, remark: remark || doc.remark };
      }
      return doc;
    }));
  };

  const updateApplicationStatus = (appId, status, remarkObj) => {
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
  };

  return (
    <AppDataContext.Provider value={{
      applications, setApplications,
      documents, setDocuments,
      notifications, setNotifications,
      addNotification,
      markNotificationRead,
      submitApplication,
      updateDocumentStatus,
      updateApplicationStatus
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
