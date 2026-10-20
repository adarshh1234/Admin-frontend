import React from 'react';
import { Button } from '../../common/Button';
import type { PaymentDetailModalProps } from './types';

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  onClose,
  onDelete,
}) => {
  if (!payment) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
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
          maxWidth: 580,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>PAYMENT RECEIPT</span>
            <h3 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              {payment.paymentNumber || payment.id}
            </h3>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Received from: <strong>{payment.party}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Posting Date</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{payment.date}</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#16a34a' }}>Amount Received</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#16a34a' }}>
              ₹{Number(payment.amount).toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Payment Mode</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{payment.paymentMethod}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Deposit Account</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{payment.paymentAccount}</div>
          </div>
        </div>

        {payment.referenceNumber && (
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12.5 }}>
            <strong>Reference / UTR #:</strong> {payment.referenceNumber}
          </div>
        )}

        {payment.notes && (
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 12.5 }}>
            <strong>Notes:</strong> {payment.notes}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
            onClick={() => onDelete(payment)}
          >
            <i className="fas fa-trash-alt" style={{ marginRight: 6 }} /> Delete Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
