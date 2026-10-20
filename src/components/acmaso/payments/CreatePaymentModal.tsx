import React, { useState, useEffect, useMemo } from 'react';
import { acmasoService } from '../../../services/acmaso.service';
import { useToast } from '../../../hooks/useToast';
import type { CreatePaymentModalProps, PaymentAllocation } from './types';

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  parties,
  invoices,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [party, setParty] = useState('');
  const [numberSeries] = useState('PAY-');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateStr, setDateStr] = useState('');
  const [paymentType, setPaymentType] = useState<'Receive' | 'Pay'>('Receive');
  const [fromAccount, setFromAccount] = useState('Debtors');
  const [toAccount, setToAccount] = useState('Cash In Hand');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [clearanceDate, setClearanceDate] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [refDate, setRefDate] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [writeOff, setWriteOff] = useState<number>(0);
  const [attachmentName, setAttachmentName] = useState('');
  const [allocations, setAllocations] = useState<PaymentAllocation[]>([
    { type: 'SalesInvoice', name: '', amount: 0 },
  ]);
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Submitted');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [forInvoice, setForInvoice] = useState('');
  const [notes] = useState('');

  // Collapsible Sections
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [amountsOpen, setAmountsOpen] = useState(true);
  const [referencesOpen, setReferencesOpen] = useState(true);

  function getFormattedTimestamp() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const time = now.toTimeString().split(' ')[0];
    return `${month} ${day}, ${year} ${time}`;
  }

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
      setDateStr(getFormattedTimestamp());
      setPaymentType('Receive');
      setFromAccount('Debtors');
      setToAccount('Cash In Hand');
      setPaymentMethod('Cash');
      setClearanceDate('');
      setChequeNo('');
      setRefDate('');
      setAmount(0);
      setWriteOff(0);
      setAttachmentName('');
      setAllocations([{ type: 'SalesInvoice', name: '', amount: 0 }]);
      setReferenceNumber('');
      setForInvoice('');
      setStatus('Submitted');
      setDetailsOpen(true);
      setAmountsOpen(true);
      setReferencesOpen(true);
      if (parties.length > 0) setParty(parties[0].name);
    }
  }, [isOpen, parties]);

  const customerUnpaidInvoices = useMemo(() => {
    return invoices.filter((i) => i.party === party && i.status !== 'Cancelled' && (i.outstandingAmount || 0) > 0);
  }, [invoices, party]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party) {
      showToast('Please select a customer.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Payment amount must be greater than 0.', 'error');
      return;
    }

    try {
      const payload = {
        party,
        paymentType: 'Receive' as const,
        paymentMethod,
        paymentAccount: toAccount,
        account: fromAccount || 'Debtors',
        date,
        amount: Number(amount),
        referenceNumber: chequeNo || referenceNumber,
        notes,
        forInvoice: forInvoice || undefined,
      };

      const result = await acmasoService.createSalesPayment(payload);
      showToast(`Payment receipt ${result.paymentNumber || result.id} recorded successfully!`, 'success');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Record payment failed: ${errorMsg}`, 'error');
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          width: '100%',
          maxWidth: 780,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          margin: 'auto 0',
        }}
      >
        {/* Header: New Entry + Draft Pill */}
        <div
          style={{
            padding: '20px 24px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 6,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
              title="Close"
            >
              <i className="fas fa-times" style={{ fontSize: 13 }} />
            </button>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
              New Entry
            </h2>
          </div>

          <span
            style={{
              background: '#f1f5f9',
              color: '#64748b',
              padding: '4px 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            {status === 'Draft' ? 'Draft' : 'Draft'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 24px 20px' }}>
          {/* Row 1: Number Series & Party */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Number Series
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0 14px',
                  height: 44,
                  background: '#ffffff',
                }}
              >
                <span style={{ fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{numberSeries}</span>
                <i className="fas fa-chevron-right" style={{ fontSize: 11, color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Party
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={party}
                  onChange={(e) => {
                    setParty(e.target.value);
                    setForInvoice('');
                  }}
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '0 36px 0 14px',
                    fontSize: 14,
                    color: party ? '#1e293b' : '#94a3b8',
                    background: '#ffffff',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" disabled>Party</option>
                  {parties.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#ef4444',
                    fontSize: 10,
                    lineHeight: '10px',
                  }}
                >
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Posting Date & Payment Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Posting Date
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  placeholder="Sep 15, 2026 10:56:24"
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '0 36px 0 14px',
                    fontSize: 14,
                    color: '#1e293b',
                    background: '#ffffff',
                  }}
                />
                <i
                  className="far fa-calendar"
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: 14,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Payment Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as 'Receive' | 'Pay')}
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '0 36px 0 14px',
                    fontSize: 14,
                    color: '#1e293b',
                    background: '#ffffff',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Receive">Receive</option>
                  <option value="Pay">Pay</option>
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#ef4444',
                    fontSize: 10,
                    lineHeight: '10px',
                  }}
                >
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Section 1: Details */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setDetailsOpen(!detailsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: detailsOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Details</h3>
              <i
                className={`fas fa-chevron-${detailsOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {detailsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      From Account
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          padding: '0 36px 0 14px',
                          fontSize: 14,
                          color: '#1e293b',
                          background: '#ffffff',
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Debtors">Debtors</option>
                        <option value="Accounts Receivable">Accounts Receivable</option>
                        <option value="Customer Account">Customer Account</option>
                      </select>
                      <div
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          color: '#ef4444',
                          fontSize: 10,
                          lineHeight: '10px',
                        }}
                      >
                        <span>▲</span>
                        <span>▼</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      To Account
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          padding: '0 36px 0 14px',
                          fontSize: 14,
                          color: '#1e293b',
                          background: '#ffffff',
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Cash In Hand">Cash In Hand</option>
                        <option value="HDFC Bank Operating A/c">HDFC Bank Operating A/c</option>
                        <option value="ICICI Bank Current A/c">ICICI Bank Current A/c</option>
                        <option value="Bank Account">Bank Account</option>
                      </select>
                      <div
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          color: '#ef4444',
                          fontSize: 10,
                          lineHeight: '10px',
                        }}
                      >
                        <span>▲</span>
                        <span>▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Payment Method
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: '0 14px',
                        height: 44,
                        background: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          width: '100%',
                          fontSize: 14,
                          color: '#1e293b',
                          fontWeight: 500,
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer</option>
                        <option value="UPI / Online QR">UPI / QR</option>
                        <option value="Cheque / Draft">Cheque / Draft</option>
                        <option value="Credit / Debit Card">Credit / Debit Card</option>
                      </select>
                      <i className="fas fa-chevron-right" style={{ fontSize: 11, color: '#94a3b8' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Clearance Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={clearanceDate}
                        onChange={(e) => setClearanceDate(e.target.value)}
                        placeholder="Clearance Date"
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          padding: '0 36px 0 14px',
                          fontSize: 14,
                          color: '#1e293b',
                          background: '#ffffff',
                        }}
                      />
                      <i
                        className="far fa-calendar"
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          fontSize: 14,
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Ref. / Cheque No.
                    </label>
                    <input
                      type="text"
                      value={chequeNo || referenceNumber}
                      onChange={(e) => {
                        setChequeNo(e.target.value);
                        setReferenceNumber(e.target.value);
                      }}
                      placeholder="Ref. / Cheque No."
                      style={{
                        width: '100%',
                        height: 44,
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        padding: '0 14px',
                        fontSize: 14,
                        color: '#1e293b',
                        background: '#ffffff',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Reference Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={refDate}
                        onChange={(e) => setRefDate(e.target.value)}
                        placeholder="Ref. Date"
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          padding: '0 36px 0 14px',
                          fontSize: 14,
                          color: '#1e293b',
                          background: '#ffffff',
                        }}
                      />
                      <i
                        className="far fa-calendar"
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          fontSize: 14,
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 2: Amounts */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setAmountsOpen(!amountsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: amountsOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Amounts</h3>
              <i
                className={`fas fa-chevron-${amountsOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {amountsOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Amount
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                    }}
                  >
                    <span style={{ fontSize: 14, color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      min={0}
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="0.00"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'right',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1e293b',
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Write Off
                  </label>
                  <div
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                    }}
                  >
                    <span style={{ fontSize: 14, color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      min={0}
                      value={writeOff || ''}
                      onChange={(e) => setWriteOff(Number(e.target.value))}
                      placeholder="0.00"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'right',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1e293b',
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 3: References */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 24 }}>
            <div
              onClick={() => setReferencesOpen(!referencesOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: referencesOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>References</h3>
              <i
                className={`fas fa-chevron-${referencesOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {referencesOpen && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Payment Reference
                  </label>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                          <th style={{ padding: '10px 14px', textAlign: 'left', width: 40, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>#</th>
                          <th style={{ padding: '10px 14px', textAlign: 'left', width: 140, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Type</th>
                          <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Name</th>
                          <th style={{ padding: '10px 14px', textAlign: 'right', width: 140, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Amount</th>
                          <th style={{ width: 36 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((al, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '8px 14px', color: '#94a3b8' }}>{idx + 1}</td>
                            <td style={{ padding: '8px 14px' }}>
                              <select
                                value={al.type}
                                onChange={(e) => {
                                  const next = [...allocations];
                                  next[idx].type = e.target.value;
                                  setAllocations(next);
                                }}
                                style={{
                                  width: '100%',
                                  height: 36,
                                  borderRadius: 6,
                                  border: '1px solid #e2e8f0',
                                  padding: '0 8px',
                                  fontSize: 13,
                                  background: '#fff',
                                }}
                              >
                                <option value="SalesInvoice">Sales Invoice</option>
                                <option value="SalesQuote">Sales Quote</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <select
                                value={al.name}
                                onChange={(e) => {
                                  const next = [...allocations];
                                  next[idx].name = e.target.value;
                                  const matched = customerUnpaidInvoices.find((i) => i.invoiceNumber === e.target.value || i.id === e.target.value);
                                  if (matched) {
                                    next[idx].amount = matched.outstandingAmount;
                                    setAmount(matched.outstandingAmount);
                                    setForInvoice(matched.invoiceNumber || matched.id);
                                  }
                                  setAllocations(next);
                                }}
                                style={{
                                  width: '100%',
                                  height: 36,
                                  borderRadius: 6,
                                  border: '1px solid #e2e8f0',
                                  padding: '0 8px',
                                  fontSize: 13,
                                  background: '#fff',
                                }}
                              >
                                <option value="">Select Invoice / Ref...</option>
                                {customerUnpaidInvoices.map((i) => (
                                  <option key={i.id} value={i.invoiceNumber || i.id}>
                                    {i.invoiceNumber} (₹{Number(i.outstandingAmount).toLocaleString('en-IN')})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                min={0}
                                value={al.amount || ''}
                                onChange={(e) => {
                                  const next = [...allocations];
                                  next[idx].amount = Number(e.target.value);
                                  setAllocations(next);
                                  setAmount(Number(e.target.value));
                                }}
                                placeholder="0.00"
                                style={{
                                  width: '100%',
                                  height: 36,
                                  borderRadius: 6,
                                  border: '1px solid #e2e8f0',
                                  padding: '0 8px',
                                  textAlign: 'right',
                                  fontSize: 13,
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              {allocations.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setAllocations(allocations.filter((_, i) => i !== idx))}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                >
                                  <i className="fas fa-trash-alt" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
                      <button
                        type="button"
                        onClick={() => setAllocations([...allocations, { type: 'SalesInvoice', name: '', amount: 0 }])}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <i className="fas fa-plus" style={{ fontSize: 11 }} /> Add Row
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Attachment
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      padding: '0 14px',
                      fontSize: 13.5,
                      color: attachmentName ? '#1e293b' : '#94a3b8',
                      cursor: 'pointer',
                      background: '#ffffff',
                    }}
                  >
                    <span>{attachmentName || 'Add attachment'}</span>
                    <i className="fas fa-arrow-up-from-bracket" style={{ color: '#94a3b8', fontSize: 14 }} />
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachmentName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 13.5,
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                setStatus('Draft');
                handleSubmit(e);
              }}
              style={{
                background: '#e2e8f0',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 13.5,
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              Save Draft
            </button>
            <button
              type="submit"
              onClick={() => setStatus('Submitted')}
              style={{
                background: '#1e293b',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 13.5,
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Make Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
