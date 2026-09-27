-- =====================================================================
-- MAHADBT Scholarship Management and Tracking System Database Schema
-- Compatible with MySQL 8.0 & MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `mahadbt_db`;
USE `mahadbt_db`;

-- Drop existing tables in correct order if re-initializing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `acknowledgements`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `admin_remarks`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `administrators`;
DROP TABLE IF EXISTS `students`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Students Table
CREATE TABLE `students` (
  `prn` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `year` VARCHAR(50) NOT NULL,
  `academic_year` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Administrators Table
CREATE TABLE `administrators` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'Scholarship Verifier',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Applications Table
CREATE TABLE `applications` (
  `id` VARCHAR(50) PRIMARY KEY,
  `student_prn` VARCHAR(50) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `year` VARCHAR(50) NOT NULL,
  `scholarship_name` VARCHAR(150) NOT NULL,
  `academic_year` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Submitted',
  `document_status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'Not Started',
  `submitted_date` DATETIME NOT NULL,
  `last_updated` DATETIME NOT NULL,
  FOREIGN KEY (`student_prn`) REFERENCES `students`(`prn`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Documents Table (Smart Categorization: Permanent vs Yearly)
CREATE TABLE `documents` (
  `id` VARCHAR(50) PRIMARY KEY,
  `application_id` VARCHAR(50) NOT NULL,
  `student_prn` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `category` ENUM('Permanent', 'Yearly') NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `file_path` VARCHAR(255) DEFAULT NULL,
  `remark` TEXT DEFAULT NULL,
  `upload_date` DATETIME NOT NULL,
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Admin Remarks Table
CREATE TABLE `admin_remarks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `text` TEXT NOT NULL,
  `date` DATETIME NOT NULL,
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Notifications Table
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_prn` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `date` DATETIME NOT NULL,
  FOREIGN KEY (`student_prn`) REFERENCES `students`(`prn`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Acknowledgements Table
CREATE TABLE `acknowledgements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `acknowledgement_no` VARCHAR(100) UNIQUE NOT NULL,
  `application_id` VARCHAR(50) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `prn` VARCHAR(50) NOT NULL,
  `scheme` VARCHAR(150) NOT NULL,
  `submission_date` DATETIME NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SEED INITIAL DATA (Matching prototype mock data)
-- =====================================================================

-- Students
INSERT INTO `students` (`prn`, `name`, `email`, `password`, `department`, `year`, `academic_year`, `phone`) VALUES
('STU2026001', 'Sharvari Bangar', 'student@demo.com', 'student123', 'Information Technology', 'Third Year', '2025-2026', '9876543210'),
('STU2026002', 'Aarav Patil', 'aarav@demo.com', 'student123', 'Computer Engineering', 'Final Year', '2025-2026', '9876543211'),
('STU2026003', 'Ananya Kulkarni', 'ananya@demo.com', 'student123', 'ENTC', 'Second Year', '2025-2026', '9876543212'),
('STU2026004', 'Rohan Deshmukh', 'rohan@demo.com', 'student123', 'Mechanical', 'First Year', '2025-2026', '9876543213'),
('STU2026005', 'Priya Sharma', 'priya@demo.com', 'student123', 'Information Technology', 'Final Year', '2025-2026', '9876543214'),
('STU2026006', 'Vikram Singh', 'vikram@demo.com', 'student123', 'Computer Engineering', 'Second Year', '2025-2026', '9876543215');

-- Administrators
INSERT INTO `administrators` (`name`, `email`, `password`, `role`) VALUES
('Scholarship Officer', 'admin@demo.com', 'admin123', 'Chief Verifier'),
('Admin Verifier 1', 'verifier@demo.com', 'admin123', 'Document Verifier');

-- Applications
INSERT INTO `applications` (`id`, `student_prn`, `student_name`, `department`, `year`, `scholarship_name`, `academic_year`, `status`, `document_status`, `payment_status`, `submitted_date`, `last_updated`) VALUES
('MH-SCH-2026-00124', 'STU2026001', 'Sharvari Bangar', 'Information Technology', 'Third Year', 'Post-Matric Scholarship', '2025-2026', 'Under Review', 'In Progress', 'Not Started', '2026-08-15 10:00:00', '2026-08-20 14:30:00'),
('MH-SCH-2026-00125', 'STU2026002', 'Aarav Patil', 'Computer Engineering', 'Final Year', 'Post-Matric Scholarship', '2025-2026', 'Approved', 'Verified', 'Processing', '2026-07-10 11:00:00', '2026-08-22 10:15:00'),
('MH-SCH-2026-00126', 'STU2026003', 'Ananya Kulkarni', 'ENTC', 'Second Year', 'Post-Matric Scholarship', '2025-2026', 'Document Verification', 'Correction Required', 'Not Started', '2026-08-25 09:30:00', '2026-09-05 16:45:00'),
('MH-SCH-2026-00127', 'STU2026004', 'Rohan Deshmukh', 'Mechanical', 'First Year', 'EBC Concession', '2025-2026', 'Submitted', 'Pending', 'Not Started', '2026-09-10 08:20:00', '2026-09-10 08:20:00'),
('MH-SCH-2026-00128', 'STU2026005', 'Priya Sharma', 'Information Technology', 'Final Year', 'Post-Matric Scholarship', '2025-2026', 'Payment Processing', 'Verified', 'Pending', '2026-06-15 10:00:00', '2026-09-15 14:30:00'),
('MH-SCH-2026-00129', 'STU2026006', 'Vikram Singh', 'Computer Engineering', 'Second Year', 'EBC Concession', '2025-2026', 'Rejected', 'Rejected', 'Not Started', '2026-07-20 10:00:00', '2026-08-01 11:00:00');

-- Documents
INSERT INTO `documents` (`id`, `application_id`, `student_prn`, `name`, `category`, `type`, `status`, `remark`, `upload_date`) VALUES
('DOC001', 'MH-SCH-2026-00124', 'STU2026001', 'Aadhaar Card.pdf', 'Permanent', 'Aadhaar Card', 'Verified', '', '2026-08-10 10:00:00'),
('DOC002', 'MH-SCH-2026-00124', 'STU2026001', 'Income_Cert.pdf', 'Permanent', 'Income Certificate', 'Verified', '', '2026-08-11 11:00:00'),
('DOC003', 'MH-SCH-2026-00124', 'STU2026001', 'Marksheet_2ndYear.pdf', 'Yearly', 'Previous Year Marksheet', 'Pending', '', '2026-08-12 12:00:00'),
('DOC004', 'MH-SCH-2026-00124', 'STU2026001', 'Fee_Receipt_3rdYear.pdf', 'Yearly', 'Fee Receipt', 'Pending', '', '2026-08-13 13:00:00'),
('DOC005', 'MH-SCH-2026-00125', 'STU2026002', 'Aadhaar Card.pdf', 'Permanent', 'Aadhaar Card', 'Verified', '', '2026-07-05 10:00:00'),
('DOC006', 'MH-SCH-2026-00125', 'STU2026002', 'Caste_Cert.pdf', 'Permanent', 'Caste Certificate', 'Verified', '', '2026-07-05 11:00:00'),
('DOC007', 'MH-SCH-2026-00125', 'STU2026002', 'Marksheet_3rdYear.pdf', 'Yearly', 'Previous Year Marksheet', 'Verified', '', '2026-07-06 12:00:00'),
('DOC008', 'MH-SCH-2026-00125', 'STU2026002', 'Fee_Receipt_FinalYear.pdf', 'Yearly', 'Fee Receipt', 'Verified', '', '2026-07-07 13:00:00'),
('DOC009', 'MH-SCH-2026-00126', 'STU2026003', 'Aadhaar Card.pdf', 'Permanent', 'Aadhaar Card', 'Verified', '', '2026-08-20 10:00:00'),
('DOC010', 'MH-SCH-2026-00126', 'STU2026003', 'Income_Cert.pdf', 'Permanent', 'Income Certificate', 'Correction Required', 'Income certificate is blurred. Please re-upload.', '2026-08-21 11:00:00'),
('DOC011', 'MH-SCH-2026-00126', 'STU2026003', 'Marksheet_1stYear.pdf', 'Yearly', 'Previous Year Marksheet', 'Verified', '', '2026-08-22 12:00:00'),
('DOC012', 'MH-SCH-2026-00126', 'STU2026003', 'Bonafide_Cert.pdf', 'Yearly', 'Bonafide Certificate', 'Pending', '', '2026-08-23 13:00:00'),
('DOC013', 'MH-SCH-2026-00127', 'STU2026004', 'Aadhaar Card.pdf', 'Permanent', 'Aadhaar Card', 'Pending', '', '2026-09-08 10:00:00'),
('DOC014', 'MH-SCH-2026-00127', 'STU2026004', 'Domicile_Cert.pdf', 'Permanent', 'Domicile Certificate', 'Pending', '', '2026-09-08 11:00:00'),
('DOC015', 'MH-SCH-2026-00127', 'STU2026004', 'Marksheet_HSC.pdf', 'Yearly', 'Previous Year Marksheet', 'Pending', '', '2026-09-09 12:00:00'),
('DOC016', 'MH-SCH-2026-00127', 'STU2026004', 'Fee_Receipt_1stYear.pdf', 'Yearly', 'Fee Receipt', 'Pending', '', '2026-09-09 13:00:00');

-- Admin Remarks
INSERT INTO `admin_remarks` (`application_id`, `author`, `text`, `date`) VALUES
('MH-SCH-2026-00124', 'System Admin', 'Application received and preliminary checks passed.', '2026-08-18 09:00:00'),
('MH-SCH-2026-00125', 'Verifier 1', 'All documents verified.', '2026-08-20 10:00:00'),
('MH-SCH-2026-00125', 'Approver', 'Approved for payment.', '2026-08-22 10:00:00'),
('MH-SCH-2026-00126', 'Verifier 1', 'Income certificate is blurred. Please re-upload.', '2026-09-05 16:40:00');

-- Notifications
INSERT INTO `notifications` (`student_prn`, `title`, `message`, `type`, `date`) VALUES
('STU2026001', 'Document Under Review', 'Your Marksheet and Fee Receipt are being reviewed by the scholarship committee.', 'info', '2026-08-18 09:00:00'),
('STU2026003', 'Correction Required', 'Your Income Certificate is blurred. Please re-upload a clear copy before 15th Sep.', 'warning', '2026-09-05 16:45:00');

-- Acknowledgements
INSERT INTO `acknowledgements` (`acknowledgement_no`, `application_id`, `student_name`, `prn`, `scheme`, `submission_date`, `status`) VALUES
('ACK-2026-89472', 'MH-SCH-2026-00124', 'Sharvari Bangar', 'STU2026001', 'Post-Matric Scholarship', '2026-08-15 10:00:00', 'Under Review');
