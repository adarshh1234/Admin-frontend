import { useState, useEffect, useMemo } from 'react';
import type {
  CompanyUser,
  AccountStatus,
  VerificationStatus,
  UserSummaryStats,
} from '../../types/platformUsers';
import { platformUsersService } from '../../services/platformUsers.service';
import { PlatformSummaryCards } from './PlatformSummaryCards';
import { AccountStatusBadge, VerificationBadge } from './PlatformStatusBadge';
import { ConfirmationModal, ActivityModal, DocumentList } from './PlatformModals';
import { PlatformPagination } from './PlatformPagination';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useToast } from '../../hooks/useToast';

export function CompaniesManagement() {
  const { showToast } = useToast();

  const [companies, setCompanies] = useState<CompanyUser[]>([]);
  const [stats, setStats] = useState<UserSummaryStats>({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [search, setSearch] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CompanyUser>('registrationDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Modals
  const [selectedCompany, setSelectedCompany] = useState<CompanyUser | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [activityModalOpen, setActivityModalOpen] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    variant?: 'danger' | 'warning' | 'primary' | 'success';
    confirmLabel?: string;
  }>({
    open: false,
    title: '',
    message: '',
    action: async () => {},
  });

  const [editForm, setEditForm] = useState<Partial<CompanyUser>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        platformUsersService.getCompanies(),
        platformUsersService.getCompanyStats(),
      ]);
      setCompanies(list);
      setStats(s);
    } catch (err) {
      showToast('Failed to load companies data.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.industry.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase());

        const matchesAccount = accountFilter === 'all' || c.accountStatus === accountFilter;
        const matchesVerification = verificationFilter === 'all' || c.verificationStatus === verificationFilter;
        const matchesSize = sizeFilter === 'all' || c.companySize === sizeFilter;

        return matchesSearch && matchesAccount && matchesVerification && matchesSize;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? '';
        const valB = b[sortField] ?? '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [companies, search, accountFilter, verificationFilter, sizeFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(start, start + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  function handleSort(field: keyof CompanyUser) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  function openAddModal() {
    setEditForm({
      name: '',
      contactPerson: '',
      contactRole: 'HR Director',
      email: '',
      phone: '',
      industry: 'Healthcare & Hospital Networks',
      location: '',
      companySize: '50-200',
      website: '',
      description: '',
      activeHiringPositions: 5,
      accountStatus: 'Active',
      verificationStatus: 'Verified',
      documents: [],
    });
    setEditModalOpen(true);
  }

  function openEditModal(c: CompanyUser) {
    setSelectedCompany(c);
    setEditForm({ ...c });
    setEditModalOpen(true);
  }

  async function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      showToast('Company Name and Email are required.', 'error');
      return;
    }
    try {
      await platformUsersService.saveCompany(editForm);
      showToast(editForm.id ? 'Company updated successfully.' : 'Company registered successfully.', 'success');
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save company.', 'error');
    }
  }

  function handleToggleAccountStatus(c: CompanyUser) {
    const newStatus: AccountStatus = c.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setConfirmModal({
      open: true,
      title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} Company Account`,
      message: `Change account status of ${c.name} to ${newStatus}?`,
      variant: newStatus === 'Active' ? 'success' : 'warning',
      confirmLabel: newStatus === 'Active' ? 'Activate' : 'Deactivate',
      action: async () => {
        await platformUsersService.updateCompanyStatus(c.id, newStatus);
        showToast(`Company account ${newStatus === 'Active' ? 'activated' : 'deactivated'}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleSuspend(c: CompanyUser) {
    setConfirmModal({
      open: true,
      title: 'Suspend Company Account',
      message: `Are you sure you want to suspend ${c.name}? All active job requisitions and candidate communications will be paused.`,
      variant: 'danger',
      confirmLabel: 'Suspend Company',
      action: async () => {
        await platformUsersService.updateCompanyStatus(c.id, 'Suspended');
        showToast('Company suspended.', 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleDelete(c: CompanyUser) {
    setConfirmModal({
      open: true,
      title: 'Delete Company Account',
      message: `Permanently delete enterprise partner ${c.name} (${c.id})? This cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete Permanently',
      action: async () => {
        await platformUsersService.deleteCompany(c.id);
        showToast('Company permanently deleted.', 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleVerifyStatus(c: CompanyUser, status: VerificationStatus) {
    setConfirmModal({
      open: true,
      title: `${status === 'Verified' ? 'Verify' : 'Reject'} Enterprise Account`,
      message: `Change verification status of ${c.name} to ${status}?`,
      variant: status === 'Verified' ? 'success' : 'danger',
      confirmLabel: status === 'Verified' ? 'Approve & Verify' : 'Reject Verification',
      action: async () => {
        await platformUsersService.updateCompanyStatus(c.id, undefined, status);
        showToast(`Company verification updated to ${status}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
        if (selectedCompany && selectedCompany.id === c.id) {
          setSelectedCompany((prev) => (prev ? { ...prev, verificationStatus: status } : null));
        }
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner */}
      <div
        className="panel"
        style={{
          padding: '24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0b1a33 0%, #1e3a8a 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 10px 25px rgba(6, 40, 79, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              <i className="fas fa-building" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Companies
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#93c5fd' }}>
                Manage all enterprise, corporate, and hiring partner company accounts on LetGetIn.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              background: filterOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
              color: filterOpen ? '#1e3a8a' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: 13,
            }}
          >
            <i className="fas fa-filter" style={{ marginRight: 6 }} />
            {filterOpen ? 'Hide Filters' : 'Filters'}
          </Button>

          <Button
            variant="primary"
            onClick={openAddModal}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              fontSize: 13,
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Company
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <PlatformSummaryCards stats={stats} entityName="Companies" icon="fa-building" />

      {/* Filter Drawer */}
      {filterOpen && (
        <div
          className="panel"
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>Account Status:</span>
            <select
              value={accountFilter}
              onChange={(e) => {
                setAccountFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: 12.5, background: '#ffffff' }}
            >
              <option value="all">All Accounts</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>Verification:</span>
            <select
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: 12.5, background: '#ffffff' }}
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>Company Size:</span>
            <select
              value={sizeFilter}
              onChange={(e) => {
                setSizeFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: 12.5, background: '#ffffff' }}
            >
              <option value="all">All Sizes</option>
              <option value="1-10">1-10</option>
              <option value="10-50">10-50</option>
              <option value="50-200">50-200</option>
              <option value="200-500">200-500</option>
              <option value="500-1000">500-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAccountFilter('all');
              setVerificationFilter('all');
              setSizeFilter('all');
              setSearch('');
              setCurrentPage(1);
            }}
            style={{ marginLeft: 'auto', fontSize: 12 }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Table Panel */}
      <div className="panel" style={{ padding: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid #e9edf4', background: '#ffffff' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9edf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Input
              type="text"
              placeholder="Search companies by name, contact, industry, city…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: 34, height: 38, width: '100%', fontSize: 13 }}
            />
            <i
              className="fas fa-search"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}
            />
          </div>

          <div style={{ fontSize: 13, color: '#64748b' }}>
            Found <strong style={{ color: '#0f172a' }}>{filteredCompanies.length}</strong> enterprise partners
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                <th
                  onClick={() => handleSort('name')}
                  style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Company {sortField === 'name' && <i className={`fas fa-sort-${sortAsc ? 'up' : 'down'}`} style={{ marginLeft: 4 }} />}
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Contact Person</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Industry</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Location</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Verification</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Account Status</th>
                <th
                  onClick={() => handleSort('registrationDate')}
                  style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Registered {sortField === 'registrationDate' && <i className={`fas fa-sort-${sortAsc ? 'up' : 'down'}`} style={{ marginLeft: 4 }} />}
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: 8, fontSize: 18 }} />
                    Loading companies…
                  </td>
                </tr>
              ) : paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 10 }}><i className="fas fa-building" /></div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>No companies found</div>
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    {/* Name + Logo */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: '#eff6ff',
                            fontSize: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {c.logo || '🏢'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>ID: {c.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{c.contactPerson}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{c.contactRole}</div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {c.email}
                    </td>

                    {/* Industry */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 600 }}>
                        {c.industry}
                      </span>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#94a3b8', marginRight: 5 }} />
                      {c.location}
                    </td>

                    {/* Company Size */}
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>
                      {c.companySize}
                    </td>

                    {/* Verification Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <VerificationBadge status={c.verificationStatus} />
                    </td>

                    {/* Account Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <AccountStatusBadge status={c.accountStatus} />
                    </td>

                    {/* Registration Date */}
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {c.registrationDate}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          title="View Company Details"
                          onClick={() => {
                            setSelectedCompany(c);
                            setDetailModalOpen(true);
                          }}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        >
                          <i className="fas fa-eye" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit Company"
                          onClick={() => openEditModal(c)}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        >
                          <i className="fas fa-edit" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title={c.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleAccountStatus(c)}
                          style={{
                            padding: '4px 8px',
                            fontSize: 12,
                            color: c.accountStatus === 'Active' ? '#ca8a04' : '#16a34a',
                          }}
                        >
                          <i className={`fas ${c.accountStatus === 'Active' ? 'fa-pause' : 'fa-play'}`} />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Suspend Company"
                          onClick={() => handleSuspend(c)}
                          style={{ padding: '4px 8px', fontSize: 12, color: '#dc2626' }}
                        >
                          <i className="fas fa-ban" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="View Activity Log"
                          onClick={() => {
                            setSelectedCompany(c);
                            setActivityModalOpen(true);
                          }}
                          style={{ padding: '4px 8px', fontSize: 12, color: '#2563eb' }}
                        >
                          <i className="fas fa-history" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete Company"
                          onClick={() => handleDelete(c)}
                          style={{ padding: '4px 8px', fontSize: 12, color: '#dc2626', borderColor: '#fecaca' }}
                        >
                          <i className="fas fa-trash-alt" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PlatformPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCompanies.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* COMPANY DETAILS MODAL */}
      {detailModalOpen && selectedCompany && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 700,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: '#eff6ff',
                    fontSize: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedCompany.logo || '🏢'}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                    {selectedCompany.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <AccountStatusBadge status={selectedCompany.accountStatus} />
                    <VerificationBadge status={selectedCompany.verificationStatus} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>Size: {selectedCompany.companySize} • Registered {selectedCompany.registrationDate}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: '#94a3b8', cursor: 'pointer' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Admin / Contact Lead
                </h4>
                <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}><strong>Lead Contact:</strong> {selectedCompany.contactPerson}</div>
                  <div style={{ marginBottom: 6 }}><strong>Designation:</strong> {selectedCompany.contactRole || 'HR Lead'}</div>
                  <div style={{ marginBottom: 6 }}><strong>Direct Email:</strong> {selectedCompany.email}</div>
                  <div><strong>Phone:</strong> {selectedCompany.phone}</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Enterprise Overview
                </h4>
                <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}><strong>Industry:</strong> {selectedCompany.industry}</div>
                  <div style={{ marginBottom: 6 }}><strong>Location:</strong> {selectedCompany.location}</div>
                  <div style={{ marginBottom: 6 }}><strong>Open Positions:</strong> {selectedCompany.activeHiringPositions || 0} Requisitions</div>
                  <div><strong>Website:</strong> <a href={selectedCompany.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedCompany.website}</a></div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Company Description
              </h4>
              <div style={{ background: '#fafcff', padding: 14, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                {selectedCompany.description}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Corporate Verification Documents
              </h4>
              <DocumentList
                documents={selectedCompany.documents}
                onDownload={(d) => showToast(`Opening document ${d.name}…`, 'info')}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f1f5f9',
                padding: '14px 18px',
                borderRadius: 10,
                marginTop: 20,
              }}
            >
              <div style={{ fontSize: 12.5, color: '#475569' }}>
                <strong>Verification:</strong> {selectedCompany.verificationStatus}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedCompany.verificationStatus !== 'Verified' && (
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                    onClick={() => handleVerifyStatus(selectedCompany, 'Verified')}
                  >
                    <i className="fas fa-check" style={{ marginRight: 4 }} /> Verify Company
                  </Button>
                )}
                {selectedCompany.verificationStatus !== 'Rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => handleVerifyStatus(selectedCompany, 'Rejected')}
                  >
                    <i className="fas fa-times" style={{ marginRight: 4 }} /> Reject Verification
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {editModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setEditModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                {editForm.id ? `Edit Company: ${editForm.name}` : 'Add New Hiring Partner'}
              </h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Company Name *
                  </label>
                  <Input
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. Apollo Health City"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Logo Emoji
                  </label>
                  <Input
                    value={editForm.logo || ''}
                    onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                    placeholder="🏥 or 🏢"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Contact Person Name *
                  </label>
                  <Input
                    required
                    value={editForm.contactPerson || ''}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Kulkarni"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Official Email *
                  </label>
                  <Input
                    required
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="careers@apollohealthcity.com"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Industry
                  </label>
                  <Input
                    value={editForm.industry || ''}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    placeholder="Healthcare & Hospitals"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Company Size
                  </label>
                  <select
                    value={editForm.companySize || '50-200'}
                    onChange={(e) => setEditForm({ ...editForm, companySize: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="10-50">10-50 Employees</option>
                    <option value="50-200">50-200 Employees</option>
                    <option value="200-500">200-500 Employees</option>
                    <option value="500-1000">500-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    HQ Location
                  </label>
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Hyderabad, Telangana"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Website URL
                  </label>
                  <Input
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="https://apollohealthcity.com"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Company Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Overview of company operations and hiring profile..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fas fa-save" style={{ marginRight: 6 }} /> Save Company
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      <ActivityModal
        isOpen={activityModalOpen}
        entityName={selectedCompany?.name || 'Company'}
        activities={selectedCompany?.recentActivity || []}
        onClose={() => setActivityModalOpen(false)}
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
