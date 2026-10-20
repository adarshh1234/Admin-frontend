import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SupportTicket, TicketStatus, TicketPriority, TicketCategory, AgentUser } from '../../../types/customerCare';

interface TicketsTabProps {
  tickets: SupportTicket[];
  agents: AgentUser[];
  onOpenCreateTicket: () => void;
  onSelectTicket: (ticket: SupportTicket) => void;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onUpdatePriority: (id: string, priority: TicketPriority) => void;
  onAssignAgent: (id: string, agentName: string) => void;
}

const CATEGORIES: TicketCategory[] = [
  'Technical Support',
  'Billing & Accounts',
  'Clinical Operations',
  'Feature Request',
  'Onboarding & Access',
  'Compliance & Security',
];

export function TicketsTab({
  tickets,
  agents,
  onOpenCreateTicket,
  onSelectTicket,
  onUpdateStatus,
  onUpdatePriority,
  onAssignAgent,
}: TicketsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.customerCompany && ticket.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      const matchAgent = agentFilter === 'all' || ticket.assignedAgent === agentFilter;

      return matchSearch && matchStatus && matchPriority && matchCategory && matchAgent;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, agentFilter]);

  const priorityStyles: Record<TicketPriority, { bg: string; color: string }> = {
    Low: { bg: '#f1f5f9', color: '#475569' },
    Medium: { bg: '#e0f2fe', color: '#0369a1' },
    High: { bg: '#fef3c7', color: '#b45309' },
    Urgent: { bg: '#fee2e2', color: '#b91c1c' },
  };

  const statusStyles: Record<TicketStatus, { bg: string; color: string }> = {
    Open: { bg: '#e0f2fe', color: '#0369a1' },
    'In Progress': { bg: '#fef3c7', color: '#b45309' },
    Pending: { bg: '#f3e8ff', color: '#7e22ce' },
    Resolved: { bg: '#dcfce7', color: '#15803d' },
    Closed: { bg: '#f1f5f9', color: '#64748b' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Controls & Filter bar */}
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
              Support Tickets ({filteredTickets.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Track, assign, prioritize, and resolve enterprise and platform support tickets
            </p>
          </div>

          <Button type="button" variant="primary" onClick={onOpenCreateTicket}>
            <i className="fas fa-plus-circle" style={{ marginRight: 6 }} />
            Create New Ticket
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1.8fr) repeat(4, minmax(130px, 1fr))',
          gap: 10,
        }}>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder="Search by ticket #, subject, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Agent Filter */}
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Ticket ID & Subject</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Assigned Agent</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Created & Updated</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    <i className="fas fa-search" style={{ fontSize: 28, marginBottom: 8, display: 'block' }} />
                    No support tickets found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const pStyle = priorityStyles[ticket.priority];
                  const sStyle = statusStyles[ticket.status];

                  return (
                    <tr
                      key={ticket.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafcff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      {/* Ticket Number & Subject */}
                      <td style={{ padding: '14px 20px', maxWidth: 280 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: 12,
                            color: '#0284c7',
                            background: '#e0f2fe',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}>
                            {ticket.ticketNumber}
                          </span>
                          {ticket.customerTier === 'VIP' && (
                            <span style={{
                              background: '#fef3c7',
                              color: '#b45309',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}>
                              VIP
                            </span>
                          )}
                        </div>
                        <div
                          onClick={() => onSelectTicket(ticket)}
                          style={{
                            fontWeight: 600,
                            color: '#0f172a',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={ticket.subject}
                        >
                          {ticket.subject}
                        </div>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 11,
                            flexShrink: 0,
                          }}>
                            {ticket.customerAvatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{ticket.customerName}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{ticket.customerCompany}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {ticket.category}
                        </span>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={ticket.priority}
                          onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: pStyle.bg,
                            color: pStyle.color,
                            fontWeight: 700,
                            fontSize: 11,
                            outline: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                          }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={ticket.status}
                          onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: sStyle.bg,
                            color: sStyle.color,
                            fontWeight: 700,
                            fontSize: 11,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Assigned Agent */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={ticket.assignedAgent}
                          onChange={(e) => onAssignAgent(ticket.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#334155',
                          }}
                        >
                          {agents.map((a) => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                        </select>
                      </td>

                      {/* Dates */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: '#1e293b' }}>{ticket.createdDate}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Updated {ticket.lastUpdated}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => onSelectTicket(ticket)}
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Open
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
