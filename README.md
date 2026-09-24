# MAHADBT Scholarship Management and Automation System (Prototype)

A working local academic prototype for a B.Tech Information Technology Software Engineering assignment. This system simulates a centralized scholarship tracking system with Student and Admin roles.

**Disclaimer: This is not a production government system. It is a simulation for academic purposes.**

## Features
- **Student Dashboard:** Submit applications, upload (simulate) documents, track application lifecycle status, view notifications.
- **Admin Dashboard:** Review applications, verify documents, view reports, approve/reject applications.
- **Simulated Integrations:** Mock MAHADBT portal redirect and DigiLocker document fetch.

## Tech Stack
- **Frontend:** React (Vite)
- **Styling:** Custom CSS (Design System)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** React Context API (with mock data in-memory/localStorage)
- **Backend:** None (Mock data driven)

## Demo Login Credentials

### Student
- **Email:** `student@demo.com`
- **Password:** `student123`

### Admin
- **Email:** `admin@demo.com`
- **Password:** `admin123`

## How to Run

1. Open a terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser.

## Simulated vs Real
- **Authentication:** Uses hardcoded demo credentials. No real authentication or session management is implemented.
- **Database:** Uses mock data stored in memory/context. Data resets on hard reload (unless persisted to localStorage for the session).
- **DigiLocker:** The "Fetch from DigiLocker" feature is simulated with a delay and mock documents.
- **MAHADBT Portal:** The official portal link is a simulated redirect.
- **File Uploads:** Document uploads are simulated. No actual files are stored.
