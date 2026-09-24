export const mockNotifications = [
  // Student Notifications (for STU2026001 - Sharvari)
  { id: "NOTIF001", userId: "STU2026001", message: "Your application MH-SCH-2026-00124 has been submitted successfully.", date: "2026-08-15T10:05:00Z", read: true, type: "success" },
  { id: "NOTIF002", userId: "STU2026001", message: "Application MH-SCH-2026-00124 has passed preliminary checks.", date: "2026-08-18T09:05:00Z", read: false, type: "info" },
  
  // Student Notifications (for STU2026002 - Aarav)
  { id: "NOTIF003", userId: "STU2026002", message: "Congratulations! Your application MH-SCH-2026-00125 has been approved.", date: "2026-08-22T10:05:00Z", read: false, type: "success" },
  
  // Student Notifications (for STU2026003 - Ananya)
  { id: "NOTIF004", userId: "STU2026003", message: "Correction required for document: Income Certificate in application MH-SCH-2026-00126.", date: "2026-09-05T16:45:00Z", read: false, type: "error" },

  // Admin Notifications
  { id: "NOTIF_ADMIN1", userId: "admin", message: "New application MH-SCH-2026-00127 submitted by Rohan Deshmukh.", date: "2026-09-10T08:25:00Z", read: false, type: "info" },
  { id: "NOTIF_ADMIN2", userId: "admin", message: "System maintenance scheduled for next weekend.", date: "2026-09-01T10:00:00Z", read: true, type: "warning" }
];
