import React, { useState, useMemo } from 'react';
import {
  INITIAL_INTERVIEW_RECORDS,
  type InterviewRecord
} from '../../data/platformManagementData';
import { useToast } from '../../hooks/useToast';

export function InterviewManagement() {
  const { showToast } = useToast();
  const [interviews, setInterviews] = useState<InterviewRecord[]>(INITIAL_INTERVIEW_RECORDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roundFilter, setRoundFilter] = useState('all');

  // Modals
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState<Partial<InterviewRecord>>({
    candidateName: '',
    candidateEmail: '',
    targetRole: '',
    company: '',
    interviewer: '',
    interviewerRole: '',
    scheduledDate: '',
    scheduledTime: '',
    roundType: 'Technical Screening',
    format: 'Video Conference',
    status: 'Scheduled',
    notes: '',
    meetingLink: ''
  });

  // Stats
  const stats = useMemo(() => {
    const total = interviews.length;
    const scheduled = interviews.filter(i => i.status === 'Scheduled').length;
    const completed = interviews.filter(i => i.status === 'Completed').length;
    const inProgress = interviews.filter(i => i.status === 'In Progress').length;
    const avgScore = Math.round(
      interviews.filter(i => i.score).reduce((acc, curr) => acc + (curr.score || 0), 0) /
      (interviews.filter(i => i.score).length || 1)
    );
    return { total, scheduled, completed, inProgress, avgScore };
  }, [interviews]);

  // Filtered interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter(item => {
      const matchesSearch =
        item.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        item.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
        item.targetRole.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.interviewer.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesRound = roundFilter === 'all' || item.roundType === roundFilter;

      return matchesSearch && matchesStatus && matchesRound;
    });
  }, [interviews, search, statusFilter, roundFilter]);

  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({
      id: `int-${Date.now()}`,
      candidateName: '',
      candidateEmail: '',
      targetRole: 'Senior Software Engineer',
      company: 'OpenAI',
      interviewer: 'Alexandre Moreau',
      interviewerRole: 'Lead Architect',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '14:00 - 15:00 PST',
      roundType: 'Technical Screening',
      format: 'Video Conference',
      status: 'Scheduled',
      notes: 'Initial technical competency evaluation.',
      meetingLink: 'https://meet.letgetin.com/room/letgetin-session-new'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (record: InterviewRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormMode('edit');
    setFormData({ ...record });
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidateName?.trim() || !formData.targetRole?.trim()) {
      showToast('Candidate Name and Role are required.', 'error');
      return;
    }

    if (formMode === 'create') {
      const newRec = {
        ...(formData as InterviewRecord),
        id: formData.id || `int-${Date.now()}`,
        status: formData.status || 'Scheduled'
      };
      setInterviews([newRec, ...interviews]);
      showToast(`Interview for "${newRec.candidateName}" scheduled!`, 'success');
    } else {
      setInterviews(prev => prev.map(item => item.id === formData.id ? { ...(formData as InterviewRecord) } : item));
      showToast(`Interview record updated.`, 'success');
    }
    setIsFormModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: InterviewRecord['status'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInterviews(prev => prev.map(item => {
      if (item.id === id) {
        showToast(`Status updated to "${newStatus}"`, 'info');
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleDelete = (id: string, candidate: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Delete interview booking for ${candidate}?`)) {
      setInterviews(prev => prev.filter(i => i.id !== id));
      showToast(`Interview record deleted.`, 'info');
      if (selectedInterview?.id === id) {
        setIsDetailModalOpen(false);
      }
    }
  };

  const getStatusColor = (status: InterviewRecord['status']) => {
    switch (status) {
      case 'Scheduled':
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' };
      case 'In Progress':
        return { bg: '#fef3c7', border: '#fde68a', text: '#b45309' };
      case 'Completed':
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' };
      case 'Cancelled':
        return { bg: '#fff1f2', border: '#fecdd3', text: '#be123c' };
      default:
        return { bg: '#f1f5f9', border: '#e2e8f0', text: '#475569' };
    }
  };

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, padding: '24px 28px', boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', color: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              <i className="fas fa-user-check" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a192f', margin: 0, letterSpacing: '-0.02em' }}>
                Interview Management
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Manage candidate interview sessions, interviewer assignments, live sandbox recordings, and assessment scorecards.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(90deg, #062b63 0%, #0066cc 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0, 102, 204, 0.2)'
            }}
          >
            <i className="fas fa-calendar-plus" />
            <span>Schedule Interview</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 22 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2edf8', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>Total Scheduled</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{stats.total}</div>
            <div style={{ fontSize: 11, color: '#0066cc', fontWeight: 600, marginTop: 2 }}>Platform rounds booked</div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#1e40af', fontWeight: 600 }}>Upcoming / Scheduled</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8', marginTop: 4 }}>{stats.scheduled}</div>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginTop: 2 }}>Pending candidate sessions</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#166534', fontWeight: 600 }}>Completed Evaluated</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{stats.completed}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>Scorecards submitted</div>
          </div>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#6b21a8', fontWeight: 600 }}>Avg Candidate Score</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#7e22ce', marginTop: 4 }}>{stats.avgScore}%</div>
            <div style={{ fontSize: 11, color: '#9333ea', fontWeight: 600, marginTop: 2 }}>High performance tier</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }} />
            <input
              type="text"
              placeholder="Search candidate, company, panel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 12.5,
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            <option value="all">Status: All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            <option value="all">Round: All Types</option>
            <option value="Technical Screening">Technical Screening</option>
            <option value="System Architecture">System Architecture</option>
            <option value="Coding Sandbox">Coding Sandbox</option>
            <option value="Behavioral & Leadership">Behavioral & Leadership</option>
            <option value="Executive Fit">Executive Fit</option>
          </select>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredInterviews.length}</strong> of {interviews.length}
        </div>
      </div>

      {/* Interviews Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 102, 204, 0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2edf8', color: '#475569', fontWeight: 700, fontSize: 12 }}>
              <th style={{ padding: '14px 18px' }}>Candidate & Target Role</th>
              <th style={{ padding: '14px 18px' }}>Company & Panel</th>
              <th style={{ padding: '14px 18px' }}>Scheduled Time</th>
              <th style={{ padding: '14px 18px' }}>Round & Format</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Score</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>
                  No interview records found.
                </td>
              </tr>
            ) : (
              filteredInterviews.map((item, idx) => {
                const sColor = getStatusColor(item.status);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: idx === filteredInterviews.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 13.5 }}>{item.candidateName}</div>
                        <div style={{ fontSize: 12, color: '#0066cc', fontWeight: 600 }}>{item.targetRole}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{item.candidateEmail}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.company}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{item.interviewer}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>
                        <i className="far fa-calendar" style={{ marginRight: 6, color: '#94a3b8' }} />
                        {item.scheduledDate}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>
                        <i className="far fa-clock" style={{ marginRight: 6, color: '#94a3b8' }} />
                        {item.scheduledTime}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 4 }}>
                        {item.roundType}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.format}</div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: sColor.bg,
                          border: `1px solid ${sColor.border}`,
                          color: sColor.text,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-block'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      {item.score ? (
                        <span style={{ fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
                          {item.score}%
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInterview(item);
                            setIsDetailModalOpen(true);
                          }}
                          style={{ background: '#f0f8ff', border: '1px solid #bae6fd', color: '#0066cc', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="View Details / Scorecard"
                        >
                          <i className="fas fa-clipboard-check" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(item, e)}
                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="Edit Details"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, item.candidateName, e)}
                          style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="Cancel / Delete"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL / SCORECARD MODAL */}
      {isDetailModalOpen && selectedInterview && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 620, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 22, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0066cc', background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                  {selectedInterview.roundType}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '6px 0 0' }}>{selectedInterview.candidateName}</h3>
                <div style={{ fontSize: 12, color: '#64748b' }}>{selectedInterview.targetRole} · {selectedInterview.company}</div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: 8, color: '#64748b', cursor: 'pointer' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2edf8', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>SCHEDULED TIME</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 2 }}>{selectedInterview.scheduledDate} ({selectedInterview.scheduledTime})</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>INTERVIEWER / PANEL</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 2 }}>{selectedInterview.interviewer}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>SESSION FORMAT</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginTop: 2 }}>{selectedInterview.format}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>CURRENT STATUS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0066cc', marginTop: 2 }}>{selectedInterview.status}</div>
                </div>
              </div>

              {selectedInterview.meetingLink && (
                <div style={{ marginBottom: 16, padding: 12, background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12, color: '#1e40af' }}>
                    <strong>Session Link:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedInterview.meetingLink}</span>
                  </div>
                  <a href={selectedInterview.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, fontWeight: 700, color: '#0066cc', textDecoration: 'none' }}>
                    Join Session →
                  </a>
                </div>
              )}

              {selectedInterview.notes && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Interviewer Notes</h4>
                  <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.55, margin: 0 }}>{selectedInterview.notes}</p>
                </div>
              )}

              {selectedInterview.feedbackSummary && (
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Feedback & Scorecard Outcome</h4>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 12, borderRadius: 10, fontSize: 12.5, color: '#166534', lineHeight: 1.55 }}>
                    {selectedInterview.feedbackSummary} (Score: {selectedInterview.score}%)
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: 16, background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={(e) => handleUpdateStatus(selectedInterview.id, 'Completed', e)}
                  style={{ padding: '6px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={(e) => handleUpdateStatus(selectedInterview.id, 'Cancelled', e)}
                  style={{ padding: '6px 12px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark Cancelled
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEdit(selectedInterview);
                  }}
                  style={{ padding: '8px 16px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Edit Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT INTERVIEW MODAL */}
      {isFormModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {formMode === 'create' ? 'Schedule New Platform Interview' : 'Edit Interview Session'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: 8, color: '#64748b', cursor: 'pointer' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName || ''}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    placeholder="e.g. Dr. Sarah Lin"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Candidate Email</label>
                  <input
                    type="email"
                    value={formData.candidateEmail || ''}
                    onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                    placeholder="sarah@stanford.edu"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Target Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.targetRole || ''}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    placeholder="e.g. Multimodal AI Engineer"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Hiring Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. OpenAI"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Interviewer / Panel</label>
                  <input
                    type="text"
                    value={formData.interviewer || ''}
                    onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                    placeholder="e.g. Alexandre Moreau"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Round Type</label>
                  <select
                    value={formData.roundType || 'Technical Screening'}
                    onChange={(e) => setFormData({ ...formData, roundType: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#fff' }}
                  >
                    <option value="Technical Screening">Technical Screening</option>
                    <option value="System Architecture">System Architecture</option>
                    <option value="Coding Sandbox">Coding Sandbox</option>
                    <option value="Behavioral & Leadership">Behavioral & Leadership</option>
                    <option value="Executive Fit">Executive Fit</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input
                    type="text"
                    value={formData.scheduledTime || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    placeholder="14:00 - 15:30 PST"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Meeting / Sandbox Link</label>
                <input
                  type="text"
                  value={formData.meetingLink || ''}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.letgetin.com/room/..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Evaluation Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Focus areas or instructions for interview panel..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, resize: 'vertical' }}
                />
              </div>

              <div style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {formMode === 'create' ? 'Book Interview' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
