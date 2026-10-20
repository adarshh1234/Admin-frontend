import React, { useEffect, useState, useMemo } from 'react';
import { acmasoService } from '../../services/acmaso.service';
import type { SalesInvoice, Party, Item, TaxTemplate } from '../../types/acmaso';
import { Input } from '../common/Input';
import { Loader } from '../common/Loader';
import { useToast } from '../../hooks/useToast';
import { InvoicePrintModal } from './InvoicePrintModal';
import {
  InvoicePaymentModal,
  InvoiceDetailModal,
  CreateEditInvoiceModal,
  type FormLineItem,
} from './invoices';

export const SalesInvoices: React.FC = () => {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [_taxTemplates, setTaxTemplates] = useState<TaxTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination
  const [search, setSearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Submitted' | 'Draft' | 'Cancelled'>('All');
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Paid' | 'Partially Paid' | 'Unpaid'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'All'>(50);

  // Modals & Details
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<SalesInvoice | null>(null);
  const [activePrintDoc, setActivePrintDoc] = useState<SalesInvoice | null>(null);

  // Record Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<SalesInvoice | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [invoicesRes, partiesRes, itemsRes, taxRes] = await Promise.all([
        acmasoService.getSalesInvoices(),
        acmasoService.getParties('Customer'),
        acmasoService.getItems(),
        acmasoService.getTaxTemplates(),
      ]);
      setInvoices(invoicesRes);
      setParties(partiesRes);
      setItems(itemsRes);
      setTaxTemplates(taxRes);
    } catch {
      showToast('Failed to load sales invoices', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingInvoice(null);
    setShowCreateModal(true);
  }

  function handleEditInvoice(inv: SalesInvoice) {
    setEditingInvoice(inv);
    setViewingInvoice(null);
    setShowCreateModal(true);
  }

  async function handleSaveInvoice(data: {
    party: string;
    date: string;
    dueDate: string;
    placeOfSupply: string;
    account: string;
    notes: string;
    status: 'Submitted' | 'Draft';
    lineItems: FormLineItem[];
    totals: { netTotal: number; totalTax: number; grandTotal: number };
  }) {
    if (!data.party) {
      showToast('Please select a Customer', 'warning');
      return;
    }

    try {
      const payload: Partial<SalesInvoice> = {
        party: data.party,
        date: data.date,
        dueDate: data.dueDate,
        placeOfSupply: data.placeOfSupply,
        status: data.status,
        notes: data.notes,
        netTotal: data.totals.netTotal,
        totalTax: data.totals.totalTax,
        grandTotal: data.totals.grandTotal,
        outstandingAmount: data.totals.grandTotal,
        items: data.lineItems.map((li) => ({
          item: li.item,
          name: li.name,
          quantity: li.quantity,
          rate: li.rate,
          amount: (li.quantity * li.rate) - (li.discountAmount || 0),
          discountPercent: li.discountPercent,
          discountAmount: li.discountAmount,
          taxRate: li.taxRate,
          total: (li.quantity * li.rate),
          account: li.account,
        })),
      };

      if (editingInvoice) {
        await acmasoService.updateSalesInvoice(editingInvoice.id, payload);
        showToast('Sales Invoice updated successfully', 'success');
      } else {
        await acmasoService.createSalesInvoice(payload);
        showToast('Sales Invoice created successfully', 'success');
      }

      setShowCreateModal(false);
      setEditingInvoice(null);
      loadData();
    } catch {
      showToast('Failed to save Sales Invoice', 'error');
    }
  }

  async function handleCancelInvoice(invoiceId: string) {
    if (!window.confirm('Are you sure you want to cancel this invoice?')) return;
    try {
      await acmasoService.updateSalesInvoice(invoiceId, { status: 'Cancelled' });
      showToast('Invoice cancelled', 'info');
      setViewingInvoice(null);
      loadData();
    } catch {
      showToast('Failed to cancel invoice', 'error');
    }
  }

  function handleOpenPayment(inv: SalesInvoice) {
    setPaymentInvoice(inv);
    setShowPaymentModal(true);
  }

  async function handleSubmitPayment(paymentData: {
    amount: number;
    date: string;
    method: string;
    account: string;
    reference: string;
    notes: string;
  }) {
    if (!paymentInvoice) return;
    try {
      await acmasoService.createSalesPayment({
        party: paymentInvoice.party,
        partyType: 'Customer',
        amount: paymentData.amount,
        date: paymentData.date,
        modeOfPayment: paymentData.method,
        account: paymentData.account,
        reference: paymentData.reference,
        notes: paymentData.notes,
        allocations: [{ invoiceId: paymentInvoice.id, invoiceNumber: paymentInvoice.invoiceNumber, allocatedAmount: paymentData.amount }],
      });
      showToast(`Payment of ₹${paymentData.amount.toLocaleString('en-IN')} recorded successfully!`, 'success');
      setShowPaymentModal(false);
      setViewingInvoice(null);
      loadData();
    } catch {
      showToast('Failed to record payment', 'error');
    }
  }

  function handleExportCsv() {
    if (invoices.length === 0) {
      showToast('No invoices to export', 'warning');
      return;
    }
    const headers = ['Invoice No', 'Status', 'Payment Status', 'Customer', 'Date', 'Due Date', 'Grand Total', 'Outstanding'];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      inv.status,
      inv.paymentStatus,
      `"${inv.party}"`,
      inv.date,
      inv.dueDate || '',
      inv.grandTotal,
      inv.outstandingAmount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported sales invoices as CSV', 'success');
  }

  // Filter & Search computation
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        search === '' ||
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.party.toLowerCase().includes(search.toLowerCase()) ||
        String(inv.grandTotal).includes(search);
      const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchPayment = paymentFilter === 'All' || inv.paymentStatus === paymentFilter;
      return matchSearch && matchStatus && matchPayment;
    });
  }, [invoices, search, statusFilter, paymentFilter]);

  const totalPages = pageSize === 'All' ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedInvoices = useMemo(() => {
    if (pageSize === 'All') return filtered;
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => {
                setShowSearchInput(!showSearchInput);
                if (showSearchInput) setSearch('');
              }}
              style={{
                background: showSearchInput ? '#e2e8f0' : '#f1f5f9',
                border: 'none',
                borderRadius: 6,
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
              title="Toggle Search"
            >
              <i className="fas fa-search" style={{ fontSize: 13 }} />
            </button>
          </div>

          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Sales Invoice</h1>

          {showSearchInput && (
            <div style={{ position: 'relative', width: 220, marginLeft: 8 }}>
              <Input
                type="text"
                placeholder="Type to filter invoices..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                autoFocus
                style={{ height: 34, fontSize: 12.5, width: '100%', paddingLeft: 10 }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleExportCsv}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Export
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{
                background: paymentFilter !== 'All' || statusFilter !== 'All' ? '#e2e8f0' : '#f1f5f9',
                border: 'none',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                color: '#475569',
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
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  width: 200,
                  padding: 8,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 8px' }}>INVOICE STATUS</div>
                {(['All', 'Submitted', 'Draft', 'Cancelled'] as const).map((st) => (
                  <div
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: 13,
                      cursor: 'pointer',
                      borderRadius: 4,
                      background: statusFilter === st ? '#f1f5f9' : 'transparent',
                      fontWeight: statusFilter === st ? 600 : 400,
                      color: '#1e293b',
                    }}
                  >
                    {st}
                  </div>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '6px 8px 4px', borderTop: '1px solid #f1f5f9', marginTop: 4 }}>PAYMENT STATUS</div>
                {(['All', 'Paid', 'Partially Paid', 'Unpaid'] as const).map((ps) => (
                  <div
                    key={ps}
                    onClick={() => {
                      setPaymentFilter(ps);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: 13,
                      cursor: 'pointer',
                      borderRadius: 4,
                      background: paymentFilter === ps ? '#f1f5f9' : 'transparent',
                      fontWeight: paymentFilter === ps ? 600 : 400,
                      color: '#1e293b',
                    }}
                  >
                    {ps}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleOpenCreate}
            style={{
              background: '#1e293b',
              border: 'none',
              borderRadius: 6,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            title="Make Entry (New Sales Invoice)"
          >
            <i className="fas fa-plus" style={{ fontSize: 13 }} />
          </button>
        </div>
      </div>

      {/* Main Table / Content */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Loader label="Loading sales invoices..." />
        </div>
      ) : filtered.length === 0 ? (
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
            onClick={handleOpenCreate}
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
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ width: 40, padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Invoice No</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Base Grand Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Outstanding Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv, idx) => {
                const globalIndex = pageSize === 'All' ? idx + 1 : (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={inv.id}
                    onClick={() => setViewingInvoice(inv)}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{globalIndex}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
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
                              : '#ea580c',
                          padding: '3px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{inv.party}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{inv.date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                      ₹ {Number(inv.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: inv.outstandingAmount > 0 ? '#1e293b' : '#64748b' }}>
                      ₹ {Number(inv.outstandingAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
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

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        viewingInvoice={viewingInvoice}
        onClose={() => setViewingInvoice(null)}
        onEdit={handleEditInvoice}
        onPrint={(inv) => setActivePrintDoc(inv)}
        onOpenPayment={handleOpenPayment}
        onCancelInvoice={handleCancelInvoice}
      />

      {/* Record Payment Modal */}
      <InvoicePaymentModal
        paymentInvoice={showPaymentModal ? paymentInvoice : null}
        onClose={() => setShowPaymentModal(false)}
        onSubmitPayment={handleSubmitPayment}
      />

      {/* Create / Edit Invoice Modal */}
      <CreateEditInvoiceModal
        isOpen={showCreateModal}
        editingInvoice={editingInvoice}
        parties={parties}
        items={items}
        invoices={invoices}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveInvoice}
      />

      {/* Invoice Print Modal */}
      {activePrintDoc && (
        <InvoicePrintModal document={activePrintDoc} docType="SalesInvoice" onClose={() => setActivePrintDoc(null)} />
      )}
    </div>
  );
};

export default SalesInvoices;
