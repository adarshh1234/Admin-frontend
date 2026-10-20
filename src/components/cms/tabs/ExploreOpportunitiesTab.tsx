import React, { useState } from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { ExploreOpportunitiesView } from '../ExploreOpportunitiesView';
import { useToast } from '../../../hooks/useToast';
import type { LandingPageCmsData } from '../../../types/cms';

interface ExploreOpportunitiesTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const ExploreOpportunitiesTab: React.FC<ExploreOpportunitiesTabProps> = ({
  cmsData,
  updateNestedField,
}) => {
  const { showToast } = useToast();
  const [exploreViewMode, setExploreViewMode] = useState<'preview' | 'settings'>('preview');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [opportunitySearch, setOpportunitySearch] = useState('');

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
              Explore Opportunities Marketplace
            </h3>
            <span className="tag-blue">Updated Design</span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7a99' }}>
            Interactive live marketplace view with Featured Opportunities, Just Listed panel, and 3-column Live Opportunities grid.
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setExploreViewMode('preview')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              border: 'none',
              background: exploreViewMode === 'preview' ? '#0066cc' : 'transparent',
              color: exploreViewMode === 'preview' ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fas fa-eye" />
            <span>Marketplace Design (Live)</span>
          </button>

          <button
            type="button"
            onClick={() => setExploreViewMode('settings')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              border: 'none',
              background: exploreViewMode === 'settings' ? '#0066cc' : 'transparent',
              color: exploreViewMode === 'settings' ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fas fa-sliders-h" />
            <span>CMS Fields & Settings</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE MARKETPLACE DESIGN */}
      {exploreViewMode === 'preview' && (
        <div style={{ marginTop: 10 }}>
          <ExploreOpportunitiesView />
        </div>
      )}

      {/* VIEW 2: CMS FIELDS & CONFIGURATION */}
      {exploreViewMode === 'settings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                const current = cmsData.exploreOpportunities?.opportunities || [];
                const newOpp = {
                  id: `opp-${Date.now()}`,
                  title: 'New High-Impact Role / Specialist',
                  rate: '$80 - $120 / hour',
                  category: cmsData.exploreOpportunities?.categories?.[1] || 'AI & Research',
                  statusType: 'new' as const,
                  statusText: 'Recently added',
                  hiredCount: '50+ hired',
                  referralBonus: '$300',
                  isOneClickApply: true,
                  location: 'Global Remote',
                  tags: ['Verified', 'Direct Hire'],
                  description: 'Brief overview of expectations, verified skills, and responsibilities for this opportunity.',
                };
                updateNestedField('exploreOpportunities.opportunities', [newOpp, ...current]);
                showToast('New opportunity card added! Fill in the details below.', 'success');
              }}
              style={{ fontSize: 12.5, padding: '7px 14px' }}
            >
              <i className="fas fa-plus" style={{ marginRight: 6 }} /> Add Opportunity
            </Button>
          </div>

          {/* Section Metadata & Headlines Card */}
          <div
            style={{
              background: '#f8faff',
              border: '1px solid #e2edf8',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#06284f' }}>
              <i className="fas fa-heading" style={{ marginRight: 8, color: '#2563eb' }} />
              Section Header & Search Settings
            </h4>

            <div className="fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field-group">
                <label>Section Tag Badge</label>
                <Input
                  className="form-control"
                  value={cmsData.exploreOpportunities?.sectionTag || ''}
                  onChange={(e) => updateNestedField('exploreOpportunities.sectionTag', e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Headline Title</label>
                <Input
                  className="form-control"
                  value={cmsData.exploreOpportunities?.title || ''}
                  onChange={(e) => updateNestedField('exploreOpportunities.title', e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Headline Gradient Highlight Word</label>
                <Input
                  className="form-control"
                  value={cmsData.exploreOpportunities?.titleHighlight || ''}
                  onChange={(e) => updateNestedField('exploreOpportunities.titleHighlight', e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Search Input Placeholder</label>
                <Input
                  className="form-control"
                  value={cmsData.exploreOpportunities?.searchPlaceholder || ''}
                  onChange={(e) => updateNestedField('exploreOpportunities.searchPlaceholder', e.target.value)}
                />
              </div>

              <div className="field-group full" style={{ gridColumn: 'span 2' }}>
                <label>Subtitle Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={cmsData.exploreOpportunities?.subtitle || ''}
                  onChange={(e) => updateNestedField('exploreOpportunities.subtitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Chips Manager */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2edf8',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#06284f' }}>
                  <i className="fas fa-tags" style={{ marginRight: 8, color: '#2563eb' }} />
                  Filter Categories & Sectors
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7a99' }}>
                  Candidates on the landing page can click these pills to instantly filter live roles.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {(cmsData.exploreOpportunities?.categories || []).map((cat, idx) => (
                <span
                  key={cat + idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 20,
                    background: cat === 'All' ? '#eff6ff' : '#f1f5f9',
                    border: `1px solid ${cat === 'All' ? '#bfdbfe' : '#cbd5e1'}`,
                    color: cat === 'All' ? '#1d4ed8' : '#334155',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <i className="fas fa-circle" style={{ fontSize: 6, color: cat === 'All' ? '#2563eb' : '#94a3b8' }} />
                  {cat}
                  {cat !== 'All' && (
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = (cmsData.exploreOpportunities?.categories || []).filter((_, i) => i !== idx);
                        updateNestedField('exploreOpportunities.categories', filtered);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 0,
                        marginLeft: 4,
                        fontSize: 11,
                      }}
                      title="Remove Category"
                    >
                      <i className="fas fa-times" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, maxWidth: 460 }}>
              <Input
                className="form-control"
                placeholder="New Category name (e.g. Cyber Security)..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newCategoryInput.trim()) {
                      const cats = [...(cmsData.exploreOpportunities?.categories || [])];
                      if (!cats.includes(newCategoryInput.trim())) {
                        cats.push(newCategoryInput.trim());
                        updateNestedField('exploreOpportunities.categories', cats);
                        setNewCategoryInput('');
                      }
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newCategoryInput.trim()) {
                    const cats = [...(cmsData.exploreOpportunities?.categories || [])];
                    if (!cats.includes(newCategoryInput.trim())) {
                      cats.push(newCategoryInput.trim());
                      updateNestedField('exploreOpportunities.categories', cats);
                      setNewCategoryInput('');
                    }
                  }
                }}
                style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}
              >
                <i className="fas fa-plus" style={{ marginRight: 4 }} /> Add Category
              </Button>
            </div>
          </div>

          {/* Active Opportunities Cards List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#06284f' }}>
                  Live Opportunity Roles ({(cmsData.exploreOpportunities?.opportunities || []).length})
                </h4>
                <span className="tag-green" style={{ fontSize: 11 }}>Live Marketplace</span>
              </div>

              <div style={{ width: 260 }}>
                <Input
                  className="form-control"
                  placeholder="Filter cards below..."
                  value={opportunitySearch}
                  onChange={(e) => setOpportunitySearch(e.target.value)}
                  style={{ fontSize: 12, padding: '6px 12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(cmsData.exploreOpportunities?.opportunities || [])
                .filter((opp) => {
                  const q = opportunitySearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    opp.title.toLowerCase().includes(q) ||
                    opp.category.toLowerCase().includes(q) ||
                    (opp.location && opp.location.toLowerCase().includes(q))
                  );
                })
                .map((opp) => {
                  const rawIndex = (cmsData.exploreOpportunities?.opportunities || []).findIndex((o) => o.id === opp.id);
                  return (
                    <div
                      key={opp.id || rawIndex}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2edf8',
                        borderRadius: 12,
                        padding: 18,
                        boxShadow: '0 2px 8px rgba(6, 40, 79, 0.04)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 16,
                          paddingBottom: 12,
                          borderBottom: '1px solid #f1f5f9',
                          flexWrap: 'wrap',
                          gap: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontWeight: 700,
                              fontSize: 12,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {rawIndex + 1}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                            {opp.title || 'Untitled Opportunity'}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontWeight: 600,
                              border: '1px solid #bfdbfe',
                            }}
                          >
                            {opp.category}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: opp.statusType === 'hired' ? '#dcfce7' : '#fef3c7',
                              color: opp.statusType === 'hired' ? '#15803d' : '#b45309',
                              fontWeight: 600,
                            }}
                          >
                            {opp.statusType.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            title="Move Up"
                            disabled={rawIndex === 0}
                            onClick={() => {
                              if (rawIndex > 0) {
                                const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                                const temp = list[rawIndex - 1];
                                list[rawIndex - 1] = list[rawIndex];
                                list[rawIndex] = temp;
                                updateNestedField('exploreOpportunities.opportunities', list);
                              }
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 4,
                              border: '1px solid #cbd5e1',
                              background: rawIndex === 0 ? '#f8fafc' : '#fff',
                              cursor: rawIndex === 0 ? 'not-allowed' : 'pointer',
                              color: '#64748b',
                              fontSize: 11,
                            }}
                          >
                            <i className="fas fa-arrow-up" />
                          </button>

                          <button
                            type="button"
                            title="Move Down"
                            disabled={rawIndex === (cmsData.exploreOpportunities?.opportunities || []).length - 1}
                            onClick={() => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              if (rawIndex < list.length - 1) {
                                const temp = list[rawIndex + 1];
                                list[rawIndex + 1] = list[rawIndex];
                                list[rawIndex] = temp;
                                updateNestedField('exploreOpportunities.opportunities', list);
                              }
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 4,
                              border: '1px solid #cbd5e1',
                              background: rawIndex === (cmsData.exploreOpportunities?.opportunities || []).length - 1 ? '#f8fafc' : '#fff',
                              cursor: rawIndex === (cmsData.exploreOpportunities?.opportunities || []).length - 1 ? 'not-allowed' : 'pointer',
                              color: '#64748b',
                              fontSize: 11,
                            }}
                          >
                            <i className="fas fa-arrow-down" />
                          </button>

                          <button
                            type="button"
                            title="Delete Opportunity"
                            onClick={() => {
                              if (confirm(`Remove "${opp.title}" from Explore Opportunities?`)) {
                                const list = (cmsData.exploreOpportunities?.opportunities || []).filter((_, i) => i !== rawIndex);
                                updateNestedField('exploreOpportunities.opportunities', list);
                                showToast('Opportunity removed.', 'info');
                              }
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 4,
                              border: '1px solid #fecaca',
                              background: '#fef2f2',
                              color: '#dc2626',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <i className="fas fa-trash-alt" /> Delete
                          </button>
                        </div>
                      </div>

                      <div className="fields" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                        <div className="field-group">
                          <label>Role / Job Title *</label>
                          <Input
                            className="form-control"
                            value={opp.title}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].title = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group">
                          <label>Compensation / Hourly Rate *</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. $90 - $130 / hour"
                            value={opp.rate}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].rate = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group">
                          <label>Category / Sector</label>
                          <select
                            className="form-control"
                            value={opp.category}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].category = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          >
                            {(cmsData.exploreOpportunities?.categories || []).filter((c) => c !== 'All').map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="field-group">
                          <label>Status Type</label>
                          <select
                            className="form-control"
                            value={opp.statusType}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].statusType = e.target.value as 'new' | 'hired' | 'active' | 'urgent';
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          >
                            <option value="new">NEW (Recently posted)</option>
                            <option value="hired">HIRED (Active placements)</option>
                            <option value="active">ACTIVE (Standard active)</option>
                            <option value="urgent">URGENT (High priority)</option>
                          </select>
                        </div>

                        <div className="field-group">
                          <label>Status Badge Text</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. 842 recently matched"
                            value={opp.statusText || ''}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].statusText = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group">
                          <label>Hired / Monthly Volume Text</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. 842 hired this month"
                            value={opp.hiredCount || ''}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].hiredCount = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group">
                          <label>Referral Reward Bonus</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. $350"
                            value={opp.referralBonus || ''}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].referralBonus = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group">
                          <label>Location / Remote Mode</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. Global Remote, San Francisco / Remote"
                            value={opp.location || ''}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].location = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
                          <label>Tags / Tech Stack (comma-separated)</label>
                          <Input
                            className="form-control"
                            placeholder="e.g. Python, PyTorch, Distributed KV"
                            value={(opp.tags || []).join(', ')}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
                          <label>Role Summary & Evaluation Scope</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            placeholder="Briefly describe what candidates will build or be tested on..."
                            value={opp.description || ''}
                            onChange={(e) => {
                              const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                              list[rawIndex].description = e.target.value;
                              updateNestedField('exploreOpportunities.opportunities', list);
                            }}
                          />
                        </div>

                        <div className="field-group full" style={{ gridColumn: 'span 2', marginTop: 4 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                            <input
                              type="checkbox"
                              checked={opp.isOneClickApply !== false}
                              onChange={(e) => {
                                const list = [...(cmsData.exploreOpportunities?.opportunities || [])];
                                list[rawIndex].isOneClickApply = e.target.checked;
                                updateNestedField('exploreOpportunities.opportunities', list);
                              }}
                            />
                            <span>Enable 1-Click Instant Apply (AI Sandbox profile matching)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
