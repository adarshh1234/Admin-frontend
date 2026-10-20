import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { CompanyLogo } from './CompanyLogos';
import {
  FEATURED_OPPORTUNITIES_LIST,
  JUST_LISTED_JOBS,
  type FeaturedOpportunity,
  type JustListedJob
} from '../../data/exploreOpportunitiesData';

export const ExploreOpportunitiesView: React.FC = () => {
  const { showToast } = useToast();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<(FeaturedOpportunity | (JustListedJob & { tags?: string[]; description?: string; requirements?: string[]; verified?: boolean; appliedCount?: string; matchedCount?: string })) | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 16 Featured Opportunities filtered by search if present
  const filteredFeatured = FEATURED_OPPORTUNITIES_LIST.filter((role) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      role.title.toLowerCase().includes(q) ||
      role.company.toLowerCase().includes(q) ||
      role.category.toLowerCase().includes(q) ||
      role.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Sort Just Listed jobs newest first
  const sortedJustListed = [...JUST_LISTED_JOBS].sort((a, b) => a.postedTimestamp - b.postedTimestamp);

  return (
    <div style={{ background: '#f8fafc', padding: 24, borderRadius: 20, border: '1px solid #e2edf8', fontFamily: 'inherit' }}>

      {/* Search & Filter Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
            <i
              className="fas fa-search"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13, pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search 16+ featured opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s',
                color: '#0f172a'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0066cc'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: '#e2e8f0', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0066cc', background: '#f0f8ff', border: '1px solid #bae6fd', padding: '4px 12px', borderRadius: 20 }}>
            {filteredFeatured.length} Active Positions
          </span>
        </div>
      </div>

      {/* TWO COLUMN MASTER LAYOUT: Featured Opportunities 4x4 Grid (Left) + Just Listed Panel (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24, alignItems: 'start' }}>

        {/* MAIN SECTION: 4-Column × 4-Row Featured Opportunities Grid */}
        <div style={{ minWidth: 0 }}>

          {/* Section Heading */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-star" style={{ color: '#0066cc', fontSize: 18 }} />
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a192f', margin: 0, letterSpacing: '-0.02em' }}>
                Featured Opportunities
              </h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Handpicked opportunities from top companies on LetGetIn
            </p>
          </div>

          {/* 4-Column × 4-Row Grid (Up to 16 Large Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 16
            }}
          >
            {filteredFeatured.map((role) => {
              const isBookmarked = bookmarkedIds.has(role.id);

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2edf8',
                    borderRadius: 16,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0, 102, 204, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    minHeight: 340
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#93c5fd';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 204, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2edf8';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.03)';
                  }}
                >
                  <div>
                    {/* Top Row: Logo, Company info, Badge, Bookmark, Time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <CompanyLogo company={role.company} size={40} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontWeight: 800, fontSize: 13.5, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {role.company}
                            </span>
                            {role.verified && (
                              <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#0066cc', color: '#fff', fontSize: 8.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                                ✓
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            <i className="fas fa-map-marker-alt" style={{ fontSize: 9.5, color: '#94a3b8' }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>
                              {role.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0066cc', background: '#f0f8ff', border: '1px solid #bae6fd', padding: '2px 7px', borderRadius: 20 }}>
                            Featured
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(role.id, e)}
                            style={{ background: 'transparent', border: 'none', color: isBookmarked ? '#0066cc' : '#cbd5e1', cursor: 'pointer', padding: 2, fontSize: 13 }}
                            title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                          >
                            <i className={isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'} />
                          </button>
                        </div>
                        <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{role.postedTime}</span>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0a192f', lineHeight: 1.35, margin: '0 0 10px', letterSpacing: '-0.01em', minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {role.title}
                    </h4>

                    {/* Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                      {role.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: '#0369a1',
                            background: '#f0f8ff',
                            border: '1px solid #e0f2fe',
                            padding: '2px 7px',
                            borderRadius: 6
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Row: Comp, Type, Applicants */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#64748b', marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#0066cc', fontFamily: 'monospace', fontSize: 12 }}>
                        <i className="fas fa-briefcase" style={{ marginRight: 4, color: '#94a3b8' }} />
                        {role.salary}
                      </span>
                      <span>·</span>
                      <span>{role.employmentType}</span>
                      {role.appliedCount && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="fas fa-users" style={{ color: '#94a3b8', fontSize: 10.5 }} />
                            {role.appliedCount}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Short Description */}
                    <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.45, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {role.description}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(role);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#ffffff',
                      border: '1px solid #bae6fd',
                      color: '#0066cc',
                      fontWeight: 700,
                      fontSize: 12,
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                      marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f8ff';
                      e.currentTarget.style.borderColor = '#0066cc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#bae6fd';
                    }}
                  >
                    <span>View Details</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: 10.5 }} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT SIDE PANEL: Just Listed (Matching User Reference Image Design) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2edf8',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            position: 'sticky',
            top: 20
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-bolt" style={{ color: '#0066cc', fontSize: 16 }} />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0a192f', margin: 0 }}>
                  Just Listed
                </h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0066cc', background: '#f0f8ff', padding: '2px 8px', borderRadius: 20, border: '1px solid #bae6fd' }}>
                Newest First
              </span>
            </div>
            <p style={{ margin: '4px 0 14px', fontSize: 12, color: '#64748b' }}>
              Latest job openings from top employers
            </p>

            {/* Vertical List of Reference Styled Jobs */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sortedJustListed.map((job, idx) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedRole({
                      ...job,
                      verified: false,
                      tags: ['Recent Listing', job.employmentType],
                      description: `Recent job posting for ${job.title} at ${job.company} (${job.location}). Direct application available.`,
                      requirements: [
                        'Relevant professional experience for the specified role.',
                        'Clear communication and dedication to workplace standards.',
                        'Resume / portfolio review through verified profile.'
                      ]
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 6px',
                    borderBottom: idx === sortedJustListed.length - 1 ? 'none' : '1px solid #f1f5f9',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Company Logo / Monogram */}
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <CompanyLogo company={job.company} size={38} />
                  </div>

                  {/* Job Details */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 2 }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.company}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.location}
                    </div>

                    {/* Time & Meta Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="far fa-clock" style={{ fontSize: 10.5, color: '#94a3b8' }} />
                        {job.postedTime}
                      </span>
                      {job.salary && (
                        <span style={{ fontWeight: 700, color: '#0066cc', fontFamily: 'monospace' }}>
                          {job.salary}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="fas fa-briefcase" style={{ fontSize: 10.5, color: '#94a3b8' }} />
                        {job.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stream Status */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b' }}>
            <span>Real-time stream</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#059669', fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Live Feed Active
            </span>
          </div>

        </div>

      </div>

      {/* Role Detail Modal */}
      {selectedRole && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 1000
          }}
          onClick={() => setSelectedRole(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 24,
              maxWidth: 620,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #e2edf8',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: 24, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <CompanyLogo company={selectedRole.company} size={48} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{selectedRole.company}</h3>
                    {selectedRole.verified && (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#0066cc', color: '#fff', fontSize: 9.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                        ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: 4, color: '#94a3b8' }} />
                    {selectedRole.location} · Posted {selectedRole.postedTime}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: 8, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0a192f', margin: '0 0 12px' }}>
                {selectedRole.title}
              </h2>

              {selectedRole.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {selectedRole.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11.5, fontWeight: 600, color: '#0369a1', background: '#f0f8ff', border: '1px solid #bae6fd', padding: '3px 10px', borderRadius: 8 }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Stat Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, background: '#f8fafc', padding: 16, borderRadius: 14, border: '1px solid #e2edf8', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Compensation</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0066cc', fontFamily: 'monospace', marginTop: 2 }}>{selectedRole.salary || 'Competitive'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Employment</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#334155', marginTop: 2 }}>{selectedRole.employmentType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Activity</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#334155', marginTop: 2 }}>{selectedRole.appliedCount || selectedRole.matchedCount || 'Direct Apply'}</div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Role Overview</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {selectedRole.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Key Fit & Requirements</h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
                  {(selectedRole.requirements || [
                    'Demonstrated proof of work in primary engineering, design, or research disciplines.',
                    'Completed adaptive 10-minute sandbox audit or verified portfolio evaluation.',
                    'Clear asynchronous communication and deep technical execution capabilities.'
                  ]).map((req, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: 18, background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                style={{ padding: '9px 16px', background: '#fff', border: '1px solid #e2edf8', borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Application submitted for ${selectedRole.title} with verified profile!`, 'success');
                  setSelectedRole(null);
                }}
                style={{ padding: '9px 20px', background: 'linear-gradient(90deg, #062b63 0%, #07498c 50%, #087bc1 100%)', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
              >
                Apply with Verified Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
