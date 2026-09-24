import React from 'react';
import { Layout } from '../../components/common/Layout';

const Help = () => {
  return (
    <Layout>
      <div style={{ marginBottom: '24px' }}>
        <h2>Help & Support</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Frequently asked questions about the scholarship process.</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>FAQ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontWeight: '600' }}>1. How do I apply for a scholarship?</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Navigate to the "Create New Application" page, fill in your personal, academic, and bank details, and submit the form.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '600' }}>2. How do I upload documents?</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Go to the "Documents" section. You can simulate uploading files or fetching them from DigiLocker for permanent documents.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '600' }}>3. What does "Correction Required" mean?</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>It means the admin found an issue with an uploaded document (e.g., blurry image). You need to re-upload it from the Documents page.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '600' }}>4. How long does verification take?</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>In this simulation, verification happens instantly when the Admin logs in and processes it.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
