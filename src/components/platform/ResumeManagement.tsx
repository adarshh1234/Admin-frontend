import React, { useState, useMemo } from 'react';
import {
  INITIAL_RESUME_RECORDS,
  type CandidateResumeRecord
} from '../../data/platformManagementData';
import { useToast } from '../../hooks/useToast';

export function ResumeManagement() {
  const { showToast } = useToast();
  const [resumes, setResumes] = useState<CandidateResumeRecord[]>(INITIAL_RESUME_RECORDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [disciplineFilter, setDisciplineFilter] = useState('all');

  // Modals
  const [selectedResume, setSelectedResume] = useState<CandidateResumeRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState<Partial<CandidateResumeRecord>>({});
  const [skillInput, setSkillInput] = useState('');

  // Stats
  const stats = useMemo(() => {
    const total = resumes.length;
    const verified = resumes.filter(r => r.status === 'Verified').length;
    const pending = resumes.filter(r => r.status === 'Pending Review').length;
    const needsUpdate = resumes.filter(r => r.status === 'Needs Update' || r.status === 'Flagged').length;
    return { total, verified, pending, needsUpdate };
  }, [resumes]);

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter(item => {
      const matchesSearch =
        item.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.headline.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesDiscipline = disciplineFilter === 'all' || item.primaryDiscipline === disciplineFilter;

      return matchesSearch && matchesStatus && matchesDiscipline;
    });
  }, [resumes, search, statusFilter, disciplineFilter]);

  const handleOpenView = (resume: CandidateResumeRecord) => {
    setSelectedResume(resume);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (resume: CandidateResumeRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResume(resume);
    setEditForm({ ...resume, skills: [...resume.skills] });
    setSkillInput('');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.candidateName?.trim() || !editForm.email?.trim()) {
      showToast('Candidate Name and Email are required.', 'error');
      return;
    }

    setResumes(prev => prev.map(item => item.id === editForm.id ? {
      ...(editForm as CandidateResumeRecord),
      lastUpdated: new Date().toISOString().split('T')[0]
    } : item));

    showToast(`Resume for "${editForm.candidateName}" updated successfully.`, 'success');
    setIsEditModalOpen(false);
  };

  const handleQuickVerify = (id: string, newStatus: CandidateResumeRecord['status'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResumes(prev => prev.map(item => {
      if (item.id === id) {
        showToast(`Resume status changed to "${newStatus}"`, 'info');
        return { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));
  };

  const handleExportCV = (resume: CandidateResumeRecord) => {
    showToast(`Generating verified PDF export for ${resume.candidateName}...`, 'success');
  };

  const getStatusBadge = (status: CandidateResumeRecord['status']) => {
    switch (status) {
      case 'Verified':
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', icon: 'fa-check-circle' };
      case 'Pending Review':
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: 'fa-clock' };
      case 'Needs Update':
        return { bg: '#fef3c7', border: '#fde68a', text: '#b45309', icon: 'fa-exclamation-triangle' };
      case 'Flagged':
        return { bg: '#fff1f2', border: '#fecdd3', text: '#be123c', icon: 'fa-ban' };
    }
  };

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, padding: '24px 28px', boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', color: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              <i className="fas fa-file-alt" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a192f', margin: 0, letterSpacing: '-0.02em' }}>
                Candidate Resume Management
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                Review candidate credentials, edit CV records, verify technical proofs of work, and maintain profile integrity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditForm({
                id: `res-${Date.now()}`,
                candidateName: '',
                email: '',
                phone: '',
                location: '',
                headline: 'Software Engineer',
                yearsOfExperience: 3,
                primaryDiscipline: 'Software Engineering',
                skills: ['JavaScript', 'React', 'TypeScript'],
                status: 'Verified',
                lastUpdated: new Date().toISOString().split('T')[0],
                summary: 'Experienced professional with demonstrated background in high performance tech environments.',
                education: [{ degree: 'B.S. Computer Science', institution: 'University', year: '2020 - 2024' }],
                experience: [{ role: 'Software Engineer', company: 'Tech Corp', duration: '2024 - Present', highlights: ['Led core architecture modules.'] }]
              });
              setSkillInput('');
              setIsEditModalOpen(true);
            }}
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
            <i className="fas fa-user-plus" />
            <span>Add Candidate CV</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 22 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2edf8', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>Total Resumes</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{stats.total}</div>
            <div style={{ fontSize: 11, color: '#0066cc', fontWeight: 600, marginTop: 2 }}>Candidate profiles in database</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#166534', fontWeight: 600 }}>Verified & Audit Passed</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{stats.verified}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>Ready for employer dispatch</div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#1e40af', fontWeight: 600 }}>Pending Staff Review</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8', marginTop: 4 }}>{stats.pending}</div>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginTop: 2 }}>Awaiting verification check</div>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#92400e', fontWeight: 600 }}>Needs Update / Flagged</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{stats.needsUpdate}</div>
            <div style={{ fontSize: 11, color: '#b45309', fontWeight: 600, marginTop: 2 }}>Requires candidate action</div>
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
              placeholder="Search by candidate, skill, keyword..."
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
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Needs Update">Needs Update</option>
            <option value="Flagged">Flagged</option>
          </select>

          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            <option value="all">Discipline: All</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Fintech & Quant">Fintech & Quant</option>
          </select>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredResumes.length}</strong> of {resumes.length}
        </div>
      </div>

      {/* Resumes Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 102, 204, 0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2edf8', color: '#475569', fontWeight: 700, fontSize: 12 }}>
              <th style={{ padding: '14px 18px' }}>Candidate Name & Headline</th>
              <th style={{ padding: '14px 18px' }}>Discipline & Experience</th>
              <th style={{ padding: '14px 18px' }}>Key Skills / Stack</th>
              <th style={{ padding: '14px 18px' }}>Location</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>Verification</th>
              <th style={{ padding: '14px 18px' }}>Last Updated</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResumes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>
                  No candidate resumes match your search.
                </td>
              </tr>
            ) : (
              filteredResumes.map((item, idx) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: idx === filteredResumes.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 13.5 }}>{item.candidateName}</div>
                        <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.headline}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{item.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#0066cc', fontSize: 12.5 }}>{item.primaryDiscipline}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>{item.yearsOfExperience} yrs professional exp</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220 }}>
                        {item.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ fontSize: 10.5, background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: 4 }}>
                            {s}
                          </span>
                        ))}
                        {item.skills.length > 3 && (
                          <span style={{ fontSize: 10, color: '#94a3b8', padding: '2px 4px' }}>
                            +{item.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569' }}>
                      {item.location}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.text,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5
                        }}
                      >
                        <i className={`fas ${badge.icon}`} style={{ fontSize: 10 }} />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: 12 }}>
                      {item.lastUpdated}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleOpenView(item)}
                          style={{ background: '#f0f8ff', border: '1px solid #bae6fd', color: '#0066cc', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="View Full Resume"
                        >
                          <i className="fas fa-file-invoice" />
                          <span style={{ marginLeft: 4 }}>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(item, e)}
                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="Edit Resume Information"
                        >
                          <i className="fas fa-edit" />
                          <span style={{ marginLeft: 4 }}>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportCV(item)}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 8px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                          title="Download Verified PDF"
                        >
                          <i className="fas fa-download" />
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

      {/* VIEW STRUCTURED RESUME MODAL */}
      {isViewModalOpen && selectedResume && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: 24, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedResume.candidateName}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 4 }}>
                    {selectedResume.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#0066cc', fontWeight: 600, marginTop: 3 }}>{selectedResume.headline}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                  <span>{selectedResume.location}</span> · <span>{selectedResume.email}</span> · <span>{selectedResume.phone}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: 8, color: '#64748b', cursor: 'pointer' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Summary */}
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Summary
                </h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {selectedResume.summary}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Verified Skills & Core Stack
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedResume.skills.map(s => (
                    <span key={s} style={{ fontSize: 11.5, background: '#eff6ff', color: '#0066cc', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Work History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedResume.experience.map((exp, i) => (
                    <div key={i} style={{ borderLeft: '2px solid #0066cc', paddingLeft: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 13.5, color: '#0f172a' }}>{exp.role}</strong>
                        <span style={{ fontSize: 11.5, color: '#64748b' }}>{exp.duration}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#0066cc', fontWeight: 600, marginBottom: 4 }}>{exp.company}</div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                        {exp.highlights.map((h, hi) => (
                          <li key={hi}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Education & Credentials
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedResume.education.map((edu, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2edf8', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a' }}>{edu.degree}</div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>{edu.institution}</div>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: 16, background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={(e) => handleQuickVerify(selectedResume.id, 'Verified', e)}
                  style={{ padding: '6px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Verify Candidate
                </button>
                <button
                  type="button"
                  onClick={(e) => handleQuickVerify(selectedResume.id, 'Needs Update', e)}
                  style={{ padding: '6px 12px', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Flag for Update
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEdit(selectedResume);
                  }}
                  style={{ padding: '8px 18px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Edit Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT RESUME MODAL */}
      {isEditModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Edit Candidate Resume Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', width: 30, height: 30, borderRadius: 8, color: '#64748b', cursor: 'pointer' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.candidateName || ''}
                    onChange={(e) => setEditForm({ ...editForm, candidateName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Professional Headline</label>
                <input
                  type="text"
                  value={editForm.headline || ''}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Discipline</label>
                  <select
                    value={editForm.primaryDiscipline || 'Software Engineering'}
                    onChange={(e) => setEditForm({ ...editForm, primaryDiscipline: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#fff' }}
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Fintech & Quant">Fintech & Quant</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Years Exp</label>
                  <input
                    type="number"
                    value={editForm.yearsOfExperience || 0}
                    onChange={(e) => setEditForm({ ...editForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Status</label>
                  <select
                    value={editForm.status || 'Verified'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#fff' }}
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Needs Update">Needs Update</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Location</label>
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Executive Summary</label>
                <textarea
                  rows={3}
                  value={editForm.summary || ''}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, resize: 'vertical' }}
                />
              </div>

              {/* Skills Editor */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Skills (Tags)</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input
                    type="text"
                    placeholder="Add skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim()) {
                        setEditForm({ ...editForm, skills: [...(editForm.skills || []), skillInput.trim()] });
                        setSkillInput('');
                      }
                    }}
                    style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(editForm.skills || []).map((s, idx) => (
                    <span key={idx} style={{ fontSize: 11, background: '#eff6ff', color: '#0066cc', padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {s}
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, skills: (editForm.skills || []).filter((_, i) => i !== idx) })}
                        style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
