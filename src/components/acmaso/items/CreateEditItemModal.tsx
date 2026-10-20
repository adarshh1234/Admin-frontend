import React, { useState, useEffect } from 'react';
import { acmasoService } from '../../../services/acmaso.service';
import { useToast } from '../../../hooks/useToast';
import type { CreateEditItemModalProps } from './types';

export const CreateEditItemModal: React.FC<CreateEditItemModalProps> = ({
  isOpen,
  editingItem,
  accounts,
  taxTemplates,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [purpose, setPurpose] = useState('Sales');
  const [type, setType] = useState('Product');
  const [unit, setUnit] = useState('Unit');
  const [rate, setRate] = useState<number>(0);
  const [purchaseRate, setPurchaseRate] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Medical Equipment');
  const [incomeAccount, setIncomeAccount] = useState('Income');
  const [expenseAccount, setExpenseAccount] = useState('Expense');
  const [taxTemplateName, setTaxTemplateName] = useState('Tax');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [hsnSac, setHsnSac] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [entryStatus, setEntryStatus] = useState<'Draft' | 'Submitted'>('Submitted');

  // Collapsible Sections
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [accountsOpen, setAccountsOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCode(editingItem.code);
      setAvatarUrl('');
      setPurpose('Sales');
      setType('Product');
      setUnit(editingItem.unit || 'Unit');
      setRate(editingItem.rate || 0);
      setPurchaseRate(editingItem.purchaseRate || editingItem.purchase_rate || 0);
      setDescription(editingItem.description || '');
      setCategory(editingItem.category || 'Medical Equipment');
      setIncomeAccount(editingItem.incomeAccount || editingItem.income_account || 'Income');
      setExpenseAccount(editingItem.expenseAccount || editingItem.expense_account || 'Expense');
      setTaxTemplateName(editingItem.taxRate !== undefined ? `GST-${editingItem.taxRate}%` : 'Tax');
      setTaxRate(editingItem.taxRate ?? editingItem.tax_rate ?? 18);
      setHsnSac(editingItem.hsnSac || editingItem.hsn_code || '');
      setStatus((editingItem.status as 'Active' | 'Inactive') || 'Active');
      setEntryStatus('Submitted');
    } else {
      setName('');
      setCode('');
      setAvatarUrl('');
      setPurpose('Sales');
      setType('Product');
      setUnit('Unit');
      setRate(0);
      setPurchaseRate(0);
      setDescription('');
      setCategory('Medical Equipment');
      setIncomeAccount('Income');
      setExpenseAccount('Expense');
      setTaxTemplateName('Tax');
      setTaxRate(18);
      setHsnSac('');
      setStatus('Active');
      setEntryStatus('Submitted');
    }
    setDetailsOpen(true);
    setAccountsOpen(true);
    setInventoryOpen(true);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Item name is required.', 'error');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        code: code.trim() ? code.trim().toUpperCase() : `ITM-${Date.now().toString().slice(-6)}`,
        description: description.trim(),
        category,
        unit,
        rate: Number(rate) || 0,
        purchaseRate: Number(purchaseRate) || 0,
        hsnSac: hsnSac.trim(),
        incomeAccount: incomeAccount || 'Sales',
        expenseAccount: expenseAccount || 'Cost of Goods Sold',
        taxRate: Number(taxRate) || 0,
        status,
      };

      if (editingItem) {
        await acmasoService.updateItem(editingItem.id, payload);
        showToast('Item updated successfully.', 'success');
      } else {
        await acmasoService.createItem(payload);
        showToast('Item added to catalog.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Action failed: ${errorMsg}`, 'error');
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
              {editingItem ? 'Edit Item' : 'New Entry'}
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
            {entryStatus === 'Draft' ? 'Draft' : 'Draft'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 24px 20px' }}>
          {/* Top Section: Avatar Box (Left) + Item Name & Item Code (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, marginBottom: 18, alignItems: 'start' }}>
            <div>
              <label
                style={{
                  width: 120,
                  height: 120,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                }}
                title="Upload item image"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="fas fa-camera" style={{ fontSize: 32, color: '#cbd5e1' }} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = () => setAvatarUrl(reader.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                  Item Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item Name"
                    required
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      padding: '0 30px 0 14px',
                      fontSize: 14,
                      color: '#1e293b',
                      background: '#f8fafc',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#ef4444',
                      fontSize: 16,
                      fontWeight: 700,
                      pointerEvents: 'none',
                    }}
                  >
                    *
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                  Item Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Item Code"
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
          </div>

          {/* Purpose & Type Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Purpose
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
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
                  <option value="Sales">Sales</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Both">Both</option>
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
                    color: '#94a3b8',
                    fontSize: 9,
                    lineHeight: '9px',
                  }}
                >
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
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
                    color: '#94a3b8',
                    fontSize: 9,
                    lineHeight: '9px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Unit Type
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
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          width: '100%',
                          fontSize: 14,
                          color: '#1e293b',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        {['Unit', 'Meter', 'Nos', 'Hours', 'Box', 'Sets', 'Kg', 'Pack', 'Bottle', 'Vial', 'Pcs'].map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-right" style={{ fontSize: 11, color: '#94a3b8' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Rate
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
                        value={rate || ''}
                        onChange={(e) => setRate(Number(e.target.value))}
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

                <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Item Description"
                    rows={3}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      padding: '10px 14px',
                      fontSize: 13.5,
                      color: '#1e293b',
                      background: '#ffffff',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 2: Accounts */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setAccountsOpen(!accountsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: accountsOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Accounts</h3>
              <i
                className={`fas fa-chevron-${accountsOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {accountsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Sales Acc.
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={incomeAccount}
                        onChange={(e) => setIncomeAccount(e.target.value)}
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
                        <option value="Income">Income</option>
                        <option value="Sales">Sales</option>
                        <option value="Operating Revenue">Operating Revenue</option>
                        <option value="Other Income">Other Income</option>
                        {accounts.filter((a) => a.rootType === 'Income' && !a.isGroup).map((a) => (
                          <option key={a.id} value={a.name}>{a.name}</option>
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
                          fontSize: 9,
                          lineHeight: '9px',
                        }}
                      >
                        <span>▲</span>
                        <span>▼</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Purchase Acc.
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={expenseAccount}
                        onChange={(e) => setExpenseAccount(e.target.value)}
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
                        <option value="Expense">Expense</option>
                        <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                        <option value="Operating Expense">Operating Expense</option>
                        {accounts.filter((a) => a.rootType === 'Expense' && !a.isGroup).map((a) => (
                          <option key={a.id} value={a.name}>{a.name}</option>
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
                          fontSize: 9,
                          lineHeight: '9px',
                        }}
                      >
                        <span>▲</span>
                        <span>▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Tax
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={taxTemplateName}
                      onChange={(e) => {
                        setTaxTemplateName(e.target.value);
                        const parsed = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(parsed)) setTaxRate(parsed);
                      }}
                      style={{
                        width: '100%',
                        height: 44,
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        padding: '0 36px 0 14px',
                        fontSize: 14,
                        color: taxTemplateName === 'Tax' ? '#64748b' : '#1e293b',
                        background: '#ffffff',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Tax">Tax</option>
                      <option value="GST-0%">GST 0%</option>
                      <option value="GST-5%">GST 5%</option>
                      <option value="GST-12%">GST 12%</option>
                      <option value="GST-18%">GST 18%</option>
                      <option value="GST-28%">GST 28%</option>
                      {taxTemplates.map((t) => (
                        <option key={t.name} value={t.name}>{t.name} ({t.rate}%)</option>
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
                        color: '#94a3b8',
                        fontSize: 9,
                        lineHeight: '9px',
                      }}
                    >
                      <span>▲</span>
                      <span>▼</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section 3: Inventory */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 24 }}>
            <div
              onClick={() => setInventoryOpen(!inventoryOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: inventoryOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Inventory</h3>
              <i
                className={`fas fa-chevron-${inventoryOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {inventoryOpen && (
              <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                  HSN/SAC
                </label>
                <input
                  type="text"
                  value={hsnSac}
                  onChange={(e) => setHsnSac(e.target.value)}
                  placeholder="HSN/SAC Code"
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
                setEntryStatus('Draft');
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
              onClick={() => setEntryStatus('Submitted')}
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
