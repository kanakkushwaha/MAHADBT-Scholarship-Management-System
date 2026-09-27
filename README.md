# MAHADBT Scholarship Management and Tracking System

A full-stack web-based academic prototype for managing, tracking, and verifying MAHADBT scholarship applications, document verification, and administrative workflows. Built for the Software Engineering Modelling Language (SEML) curriculum at **Pimpri Chinchwad College of Engineering (PCCOE), Pune**.

---

## 👥 Project Team & Contributors
- **Kanak Kushwaha** (Lead Developer - Backend, MySQL Architecture & Integration)
- **Sharvari Bangar** (Frontend Prototype & UI Components)
- **Arya Navrang** (System Modelling & Testing)
- **Aayush Kate** (Requirement Engineering & Documentation)

---

## 🛠️ Full-Stack Technology Stack

- **Frontend:** React 19 (Vite), React Router DOM (HashRouter), Lucide React Icons, Recharts Analytics.
- **Backend API:** Node.js, Express.js REST API with CORS & Multer.
- **Database:** Local MySQL Server 8.0 (`mahadbt_db`) with 7 relational tables, foreign key constraints, and transactional consistency.
- **Document Processing:** Authentic PDF generation, Multer file upload/re-upload, and simulated 4-step DigiLocker verification gateway (NeGD/UIDAI workflow).

---

## 🌟 Key Features

### 🎓 Student Portal
1. **Interactive Dashboard:** Live counts of application status, document status (`X / 11 Verified`), payment status, and unread notifications fetched directly from MySQL.
2. **Official MAHADBT Document Checklist:**
   - *Permanent Documents:* Aadhaar Card, Caste Certificate, Domicile Certificate, Caste Validity, Ration Card.
   - *Yearly Documents:* Income Certificate, SPPU Marksheet, College Fee Receipt, Bonafide Certificate, Bank Passbook.
3. **DigiLocker Integration:** 4-step interactive verification wizard (Sign In -> OTP -> Consent -> DB Linkage) with authentic government PDF linkage.
4. **Real PDF Operations:** View authentic generated PDFs directly in the browser, upload/re-upload new documents from PC, and delete unwanted files.
5. **Admin Discrepancy Callouts:** Prominent red alerts detailing the exact correction remarks submitted by the scrutiny officer.
6. **Detailed Status Tracking:** Step-by-step audit trail from Submission to Approval with official timestamps.
7. **Official Acknowledgement Receipt:** Computer-generated receipt with State of Maharashtra header, simulated QR code, and print-optimized layout.

### 🛡️ Administrative Portal
1. **Real-time Analytics:** Visual KPI counters and Recharts distribution charts powered by MySQL aggregates.
2. **Applications Scrutiny:** Search by student name, ID, or PRN, with filters by department (IT, Computer, ENTC, Mechanical) and application stage.
3. **PDF Inspection & Decision Making:** Inspect students' uploaded PDFs, click **"Verify"** to mark valid, or click **"Reject / Discrepancy"** with custom correction instructions that automatically trigger student notifications.
4. **Central Verification Queue:** Global scrutiny queue across all submitted documents.
5. **Broadcast Announcements:** Broadcast notifications directly to all registered students via MySQL database.
6. **Database Diagnostics:** Live connection status monitoring MySQL 8.0 on port 3306.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | PRN / Authority |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `student123` | `STU2026001` (Sharvari Bangar, IT Dept) |
| **Student (Alt)** | `aarav@demo.com` | `student123` | `STU2026002` (Aarav Patil, CE Dept) |
| **Admin** | `admin@demo.com` | `admin123` | Chief Scrutiny & Nodal Officer (PCCOE) |

*(Clicking "Student" or "Admin" on the login page autofills these demo credentials).*

---

## 🚀 How to Run the Project Locally

### 1-Click Launch (Windows)
Double-click `Run_Project.bat` in the root directory. It verifies MySQL, starts the Node backend on port 5000, launches Vite frontend on port 5173, and opens your browser.

### Manual Setup
1. **Database Setup:**
   - Ensure MySQL Server 8.0 is running on `localhost:3306`.
   - Open MySQL Workbench and execute `backend/database/schema.sql`.
2. **Start Backend Server:**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *(Running at `http://localhost:5000`)*
3. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Running at `http://localhost:5173`)*

---

## 📄 License & Disclaimer
This project is an academic prototype developed for educational demonstration purposes at PCCOE Pune.
