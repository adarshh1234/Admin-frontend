import React from 'react';
import { Button } from '../../common/Button';
import type { SalesQuote } from '../../../types/acmaso';

interface QuoteDetailModalProps {
  viewingQuote: SalesQuote | null;
  onClose: () => void;
  onEdit: (quote: SalesQuote) => void;
  onPrint: (quote: SalesQuote) => void;
  onConvertToInvoice: (quote: SalesQuote) => void;
  onUpdateStatus: (quoteId: string, status: SalesQuote['status']) => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  viewingQuote,
  onClose,
  onEdit,
  onPrint,
  onConvertToInvoice,
  onUpdateStatus,
}) => {
  if (!viewingQuote) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 750, maxHeight: '90vh', overflowY: 'auto', padding: 28, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>SALES QUOTATION</span>
            <h3 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{viewingQuote.quoteNumber}</h3>
            <span style={{ fontSize: 13, color: '#64748b' }}>Customer: <strong>{viewingQuote.party}</strong></span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Date</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{viewingQuote.date}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Valid Until</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{viewingQuote.validUntil || '—'}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Grand Total</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
              ₹{Number(viewingQuote.grandTotal).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Line Items</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(viewingQuote.items || []).map((it, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{it.name || it.item}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{it.quantity}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(it.rate).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>₹{Number(it.total || it.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => onUpdateStatus(viewingQuote.id, 'Accepted')}>
              <i className="fas fa-check" style={{ marginRight: 6, color: '#16a34a' }} /> Mark Accepted
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(viewingQuote)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPrint(viewingQuote)}>
              <i className="fas fa-print" style={{ marginRight: 6 }} /> Print
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={onClose}>Close</Button>
            {viewingQuote.status !== 'Accepted' && (
              <Button variant="primary" onClick={() => onConvertToInvoice(viewingQuote)}>
                <i className="fas fa-bolt" style={{ marginRight: 6 }} /> Convert to Sales Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
