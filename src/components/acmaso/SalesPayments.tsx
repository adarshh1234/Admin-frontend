import React, { useEffect, useState, useMemo } from 'react';
import { acmasoService } from '../../services/acmaso.service';
import type { SalesPayment, Party, SalesInvoice, Account, PaymentMethod } from '../../types/acmaso';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Loader } from '../common/Loader';
import { useToast } from '../../hooks/useToast';
import { PaymentDetailModal, CreatePaymentModal } from './payments';

export const SalesPayments: React.FC = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<SalesPayment[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [_accounts, setAccounts] = useState<Account[]>([]);
  const [_paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination
  const [search, setSearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'All'>(50);

  // Modals & Details
  const [showModal, setShowModal] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<SalesPayment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [payRes, partyRes, invRes, accRes, methodRes] = await Promise.all([
        acmasoService.getSalesPayments(),
        acmasoService.getParties('Customer'),
        acmasoService.getSalesInvoices(),
        acmasoService.getAccounts(),
        acmasoService.getPaymentMethods(),
      ]);
      setPayments(payRes || []);
      setParties(partyRes || []);
      setInvoices(invRes || []);
      setAccounts(accRes || []);
      setPaymentMethods(methodRes || []);
    } catch {
      showToast('Failed to load received payments.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(payment: SalesPayment) {
    if (!window.confirm(`Delete receipt ${payment.paymentNumber}? This will revert the bank balance and restore the unpaid amount on any allocated invoices.`))
      return;
    try {
      await acmasoService.deleteSalesPayment(payment.id);
      showToast(`Payment receipt ${payment.paymentNumber} deleted.`, 'info');
      setViewingPayment(null);
      loadData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Delete failed: ${errorMsg}`, 'error');
    }
  }

  function handleExportCsv() {
    if (payments.length === 0) {
      showToast('No payments to export.', 'info');
      return;
    }
    const headers = ['#', 'Payment No', 'Status', 'Party', 'Posting Date', 'Amount'];
    const rows = filtered.map((p, idx) => [
      idx + 1,
      p.paymentNumber || p.id,
      p.status || 'Submitted',
      p.party,
      p.date,
      p.amount,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_payments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.party.toLowerCase().includes(search.toLowerCase()) ||
        (p.referenceNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.notes || '').toLowerCase().includes(search.toLowerCase());

      const matchMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, search, methodFilter]);

  const effectivePageSize = pageSize === 'All' ? filtered.length || 1 : pageSize;
  const totalPages = Math.ceil(filtered.length / effectivePageSize) || 1;
  const paginatedPayments = useMemo(() => {
    if (pageSize === 'All') return filtered;
    const start = (currentPage - 1) * effectivePageSize;
    return filtered.slice(start, start + effectivePageSize);
  }, [filtered, currentPage, effectivePageSize, pageSize]);

  return (
    <div style={{ background: '#ffffff', minHeight: '100%', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
      {/* Frappe Books Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #f1f5f9',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search toggle & Nav buttons */}
          <div style={{ display: 'inline-flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              style={{
                background: showSearchInput ? '#f1f5f9' : '#ffffff',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#64748b',
                borderRight: '1px solid #e2e8f0',
              }}
              title="Search"
            >
              <i className="fas fa-search" style={{ fontSize: 13 }} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                background: '#ffffff',
                border: 'none',
                padding: '8px 12px',
                cursor: currentPage > 1 ? 'pointer' : 'default',
                color: currentPage > 1 ? '#64748b' : '#cbd5e1',
                borderRight: '1px solid #e2e8f0',
              }}
              title="Previous Page"
            >
              <i className="fas fa-chevron-left" style={{ fontSize: 11 }} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                background: '#ffffff',
                border: 'none',
                padding: '8px 12px',
                cursor: currentPage < totalPages ? 'pointer' : 'default',
                color: currentPage < totalPages ? '#64748b' : '#cbd5e1',
              }}
              title="Next Page"
            >
              <i className="fas fa-chevron-right" style={{ fontSize: 11 }} />
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setMethodFilter('All')}
              style={{
                background: methodFilter === 'All' ? '#f1f5f9' : 'transparent',
                border: '1px solid',
                borderColor: methodFilter === 'All' ? '#cbd5e1' : '#e2e8f0',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12.5,
                fontWeight: 500,
                color: methodFilter === 'All' ? '#1e293b' : '#64748b',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            <button
              onClick={() => setMethodFilter('Cash')}
              style={{
                background: methodFilter === 'Cash' ? '#f1f5f9' : 'transparent',
                border: '1px solid',
                borderColor: methodFilter === 'Cash' ? '#cbd5e1' : '#e2e8f0',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12.5,
                fontWeight: 500,
                color: methodFilter === 'Cash' ? '#1e293b' : '#64748b',
                cursor: 'pointer',
              }}
            >
              Cash
            </button>
            <button
              onClick={() => setMethodFilter('Bank Transfer (NEFT/RTGS/IMPS)')}
              style={{
                background: methodFilter === 'Bank Transfer (NEFT/RTGS/IMPS)' ? '#f1f5f9' : 'transparent',
                border: '1px solid',
                borderColor: methodFilter === 'Bank Transfer (NEFT/RTGS/IMPS)' ? '#cbd5e1' : '#e2e8f0',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 12.5,
                fontWeight: 500,
                color: methodFilter === 'Bank Transfer (NEFT/RTGS/IMPS)' ? '#1e293b' : '#64748b',
                cursor: 'pointer',
              }}
            >
              Bank Transfer
            </button>

            {/* Filter Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{
                  background: showFilterDropdown ? '#f1f5f9' : 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <i className="fas fa-filter" style={{ fontSize: 11 }} /> Filter
              </button>

              {showFilterDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: '#ffffff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: 8,
                    zIndex: 50,
                    width: 200,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Payment Method
                  </div>
                  {['All', 'Cash', 'Bank Transfer (NEFT/RTGS/IMPS)', 'UPI / Online QR', 'Cheque / Draft'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMethodFilter(m);
                        setShowFilterDropdown(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '6px 8px',
                        fontSize: 12.5,
                        background: methodFilter === m ? '#f8fafc' : 'transparent',
                        color: methodFilter === m ? '#2563eb' : '#334155',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: methodFilter === m ? 600 : 400,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleExportCsv}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12.5,
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <i className="fas fa-file-export" style={{ fontSize: 11 }} /> Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#1e293b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <i className="fas fa-plus" style={{ fontSize: 11 }} /> Make Entry
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearchInput && (
        <div style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <Input
            placeholder="Search by Payment #, Party, Reference, or Notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400, background: '#ffffff' }}
          />
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Loader label="Loading payments received..." />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            color: '#64748b',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              border: '2px solid #cbd5e1',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <i className="far fa-file-lines" style={{ fontSize: 32, color: '#94a3b8' }} />
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 16, fontWeight: 500 }}>No entries found</div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#1e293b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Make Entry
          </button>
        </div>
      ) : (
        /* Table */
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ width: 40, padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Payment No</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Party</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Posting Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((p, idx) => {
                const globalIndex = pageSize === 'All' ? idx + 1 : (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setViewingPayment(p)}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{globalIndex}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>{p.paymentNumber || p.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#16a34a',
                          padding: '3px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {p.status || 'Submitted'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{p.party}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                      ₹ {Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Frappe Books Bottom Pagination Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          borderTop: '1px solid #f1f5f9',
          fontSize: 13,
          color: '#64748b',
        }}
      >
        <div>
          {filtered.length === 0
            ? '0'
            : pageSize === 'All'
            ? `1 - ${filtered.length}`
            : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filtered.length)}`}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            style={{
              background: 'none',
              border: 'none',
              cursor: currentPage > 1 ? 'pointer' : 'default',
              color: currentPage > 1 ? '#64748b' : '#cbd5e1',
            }}
          >
            <i className="fas fa-chevron-left" style={{ fontSize: 11 }} />
          </button>
          <span style={{ fontSize: 12.5, color: '#475569' }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              background: 'none',
              border: 'none',
              cursor: currentPage < totalPages ? 'pointer' : 'default',
              color: currentPage < totalPages ? '#64748b' : '#cbd5e1',
            }}
          >
            <i className="fas fa-chevron-right" style={{ fontSize: 11 }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[50, 100, 'All'].map((sz) => (
            <button
              key={sz}
              onClick={() => {
                setPageSize(sz as number | 'All');
                setCurrentPage(1);
              }}
              style={{
                background: pageSize === sz ? '#f1f5f9' : 'transparent',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 12.5,
                fontWeight: pageSize === sz ? 600 : 400,
                color: pageSize === sz ? '#1e293b' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        payment={viewingPayment}
        onClose={() => setViewingPayment(null)}
        onDelete={handleDelete}
      />

      {/* Create / Edit Payment Modal */}
      <CreatePaymentModal
        isOpen={showModal}
        parties={parties}
        invoices={invoices}
        onClose={() => setShowModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default SalesPayments;
