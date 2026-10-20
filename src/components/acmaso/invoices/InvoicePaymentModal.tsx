import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SalesInvoice } from '../../../types/acmaso';

interface InvoicePaymentModalProps {
  paymentInvoice: SalesInvoice | null;
  onClose: () => void;
  onSubmitPayment: (paymentData: {
    amount: number;
    date: string;
    method: string;
    account: string;
    reference: string;
    notes: string;
  }) => void;
}

export const InvoicePaymentModal: React.FC<InvoicePaymentModalProps> = ({
  paymentInvoice,
  onClose,
  onSubmitPayment,
}) => {
  const [payAmount, setPayAmount] = useState<number>(paymentInvoice?.outstandingAmount || 0);
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState('Bank Transfer (NEFT/RTGS/IMPS)');
  const [payAccount, setPayAccount] = useState('HDFC Bank Operating A/c');
  const [payRef, setPayRef] = useState('');
  const [payNotes] = useState('');

  if (!paymentInvoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPayment({
      amount: payAmount,
      date: payDate,
      method: payMethod,
      account: payAccount,
      reference: payRef,
      notes: payNotes,
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 520, padding: 28, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Record Payment</h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Against {paymentInvoice.invoiceNumber} ({paymentInvoice.party})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Amount (₹) *</label>
            <Input
              type="number"
              min={1}
              max={paymentInvoice.outstandingAmount}
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              style={{ width: '100%', height: 38, fontSize: 15, fontWeight: 800 }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>Maximum outstanding: ₹{Number(paymentInvoice.outstandingAmount).toLocaleString('en-IN')}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Payment Date</label>
              <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} style={{ width: '100%', height: 38 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Payment Mode</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid #cbd5e1', padding: '0 8px', fontSize: 12.5 }}
              >
                <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer</option>
                <option value="UPI / Online QR">UPI / QR</option>
                <option value="Cash">Cash</option>
                <option value="Cheque / Draft">Cheque</option>
                <option value="Credit / Debit Card">Card</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Deposit Account</label>
            <select
              value={payAccount}
              onChange={(e) => setPayAccount(e.target.value)}
              style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid #cbd5e1', padding: '0 8px', fontSize: 12.5 }}
            >
              <option value="HDFC Bank Operating A/c">HDFC Bank Operating A/c</option>
              <option value="ICICI Bank Current A/c">ICICI Bank Current A/c</option>
              <option value="Cash In Hand">Cash In Hand</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Reference # / UTR</label>
            <Input type="text" placeholder="UTR or Transaction Reference" value={payRef} onChange={(e) => setPayRef(e.target.value)} style={{ width: '100%', height: 38 }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">
              <i className="fas fa-check" style={{ marginRight: 6 }} /> Confirm Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
