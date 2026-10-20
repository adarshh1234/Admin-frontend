import React, { useState, useEffect } from 'react';
import { acmasoService } from '../../../services/acmaso.service';
import { useToast } from '../../../hooks/useToast';
import type { CreateEditCustomerModalProps } from './types';

export const CreateEditCustomerModal: React.FC<CreateEditCustomerModalProps> = ({
  isOpen,
  editingCustomer,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Customer');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [defaultAccount, setDefaultAccount] = useState('Debtors');
  const [currency, setCurrency] = useState('INR');
  const [gstRegistration, setGstRegistration] = useState('Unregistered');
  const [fromLead, setFromLead] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Maharashtra');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [entryStatus, setEntryStatus] = useState<'Draft' | 'Submitted'>('Submitted');

  // Collapsible Sections
  const [contactsOpen, setContactsOpen] = useState(true);
  const [billingOpen, setBillingOpen] = useState(true);
  const [referencesOpen, setReferencesOpen] = useState(true);

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setRole(editingCustomer.role || 'Customer');
      setAvatarUrl('');
      setEmail(editingCustomer.email || '');
      setPhone(editingCustomer.phone || '');
      setAddress(editingCustomer.address || '');
      setDefaultAccount(editingCustomer.defaultAccount || 'Debtors');
      setCurrency('INR');
      setGstRegistration(editingCustomer.gstin ? 'Registered Regular' : 'Unregistered');
      setFromLead('');
      setGstin(editingCustomer.gstin || '');
      setPan(editingCustomer.pan || '');
      setPlaceOfSupply(editingCustomer.placeOfSupply || 'Maharashtra');
      setOpeningBalance(editingCustomer.openingBalance || 0);
      setStatus((editingCustomer.status as 'Active' | 'Inactive') || 'Active');
      setEntryStatus('Submitted');
    } else {
      setName('');
      setRole('Customer');
      setAvatarUrl('');
      setEmail('');
      setPhone('');
      setAddress('');
      setDefaultAccount('Debtors');
      setCurrency('INR');
      setGstRegistration('Unregistered');
      setFromLead('');
      setGstin('');
      setPan('');
      setPlaceOfSupply('Maharashtra');
      setOpeningBalance(0);
      setStatus('Active');
      setEntryStatus('Submitted');
    }
    setContactsOpen(true);
    setBillingOpen(true);
    setReferencesOpen(true);
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Customer name is required.', 'error');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        role: 'Customer' as const,
        gstin: gstin.trim().toUpperCase(),
        pan: pan.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        placeOfSupply,
        defaultAccount: defaultAccount || 'Debtors',
        openingBalance: Number(openingBalance) || 0,
        status,
      };

      if (editingCustomer) {
        await acmasoService.updateParty(editingCustomer.id, payload);
        showToast('Customer updated successfully.', 'success');
      } else {
        await acmasoService.createParty(payload);
        showToast('Customer created successfully.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Save customer failed: ${errorMsg}`, 'error');
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
              {editingCustomer ? 'Edit Customer' : 'New Entry'}
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
          {/* Top Section: Avatar Box (Left) + Name & Role (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, marginBottom: 20, alignItems: 'start' }}>
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
                title="Upload customer photo or logo"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
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
                  Role
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    <option value="Customer">Customer</option>
                    <option value="Client">Client</option>
                    <option value="Patient">Patient</option>
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
          </div>

          {/* Collapsible Section 1: Contacts */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setContactsOpen(!contactsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: contactsOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Contacts</h3>
              <i
                className={`fas fa-chevron-${contactsOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {contactsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@doe.com"
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
                      Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
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

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
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

          {/* Collapsible Section 2: Billing */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18, marginBottom: 18 }}>
            <div
              onClick={() => setBillingOpen(!billingOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: billingOpen ? 14 : 0,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Billing</h3>
              <i
                className={`fas fa-chevron-${billingOpen ? 'up' : 'down'}`}
                style={{ fontSize: 12, color: '#94a3b8' }}
              />
            </div>

            {billingOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                      Default Account
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={defaultAccount}
                        onChange={(e) => setDefaultAccount(e.target.value)}
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
                        <option value="Customer Clearing A/c">Customer Clearing A/c</option>
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
                      Currency
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
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
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AED">AED</option>
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

                <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                    GST Registration
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={gstRegistration}
                      onChange={(e) => setGstRegistration(e.target.value)}
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
                      <option value="Unregistered">Unregistered</option>
                      <option value="Registered Regular">Registered Regular</option>
                      <option value="Registered Composition">Registered Composition</option>
                      <option value="Overseas">Overseas</option>
                      <option value="SEZ">SEZ</option>
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
              <div style={{ maxWidth: 'calc(50% - 9px)' }}>
                <label style={{ display: 'block', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                  From Lead
                </label>
                <input
                  type="text"
                  value={fromLead}
                  onChange={(e) => setFromLead(e.target.value)}
                  placeholder="From Lead"
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
