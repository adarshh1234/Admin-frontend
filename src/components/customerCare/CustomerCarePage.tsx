import { useState } from 'react';
import { customerCareService } from '../../services/customerCare.service';
import { useToast } from '../../hooks/useToast';

import { CustomerCareOverviewTab } from './tabs/CustomerCareOverviewTab';
import { TicketsTab } from './tabs/TicketsTab';
import { CustomerChatTab } from './tabs/CustomerChatTab';
import { AgentChatTab } from './tabs/AgentChatTab';
import { AiChatTab } from './tabs/AiChatTab';
import { MonitorTab } from './tabs/MonitorTab';
import { CustomerCallsTab } from './tabs/CustomerCallsTab';
import { ManualCallAttendTab } from './tabs/ManualCallAttendTab';

import { CreateTicketModal } from './modals/CreateTicketModal';
import { ViewTicketModal } from './modals/ViewTicketModal';
import { LogCallModal } from './modals/LogCallModal';

import type {
  CustomerCareTab,
  SupportTicket,
  TicketStatus,
  TicketPriority,
  FollowUpStatus,
} from '../../types/customerCare';

interface CustomerCarePageProps {
  onNavigateDashboard?: () => void;
  initialTab?: CustomerCareTab;
}

export function CustomerCarePage({ onNavigateDashboard, initialTab = 'overview' }: CustomerCarePageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CustomerCareTab>(initialTab);

  const [tickets, setTickets] = useState(() => customerCareService.getTickets());
  const [conversations, setConversations] = useState(() => customerCareService.getConversations());
  const [internalChannels, setInternalChannels] = useState(() => customerCareService.getInternalChannels());
  const [calls, setCalls] = useState(() => customerCareService.getCalls());
  const [agents] = useState(() => customerCareService.getAgents());

  // Modals state
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  function refreshAll() {
    setTickets(customerCareService.getTickets());
    setConversations(customerCareService.getConversations());
    setInternalChannels(customerCareService.getInternalChannels());
    setCalls(customerCareService.getCalls());
    if (selectedTicket) {
      setSelectedTicket(customerCareService.getTicketById(selectedTicket.id) || null);
    }
  }

  // ---------------------------------------------------------------------------
  // TICKET HANDLERS
  // ---------------------------------------------------------------------------
  function handleCreateTicket(data: Parameters<typeof customerCareService.createTicket>[0]) {
    const newT = customerCareService.createTicket(data);
    refreshAll();
    showToast(`Ticket ${newT.ticketNumber} opened successfully.`, 'success');
  }

  function handleUpdateStatus(id: string, status: TicketStatus) {
    customerCareService.updateTicketStatus(id, status);
    refreshAll();
    showToast(`Ticket status changed to ${status}.`, 'info');
  }

  function handleUpdatePriority(id: string, priority: TicketPriority) {
    customerCareService.updateTicketPriority(id, priority);
    refreshAll();
    showToast(`Ticket priority changed to ${priority}.`, 'info');
  }

  function handleAssignAgent(id: string, agentName: string) {
    customerCareService.assignTicketAgent(id, agentName);
    refreshAll();
    showToast(`Assigned to ${agentName}.`, 'success');
  }

  function handleReplyTicket(id: string, message: string) {
    customerCareService.replyToTicket(id, message);
    refreshAll();
    showToast('Reply dispatched to customer.', 'success');
  }

  // ---------------------------------------------------------------------------
  // CHAT HANDLERS
  // ---------------------------------------------------------------------------
  function handleSendCustomerMessage(conversationId: string, text: string) {
    customerCareService.sendChatMessage(conversationId, text);
    refreshAll();
  }

  function handleTakeOverAi(conversationId: string, agentName: string) {
    customerCareService.takeOverAiChat(conversationId, agentName);
    refreshAll();
    showToast(`Taken over session from AI Bot. You are now speaking with customer.`, 'success');
  }

  function handleResolveChat(conversationId: string) {
    customerCareService.resolveChat(conversationId);
    refreshAll();
    showToast('Conversation closed as resolved.', 'info');
  }

  function handleSendInternalMessage(channelId: string, text: string) {
    customerCareService.sendInternalMessage(channelId, text);
    refreshAll();
  }

  // ---------------------------------------------------------------------------
  // CALLS HANDLERS
  // ---------------------------------------------------------------------------
  function handleLogCall(data: Parameters<typeof customerCareService.logCall>[0]) {
    const call = customerCareService.logCall(data);
    refreshAll();
    showToast(`Call record ${call.callReference} logged.`, 'success');
  }

  function handleUpdateFollowUp(callId: string, status: FollowUpStatus) {
    customerCareService.updateCallFollowUp(callId, status);
    refreshAll();
    showToast(`Follow-up status updated to ${status}.`, 'info');
  }

  const tabs: { id: CustomerCareTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'tickets', label: 'Tickets', icon: 'fa-ticket-alt', count: tickets.length },
    { id: 'customer-chat', label: 'Customer Chat', icon: 'fa-comments', count: conversations.length },
    { id: 'agent-chat', label: 'Agent Chat', icon: 'fa-users', count: internalChannels.length },
    { id: 'ai-chat', label: 'AI Chat', icon: 'fa-robot' },
    { id: 'monitor', label: 'Monitor', icon: 'fa-desktop' },
    { id: 'customer-calls', label: 'Customer Calls', icon: 'fa-phone-alt', count: calls.length },
    { id: 'manual-calls', label: 'Manual Call Attend', icon: 'fa-headset' },
  ];

  return (
    <div style={{ padding: '24px 32px 60px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onNavigateDashboard && (
            <button
              type="button"
              onClick={onNavigateDashboard}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
              title="Back to Dashboard"
            >
              <i className="fas fa-arrow-left" />
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #091e42, #0265c2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 16,
              }}>
                <i className="fas fa-headset" />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: '#091e42',
                letterSpacing: '-0.02em',
              }}>
                Customer Care & Support Operations
              </h1>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Omnichannel ticketing, live agent chat, AI deflection, and voice telephony call logs
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: 30,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>AI Auto-Triage Online</span>
          <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>SLA 98.4%</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#ffffff',
        padding: '6px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        marginBottom: 24,
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fas ${tab.icon}`} style={{ fontSize: 13, color: isActive ? '#ffffff' : '#94a3b8' }} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  padding: '2px 7px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <CustomerCareOverviewTab
          tickets={tickets}
          conversations={conversations}
          agents={agents}
          calls={calls}
          onNavigateTab={setActiveTab}
          onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
          onOpenLogCall={() => setIsLogCallOpen(true)}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        />
      )}

      {activeTab === 'tickets' && (
        <TicketsTab
          tickets={tickets}
          agents={agents}
          onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          onAssignAgent={handleAssignAgent}
        />
      )}

      {activeTab === 'customer-chat' && (
        <CustomerChatTab
          conversations={conversations}
          agents={agents}
          onSendMessage={handleSendCustomerMessage}
          onTakeOverAi={handleTakeOverAi}
          onResolveChat={handleResolveChat}
        />
      )}

      {activeTab === 'agent-chat' && (
        <AgentChatTab
          channels={internalChannels}
          agents={agents}
          onSendInternalMessage={handleSendInternalMessage}
        />
      )}

      {activeTab === 'ai-chat' && (
        <AiChatTab
          conversations={conversations}
          agents={agents}
          onTakeOverAi={handleTakeOverAi}
          onSendMessage={handleSendCustomerMessage}
        />
      )}

      {activeTab === 'monitor' && (
        <MonitorTab
          tickets={tickets}
          conversations={conversations}
          agents={agents}
        />
      )}

      {activeTab === 'customer-calls' && (
        <CustomerCallsTab
          calls={calls}
          agents={agents}
          onOpenLogCall={() => setIsLogCallOpen(true)}
          onUpdateFollowUp={handleUpdateFollowUp}
        />
      )}

      {activeTab === 'manual-calls' && (
        <ManualCallAttendTab
          calls={calls}
          agents={agents}
          onLogCall={handleLogCall}
          onUpdateFollowUp={handleUpdateFollowUp}
        />
      )}

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        agents={agents}
        onClose={() => setIsCreateTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />

      <ViewTicketModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        agents={agents}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleUpdateStatus}
        onPriorityChange={handleUpdatePriority}
        onAgentChange={handleAssignAgent}
        onReply={handleReplyTicket}
      />

      <LogCallModal
        isOpen={isLogCallOpen}
        agents={agents}
        onClose={() => setIsLogCallOpen(false)}
        onSubmit={handleLogCall}
      />
    </div>
  );
}

export default CustomerCarePage;
