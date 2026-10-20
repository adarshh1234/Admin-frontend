import { useState, useEffect, useMemo } from 'react';
import type {
  InstitutionUser,
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

export function InstitutionsManagement() {
  const { showToast } = useToast();

  const [institutions, setInstitutions] = useState<InstitutionUser[]>([]);
  const [stats, setStats] = useState<UserSummaryStats>({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [search, setSearch] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof InstitutionUser>('registrationDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Modals
  const [selectedInst, setSelectedInst] = useState<InstitutionUser | null>(null);
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

  const [editForm, setEditForm] = useState<Partial<InstitutionUser>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        platformUsersService.getInstitutions(),
        platformUsersService.getInstitutionStats(),
      ]);
      setInstitutions(list);
      setStats(s);
    } catch (err) {
      showToast('Failed to load institutions data.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredInstitutions = useMemo(() => {
    return institutions
      .filter((i) => {
        const matchesSearch =
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
          i.email.toLowerCase().includes(search.toLowerCase()) ||
          i.institutionType.toLowerCase().includes(search.toLowerCase()) ||
          i.location.toLowerCase().includes(search.toLowerCase());

        const matchesAccount = accountFilter === 'all' || i.accountStatus === accountFilter;
        const matchesVerification = verificationFilter === 'all' || i.verificationStatus === verificationFilter;
        const matchesType = typeFilter === 'all' || i.institutionType === typeFilter;

        return matchesSearch && matchesAccount && matchesVerification && matchesType;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? '';
        const valB = b[sortField] ?? '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [institutions, search, accountFilter, verificationFilter, typeFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage) || 1;
  const paginatedInstitutions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInstitutions.slice(start, start + itemsPerPage);
  }, [filteredInstitutions, currentPage, itemsPerPage]);

  function handleSort(field: keyof InstitutionUser) {
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
      contactRole: 'Dean of Placements',
      email: '',
      phone: '',
      institutionType: 'Central University',
      location: '',
      website: '',
      description: '',
      accreditation: 'NAAC A++ / NIRF Top 10',
      totalStudents: '5,000+ Students',
      accountStatus: 'Active',
      verificationStatus: 'Verified',
      documents: [],
    });
    setEditModalOpen(true);
  }

  function openEditModal(inst: InstitutionUser) {
    setSelectedInst(inst);
    setEditForm({ ...inst });
    setEditModalOpen(true);
  }

  async function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      showToast('Institution Name and Official Email are required.', 'error');
      return;
    }
    try {
      await platformUsersService.saveInstitution(editForm);
      showToast(editForm.id ? 'Institution updated successfully.' : 'Institution registered successfully.', 'success');
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save institution.', 'error');
    }
  }

  function handleToggleAccountStatus(i: InstitutionUser) {
    const newStatus: AccountStatus = i.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setConfirmModal({
      open: true,
      title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} Institution Account`,
      message: `Change account status of ${i.name} to ${newStatus}?`,
      variant: newStatus === 'Active' ? 'success' : 'warning',
      confirmLabel: newStatus === 'Active' ? 'Activate' : 'Deactivate',
      action: async () => {
        await platformUsersService.updateInstitutionStatus(i.id, newStatus);
        showToast(`Institution account ${newStatus === 'Active' ? 'activated' : 'deactivated'}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleSuspend(i: InstitutionUser) {
    setConfirmModal({
      open: true,
      title: 'Suspend Institution Portal Access',
      message: `Are you sure you want to suspend ${i.name}? Campus drive coordination and student batch sync will be temporarily locked.`,
      variant: 'danger',
      confirmLabel: 'Suspend Institution',
      action: async () => {
        await platformUsersService.updateInstitutionStatus(i.id, 'Suspended');
        showToast('Institution suspended.', 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleDelete(i: InstitutionUser) {
    setConfirmModal({
      open: true,
      title: 'Delete Institution Record',
      message: `Permanently delete institution ${i.name} (${i.id}) from the platform? This cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete Permanently',
      action: async () => {
        await platformUsersService.deleteInstitution(i.id);
        showToast('Institution permanently deleted.', 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleVerifyStatus(i: InstitutionUser, status: VerificationStatus) {
    setConfirmModal({
      open: true,
      title: `${status === 'Verified' ? 'Verify' : 'Reject'} Educational Institution`,
      message: `Change verification status of ${i.name} to ${status}?`,
      variant: status === 'Verified' ? 'success' : 'danger',
      confirmLabel: status === 'Verified' ? 'Verify Institution' : 'Reject Verification',
      action: async () => {
        await platformUsersService.updateInstitutionStatus(i.id, undefined, status);
        showToast(`Institution verification updated to ${status}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
        if (selectedInst && selectedInst.id === i.id) {
          setSelectedInst((prev) => (prev ? { ...prev, verificationStatus: status } : null));
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
              <i className="fas fa-university" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Institutions
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#93c5fd' }}>
                Manage all universities, colleges, and educational institutions registered on LetGetIn.
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
            <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Institution
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <PlatformSummaryCards stats={stats} entityName="Institutions" icon="fa-university" />

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
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>Institution Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: 12.5, background: '#ffffff' }}
            >
              <option value="all">All Types</option>
              <option value="Central University">Central University</option>
              <option value="State University">State University</option>
              <option value="Engineering College">Engineering College</option>
              <option value="Medical Institute">Medical Institute</option>
              <option value="Business School">Business School</option>
              <option value="Research Academy">Research Academy</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAccountFilter('all');
              setVerificationFilter('all');
              setTypeFilter('all');
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
              placeholder="Search universities, colleges, contacts, location…"
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
            Found <strong style={{ color: '#0f172a' }}>{filteredInstitutions.length}</strong> institutions
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
                  Institution {sortField === 'name' && <i className={`fas fa-sort-${sortAsc ? 'up' : 'down'}`} style={{ marginLeft: 4 }} />}
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Contact Lead / Dean</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Institution Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>Location</th>
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
                  <td colSpan={9} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: 8, fontSize: 18 }} />
                    Loading institutions directory…
                  </td>
                </tr>
              ) : paginatedInstitutions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 10 }}><i className="fas fa-university" /></div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>No institutions match your search</div>
                  </td>
                </tr>
              ) : (
                paginatedInstitutions.map((inst) => (
                  <tr
                    key={inst.id}
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
                          {inst.logo || '🏛️'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{inst.name}</div>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>ID: {inst.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Lead */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{inst.contactPerson}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{inst.contactRole}</div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {inst.email}
                    </td>

                    {/* Institution Type */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 6, fontSize: 11.5, fontWeight: 600 }}>
                        {inst.institutionType}
                      </span>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#94a3b8', marginRight: 5 }} />
                      {inst.location}
                    </td>

                    {/* Verification Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <VerificationBadge status={inst.verificationStatus} />
                    </td>

                    {/* Account Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <AccountStatusBadge status={inst.accountStatus} />
                    </td>

                    {/* Registration Date */}
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {inst.registrationDate}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          title="View Institution Details"
                          onClick={() => {
                            setSelectedInst(inst);
                            setDetailModalOpen(true);
                          }}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        >
                          <i className="fas fa-eye" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit Institution"
                          onClick={() => openEditModal(inst)}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        >
                          <i className="fas fa-edit" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title={inst.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleAccountStatus(inst)}
                          style={{
                            padding: '4px 8px',
                            fontSize: 12,
                            color: inst.accountStatus === 'Active' ? '#ca8a04' : '#16a34a',
                          }}
                        >
                          <i className={`fas ${inst.accountStatus === 'Active' ? 'fa-pause' : 'fa-play'}`} />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Suspend Access"
                          onClick={() => handleSuspend(inst)}
                          style={{ padding: '4px 8px', fontSize: 12, color: '#dc2626' }}
                        >
                          <i className="fas fa-ban" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="View Activity Log"
                          onClick={() => {
                            setSelectedInst(inst);
                            setActivityModalOpen(true);
                          }}
                          style={{ padding: '4px 8px', fontSize: 12, color: '#2563eb' }}
                        >
                          <i className="fas fa-history" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete Institution"
                          onClick={() => handleDelete(inst)}
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
          totalItems={filteredInstitutions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* INSTITUTION DETAILS MODAL */}
      {detailModalOpen && selectedInst && (
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
                  {selectedInst.logo || '🏛️'}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                    {selectedInst.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <AccountStatusBadge status={selectedInst.accountStatus} />
                    <VerificationBadge status={selectedInst.verificationStatus} />
                    <span style={{ fontSize: 12, color: '#64748b' }}>{selectedInst.institutionType} • Registered {selectedInst.registrationDate}</span>
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
                  Dean / Placement Leadership
                </h4>
                <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}><strong>Lead Contact:</strong> {selectedInst.contactPerson}</div>
                  <div style={{ marginBottom: 6 }}><strong>Designation:</strong> {selectedInst.contactRole || 'Dean / Registrar'}</div>
                  <div style={{ marginBottom: 6 }}><strong>Official Email:</strong> {selectedInst.email}</div>
                  <div><strong>Phone:</strong> {selectedInst.phone}</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Campus &amp; Accreditation
                </h4>
                <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}><strong>Type:</strong> {selectedInst.institutionType}</div>
                  <div style={{ marginBottom: 6 }}><strong>Location:</strong> {selectedInst.location}</div>
                  <div style={{ marginBottom: 6 }}><strong>Ranking / Accreditation:</strong> {selectedInst.accreditation || 'NAAC A+'}</div>
                  <div style={{ marginBottom: 6 }}><strong>Student Strength:</strong> {selectedInst.totalStudents || 'N/A'}</div>
                  <div><strong>Website:</strong> <a href={selectedInst.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedInst.website}</a></div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Institution Overview
              </h4>
              <div style={{ background: '#fafcff', padding: 14, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                {selectedInst.description}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Affiliation &amp; Verification Documents
              </h4>
              <DocumentList
                documents={selectedInst.documents}
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
                <strong>Verification:</strong> {selectedInst.verificationStatus}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedInst.verificationStatus !== 'Verified' && (
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                    onClick={() => handleVerifyStatus(selectedInst, 'Verified')}
                  >
                    <i className="fas fa-check" style={{ marginRight: 4 }} /> Verify Institution
                  </Button>
                )}
                {selectedInst.verificationStatus !== 'Rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => handleVerifyStatus(selectedInst, 'Rejected')}
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
                {editForm.id ? `Edit Institution: ${editForm.name}` : 'Register New University / College'}
              </h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Institution Name *
                  </label>
                  <Input
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. IIT Kharagpur"
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
                    placeholder="🏛️ or 🎓"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Dean / Lead Contact *
                  </label>
                  <Input
                    required
                    value={editForm.contactPerson || ''}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                    placeholder="e.g. Prof. Debashis Sen"
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
                    placeholder="placement@iitkgp.ac.in"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Institution Type
                  </label>
                  <select
                    value={editForm.institutionType || 'Central University'}
                    onChange={(e) => setEditForm({ ...editForm, institutionType: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  >
                    <option value="Central University">Central University</option>
                    <option value="State University">State University</option>
                    <option value="Engineering College">Engineering College</option>
                    <option value="Medical Institute">Medical Institute</option>
                    <option value="Business School">Business School</option>
                    <option value="Research Academy">Research Academy</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Ranking / Accreditation
                  </label>
                  <Input
                    value={editForm.accreditation || ''}
                    onChange={(e) => setEditForm({ ...editForm, accreditation: e.target.value })}
                    placeholder="NAAC A++ / NIRF #5"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Campus Location
                  </label>
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Kharagpur, West Bengal"
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
                    placeholder="https://www.iitkgp.ac.in"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Institution Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Overview of academic faculty, programs, and placement history..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fas fa-save" style={{ marginRight: 6 }} /> Save Institution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      <ActivityModal
        isOpen={activityModalOpen}
        entityName={selectedInst?.name || 'Institution'}
        activities={selectedInst?.recentActivity || []}
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
