import { Button } from '../../common/Button';
import type { SupportTicket, CustomerConversation, AgentUser, CustomerCallRecord, CustomerCareTab } from '../../../types/customerCare';

interface CustomerCareOverviewTabProps {
  tickets: SupportTicket[];
  conversations: CustomerConversation[];
  agents: AgentUser[];
  calls: CustomerCallRecord[];
  onNavigateTab: (tab: CustomerCareTab) => void;
  onOpenCreateTicket: () => void;
  onOpenLogCall: () => void;
  onSelectTicket: (ticket: SupportTicket) => void;
}

export function CustomerCareOverviewTab({
  tickets,
  conversations,
  agents,
  calls,
  onNavigateTab,
  onOpenCreateTicket,
  onOpenLogCall,
  onSelectTicket,
}: CustomerCareOverviewTabProps) {
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const urgentTickets = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved' && t.status !== 'Closed');
  const activeChats = conversations.filter((c) => c.status === 'Active');
  const activeAgents = agents.filter((a) => a.isOnline);
  const aiHandledChats = conversations.filter((c) => c.handledBy === 'AI Bot');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091e42 0%, #0052cc 60%, #0284c7 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: '0 10px 25px rgba(2, 101, 194, 0.2)',
      }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
          }}>
            <i className="fas fa-headset" style={{ color: '#38bdf8' }} />
            <span>Support Command Center Active</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Customer Support & Incident Escalation
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
            Omnichannel customer support, AI-assisted triage, live agent chat, and voice telephony call logging.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenCreateTicket}
            style={{
              background: '#ffffff',
              color: '#0052cc',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <i className="fas fa-plus-circle" />
            <span>New Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('customer-chat')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-comment-dots" />
            <span>Live Chats ({activeChats.length})</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('manual-calls')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-headset" />
            <span>Manual Call Desk</span>
          </button>

          <button
            type="button"
            onClick={onOpenLogCall}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-phone-alt" />
            <span>Log Call</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16,
      }}>
        {/* Active / Open Tickets */}
        <div
          onClick={() => onNavigateTab('tickets')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Active Tickets</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-ticket-alt" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{openTickets.length}</div>
          <div style={{ fontSize: 12, color: urgentTickets.length > 0 ? '#ef4444' : '#16a34a', marginTop: 4, fontWeight: 600 }}>
            {urgentTickets.length > 0 ? `⚠️ ${urgentTickets.length} Urgent Priority` : 'All normal SLA'}
          </div>
        </div>

        {/* Live Chats */}
        <div
          onClick={() => onNavigateTab('customer-chat')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Active Chats</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-comments" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{activeChats.length}</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>
            {conversations.length} total today
          </div>
        </div>

        {/* AI Handled / Deflection */}
        <div
          onClick={() => onNavigateTab('ai-chat')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>AI Deflection Rate</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#faf5ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-robot" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>68%</div>
          <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>
            {aiHandledChats.length} active autonomous sessions
          </div>
        </div>

        {/* Avg Response Time */}
        <div
          onClick={() => onNavigateTab('monitor')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Avg First Response</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-bolt" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>1m 24s</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
            ⚡ 98.4% within SLA target
          </div>
        </div>

        {/* Active Agents Online */}
        <div
          onClick={() => onNavigateTab('agent-chat')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Agents Online</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#ecfeff',
              color: '#0891b2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-user-shield" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{activeAgents.length}/{agents.length}</div>
          <div style={{ fontSize: 12, color: '#0891b2', marginTop: 4 }}>
            Ready for triage & escalations
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Tickets & Support Agents Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Left: Recent Support Tickets */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Priority Support Tickets Queue
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Recent customer issues requiring attention</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('tickets')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All ({tickets.length}) <i className="fas fa-arrow-right" style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.slice(0, 4).map((ticket) => {
              const isUrgent = ticket.priority === 'Urgent';
              return (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    border: isUrgent ? '1px solid #fecaca' : '1px solid #f1f5f9',
                    background: isUrgent ? '#fffafb' : '#fafcff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 11,
                        color: '#0284c7',
                        background: '#e0f2fe',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}>
                        {ticket.ticketNumber}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: isUrgent ? '#fee2e2' : '#fef3c7',
                        color: isUrgent ? '#dc2626' : '#b45309',
                        textTransform: 'uppercase',
                      }}>
                        {ticket.priority}
                      </span>
                    </div>

                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: ticket.status === 'Open' ? '#e0f2fe' : ticket.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                      color: ticket.status === 'Open' ? '#0369a1' : ticket.status === 'Resolved' ? '#15803d' : '#b45309',
                    }}>
                      {ticket.status}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>
                    {ticket.subject}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                    <span>
                      Customer: <strong>{ticket.customerName}</strong> ({ticket.customerCompany})
                    </span>
                    <span>Assigned: <strong>{ticket.assignedAgent}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Support Agents Workload */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Support Specialists
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Live agent load & availability</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('agent-chat')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Agent Chat <i className="fas fa-comment" style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {agents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: '#091e42',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                    }}>
                      {agent.avatar}
                    </div>
                    <span style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: agent.isOnline ? '#22c55e' : '#94a3b8',
                      border: '2px solid #ffffff',
                    }} />
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{agent.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{agent.role}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                    {agent.openTicketsCount} tickets • {agent.activeChatsCount} chats
                  </div>
                  <div style={{ fontSize: 11, color: '#16a34a' }}>
                    ★ {agent.rating} CSAT
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
