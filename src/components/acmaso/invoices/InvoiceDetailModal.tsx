import React from 'react';
import { Button } from '../../common/Button';
import type { SalesInvoice } from '../../../types/acmaso';

interface InvoiceDetailModalProps {
  viewingInvoice: SalesInvoice | null;
  onClose: () => void;
  onEdit: (invoice: SalesInvoice) => void;
  onPrint: (invoice: SalesInvoice) => void;
  onOpenPayment: (invoice: SalesInvoice) => void;
  onCancelInvoice: (invoiceId: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  viewingInvoice,
  onClose,
  onEdit,
  onPrint,
  onOpenPayment,
  onCancelInvoice,
}) => {
  if (!viewingInvoice) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 750, maxHeight: '90vh', overflowY: 'auto', padding: 28, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>SALES INVOICE</span>
            <h3 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{viewingInvoice.invoiceNumber}</h3>
            <span style={{ fontSize: 13, color: '#64748b' }}>Customer: <strong>{viewingInvoice.party}</strong></span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Invoice Date</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{viewingInvoice.date}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Due Date</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{viewingInvoice.dueDate || '—'}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Payment Status</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: viewingInvoice.paymentStatus === 'Paid' ? '#16a34a' : '#ea580c' }}>{viewingInvoice.paymentStatus}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Outstanding</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: viewingInvoice.outstandingAmount > 0 ? '#dc2626' : '#16a34a' }}>
              ₹{Number(viewingInvoice.outstandingAmount).toLocaleString('en-IN')}
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
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Tax Rate</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(viewingInvoice.items || []).map((it, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{it.name || it.item}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{it.quantity}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{Number(it.rate).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{it.taxRate ?? 18}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>₹{Number(it.total || it.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={() => onEdit(viewingInvoice)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
            </Button>
            <Button variant="outline" onClick={() => onPrint(viewingInvoice)}>
              <i className="fas fa-print" style={{ marginRight: 6 }} /> Print / PDF
            </Button>
            {viewingInvoice.status !== 'Cancelled' && (
              <Button variant="ghost" onClick={() => onCancelInvoice(viewingInvoice.id)} style={{ color: '#dc2626' }}>
                <i className="fas fa-ban" style={{ marginRight: 6 }} /> Cancel Invoice
              </Button>
            )}
          </div>
          {viewingInvoice.outstandingAmount > 0 && viewingInvoice.status !== 'Cancelled' && (
            <Button variant="primary" onClick={() => onOpenPayment(viewingInvoice)}>
              <i className="fas fa-money-bill-wave" style={{ marginRight: 6 }} /> Record Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
