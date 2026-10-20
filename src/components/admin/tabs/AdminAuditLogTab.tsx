import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { AdminAuditLog, AuditLogStatus } from '../../../types/admin';

interface AdminAuditLogTabProps {
  logs: AdminAuditLog[];
  onClearLogs?: () => void;
}

export function AdminAuditLogTab({ logs }: AdminAuditLogTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const modules = useMemo(() => {
    const list = Array.from(new Set(logs.map((l) => l.module)));
    return list;
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchStatus = statusFilter === 'all' || log.status === statusFilter;

      return matchSearch && matchModule && matchStatus;
    });
  }, [logs, searchQuery, moduleFilter, statusFilter]);

  function handleExportCsv() {
    const headers = ['ID', 'User', 'Username', 'Role', 'Action', 'Module', 'Timestamp', 'IP', 'Status', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.user}"`,
      l.username,
      l.userRole,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.timestamp}"`,
      `"${l.ipAddress}"`,
      l.status,
      `"${l.details || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Filter Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Administrative Audit Trail ({filteredLogs.length} Events)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Immutable recording of security events, privilege escalations, account lockouts, and access alterations
            </p>
          </div>

          <Button type="button" variant="secondary" onClick={handleExportCsv}>
            <i className="fas fa-download" style={{ marginRight: 6 }} />
            Export Audit CSV
          </Button>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 2fr) 1fr 1fr',
          gap: 12,
        }}>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder="Search audit actions, users, IPs, changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Event Results</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Administrator / Actor</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Action Performed</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Module</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>IP & Location</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    No audit records matching query parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusColors: Record<AuditLogStatus, { bg: string; color: string; border: string }> = {
                    Success: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
                    Warning: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
                    Failed: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
                    Blocked: { bg: '#fef2f2', color: '#dc2626', border: '#f87171' },
                  };
                  const badge = statusColors[log.status];

                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafcff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      {/* User / Actor */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                          }}>
                            {log.userAvatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{log.user}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              @{log.username} • {log.userRole}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>
                        <div>{log.action}</div>
                        {log.details && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.details}
                          </div>
                        )}
                      </td>

                      {/* Module */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          {log.module}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '14px 16px', color: '#475569', fontSize: 12 }}>
                        {log.timestamp}
                      </td>

                      {/* IP & Location */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
                          {log.ipAddress}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{log.location}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          textTransform: 'uppercase',
                        }}>
                          {log.status}
                        </span>
                      </td>

                      {/* Action details */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: 6,
                            padding: '4px 10px',
                            color: '#0284c7',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Log Modal / Drawer */}
      {selectedLog && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            width: '100%',
            maxWidth: 560,
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                  Audit Event Details
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Log ID: {selectedLog.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                    Action
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                    {selectedLog.action}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Actor</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedLog.user}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>@{selectedLog.username} ({selectedLog.userRole})</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Module</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedLog.module}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Result: {selectedLog.status}</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                    Timestamp & Origin
                  </div>
                  <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{selectedLog.timestamp}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
                    IP: {selectedLog.ipAddress} ({selectedLog.location})
                  </div>
                </div>

                {selectedLog.details && (
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                      Detailed Notes
                    </div>
                    <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                      {selectedLog.details}
                    </div>
                  </div>
                )}

                {selectedLog.afterState && (
                  <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8, border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#0369a1', fontWeight: 600, marginBottom: 4 }}>
                      Recorded State Change
                    </div>
                    {selectedLog.beforeState && (
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                        <strong>Before:</strong> {selectedLog.beforeState}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#0f172a' }}>
                      <strong>After:</strong> {selectedLog.afterState}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button type="button" variant="primary" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
