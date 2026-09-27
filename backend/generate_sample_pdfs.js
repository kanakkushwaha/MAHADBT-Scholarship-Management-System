import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to create a clean, valid standard PDF file with custom text
function createSimplePdf(filePath, title, lines) {
  let streamContent = `BT\n/F1 18 Tf\n50 720 Td\n(${title}) Tj\nET\n`;
  streamContent += `BT\n/F1 10 Tf\n50 700 Td\n(GOVERNMENT OF MAHARASHTRA / PCCOE PIMPRI CHINCHWAD) Tj\nET\n`;
  streamContent += `BT\n/F1 10 Tf\n50 685 Td\n(Digitally Verified & Document Verification Copy - MAHADBT Portal) Tj\nET\n`;
  streamContent += `0.5 0.5 0.5 RG\n2 w\n50 675 m\n550 675 l\nS\n`; // Horizontal separator line

  let y = 640;
  lines.forEach((line) => {
    // Escape parentheses
    const safeLine = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamContent += `BT\n/F1 12 Tf\n50 ${y} Td\n(${safeLine}) Tj\nET\n`;
    y -= 25;
  });

  // Footer / Watermark
  streamContent += `0.2 0.6 0.2 RG\nBT\n/F1 11 Tf\n50 80 Td\n([VERIFIED] Digitally Signed & Authenticated via DigiLocker / MAHADBT Verifier) Tj\nET\n`;

  const streamLength = Buffer.byteLength(streamContent);

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000${(244 + 50 + streamLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${350 + streamLength}
%%EOF`;

  fs.writeFileSync(filePath, pdf);
  console.log(`Created PDF: ${path.basename(filePath)}`);
}

// 1. Aadhaar Card
createSimplePdf(
  path.join(uploadsDir, 'Aadhaar_Card_Verified.pdf'),
  'GOVERNMENT OF INDIA - UNIQUE IDENTIFICATION AUTHORITY',
  [
    'Document Type: Aadhaar Card (e-Aadhaar)',
    'Resident Name: Sharvari Bangar',
    'Aadhaar Number: XXXX-XXXX-5678',
    'Gender: Female  |  DOB: 14/05/2004',
    'Address: PCCOE Campus, Sector 26, Pradhikaran, Nigdi, Pune 411044',
    'Issuer: UIDAI Government of India',
    'Verification Status: Digitally Signed via DigiLocker API'
  ]
);

// 2. Income Certificate
createSimplePdf(
  path.join(uploadsDir, 'Income_Certificate_2025_26.pdf'),
  'MAHARASHTRA STATE - REVENUE & FOREST DEPARTMENT',
  [
    'Document Type: Tahsildar Annual Income Certificate',
    'Certificate No: REV/PUN/INC/2025/94821',
    'Beneficiary Name: Sharvari Bangar (D/o Sanjay Bangar)',
    'Annual Family Income: Rs. 1,80,000/- (One Lakh Eighty Thousand Only)',
    'Financial Year: 2025-2026',
    'Issuing Authority: Office of the Tahsildar, Haveli, Pune',
    'Eligibility: Eligible for MAHADBT Post-Matric Scholarship / EBC'
  ]
);

// 3. Caste Certificate
createSimplePdf(
  path.join(uploadsDir, 'Caste_Certificate_Social_Justice.pdf'),
  'GOVERNMENT OF MAHARASHTRA - SOCIAL JUSTICE DEPT',
  [
    'Document Type: Caste / Tribe Certificate',
    'Certificate No: SJD/MH/CAST/2022/74381',
    'Candidate Name: Sharvari Bangar',
    'Category: Other Backward Class (OBC) / Socially & Educationally Backward',
    'Issuing Officer: Sub-Divisional Officer (SDO), Pune Division',
    'DigiLocker Status: Verified from State Data Center'
  ]
);

// 4. Domicile Certificate
createSimplePdf(
  path.join(uploadsDir, 'Domicile_Certificate_Maharashtra.pdf'),
  'OFFICE OF THE DISTRICT COLLECTOR - PUNE',
  [
    'Document Type: Domicile and Nationality Certificate',
    'Certificate No: DOM/MH/PUN/2021/48912',
    'Candidate Name: Sharvari Bangar',
    'State of Domicile: Maharashtra State, India',
    'Issuing Authority: Executive Magistrate, District Pune',
    'Validity: Valid throughout academic tenure till graduation'
  ]
);

// 5. Marksheet 2nd Year
createSimplePdf(
  path.join(uploadsDir, 'Marksheet_2ndYear_Engg.pdf'),
  'SAVITRIBAI PHULE PUNE UNIVERSITY - STATEMENT OF MARKS',
  [
    'Examination: Second Year Engineering (Information Technology)',
    'Student Name: Sharvari Bangar',
    'PRN: STU2026001  |  College: PCCOE Pune (Code: 6175)',
    'SGPA Semester 3: 8.82  |  SGPA Semester 4: 9.15',
    'CGPA: 8.98  |  Result: FIRST CLASS WITH DISTINCTION',
    'Date of Declaration: 12/07/2025'
  ]
);

// 6. Fee Receipt PCCOE
createSimplePdf(
  path.join(uploadsDir, 'Fee_Receipt_PCCOE_2025_26.pdf'),
  'PIMPRI CHINCHWAD COLLEGE OF ENGINEERING - FEE RECEIPT',
  [
    'Receipt No: PCCOE/FEES/2025-26/18492',
    'Student Name: Sharvari Bangar  |  PRN: STU2026001',
    'Branch: Information Technology  |  Year: Third Year (TE)',
    'Total College Tuition & Development Fees Paid: Rs. 65,000/-',
    'Payment Mode: Online Net Banking (Ref: UTR9847192847)',
    'Date of Payment: 02/08/2025'
  ]
);

// 7. Bonafide Certificate
createSimplePdf(
  path.join(uploadsDir, 'Bonafide_Certificate_PCCOE.pdf'),
  'PIMPRI CHINCHWAD COLLEGE OF ENGINEERING - BONAFIDE',
  [
    'Certificate No: PCCOE/BON/2025/3821',
    'To Whomsoever It May Concern:',
    'This is to certify that Miss Sharvari Bangar (PRN: STU2026001)',
    'is a bonafide student studying in B.Tech Information Technology',
    'for the Academic Year 2025-2026.',
    'This certificate is issued for MAHADBT Scholarship Verification.'
  ]
);

// 8. Bank Passbook
createSimplePdf(
  path.join(uploadsDir, 'Bank_Passbook_Aadhaar_Linked.pdf'),
  'STATE BANK OF INDIA - SAVINGS ACCOUNT PASSBOOK',
  [
    'Account Holder Name: Sharvari Bangar',
    'Account Number: 39847291847',
    'IFSC Code: SBIN0001234  |  Branch: Nigdi Pradhikaran, Pune',
    'DBT / Aadhaar Seeding Status: YES (Aadhaar Linked for DBT)',
    'Active Balance Valid for Direct Benefit Transfer'
  ]
);

console.log('All sample MahaDBT PDF documents successfully generated!');
