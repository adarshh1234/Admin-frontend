import React, { useState, useEffect, useMemo } from 'react';
import type {
  CandidateUser,
  AccountStatus,
  VerificationStatus,
  UserSummaryStats,
} from '../../types/platformUsers';
import { platformUsersService } from '../../services/platformUsers.service';
import { PlatformSummaryCards } from './PlatformSummaryCards';
import { ConfirmationModal, ActivityModal } from './PlatformModals';
import { PlatformPagination } from './PlatformPagination';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useToast } from '../../hooks/useToast';
import {
  CandidateDetailModal,
  CandidateEditModal,
  CandidateTable,
} from './candidates';

export const CandidatesManagement: React.FC = () => {
  const { showToast } = useToast();

  // Data states
  const [candidates, setCandidates] = useState<CandidateUser[]>([]);
  const [stats, setStats] = useState<UserSummaryStats>({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [_loading, setLoading] = useState<boolean>(true);

  // Search, Filter & Sort states
  const [search, setSearch] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CandidateUser>('registrationDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateUser | null>(null);
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

  // Edit / Add Form state
  const [editForm, setEditForm] = useState<Partial<CandidateUser>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        platformUsersService.getCandidates(),
        platformUsersService.getCandidateStats(),
      ]);
      setCandidates(list);
      setStats(s);
    } catch {
      showToast('Failed to load candidates data.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Filtered and Sorted candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.location.toLowerCase().includes(search.toLowerCase()) ||
          c.education.toLowerCase().includes(search.toLowerCase()) ||
          c.college.toLowerCase().includes(search.toLowerCase()) ||
          c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

        const matchesAccount = accountFilter === 'all' || c.accountStatus === accountFilter;
        const matchesVerification = verificationFilter === 'all' || c.verificationStatus === verificationFilter;

        return matchesSearch && matchesAccount && matchesVerification;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? '';
        const valB = b[sortField] ?? '';
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [candidates, search, accountFilter, verificationFilter, sortField, sortAsc]);

  // Paginated records
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  function handleSort(field: keyof CandidateUser) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  // Action Handlers
  function openAddModal() {
    setEditForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      education: '',
      college: '',
      experience: 'Fresher',
      experienceYears: 0,
      skills: ['React', 'JavaScript'],
      accountStatus: 'Active',
      verificationStatus: 'Verified',
      bio: '',
    });
    setEditModalOpen(true);
  }

  function openEditModal(c: CandidateUser) {
    setSelectedCandidate(c);
    setEditForm({ ...c });
    setEditModalOpen(true);
  }

  async function handleSaveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      showToast('Name and Email are required.', 'error');
      return;
    }
    try {
      await platformUsersService.saveCandidate(editForm);
      showToast(editForm.id ? 'Candidate updated successfully.' : 'Candidate created successfully.', 'success');
      setEditModalOpen(false);
      loadData();
    } catch {
      showToast('Failed to save candidate.', 'error');
    }
  }

  function handleToggleAccountStatus(c: CandidateUser) {
    const newStatus: AccountStatus = c.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setConfirmModal({
      open: true,
      title: `${newStatus === 'Active' ? 'Activate' : 'Deactivate'} Account`,
      message: `Are you sure you want to mark ${c.name}'s account as ${newStatus}?`,
      variant: newStatus === 'Active' ? 'success' : 'warning',
      confirmLabel: newStatus === 'Active' ? 'Activate' : 'Deactivate',
      action: async () => {
        await platformUsersService.updateCandidateStatus(c.id, newStatus);
        showToast(`Account ${newStatus === 'Active' ? 'activated' : 'deactivated'}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleSuspend(c: CandidateUser) {
    setConfirmModal({
      open: true,
      title: 'Suspend Candidate Account',
      message: `Are you sure you want to suspend ${c.name}? They will immediately lose access to the platform.`,
      variant: 'danger',
      confirmLabel: 'Suspend Account',
      action: async () => {
        await platformUsersService.updateCandidateStatus(c.id, 'Suspended');
        showToast(`Candidate account suspended.`, 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleDelete(c: CandidateUser) {
    setConfirmModal({
      open: true,
      title: 'Delete Candidate Profile',
      message: `Are you sure you want to permanently delete candidate ${c.name} (${c.id})? This action cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete Permanently',
      action: async () => {
        await platformUsersService.deleteCandidate(c.id);
        showToast('Candidate permanently deleted.', 'info');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
      },
    });
  }

  function handleVerifyStatus(c: CandidateUser, status: VerificationStatus) {
    setConfirmModal({
      open: true,
      title: `${status === 'Verified' ? 'Verify' : 'Reject'} Candidate`,
      message: `Change verification status of ${c.name} to ${status}?`,
      variant: status === 'Verified' ? 'success' : 'danger',
      confirmLabel: status === 'Verified' ? 'Mark as Verified' : 'Reject Verification',
      action: async () => {
        await platformUsersService.updateCandidateStatus(c.id, undefined, status);
        showToast(`Candidate verification updated to ${status}.`, 'success');
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadData();
        if (selectedCandidate && selectedCandidate.id === c.id) {
          setSelectedCandidate((prev) => (prev ? { ...prev, verificationStatus: status } : null));
        }
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
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
              <i className="fas fa-user-graduate" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Candidates
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#93c5fd' }}>
                Manage all candidate accounts registered on LetGetIn.
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
            <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <PlatformSummaryCards stats={stats} entityName="Candidates" icon="fa-user-graduate" />

      {/* Filter Drawer / Dropdown */}
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
              style={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                fontSize: 12.5,
                background: '#ffffff',
              }}
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
              style={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                fontSize: 12.5,
                background: '#ffffff',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAccountFilter('all');
              setVerificationFilter('all');
              setSearch('');
              setCurrentPage(1);
            }}
            style={{ marginLeft: 'auto', fontSize: 12 }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Main Table Panel */}
      <div className="panel" style={{ padding: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid #e9edf4', background: '#ffffff' }}>
        {/* Search Toolbar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9edf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Input
              type="text"
              placeholder="Search candidates by name, email, skills, college…"
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
            Found <strong style={{ color: '#0f172a' }}>{filteredCandidates.length}</strong> candidate profiles
          </div>
        </div>

        {/* Table Content */}
        <CandidateTable
          candidates={filteredCandidates}
          paginatedCandidates={paginatedCandidates}
          sortField={sortField}
          sortAsc={sortAsc}
          onSort={handleSort}
          onViewCandidate={(c) => {
            setSelectedCandidate(c);
            setDetailModalOpen(true);
          }}
          onEditCandidate={openEditModal}
          onToggleStatus={handleToggleAccountStatus}
          onSuspendCandidate={handleSuspend}
          onViewActivity={(c) => {
            setSelectedCandidate(c);
            setActivityModalOpen(true);
          }}
          onDeleteCandidate={handleDelete}
        />

        {/* Pagination */}
        <PlatformPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCandidates.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* CANDIDATE PROFILE DETAILS MODAL */}
      <CandidateDetailModal
        isOpen={detailModalOpen}
        candidate={selectedCandidate}
        onClose={() => setDetailModalOpen(false)}
        onVerifyStatus={handleVerifyStatus}
      />

      {/* EDIT / ADD MODAL */}
      <CandidateEditModal
        isOpen={editModalOpen}
        editForm={editForm}
        onEditFormChange={setEditForm}
        onSave={handleSaveForm}
        onClose={() => setEditModalOpen(false)}
      />

      {/* ACTIVITY MODAL */}
      <ActivityModal
        isOpen={activityModalOpen}
        entityName={selectedCandidate?.name || 'Candidate'}
        activities={selectedCandidate?.recentActivity || []}
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
};

export default CandidatesManagement;
