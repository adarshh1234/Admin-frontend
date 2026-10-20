import React, { useEffect, useState, useMemo } from 'react';
import { acmasoService } from '../../services/acmaso.service';
import type { SalesQuote, Party, Item } from '../../types/acmaso';
import { Input } from '../common/Input';
import { Loader } from '../common/Loader';
import { useToast } from '../../hooks/useToast';
import { InvoicePrintModal } from './InvoicePrintModal';
import {
  QuoteDetailModal,
  CreateEditQuoteModal,
  type FormLineItem,
} from './quotes';

export const SalesQuotes: React.FC = () => {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<SalesQuote[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination
  const [search, setSearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'All'>(50);

  // Modals & Details
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<SalesQuote | null>(null);
  const [viewingQuote, setViewingQuote] = useState<SalesQuote | null>(null);
  const [activePrintDoc, setActivePrintDoc] = useState<SalesQuote | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [quotesRes, partiesRes, itemsRes] = await Promise.all([
        acmasoService.getSalesQuotes(),
        acmasoService.getParties('Customer'),
        acmasoService.getItems(),
      ]);
      setQuotes(quotesRes || []);
      setParties(partiesRes || []);
      setItems(itemsRes || []);
    } catch {
      showToast('Failed to load sales quotations.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingQuote(null);
    setShowCreateModal(true);
  }

  function handleOpenEdit(q: SalesQuote) {
    setEditingQuote(q);
    setShowCreateModal(true);
  }

  async function handleSaveQuote(data: {
    party: string;
    date: string;
    validUntil: string;
    notes: string;
    status: 'Draft' | 'Sent';
    lineItems: FormLineItem[];
    totals: { netTotal: number; totalTax: number; grandTotal: number };
  }) {
    if (!data.party) {
      showToast('Please select a Customer', 'warning');
      return;
    }

    try {
      const payload: Partial<SalesQuote> = {
        party: data.party,
        date: data.date,
        validUntil: data.validUntil,
        status: data.status,
        notes: data.notes,
        netTotal: data.totals.netTotal,
        totalTax: data.totals.totalTax,
        grandTotal: data.totals.grandTotal,
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

      if (editingQuote) {
        await acmasoService.updateSalesQuote(editingQuote.id, payload);
        showToast('Sales Quotation updated successfully', 'success');
      } else {
        await acmasoService.createSalesQuote(payload);
        showToast('Sales Quotation created successfully', 'success');
      }

      setShowCreateModal(false);
      setEditingQuote(null);
      loadData();
    } catch {
      showToast('Failed to save Sales Quotation', 'error');
    }
  }

  async function handleUpdateStatus(quoteId: string, newStatus: SalesQuote['status']) {
    try {
      await acmasoService.updateSalesQuote(quoteId, { status: newStatus });
      showToast(`Quotation status updated to ${newStatus}`, 'success');
      setViewingQuote(null);
      loadData();
    } catch {
      showToast('Failed to update status', 'error');
    }
  }

  async function handleConvertToInvoice(quote: SalesQuote) {
    try {
      await acmasoService.createSalesInvoice({
        party: quote.party,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        notes: `Converted from Quotation #${quote.quoteNumber}`,
        netTotal: quote.netTotal,
        totalTax: quote.totalTax,
        grandTotal: quote.grandTotal,
        outstandingAmount: quote.grandTotal,
        items: quote.items,
      });
      await acmasoService.updateSalesQuote(quote.id, { status: 'Accepted' });
      showToast(`Quotation #${quote.quoteNumber} converted to Draft Sales Invoice!`, 'success');
      setViewingQuote(null);
      loadData();
    } catch {
      showToast('Failed to convert to Invoice', 'error');
    }
  }

  function handleExportCsv() {
    if (quotes.length === 0) {
      showToast('No quotations to export', 'warning');
      return;
    }
    const headers = ['Quotation No', 'Status', 'Customer', 'Date', 'Valid Until', 'Grand Total'];
    const rows = quotes.map((q) => [
      q.quoteNumber,
      q.status,
      `"${q.party}"`,
      q.date,
      q.validUntil || '',
      q.grandTotal,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Quotations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported sales quotations as CSV', 'success');
  }

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      const matchSearch =
        search === '' ||
        q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
        q.party.toLowerCase().includes(search.toLowerCase()) ||
        String(q.grandTotal).includes(search);
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotes, search, statusFilter]);

  const totalPages = pageSize === 'All' ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedQuotes = useMemo(() => {
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

          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Sales Quotation</h1>

          {showSearchInput && (
            <div style={{ position: 'relative', width: 220, marginLeft: 8 }}>
              <Input
                type="text"
                placeholder="Type to filter..."
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
                background: statusFilter !== 'All' ? '#e2e8f0' : '#f1f5f9',
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
                  width: 180,
                  padding: 8,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 8px' }}>STATUS</div>
                {(['All', 'Draft', 'Sent', 'Accepted', 'Declined', 'Expired'] as const).map((st) => (
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
            title="Make Entry (New Sales Quotation)"
          >
            <i className="fas fa-plus" style={{ fontSize: 13 }} />
          </button>
        </div>
      </div>

      {/* Main Table / Content */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Loader label="Loading sales quotations..." />
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
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Quote No</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Valid Until</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, color: '#64748b', fontSize: 12 }}>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotes.map((q, idx) => {
                const globalIndex = pageSize === 'All' ? idx + 1 : (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={q.id}
                    onClick={() => setViewingQuote(q)}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{globalIndex}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>{q.quoteNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          background:
                            q.status === 'Accepted'
                              ? '#dcfce7'
                              : q.status === 'Sent'
                              ? '#eff6ff'
                              : q.status === 'Declined'
                              ? '#fee2e2'
                              : '#f1f5f9',
                          color:
                            q.status === 'Accepted'
                              ? '#16a34a'
                              : q.status === 'Sent'
                              ? '#2563eb'
                              : q.status === 'Declined'
                              ? '#ea580c'
                              : '#64748b',
                          padding: '3px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{q.party}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{q.date}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{q.validUntil || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                      ₹ {Number(q.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* Quote Detail Modal */}
      <QuoteDetailModal
        viewingQuote={viewingQuote}
        onClose={() => setViewingQuote(null)}
        onEdit={handleOpenEdit}
        onPrint={(q) => setActivePrintDoc(q)}
        onConvertToInvoice={handleConvertToInvoice}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create / Edit Modal */}
      <CreateEditQuoteModal
        isOpen={showCreateModal}
        editingQuote={editingQuote}
        parties={parties}
        items={items}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveQuote}
      />

      {/* Print Modal */}
      {activePrintDoc && (
        <InvoicePrintModal document={activePrintDoc} docType="SalesQuote" onClose={() => setActivePrintDoc(null)} />
      )}
    </div>
  );
};

export default SalesQuotes;
