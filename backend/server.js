import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// =====================================================================
// AUTH ROUTES
// =====================================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Check Student Table
    const [students] = await pool.query(
      'SELECT * FROM students WHERE email = ? AND password = ?',
      [email, password]
    );

    if (students.length > 0) {
      const student = students[0];
      return res.json({
        user: {
          id: student.prn,
          prn: student.prn,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          academicYear: student.academic_year,
          phone: student.phone,
          role: 'student'
        }
      });
    }

    // 2. Check Administrator Table
    const [admins] = await pool.query(
      'SELECT * FROM administrators WHERE email = ? AND password = ?',
      [email, password]
    );

    if (admins.length > 0) {
      const admin = admins[0];
      return res.json({
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'admin'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error during authentication' });
  }
});

// =====================================================================
// APPLICATIONS ROUTES
// =====================================================================

// Helper to assemble full application object (with docs & remarks)
async function getFullApplication(appRow) {
  const [remarks] = await pool.query(
    'SELECT author, text, date FROM admin_remarks WHERE application_id = ? ORDER BY date ASC',
    [appRow.id]
  );
  const [docRows] = await pool.query(
    'SELECT id FROM documents WHERE application_id = ?',
    [appRow.id]
  );

  return {
    id: appRow.id,
    studentId: appRow.student_prn,
    studentName: appRow.student_name,
    department: appRow.department,
    year: appRow.year,
    scholarshipName: appRow.scholarship_name,
    academicYear: appRow.academic_year,
    status: appRow.status,
    documentStatus: appRow.document_status,
    paymentStatus: appRow.payment_status,
    submittedDate: appRow.submitted_date,
    lastUpdated: appRow.last_updated,
    adminRemarks: remarks.map(r => ({ author: r.author, text: r.text, date: r.date })),
    documents: docRows.map(d => d.id)
  };
}

// GET /api/applications - List all applications
app.get('/api/applications', async (req, res) => {
  try {
    const [apps] = await pool.query('SELECT * FROM applications ORDER BY submitted_date DESC');
    const result = await Promise.all(apps.map(getFullApplication));
    res.json(result);
  } catch (err) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET /api/applications/:id - Single application
app.get('/api/applications/:id', async (req, res) => {
  try {
    const [apps] = await pool.query('SELECT * FROM applications WHERE id = ?', [req.params.id]);
    if (apps.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    const fullApp = await getFullApplication(apps[0]);
    res.json(fullApp);
  } catch (err) {
    console.error('Fetch single application error:', err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// GET /api/applications/student/:prn - Applications for a student
app.get('/api/applications/student/:prn', async (req, res) => {
  try {
    const [apps] = await pool.query('SELECT * FROM applications WHERE student_prn = ?', [req.params.prn]);
    const result = await Promise.all(apps.map(getFullApplication));
    res.json(result);
  } catch (err) {
    console.error('Fetch student applications error:', err);
    res.status(500).json({ error: 'Failed to fetch student applications' });
  }
});

// POST /api/applications - Submit new application
app.post('/api/applications', async (req, res) => {
  const {
    studentId,
    studentName,
    department,
    year,
    scholarshipName,
    academicYear,
    documentIds
  } = req.body;

  try {
    // Generate Application ID: MH-SCH-2026-XXXXX
    const [countResult] = await pool.query('SELECT COUNT(*) as cnt FROM applications');
    const nextNum = 124 + countResult[0].cnt;
    const appId = `MH-SCH-2026-00${nextNum}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await pool.query(
      `INSERT INTO applications 
       (id, student_prn, student_name, department, year, scholarship_name, academic_year, status, document_status, payment_status, submitted_date, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Submitted', 'Pending', 'Not Started', ?, ?)`,
      [appId, studentId, studentName, department, year, scholarshipName || 'Post-Matric Scholarship', academicYear || '2025-2026', now, now]
    );

    // Link any existing or passed documents to this application
    if (Array.isArray(documentIds) && documentIds.length > 0) {
      for (const docId of documentIds) {
        await pool.query('UPDATE documents SET application_id = ? WHERE id = ?', [appId, docId]);
      }
    }

    // Auto-generate Acknowledgement Receipt
    const ackNo = `ACK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    await pool.query(
      `INSERT INTO acknowledgements (acknowledgement_no, application_id, student_name, prn, scheme, submission_date, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Submitted')`,
      [ackNo, appId, studentName, studentId, scholarshipName || 'Post-Matric Scholarship', now]
    );

    // Create a Notification for the student
    await pool.query(
      `INSERT INTO notifications (student_prn, title, message, type, date)
       VALUES (?, 'Application Submitted Successfully', ?, 'success', ?)`,
      [studentId, `Your scholarship application ${appId} has been successfully submitted and is queued for verification.`, now]
    );

    // Return the newly created application
    const [created] = await pool.query('SELECT * FROM applications WHERE id = ?', [appId]);
    const fullApp = await getFullApplication(created[0]);
    res.status(201).json({ application: fullApp, acknowledgementNo: ackNo });
  } catch (err) {
    console.error('Submit application error:', err);
    res.status(500).json({ error: 'Failed to submit application: ' + err.message });
  }
});

// PUT /api/applications/:id/status - Update application status & remarks
app.put('/api/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, documentStatus, paymentStatus, remark, author } = req.body;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const updates = [];
    const params = [];

    if (status) { updates.push('status = ?'); params.push(status); }
    if (documentStatus) { updates.push('document_status = ?'); params.push(documentStatus); }
    if (paymentStatus) { updates.push('payment_status = ?'); params.push(paymentStatus); }
    updates.push('last_updated = ?');
    params.push(now);

    params.push(id);
    await pool.query(`UPDATE applications SET ${updates.join(', ')} WHERE id = ?`, params);

    // Add remark if given
    if (remark && remark.trim()) {
      await pool.query(
        'INSERT INTO admin_remarks (application_id, author, text, date) VALUES (?, ?, ?, ?)',
        [id, author || 'Scholarship Admin', remark.trim(), now]
      );
    }

    // Notify student about status change
    const [appRows] = await pool.query('SELECT student_prn, scholarship_name FROM applications WHERE id = ?', [id]);
    if (appRows.length > 0) {
      const studentPrn = appRows[0].student_prn;
      let notifTitle = `Application Status Updated: ${status || 'In Review'}`;
      let notifMsg = `Your application (${id}) status is now "${status}".`;
      let notifType = status === 'Approved' ? 'success' : (status === 'Rejected' ? 'error' : 'info');

      if (remark) {
        notifMsg += ` Admin remark: "${remark}"`;
      }
      await pool.query(
        'INSERT INTO notifications (student_prn, title, message, type, date) VALUES (?, ?, ?, ?, ?)',
        [studentPrn, notifTitle, notifMsg, notifType, now]
      );
    }

    const [updated] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    const fullApp = await getFullApplication(updated[0]);
    res.json(fullApp);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// POST /api/applications/:id/remarks - Add admin remark
app.post('/api/applications/:id/remarks', async (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (!text) {
    return res.status(400).json({ error: 'Remark text is required' });
  }

  try {
    await pool.query(
      'INSERT INTO admin_remarks (application_id, author, text, date) VALUES (?, ?, ?, ?)',
      [id, author || 'Scholarship Officer', text, now]
    );

    const [remarks] = await pool.query(
      'SELECT author, text, date FROM admin_remarks WHERE application_id = ? ORDER BY date ASC',
      [id]
    );
    res.json(remarks);
  } catch (err) {
    console.error('Add remark error:', err);
    res.status(500).json({ error: 'Failed to add remark' });
  }
});

// =====================================================================
// DOCUMENTS ROUTES
// =====================================================================

// Helper to normalize document fields for both camelCase and snake_case
function formatDocument(doc) {
  return {
    id: doc.id,
    applicationId: doc.application_id,
    application_id: doc.application_id,
    studentId: doc.student_prn,
    student_prn: doc.student_prn,
    name: doc.name,
    category: doc.category,
    type: doc.type,
    status: doc.status,
    filePath: doc.file_path,
    file_path: doc.file_path,
    remark: doc.remark || '',
    uploadDate: doc.upload_date,
    upload_date: doc.upload_date
  };
}

// GET /api/documents - Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const [docs] = await pool.query('SELECT * FROM documents ORDER BY upload_date DESC');
    res.json(docs.map(formatDocument));
  } catch (err) {
    console.error('Fetch documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/application/:appId
app.get('/api/documents/application/:appId', async (req, res) => {
  try {
    const [docs] = await pool.query('SELECT * FROM documents WHERE application_id = ?', [req.params.appId]);
    res.json(docs.map(formatDocument));
  } catch (err) {
    console.error('Fetch app docs error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/student/:prn
app.get('/api/documents/student/:prn', async (req, res) => {
  try {
    const [docs] = await pool.query('SELECT * FROM documents WHERE student_prn = ?', [req.params.prn]);
    res.json(docs.map(formatDocument));
  } catch (err) {
    console.error('Fetch student docs error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// PUT /api/documents/:id/verify - Verify or request correction
app.put('/api/documents/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body;

  try {
    await pool.query(
      'UPDATE documents SET status = ?, remark = ? WHERE id = ?',
      [status || 'Verified', remark || '', id]
    );

    // If correction required, send notification to student
    if (status === 'Correction Required') {
      const [docs] = await pool.query('SELECT student_prn, type, name FROM documents WHERE id = ?', [id]);
      if (docs.length > 0) {
        const doc = docs[0];
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await pool.query(
          `INSERT INTO notifications (student_prn, title, message, type, date)
           VALUES (?, 'Document Correction Required', ?, 'warning', ?)`,
          [doc.student_prn, `Your ${doc.type || doc.name} needs correction: ${remark || 'Please re-upload a clearer document.'}`, now]
        );
      }
    }

    const [updated] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    res.json(formatDocument(updated[0]));
  } catch (err) {
    console.error('Verify doc error:', err);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

// DELETE /api/documents/:id - Delete document
app.delete('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [docs] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (docs.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete uploaded physical file if present
    const doc = docs[0];
    if (doc.file_path && doc.file_path.startsWith('/uploads/') && !doc.file_path.includes('_Verified.pdf') && !doc.file_path.includes('_PCCOE.pdf')) {
      const filePathOnDisk = path.join(uploadsDir, path.basename(doc.file_path));
      if (fs.existsSync(filePathOnDisk)) {
        try { fs.unlinkSync(filePathOnDisk); } catch (e) {}
      }
    }

    await pool.query('DELETE FROM documents WHERE id = ?', [id]);
    res.json({ message: 'Document deleted successfully', id });
  } catch (err) {
    console.error('Delete doc error:', err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// POST /api/documents/upload - Real file upload via Multer (New or Re-upload)
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  const { docId, applicationId, studentPrn, type, category } = req.body;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    // If updating an existing document
    if (docId) {
      const [existing] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
      if (existing.length > 0) {
        const fileName = req.file ? req.file.originalname : (req.body.name || existing[0].name);
        const filePath = req.file ? `/uploads/${req.file.filename}` : existing[0].file_path;
        await pool.query(
          'UPDATE documents SET name = ?, file_path = ?, status = "Pending", remark = "Re-uploaded by student. Pending review.", upload_date = ? WHERE id = ?',
          [fileName, filePath, now, docId]
        );
        const [updated] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
        return res.json(formatDocument(updated[0]));
      }
    }

    // Creating a new document upload
    const [countResult] = await pool.query('SELECT COUNT(*) as cnt FROM documents');
    const newDocId = `DOC${100 + countResult[0].cnt + 1}`;
    const fileName = req.file ? req.file.originalname : (req.body.name || `${type}.pdf`);
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      `INSERT INTO documents (id, application_id, student_prn, name, category, type, status, file_path, remark, upload_date)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, '', ?)`,
      [newDocId, applicationId || 'MH-SCH-2026-00124', studentPrn || 'STU2026001', fileName, category || 'Yearly', type || 'Document', filePath, now]
    );

    const [newDoc] = await pool.query('SELECT * FROM documents WHERE id = ?', [newDocId]);
    res.status(201).json(formatDocument(newDoc[0]));
  } catch (err) {
    console.error('Upload document error:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// POST /api/documents/digilocker-fetch - DigiLocker simulation with real database insertion & actual PDF links
app.post('/api/documents/digilocker-fetch', async (req, res) => {
  const { studentPrn, applicationId, selectedTypes, aadhaarNo } = req.body;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const availableDocs = [
    { 
      type: 'Aadhaar Card', 
      name: 'Aadhaar_Card_Verified.pdf', 
      category: 'Permanent', 
      filePath: '/uploads/Aadhaar_Card_Verified.pdf' 
    },
    { 
      type: 'Income Certificate', 
      name: 'Income_Certificate_2025_26.pdf', 
      category: 'Permanent', 
      filePath: '/uploads/Income_Certificate_2025_26.pdf' 
    },
    { 
      type: 'Caste Certificate', 
      name: 'Caste_Certificate_Social_Justice.pdf', 
      category: 'Permanent', 
      filePath: '/uploads/Caste_Certificate_Social_Justice.pdf' 
    },
    { 
      type: 'Domicile Certificate', 
      name: 'Domicile_Certificate_Maharashtra.pdf', 
      category: 'Permanent', 
      filePath: '/uploads/Domicile_Certificate_Maharashtra.pdf' 
    }
  ];

  const docsToFetch = selectedTypes && selectedTypes.length > 0
    ? availableDocs.filter(d => selectedTypes.includes(d.type))
    : availableDocs;

  try {
    const processed = [];
    for (const doc of docsToFetch) {
      const [existing] = await pool.query(
        'SELECT * FROM documents WHERE application_id = ? AND type = ?',
        [applicationId || 'MH-SCH-2026-00124', doc.type]
      );

      const remarkText = `Digitally verified via DigiLocker (${aadhaarNo ? 'Aadhaar ending ' + aadhaarNo.slice(-4) : 'UIDAI Authenticated'})`;

      if (existing.length > 0) {
        await pool.query(
          'UPDATE documents SET name = ?, file_path = ?, status = "Verified", remark = ?, upload_date = ? WHERE id = ?',
          [doc.name, doc.filePath, remarkText, now, existing[0].id]
        );
        const [updated] = await pool.query('SELECT * FROM documents WHERE id = ?', [existing[0].id]);
        processed.push(formatDocument(updated[0]));
      } else {
        const [countResult] = await pool.query('SELECT COUNT(*) as cnt FROM documents');
        const docId = `DOC${100 + countResult[0].cnt + 1}`;
        await pool.query(
          `INSERT INTO documents (id, application_id, student_prn, name, category, type, status, file_path, remark, upload_date)
           VALUES (?, ?, ?, ?, ?, ?, 'Verified', ?, ?, ?)`,
          [docId, applicationId || 'MH-SCH-2026-00124', studentPrn || 'STU2026001', doc.name, doc.category, doc.type, doc.filePath, remarkText, now]
        );
        const [record] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
        processed.push(formatDocument(record[0]));
      }
    }

    res.json({ message: 'DigiLocker documents fetched successfully', documents: processed });
  } catch (err) {
    console.error('DigiLocker fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch from DigiLocker' });
  }
});

// =====================================================================
// NOTIFICATIONS & ACKNOWLEDGEMENTS
// =====================================================================

// GET /api/notifications - All notifications (for admin or global feed)
app.get('/api/notifications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY date DESC');
    res.json(rows.map(n => ({
      id: n.id,
      userId: n.student_prn,
      studentPrn: n.student_prn,
      title: n.title,
      message: n.message,
      type: n.type,
      read: !!n.is_read,
      is_read: !!n.is_read,
      date: n.date
    })));
  } catch (err) {
    console.error('Fetch all notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/:prn - Student specific notifications
app.get('/api/notifications/:prn', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE student_prn = ? ORDER BY date DESC',
      [req.params.prn]
    );
    res.json(rows.map(n => ({
      id: n.id,
      userId: n.student_prn,
      studentPrn: n.student_prn,
      title: n.title,
      message: n.message,
      type: n.type,
      read: !!n.is_read,
      is_read: !!n.is_read,
      date: n.date
    })));
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications - Send announcement or notification
app.post('/api/notifications', async (req, res) => {
  const { studentPrn, userId, title, message, type } = req.body;
  const target = studentPrn || userId || 'all';
  const notifTitle = title || 'Announcement';
  const notifType = type || 'info';
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    if (target === 'all') {
      const [students] = await pool.query('SELECT prn FROM students');
      for (const s of students) {
        await pool.query(
          'INSERT INTO notifications (student_prn, title, message, type, is_read, date) VALUES (?, ?, ?, ?, 0, ?)',
          [s.prn, notifTitle, message, notifType, now]
        );
      }
      return res.status(201).json({ message: `Broadcast sent to ${students.length} students` });
    } else {
      await pool.query(
        'INSERT INTO notifications (student_prn, title, message, type, is_read, date) VALUES (?, ?, ?, ?, 0, ?)',
        [target, notifTitle, message, notifType, now]
      );
      return res.status(201).json({ message: 'Notification sent successfully' });
    }
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ error: 'Failed to send notification: ' + err.message });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PUT /api/notifications/read-all/:prn - Mark all notifications as read for student
app.put('/api/notifications/read-all/:prn', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE student_prn = ?', [req.params.prn]);
    res.json({ success: true });
  } catch (err) {
    console.error('Mark all notifications read error:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// GET /api/acknowledgements/:appId
app.get('/api/acknowledgements/:appId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM acknowledgements WHERE application_id = ?',
      [req.params.appId]
    );
    if (rows.length > 0) {
      return res.json(rows[0]);
    }
    res.status(404).json({ error: 'Acknowledgement not found' });
  } catch (err) {
    console.error('Fetch acknowledgement error:', err);
    res.status(500).json({ error: 'Failed to fetch acknowledgement' });
  }
});

// =====================================================================
// ANALYTICS / STATS ROUTE
// =====================================================================

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const [totalApps] = await pool.query('SELECT COUNT(*) as count FROM applications');
    const [approved] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE status = "Approved"');
    const [rejected] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE status = "Rejected"');
    const [underReview] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE status IN ("Under Review", "Document Verification", "Submitted")');
    const [pendingDocs] = await pool.query('SELECT COUNT(*) as count FROM documents WHERE status = "Pending"');

    // Department breakdown
    const [deptCounts] = await pool.query(
      'SELECT department, COUNT(*) as count FROM applications GROUP BY department'
    );

    res.json({
      totalApplications: totalApps[0].count,
      approved: approved[0].count,
      rejected: rejected[0].count,
      underReview: underReview[0].count,
      pendingDocuments: pendingDocs[0].count,
      departments: deptCounts
    });
  } catch (err) {
    console.error('Fetch stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Serve static frontend build
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` MAHADBT Backend running live on http://localhost:${PORT}`);
  console.log(` Connected to MySQL Server database 'mahadbt_db'`);
  console.log(`=======================================================`);
});
