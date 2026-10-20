import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../../hooks/useToast';
import type { BulkBatch } from './types';

const SAMPLE_BATCHES: BulkBatch[] = [
  {
    id: 'BATCH-801',
    batchName: 'Campus Drive 2026 AIIMS & IITs',
    source: 'Campus Placement Portal',
    totalResumes: 450,
    parsedCount: 450,
    date: '2026-09-12',
    status: 'Completed',
  },
  {
    id: 'BATCH-802',
    batchName: 'LinkedIn Telemedicine Specialists Export',
    source: 'LinkedIn Talent Solutions',
    totalResumes: 180,
    parsedCount: 165,
    date: '2026-09-10',
    status: 'Completed',
  },
  {
    id: 'BATCH-803',
    batchName: 'MedRecruit Agency Fall Batch',
    source: 'External Agency ZIP',
    totalResumes: 320,
    parsedCount: 210,
    date: '2026-09-14',
    status: 'Processing',
  },
];

export const BulkCandidatesTab: React.FC = () => {
  const { showToast } = useToast();
  const [batches, setBatches] = useState<BulkBatch[]>(SAMPLE_BATCHES);

  function handleUploadZip() {
    const newBatch: BulkBatch = {
      id: `BATCH-${800 + batches.length + 1}`,
      batchName: `Bulk Upload Batch #${batches.length + 1}`,
      source: 'Direct ZIP Upload',
      totalResumes: 125,
      parsedCount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
    };
    setBatches([newBatch, ...batches]);
    showToast('Bulk resume archive uploaded! Parsing in background…', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Upload Zone */}
      <div
        className="panel"
        style={{
          border: '2px dashed #93c5fd',
          background: '#f8faff',
          borderRadius: 14,
          padding: '36px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            marginBottom: 14,
          }}
        >
          <i className="fas fa-cloud-upload-alt" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: '0 0 6px 0' }}>
          Bulk Candidate Ingestion &amp; Resume Parsing
        </h3>
        <p style={{ fontSize: 13.5, color: '#64748b', maxWidth: 540, margin: '0 auto 18px auto', lineHeight: 1.5 }}>
          Upload CSV spreadsheet, Excel sheet (.xlsx), or ZIP folder containing candidate resumes. AI will extract qualifications, experience, and contact information automatically.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={handleUploadZip} style={{ fontSize: 13, padding: '10px 20px' }}>
            <i className="fas fa-folder-open" style={{ marginRight: 6 }} /> Upload Resumes (ZIP / CSV)
          </Button>
          <Button
            variant="outline"
            onClick={() => showToast('Sample candidate ingestion template downloaded.', 'info')}
            style={{ fontSize: 13 }}
          >
            <i className="fas fa-file-excel" style={{ marginRight: 6 }} /> Download CSV Template
          </Button>
        </div>
      </div>

      {/* Batch History */}
      <div className="panel" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2540', marginBottom: 16 }}>
          <i className="fas fa-history" style={{ color: '#2563eb', marginRight: 8 }} />
          Recent Ingestion Batches
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                {['Batch ID', 'Batch Name', 'Source', 'Resumes', 'Parsed', 'Upload Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7a99', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: '1px solid #f0f3fa', transition: 'background 0.12s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                >
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{b.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1a2540' }}>{b.batchName}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{b.source}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#334155' }}>{b.totalResumes} files</td>
                  <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 600 }}>{b.parsedCount} extracted</td>
                  <td style={{ padding: '12px 14px', color: '#6b7a99' }}>{b.date}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        background: b.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                        color: b.status === 'Completed' ? '#16a34a' : '#b45309',
                        borderRadius: 20,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ fontSize: 11, padding: '3px 8px' }}
                      onClick={() => showToast(`Viewing parsed profiles for ${b.batchName}`, 'info')}
                    >
                      <i className="fas fa-list" /> View Records
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
