import React, { useState, useEffect } from 'react';
import type { SalesInvoice, Party, Item } from '../../../types/acmaso';
import type { FormLineItem } from './types';

interface CreateEditInvoiceModalProps {
  isOpen: boolean;
  editingInvoice: SalesInvoice | null;
  parties: Party[];
  items: Item[];
  invoices: SalesInvoice[];
  onClose: () => void;
  onSave: (invoiceData: {
    party: string;
    date: string;
    dueDate: string;
    placeOfSupply: string;
    account: string;
    notes: string;
    status: 'Submitted' | 'Draft';
    lineItems: FormLineItem[];
    totals: { netTotal: number; totalTax: number; grandTotal: number };
  }) => void;
}

export const CreateEditInvoiceModal: React.FC<CreateEditInvoiceModalProps> = ({
  isOpen,
  editingInvoice,
  parties,
  items,
  invoices,
  onClose,
  onSave,
}) => {
  const [party, setParty] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateStr, setDateStr] = useState('');
  const [numberSeries] = useState('SINV-');
  const [account, setAccount] = useState('Debtors');
  const [attachmentName, setAttachmentName] = useState('');
  const [returnAgainst, setReturnAgainst] = useState('');
  const [coupons, setCoupons] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Maharashtra');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Submitted' | 'Draft'>('Submitted');
  const [lineItems, setLineItems] = useState<FormLineItem[]>([
    { item: '', name: '', quantity: 1, rate: 0, discountPercent: 0, discountAmount: 0, taxRate: 18, account: 'Sales' },
  ]);

  // Collapsible Sections
  const [itemsOpen, setItemsOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(true);
  const [outstandingOpen, setOutstandingOpen] = useState(true);
  const [referencesOpen, setReferencesOpen] = useState(true);
  const [couponsOpen, setCouponsOpen] = useState(true);

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
    if (editingInvoice) {
      setParty(editingInvoice.party);
      setDate(editingInvoice.date);
      setDateStr(editingInvoice.date);
      setDueDate(editingInvoice.dueDate || '');
      setPlaceOfSupply(editingInvoice.placeOfSupply || 'Maharashtra');
      setNotes(editingInvoice.notes || '');
      setStatus(editingInvoice.status === 'Draft' ? 'Draft' : 'Submitted');
      if (editingInvoice.items && editingInvoice.items.length > 0) {
        setLineItems(
          editingInvoice.items.map((it) => ({
            item: it.item || '',
            name: it.name || it.item || '',
            quantity: it.quantity || 1,
            rate: it.rate || 0,
            discountPercent: it.discountPercent || 0,
            discountAmount: it.discountAmount || 0,
            taxRate: it.taxRate ?? 18,
            account: it.account || 'Sales',
          }))
        );
      }
    } else {
      setParty('');
      setDate(new Date().toISOString().split('T')[0]);
      setDateStr(getFormattedTimestamp());
      setDueDate('');
      setPlaceOfSupply('Maharashtra');
      setNotes('');
      setStatus('Submitted');
      setLineItems([
        { item: '', name: '', quantity: 1, rate: 0, discountPercent: 0, discountAmount: 0, taxRate: 18, account: 'Sales' },
      ]);
    }
  }, [editingInvoice, isOpen]);

  function handleItemChange(index: number, itemCode: string) {
    const selected = items.find((i) => i.code === itemCode);
    const updated = [...lineItems];
    if (selected) {
      updated[index] = {
        ...updated[index],
        item: selected.code,
        name: selected.name,
        rate: selected.rate || 0,
        taxRate: 18,
      };
    } else {
      updated[index] = {
        ...updated[index],
        item: itemCode,
        name: itemCode,
      };
    }
    setLineItems(updated);
  }

  function handleRowFieldChange(index: number, field: keyof FormLineItem, val: string | number) {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setLineItems(updated);
  }

  function handleAddItemRow() {
    setLineItems([
      ...lineItems,
      { item: '', name: '', quantity: 1, rate: 0, discountPercent: 0, discountAmount: 0, taxRate: 18, account: 'Sales' },
    ]);
  }

  function handleRemoveItemRow(index: number) {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  }

  const totals = lineItems.reduce(
    (acc, li) => {
      const net = (Number(li.quantity) || 0) * (Number(li.rate) || 0);
      const tax = net * ((Number(li.taxRate) || 0) / 100);
      return {
        netTotal: acc.netTotal + net,
        totalTax: acc.totalTax + tax,
        grandTotal: acc.grandTotal + net + tax,
      };
    },
    { netTotal: 0, totalTax: 0, grandTotal: 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      party,
      date: dateStr || date,
      dueDate,
      placeOfSupply,
      account,
      notes,
      status,
      lineItems,
      totals,
    });
  };

  if (!isOpen) return null;

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
              {editingInvoice ? `Edit Entry: ${editingInvoice.invoiceNumber}` : 'New Entry'}
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
          {/* Row 1: Number Series & Customer */}
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
                Customer *
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  required
                  value={party}
                  onChange={(e) => {
                    setParty(e.target.value);
                    const selected = parties.find((p) => p.name === e.target.value);
                    if (selected?.placeOfSupply) setPlaceOfSupply(selected.placeOfSupply);
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
                  <option value="" disabled>Customer</option>
                  {parties.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Account & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Account
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  padding: '0 14px',
                  fontSize: 14,
                  color: '#1e293b',
                  background: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <option value="Debtors">Debtors</option>
                <option value="Accounts Receivable">Accounts Receivable</option>
                <option value="Cash In Hand">Cash In Hand</option>
                <option value="Bank Account">Bank Account</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Date
              </label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="Sep 15, 2026 10:52:16"
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
          </div>

          {/* Collapsible Section 1: Items */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setItemsOpen(!itemsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: itemsOpen ? 12 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Items</h3>
              <i className={`fas fa-chevron-${itemsOpen ? 'up' : 'down'}`} style={{ fontSize: 12, color: '#94a3b8' }} />
            </div>

            {itemsOpen && (
              <div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: 36, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>#</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Item</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: 130, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Tax</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right', width: 80, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Qty</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right', width: 110, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Rate</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right', width: 120, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Amount</th>
                        <th style={{ width: 36 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((li, idx) => {
                        const qty = Number(li.quantity) || 0;
                        const rate = Number(li.rate) || 0;
                        const rowTotal = qty * rate;

                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '8px 14px', color: '#94a3b8' }}>{idx + 1}</td>
                            <td style={{ padding: '8px 14px' }}>
                              <select
                                value={li.item}
                                onChange={(e) => handleItemChange(idx, e.target.value)}
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
                                <option value="">Select Item...</option>
                                {items.map((it) => (
                                  <option key={it.id} value={it.code}>
                                    {it.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <select
                                value={li.taxRate}
                                onChange={(e) => handleRowFieldChange(idx, 'taxRate', Number(e.target.value))}
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
                                <option value={18}>GST-18</option>
                                <option value={12}>GST-12</option>
                                <option value={5}>GST-5</option>
                                <option value={0}>0%</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                min={1}
                                value={li.quantity}
                                onChange={(e) => handleRowFieldChange(idx, 'quantity', Number(e.target.value))}
                                style={{
                                  width: '100%',
                                  height: 36,
                                  borderRadius: 6,
                                  border: '1px solid #e2e8f0',
                                  padding: '0 6px',
                                  textAlign: 'right',
                                  fontSize: 13,
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input
                                type="number"
                                value={li.rate}
                                onChange={(e) => handleRowFieldChange(idx, 'rate', Number(e.target.value))}
                                style={{
                                  width: '100%',
                                  height: 36,
                                  borderRadius: 6,
                                  border: '1px solid #e2e8f0',
                                  padding: '0 6px',
                                  textAlign: 'right',
                                  fontSize: 13,
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                              ₹ {rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              {lineItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemRow(idx)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                >
                                  <i className="fas fa-trash-alt" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
                    <button
                      type="button"
                      onClick={handleAddItemRow}
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

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Net Total
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
                      justifyContent: 'flex-end',
                      padding: '0 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#1e293b',
                    }}
                  >
                    ₹ {totals.netTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 2: Tax and Totals */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setTaxOpen(!taxOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: taxOpen ? 12 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Tax and Totals</h3>
              <i className={`fas fa-chevron-${taxOpen ? 'up' : 'down'}`} style={{ fontSize: 12, color: '#94a3b8' }} />
            </div>

            {taxOpen && (
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                  Grand Total
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
                    justifyContent: 'flex-end',
                    padding: '0 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  ₹ {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 3: Outstanding */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setOutstandingOpen(!outstandingOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: outstandingOpen ? 12 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Outstanding</h3>
              <i className={`fas fa-chevron-${outstandingOpen ? 'up' : 'down'}`} style={{ fontSize: 12, color: '#94a3b8' }} />
            </div>

            {outstandingOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Outstanding Amount
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
                      justifyContent: 'flex-end',
                      padding: '0 16px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1e293b',
                    }}
                  >
                    ₹ {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Stock Not Shipped
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
                      justifyContent: 'flex-end',
                      padding: '0 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#1e293b',
                    }}
                  >
                    0
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 4: References */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setReferencesOpen(!referencesOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: referencesOpen ? 12 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>References</h3>
              <i className={`fas fa-chevron-${referencesOpen ? 'up' : 'down'}`} style={{ fontSize: 12, color: '#94a3b8' }} />
            </div>

            {referencesOpen && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add invoice terms"
                      rows={3}
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        padding: '10px 14px',
                        fontSize: 13.5,
                        color: '#1e293b',
                        resize: 'none',
                        background: '#ffffff',
                      }}
                    />
                  </div>

                  <div>
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

                <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Return Against
                  </label>
                  <select
                    value={returnAgainst}
                    onChange={(e) => setReturnAgainst(e.target.value)}
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      padding: '0 14px',
                      fontSize: 14,
                      color: returnAgainst ? '#1e293b' : '#94a3b8',
                      background: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Return Against</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.invoiceNumber || inv.id}>
                        {inv.invoiceNumber || inv.id} ({inv.party} - ₹{inv.grandTotal})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 5: Coupons */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 24 }}>
            <div
              onClick={() => setCouponsOpen(!couponsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: couponsOpen ? 12 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Coupons</h3>
              <i className={`fas fa-chevron-${couponsOpen ? 'up' : 'down'}`} style={{ fontSize: 12, color: '#94a3b8' }} />
            </div>

            {couponsOpen && (
              <div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', width: 40, color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>#</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 12.5 }}>Coupons</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '8px 14px', color: '#94a3b8' }}>{i + 1}</td>
                          <td style={{ padding: '8px 14px' }}>
                            <input
                              type="text"
                              value={c}
                              onChange={(e) => {
                                const next = [...coupons];
                                next[i] = e.target.value;
                                setCoupons(next);
                              }}
                              placeholder="Enter coupon code..."
                              style={{
                                width: '100%',
                                height: 36,
                                borderRadius: 6,
                                border: '1px solid #e2e8f0',
                                padding: '0 8px',
                                fontSize: 13,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
                    <button
                      type="button"
                      onClick={() => setCoupons([...coupons, ''])}
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
