# MAHADBT Scholarship Management and Tracking System

A full-stack web application designed for the college scholarship section to track, verify, and manage internal scholarship workflows, integrated with **MySQL Server / MySQL Workbench**.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), React Router DOM, Lucide Icons, Recharts, Context API
- **Backend API:** Node.js, Express.js, Multer (file uploads), MySQL2
- **Database:** MySQL Server 8.0 (Database name: `mahadbt_db`)
- **Database Management Tool:** MySQL Workbench 8.0 CE

---

## 🛠️ How to Run in VS Code

### Method 1: One-Click Launch (Easiest)
Simply double click the **`start_all.bat`** file in the root folder. It will automatically start both the backend and frontend in separate windows!

### Method 2: From VS Code Terminals
Open the project folder (`Desktop\seml`) in VS Code.

1. **Terminal 1 (Backend):**
   ```bash
   cd backend
   node server.js
   ```
   *Runs on:* `http://localhost:5000`

2. **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs on:* `http://localhost:5173` (Open in browser)

---

## 🗄️ How to View & Manage Database in MySQL Workbench

1. Open **MySQL Workbench**.
2. Click on your local MySQL connection (usually `Local instance MySQL80` or `localhost:3306`).
3. In the left sidebar under **Schemas**, look for **`mahadbt_db`**.
4. You will see all 7 tables created:
   - `students`
   - `administrators`
   - `applications`
   - `documents` (Smart categorization: Permanent vs Yearly)
   - `admin_remarks`
   - `notifications`
   - `acknowledgements`
5. Right-click on any table (e.g. `applications`) and select **Select Rows - Limit 1000** to view live records.
6. Whenever you submit an application, verify a document, or change status in the web portal, you will see the changes instantly updated in MySQL Workbench!

> *Note:* The full SQL schema and seed data is located at `backend/database/schema.sql`.

---

## 🔑 Demo Credentials

### Student Login
- **Email:** `student@demo.com`
- **Password:** `student123`
- *Features:* View Dashboard, Submit Application, Upload Documents, Fetch from DigiLocker (simulated with real DB persistence), Track Application Timeline, Download Acknowledgement Receipt.

### Admin Login
- **Email:** `admin@demo.com`
- **Password:** `admin123`
- *Features:* Admin Dashboard Analytics (Recharts), Search by PRN/Name, Filter by Department & Academic Year, Document Verification (Approve / Correction Required / Reject with remarks), Application Approval/Rejection, Notification Alerts.

---

## 📁 Project Directory Structure

```
seml/
  ├── backend/
  │   ├── database/
  │   │   ├── db.js             # MySQL connection pool
  │   │   └── schema.sql        # Database schema for MySQL Workbench
  │   ├── uploads/              # Uploaded document files
  │   ├── .env                  # Port & MySQL connection config
  │   ├── package.json
  │   └── server.js             # Express REST API (Auth, Apps, Docs, Remarks, Stats)
  │
  ├── frontend/
  │   ├── src/
  │   │   ├── components/       # UI Components & Layouts
  │   │   ├── context/          # AppDataContext (Live API sync) & AuthContext
  │   │   ├── pages/
  │   │   │   ├── admin/        # Admin Dashboard, Applications, Document Verification
  │   │   │   ├── student/      # Student Dashboard, Form, Docs, Track, Acknowledgement
  │   │   │   └── LoginPage.jsx
  │   │   └── main.jsx
  │   └── package.json
  │
  ├── start_all.bat             # 1-click launcher for Windows
  └── README_GUIDE.md           # This guide
```
