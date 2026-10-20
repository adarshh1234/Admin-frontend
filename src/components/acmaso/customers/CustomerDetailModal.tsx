import React, { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import type { CustomerDetailModalProps } from './types';

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  invoices,
  payments,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [historyTab, setHistoryTab] = useState<'invoices' | 'payments'>('invoices');

  const selectedCustomerInvoices = useMemo(() => {
    if (!customer) return [];
    return invoices.filter((i) => i.party === customer.name);
  }, [customer, invoices]);

  const selectedCustomerPayments = useMemo(() => {
    if (!customer) return [];
    return payments.filter((p) => p.party === customer.name);
  }, [customer, payments]);

  const totalBilled = selectedCustomerInvoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
  const totalPaid = selectedCustomerPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  if (!customer) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{customer.name}</h3>
            <span style={{ fontSize: 12.5, color: '#64748b' }}>Complete Customer Statement & Financial Activity</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}
          >
            ×
          </button>
        </div>

        {/* Customer Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>GSTIN / Tax ID</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
              {customer.gstin || 'Unregistered'}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Total Invoiced</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Total Payments</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ background: '#fef2f2', padding: 12, borderRadius: 8, border: '1px solid #fecaca' }}>
            <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Outstanding Balance</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626' }}>
              ₹{Number(customer.calculatedOutstanding ?? customer.outstandingAmount ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Customer Contact & Address Strip */}
        <div
          style={{
            background: '#f8fafc',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 18,
            fontSize: 12.5,
            display: 'flex',
            gap: 20,
            color: '#475569',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <strong>Email:</strong> {customer.email || '—'}
          </div>
          <div>
            <strong>Phone:</strong> {customer.phone || '—'}
          </div>
          <div>
            <strong>Place of Supply:</strong> {customer.placeOfSupply || 'Maharashtra'}
          </div>
          {customer.address && (
            <div>
              <strong>Address:</strong> {customer.address}
            </div>
          )}
        </div>

        {/* History Tabs */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
          <button
            onClick={() => setHistoryTab('invoices')}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: historyTab === 'invoices' ? '2px solid #0d9488' : '2px solid transparent',
              fontWeight: 700,
              fontSize: 13,
              color: historyTab === 'invoices' ? '#0d9488' : '#64748b',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-file-invoice" style={{ marginRight: 6 }} /> Sales Invoices (
            {selectedCustomerInvoices.length})
          </button>
          <button
            onClick={() => setHistoryTab('payments')}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: historyTab === 'payments' ? '2px solid #0d9488' : '2px solid transparent',
              fontWeight: 700,
              fontSize: 13,
              color: historyTab === 'payments' ? '#0d9488' : '#64748b',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-money-bill-transfer" style={{ marginRight: 6 }} /> Payments Received (
            {selectedCustomerPayments.length})
          </button>
        </div>

        {/* Invoices List */}
        {historyTab === 'invoices' && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Invoice #</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Outstanding (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Payment</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{inv.date}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{Number(inv.grandTotal).toLocaleString('en-IN')}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'right',
                        fontWeight: 800,
                        color: inv.outstandingAmount > 0 ? '#dc2626' : '#16a34a',
                      }}
                    >
                      ₹{Number(inv.outstandingAmount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background:
                            inv.paymentStatus === 'Paid'
                              ? '#dcfce7'
                              : inv.paymentStatus === 'Partially Paid'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            inv.paymentStatus === 'Paid'
                              ? '#16a34a'
                              : inv.paymentStatus === 'Partially Paid'
                              ? '#d97706'
                              : '#dc2626',
                        }}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background:
                            inv.status === 'Submitted'
                              ? '#dbeafe'
                              : inv.status === 'Cancelled'
                              ? '#f1f5f9'
                              : '#fef9c3',
                          color:
                            inv.status === 'Submitted'
                              ? '#1d4ed8'
                              : inv.status === 'Cancelled'
                              ? '#94a3b8'
                              : '#854d0e',
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {selectedCustomerInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No sales invoices recorded for this customer yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments List */}
        {historyTab === 'payments' && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Receipt #</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Payment Date</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Linked Invoice</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Mode</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount Paid (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerPayments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>
                      {p.id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{p.date}</td>
                    <td style={{ padding: '8px 12px', color: '#2563eb', fontWeight: 600 }}>
                      {p.invoiceNumber || p.invoiceId || 'On Account'}
                    </td>
                    <td style={{ padding: '8px 12px' }}>{p.modeOfPayment || p.paymentMethod}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                {selectedCustomerPayments.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No payment receipts found for this customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="outline"
              size="sm"
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
              onClick={() => onDelete(customer)}
            >
              <i className="fas fa-trash-alt" style={{ marginRight: 6 }} /> Delete Customer
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close Statement
          </Button>
        </div>
      </div>
    </div>
  );
};
