import React, { useState } from 'react';
import { Input } from '../../common/Input';
import type { CustomerCallRecord, FollowUpStatus } from '../../../types/customerCare';

interface ManualCallHistoryTableProps {
  calls: CustomerCallRecord[];
  activeCallId?: string;
  onUpdateFollowUp: (callId: string, status: FollowUpStatus) => void;
  onViewTranscript: (call: CustomerCallRecord) => void;
}

export const ManualCallHistoryTable: React.FC<ManualCallHistoryTableProps> = ({
  calls,
  activeCallId,
  onUpdateFollowUp,
  onViewTranscript,
}) => {
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');

  const filteredHistory = calls.filter((c) => {
    const matchSearch =
      historySearch.trim() === '' ||
      c.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
      c.customerPhone.includes(historySearch) ||
      c.notes.toLowerCase().includes(historySearch.toLowerCase()) ||
      (c.transcript && c.transcript.toLowerCase().includes(historySearch.toLowerCase()));

    const matchStatus =
      historyStatusFilter === 'all' ||
      (historyStatusFilter === 'active' && activeCallId && c.id === activeCallId) ||
      c.callStatus.toLowerCase() === historyStatusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              Recent Manual & Attended Call History ({filteredHistory.length})
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
              Audited telephony log with saved voice-to-text transcripts, direction, status, notes & follow-up
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Input
              type="text"
              placeholder="Search by customer, phone, notes, transcript..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              style={{ width: 280 }}
            />

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
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
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="in progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '12px 20px', fontWeight: 700 }}>Caller / Customer</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Direction</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Duration</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Agent</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Time</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Follow-up</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Transcript</th>
              <th style={{ padding: '12px 20px', fontWeight: 700 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  No call history records matching the filter.
                </td>
              </tr>
            ) : (
              filteredHistory.map((call) => {
                let statusBg = '#f1f5f9';
                let statusColor = '#475569';
                if (call.callStatus === 'Completed') {
                  statusBg = '#ecfdf5';
                  statusColor = '#059669';
                } else if (call.callStatus === 'Missed') {
                  statusBg = '#fef2f2';
                  statusColor = '#dc2626';
                } else if (call.callStatus === 'In Progress' || call.callStatus === 'Active') {
                  statusBg = '#eff6ff';
                  statusColor = '#2563eb';
                }

                let followUpColor = '#64748b';
                if (call.followUpStatus === 'Required') followUpColor = '#d97706';
                if (call.followUpStatus === 'Completed') followUpColor = '#059669';

                return (
                  <tr
                    key={call.id}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {call.customerAvatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{call.customerName}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{call.customerPhone}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, color: '#334155', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <i
                          className={`fas fa-arrow-${call.callType === 'Inbound' ? 'down-left' : 'up-right'}`}
                          style={{ color: call.callType === 'Inbound' ? '#059669' : '#2563eb' }}
                        />
                        {call.callType}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: statusBg,
                          color: statusColor,
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {call.callStatus}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#334155', fontFamily: 'monospace' }}>
                      {call.duration}
                    </td>

                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      {call.agentName}
                    </td>

                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 12 }}>
                      <div>{call.callTime}</div>
                      <div>{call.callDate}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={call.followUpStatus}
                        onChange={(e) => onUpdateFollowUp(call.id, e.target.value as FollowUpStatus)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          fontSize: 12,
                          fontWeight: 600,
                          color: followUpColor,
                          background: '#ffffff',
                        }}
                      >
                        <option value="Required">Required</option>
                        <option value="Completed">Completed</option>
                        <option value="None">None</option>
                      </select>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {call.transcript ? (
                        <button
                          type="button"
                          onClick={() => onViewTranscript(call)}
                          style={{
                            background: '#eff6ff',
                            color: '#0066cc',
                            border: '1px solid #bfdbfe',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <i className="fas fa-file-alt" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 20px', color: '#334155', maxWidth: 220 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={call.notes}>
                        {call.notes || '—'}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
