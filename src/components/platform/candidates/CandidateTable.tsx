import React from 'react';
import type { CandidateTableProps } from './types';
import { AccountStatusBadge, VerificationBadge } from '../PlatformStatusBadge';
import { Button } from '../../common/Button';

export const CandidateTable: React.FC<CandidateTableProps> = ({
  paginatedCandidates,
  sortField,
  sortAsc,
  onSort,
  onViewCandidate,
  onEditCandidate,
  onToggleStatus,
  onSuspendCandidate,
  onViewActivity,
  onDeleteCandidate,
}) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th
              onClick={() => onSort('name')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Candidate{' '}
              {sortField === 'name' && (
                <i className={`fas fa-sort-${sortAsc ? 'up' : 'down'}`} style={{ marginLeft: 4 }} />
              )}
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Contact
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Location
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Education
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Experience
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Account Status
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Verification
            </th>
            <th
              onClick={() => onSort('registrationDate')}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Registered{' '}
              {sortField === 'registrationDate' && (
                <i className={`fas fa-sort-${sortAsc ? 'up' : 'down'}`} style={{ marginLeft: 4 }} />
              )}
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedCandidates.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 10 }}>
                  <i className="fas fa-user-slash" />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>No candidates found</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                  Try clearing search keywords or changing filters.
                </div>
              </td>
            </tr>
          ) : (
            paginatedCandidates.map((c) => (
              <tr
                key={c.id}
                style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
              >
                {/* Name + Avatar */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {c.avatar || c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748b' }}>ID: {c.id}</div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ color: '#1e293b', fontSize: 12.5 }}>{c.email}</div>
                  <div style={{ color: '#64748b', fontSize: 11.5, marginTop: 2 }}>{c.phone}</div>
                </td>

                {/* Location */}
                <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#94a3b8', marginRight: 5 }} />
                  {c.location}
                </td>

                {/* Education */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 500, color: '#2563eb' }}>{c.education}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>{c.college}</div>
                </td>

                {/* Experience */}
                <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {c.experience}
                </td>

                {/* Account Status */}
                <td style={{ padding: '12px 16px' }}>
                  <AccountStatusBadge status={c.accountStatus} />
                </td>

                {/* Verification Status */}
                <td style={{ padding: '12px 16px' }}>
                  <VerificationBadge status={c.verificationStatus} />
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
                      title="View Full Profile"
                      onClick={() => onViewCandidate(c)}
                      style={{ padding: '4px 8px', fontSize: 12 }}
                    >
                      <i className="fas fa-eye" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit Candidate"
                      onClick={() => onEditCandidate(c)}
                      style={{ padding: '4px 8px', fontSize: 12 }}
                    >
                      <i className="fas fa-edit" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title={c.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                      onClick={() => onToggleStatus(c)}
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
                      title="Suspend Account"
                      onClick={() => onSuspendCandidate(c)}
                      style={{ padding: '4px 8px', fontSize: 12, color: '#dc2626' }}
                    >
                      <i className="fas fa-ban" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title="View Activity Log"
                      onClick={() => onViewActivity(c)}
                      style={{ padding: '4px 8px', fontSize: 12, color: '#2563eb' }}
                    >
                      <i className="fas fa-history" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title="Delete Candidate"
                      onClick={() => onDeleteCandidate(c)}
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
  );
};
