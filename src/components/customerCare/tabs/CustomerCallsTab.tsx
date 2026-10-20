import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { CustomerCallRecord, FollowUpStatus, CallStatus, AgentUser } from '../../../types/customerCare';

interface CustomerCallsTabProps {
  calls: CustomerCallRecord[];
  agents: AgentUser[];
  onOpenLogCall: () => void;
  onUpdateFollowUp: (callId: string, status: FollowUpStatus) => void;
}

export function CustomerCallsTab({
  calls,
  agents,
  onOpenLogCall,
  onUpdateFollowUp,
}: CustomerCallsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [followUpFilter, setFollowUpFilter] = useState<string>('all');

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.customerPhone.includes(searchQuery) ||
        call.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || call.callStatus === statusFilter;
      const matchType = typeFilter === 'all' || call.callType === typeFilter;
      const matchFollowUp = followUpFilter === 'all' || call.followUpStatus === followUpFilter;

      return matchSearch && matchStatus && matchType && matchFollowUp;
    });
  }, [calls, searchQuery, statusFilter, typeFilter, followUpFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Controls */}
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
              Customer Voice Telephony & Call Logs ({filteredCalls.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Telephony call history, audio recordings, summary transcripts, and callback follow-ups
            </p>
          </div>

          <Button type="button" variant="primary" onClick={onOpenLogCall}>
            <i className="fas fa-phone-plus" style={{ marginRight: 6 }} />
            Log Customer Call
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 2fr) repeat(3, minmax(140px, 1fr))',
          gap: 12,
        }}>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder="Search by customer, phone, company, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
            <option value="all">All Call Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
            <option value="Voicemail">Voicemail</option>
            <option value="In Progress">In Progress</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
            <option value="all">All Call Directions</option>
            <option value="Inbound">Inbound Calls</option>
            <option value="Outbound">Outbound Calls</option>
          </select>

          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value)}
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
            <option value="all">All Follow-ups</option>
            <option value="Required">Follow-Up Required</option>
            <option value="Completed">Completed</option>
            <option value="None">None Required</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Direction</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Handling Agent</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Duration</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Call Notes</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Follow-Up Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Audio / Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    <i className="fas fa-phone-slash" style={{ fontSize: 28, marginBottom: 8, display: 'block' }} />
                    No call records matching query.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => {
                  const isCompleted = call.callStatus === 'Completed';
                  return (
                    <tr
                      key={call.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafcff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      {/* Customer */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{call.customerName}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {call.customerPhone} • {call.customerCompany}
                        </div>
                      </td>

                      {/* Direction & Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <i
                            className={`fas ${call.callType === 'Inbound' ? 'fa-arrow-down text-blue-500' : 'fa-arrow-up text-emerald-500'}`}
                            style={{ color: call.callType === 'Inbound' ? '#0284c7' : '#10b981', fontSize: 12 }}
                          />
                          <span style={{ fontWeight: 600 }}>{call.callType}</span>
                        </div>
                        <div style={{ fontSize: 11, color: isCompleted ? '#16a34a' : '#ef4444' }}>
                          {call.callStatus}
                        </div>
                      </td>

                      {/* Agent */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{call.agentName}</div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: '#1e293b' }}>{call.callDate}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{call.callTime}</div>
                      </td>

                      {/* Duration */}
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                        {call.duration}
                      </td>

                      {/* Notes */}
                      <td style={{ padding: '14px 16px', maxWidth: 260 }}>
                        <div style={{
                          fontSize: 12,
                          color: '#475569',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {call.notes}
                        </div>
                      </td>

                      {/* Follow-up */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={call.followUpStatus}
                          onChange={(e) => onUpdateFollowUp(call.id, e.target.value as FollowUpStatus)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background:
                              call.followUpStatus === 'Required'
                                ? '#fee2e2'
                                : call.followUpStatus === 'Completed'
                                ? '#dcfce7'
                                : '#f1f5f9',
                            color:
                              call.followUpStatus === 'Required'
                                ? '#dc2626'
                                : call.followUpStatus === 'Completed'
                                ? '#15803d'
                                : '#64748b',
                            fontWeight: 700,
                            fontSize: 11,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="None">None</option>
                          <option value="Required">Required</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Audio simulation */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 12,
                            color: '#0284c7',
                            cursor: 'pointer',
                          }}
                          title="Play Call Recording / Voicemail"
                        >
                          <i className="fas fa-play" style={{ marginRight: 4 }} /> Audio
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
    </div>
  );
}
