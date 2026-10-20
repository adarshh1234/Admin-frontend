import React, { useState, useMemo } from 'react';
import { CompanyLogo } from '../cms/CompanyLogos';
import {
  INITIAL_OPPORTUNITY_RECORDS,
  type OpportunityRecord
} from '../../data/platformManagementData';
import { useToast } from '../../hooks/useToast';

export function ExploreOpportunitiesManagement() {
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(INITIAL_OPPORTUNITY_RECORDS);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Modals
  const [selectedOpp, setSelectedOpp] = useState<OpportunityRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState<Partial<OpportunityRecord>>({
    title: '',
    company: '',
    verified: true,
    category: 'Engineering',
    tags: [],
    location: '',
    salary: '',
    employmentType: 'Full-time',
    description: '',
    requirements: [],
    featured: false,
    published: true,
    status: 'active'
  });
  const [tagInput, setTagInput] = useState('');
  const [reqInput, setReqInput] = useState('');

  // Stats
  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter(o => o.status === 'active' && o.published).length;
    const featured = opportunities.filter(o => o.featured).length;
    const totalApplied = opportunities.reduce((acc, curr) => {
      const num = parseInt(curr.appliedCount.replace(/[^0-9]/g, '')) || 0;
      return acc + num;
    }, 0);
    return { total, active, featured, totalApplied };
  }, [opportunities]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(opportunities.map(o => o.category));
    return ['all', ...Array.from(set)];
  }, [opportunities]);

  // Filtered list
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.company.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesType = typeFilter === 'all' || item.employmentType === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesFeatured = !featuredOnly || item.featured;

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesFeatured;
    });
  }, [opportunities, search, categoryFilter, typeFilter, statusFilter, featuredOnly]);

  // Handlers
  const handleOpenCreate = () => {
    setFormMode('create');
    setFormData({
      id: `opp-${Date.now()}`,
      title: '',
      company: '',
      verified: true,
      category: 'Engineering',
      tags: ['Engineering', 'Full-time'],
      location: 'Remote, US',
      salary: '$140k - $200k',
      employmentType: 'Full-time',
      appliedCount: '0 applied',
      matchedCount: '0 matched',
      description: '',
      requirements: ['Proven domain expertise and strong technical communication skills.'],
      featured: false,
      published: true,
      status: 'active',
      postedTime: 'Just now',
      postedDate: new Date().toISOString().split('T')[0]
    });
    setTagInput('');
    setReqInput('');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (opp: OpportunityRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormMode('edit');
    setFormData({ ...opp });
    setTagInput('');
    setReqInput('');
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.company?.trim()) {
      showToast('Title and Company are required.', 'error');
      return;
    }

    if (formMode === 'create') {
      const newRecord = {
        ...(formData as OpportunityRecord),
        id: formData.id || `opp-${Date.now()}`,
        postedTime: 'Just now',
        postedDate: new Date().toISOString().split('T')[0],
        appliedCount: formData.appliedCount || '0 applied',
        matchedCount: formData.matchedCount || '0 matched',
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : [formData.category || 'Engineering']
      };
      setOpportunities([newRecord, ...opportunities]);
      showToast(`Opportunity "${newRecord.title}" published successfully!`, 'success');
    } else {
      setOpportunities(prev => prev.map(item => item.id === formData.id ? { ...(formData as OpportunityRecord) } : item));
      showToast(`Opportunity "${formData.title}" updated!`, 'success');
    }
    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to deactivate/delete "${title}"?`)) {
      setOpportunities(prev => prev.filter(item => item.id !== id));
      showToast(`Opportunity "${title}" removed.`, 'info');
      if (selectedOpp?.id === id) {
        setIsDetailModalOpen(false);
      }
    }
  };

  const handleToggleFeatured = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpportunities(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.featured;
        showToast(`Opportunity marked as ${next ? 'Featured' : 'Standard'}`, 'success');
        return { ...item, featured: next };
      }
      return item;
    }));
  };

  const handleTogglePublished = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpportunities(prev => prev.map(item => {
      if (item.id === id) {
        const nextPub = !item.published;
        showToast(`Opportunity visibility set to ${nextPub ? 'Published' : 'Hidden/Draft'}`, 'info');
        return { ...item, published: nextPub, status: nextPub ? 'active' : 'draft' };
      }
      return item;
    }));
  };

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top Header Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, padding: '24px 28px', boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', color: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                <i className="fas fa-compass" />
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a192f', margin: 0, letterSpacing: '-0.02em' }}>
                  Explore Opportunities Management
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                  Manage platform job requisitions, publish controls, featured positions, and category metadata.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* View Toggle */}
            <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 3, display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === 'table' ? '#ffffff' : 'transparent',
                  color: viewMode === 'table' ? '#0066cc' : '#64748b',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <i className="fas fa-list" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#0066cc' : '#64748b',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <i className="fas fa-th-large" />
                <span>4×4 Grid</span>
              </button>
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
              <i className="fas fa-plus" />
              <span>Add Opportunity</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 22 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2edf8', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>Total Opportunities</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{stats.total}</div>
            <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 2 }}>All created positions</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#166534', fontWeight: 600 }}>Live & Published</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{stats.active}</div>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 2 }}>Visible to candidate portal</div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#1e40af', fontWeight: 600 }}>Featured High-Priority</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8', marginTop: 4 }}>{stats.featured}</div>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginTop: 2 }}>Highlighted in top cards</div>
          </div>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11.5, color: '#6b21a8', fontWeight: 600 }}>Total Platform Applicants</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#7e22ce', marginTop: 4 }}>3,480+</div>
            <div style={{ fontSize: 11, color: '#9333ea', fontWeight: 600, marginTop: 2 }}>Engaged candidate matches</div>
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
              placeholder="Search by role, company, skill..."
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                Category: {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Employment Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            <option value="all">Type: All</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#f8fafc', color: '#334155', fontWeight: 600 }}
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="draft">Draft / Hidden</option>
            <option value="closed">Closed</option>
          </select>

          {/* Featured Toggle */}
          <button
            type="button"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              border: featuredOnly ? '1px solid #0066cc' : '1px solid #cbd5e1',
              background: featuredOnly ? '#eff6ff' : '#ffffff',
              color: featuredOnly ? '#0066cc' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <i className={`fas fa-star ${featuredOnly ? 'text-amber-500' : ''}`} />
            <span>Featured Only</span>
          </button>
        </div>

        <div style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredOpportunities.length}</strong> of {opportunities.length}
        </div>
      </div>

      {/* Main View: Table or 4x4 Grid */}
      {viewMode === 'table' ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 102, 204, 0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2edf8', color: '#475569', fontWeight: 700, fontSize: 12 }}>
                <th style={{ padding: '14px 18px' }}>Company & Role</th>
                <th style={{ padding: '14px 18px' }}>Category & Tags</th>
                <th style={{ padding: '14px 18px' }}>Location</th>
                <th style={{ padding: '14px 18px' }}>Compensation</th>
                <th style={{ padding: '14px 18px' }}>Type</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Featured</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Visibility</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>
                    No opportunities match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: idx === filteredOpportunities.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <CompanyLogo company={item.company} size={36} />
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 13.5 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span>{item.company}</span>
                            {item.verified && (
                              <span style={{ color: '#0066cc', fontSize: 11, fontWeight: 900 }}>✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: 6 }}>
                          {item.category}
                        </span>
                        {item.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{ fontSize: 10.5, color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569' }}>
                      {item.location}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#0066cc' }}>
                      {item.salary}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569' }}>
                      {item.employmentType}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(item.id, e)}
                        style={{
                          background: item.featured ? '#fef3c7' : '#f1f5f9',
                          border: item.featured ? '1px solid #fde68a' : '1px solid #e2e8f0',
                          color: item.featured ? '#d97706' : '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <i className={`fas fa-star ${item.featured ? 'text-amber-500' : ''}`} />
                        <span>{item.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => handleTogglePublished(item.id, e)}
                        style={{
                          background: item.published ? '#dcfce7' : '#f1f5f9',
                          border: item.published ? '1px solid #86efac' : '1px solid #e2e8f0',
                          color: item.published ? '#15803d' : '#64748b',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.published ? '#22c55e' : '#94a3b8' }} />
                        <span>{item.published ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOpp(item);
                            setIsDetailModalOpen(true);
                          }}
                          style={{ background: '#f0f8ff', border: '1px solid #bae6fd', color: '#0066cc', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="View Details"
                        >
                          <i className="fas fa-eye" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(item, e)}
                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="Edit Opportunity"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, item.title, e)}
                          style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          title="Deactivate / Delete"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* 4x4 Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
          {filteredOpportunities.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: item.featured ? '1.5px solid #93c5fd' : '1px solid #e2edf8',
                borderRadius: 16,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: item.featured ? '0 4px 14px rgba(0, 102, 204, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                position: 'relative',
                minHeight: 320
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CompanyLogo company={item.company} size={38} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{item.company}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.location}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFeatured(item.id, e)}
                    style={{ background: 'transparent', border: 'none', color: item.featured ? '#f59e0b' : '#cbd5e1', fontSize: 15, cursor: 'pointer', padding: 2 }}
                    title={item.featured ? 'Featured' : 'Mark Featured'}
                  >
                    <i className="fas fa-star" />
                  </button>
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0a192f', margin: '0 0 8px', lineHeight: 1.35 }}>
                  {item.title}
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4 }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: 10, color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                    {item.employmentType}
                  </span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, color: '#0066cc', fontFamily: 'monospace', marginBottom: 8 }}>
                  {item.salary}
                </div>

                <p style={{ fontSize: 11.5, color: '#64748b', margin: '0 0 12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOpp(item);
                    setIsDetailModalOpen(true);
                  }}
                  style={{ flex: 1, padding: '7px 0', background: '#f0f8ff', border: '1px solid #bae6fd', color: '#0066cc', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(item, e)}
                  style={{ flex: 1, padding: '7px 0', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, item.title, e)}
                  style={{ padding: '7px 10px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                  title="Delete"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isDetailModalOpen && selectedOpp && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 22, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CompanyLogo company={selectedOpp.company} size={44} />
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedOpp.company}</h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{selectedOpp.location} · Posted {selectedOpp.postedTime}</div>
                </div>
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
              <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0a192f', margin: '0 0 10px' }}>{selectedOpp.title}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0066cc', background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
                  {selectedOpp.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: 6 }}>
                  {selectedOpp.status.toUpperCase()}
                </span>
                {selectedOpp.featured && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: 6 }}>
                    FEATURED
                  </span>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2edf8', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>SALARY</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0066cc', fontFamily: 'monospace' }}>{selectedOpp.salary}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>EMPLOYMENT</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{selectedOpp.employmentType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>APPLICANTS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{selectedOpp.appliedCount}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Description</h4>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.55, margin: 0 }}>{selectedOpp.description}</p>
              </div>

              <div>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Requirements</h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  {selectedOpp.requirements.map((r, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ padding: 16, background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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
                  handleOpenEdit(selectedOpp);
                }}
                style={{ padding: '8px 18px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Edit Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            style={{ background: '#ffffff', borderRadius: 20, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2edf8', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {formMode === 'create' ? 'Add New Opportunity' : 'Edit Opportunity Details'}
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
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. OpenAI, Google, Stripe"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Category</label>
                  <select
                    value={formData.category || 'Engineering'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#fff' }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI Research">AI Research</option>
                    <option value="Design">Design</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Employment Type</label>
                  <select
                    value={formData.employmentType || 'Full-time'}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, background: '#fff' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Salary / Comp</label>
                  <input
                    type="text"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $160k - $220k"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA (Remote)"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short role summary..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, resize: 'vertical' }}
                />
              </div>

              {/* Tags Editor */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Skill Tags</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input
                    type="text"
                    placeholder="Add a tag (e.g. PyTorch, React)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
                        setTagInput('');
                      }
                    }}
                    style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(formData.tags || []).map((t, idx) => (
                    <span key={idx} style={{ fontSize: 11, background: '#eff6ff', color: '#0066cc', padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {t}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tags: (formData.tags || []).filter((_, i) => i !== idx) })}
                        style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Position</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked, status: e.target.checked ? 'active' : 'draft' })}
                  />
                  <span>Published on Platform</span>
                </label>
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
                  {formMode === 'create' ? 'Publish Opportunity' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
