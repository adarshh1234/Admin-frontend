import { useState } from 'react';
import { Button } from '../../common/Button';
import type { SupportTicket, TicketStatus, TicketPriority, AgentUser } from '../../../types/customerCare';

interface ViewTicketModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  agents: AgentUser[];
  onClose: () => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onPriorityChange: (id: string, priority: TicketPriority) => void;
  onAgentChange: (id: string, agentName: string) => void;
  onReply: (id: string, message: string) => void;
}

export function ViewTicketModal({
  isOpen,
  ticket,
  agents,
  onClose,
  onStatusChange,
  onPriorityChange,
  onAgentChange,
  onReply,
}: ViewTicketModalProps) {
  const [replyText, setReplyText] = useState('');

  if (!isOpen || !ticket) return null;

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(ticket!.id, replyText.trim());
    setReplyText('');
  }

  const priorityColors: Record<TicketPriority, { bg: string; color: string }> = {
    Low: { bg: '#f1f5f9', color: '#475569' },
    Medium: { bg: '#e0f2fe', color: '#0369a1' },
    High: { bg: '#fef3c7', color: '#b45309' },
    Urgent: { bg: '#fee2e2', color: '#b91c1c' },
  };

  const statusColors: Record<TicketStatus, { bg: string; color: string }> = {
    Open: { bg: '#e0f2fe', color: '#0369a1' },
    'In Progress': { bg: '#fef3c7', color: '#b45309' },
    Pending: { bg: '#f3e8ff', color: '#7e22ce' },
    Resolved: { bg: '#dcfce7', color: '#15803d' },
    Closed: { bg: '#f1f5f9', color: '#64748b' },
  };

  return (
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
        maxWidth: 780,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: '#091e42',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: 12,
                padding: '3px 8px',
                borderRadius: 6,
              }}>
                {ticket.ticketNumber}
              </span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                {ticket.subject}
              </h3>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              From: <strong>{ticket.customerName}</strong> ({ticket.customerEmail}) • {ticket.customerCompany} • Created: {ticket.createdDate}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Status Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Status:</span>
              <select
                value={ticket.status}
                onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: statusColors[ticket.status].bg,
                  color: statusColors[ticket.status].color,
                  fontWeight: 700,
                  fontSize: 12,
                  outline: 'none',
                }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Priority:</span>
              <select
                value={ticket.priority}
                onChange={(e) => onPriorityChange(ticket.id, e.target.value as TicketPriority)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: priorityColors[ticket.priority].bg,
                  color: priorityColors[ticket.priority].color,
                  fontWeight: 700,
                  fontSize: 12,
                  outline: 'none',
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Agent Assignment */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Assigned:</span>
              <select
                value={ticket.assignedAgent}
                onChange={(e) => onAgentChange(ticket.id, e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Conversation Thread */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {ticket.conversation.map((msg) => {
            const isAgent = msg.senderType === 'agent';
            const isAi = msg.senderType === 'ai';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  maxWidth: '88%',
                  alignSelf: isAgent ? 'flex-end' : 'flex-start',
                }}
              >
                {!isAgent && (
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isAi ? '#7c3aed' : '#0284c7',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}>
                    {msg.avatar}
                  </div>
                )}

                <div style={{
                  background: isAgent ? '#0066cc' : isAi ? '#f5f3ff' : '#ffffff',
                  color: isAgent ? '#ffffff' : '#1e293b',
                  borderRadius: 14,
                  padding: '12px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: isAgent ? 'none' : isAi ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: isAgent ? '#ffffff' : isAi ? '#6d28d9' : '#0f172a',
                    }}>
                      {msg.sender} {isAi && '(Automated System)'}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: isAgent ? 'rgba(255,255,255,0.75)' : '#94a3b8',
                    }}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </p>
                </div>

                {isAgent && (
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#091e42',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}>
                    {msg.avatar}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSendReply} style={{
          padding: '16px 24px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <textarea
              placeholder="Type your response to the customer..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                resize: 'none',
              }}
            />
            <Button type="submit" variant="primary" style={{ alignSelf: 'flex-end', height: 42 }}>
              <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
              Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
