import {
  INITIAL_TICKETS,
  INITIAL_CONVERSATIONS,
  INITIAL_INTERNAL_CHANNELS,
  INITIAL_CALLS,
  INITIAL_AGENTS,
} from '../data/customerCareData';
import type {
  SupportTicket,
  CustomerConversation,
  AgentChatChannel,
  CustomerCallRecord,
  AgentUser,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  FollowUpStatus,
  TranscriptSegment,
} from '../types/customerCare';

class CustomerCareService {
  private tickets: SupportTicket[] = [...INITIAL_TICKETS];
  private conversations: CustomerConversation[] = [...INITIAL_CONVERSATIONS];
  private internalChannels: AgentChatChannel[] = [...INITIAL_INTERNAL_CHANNELS];
  private calls: CustomerCallRecord[] = [...INITIAL_CALLS];
  private agents: AgentUser[] = [...INITIAL_AGENTS];

  // ---------------------------------------------------------------------------
  // TICKETS
  // ---------------------------------------------------------------------------
  public getTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public getTicketById(id: string): SupportTicket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  public createTicket(data: {
    customerName: string;
    customerEmail: string;
    customerCompany?: string;
    customerTier?: 'Standard' | 'Enterprise' | 'VIP';
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    assignedAgent: string;
    description: string;
    tags?: string[];
  }): SupportTicket {
    const ticketNum = `#TCK-${Math.floor(8000 + Math.random() * 2000)}`;
    const initials = data.customerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const agentObj = this.agents.find((a) => a.name === data.assignedAgent) || this.agents[0];

    const newTicket: SupportTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      ticketNumber: ticketNum,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAvatar: initials || 'CU',
      customerCompany: data.customerCompany || 'Individual Account',
      customerTier: data.customerTier || 'Standard',
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      assignedAgent: agentObj.name,
      assignedAgentAvatar: agentObj.avatar,
      createdDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      lastUpdated: 'Just now',
      description: data.description,
      tags: data.tags || [data.category],
      conversation: [
        {
          id: `msg-${Date.now()}`,
          sender: data.customerName,
          senderType: 'customer',
          avatar: initials || 'CU',
          timestamp: 'Just now',
          message: data.description,
        },
      ],
    };

    this.tickets = [newTicket, ...this.tickets];
    return newTicket;
  }

  public updateTicketStatus(id: string, status: TicketStatus): boolean {
    const ticket = this.getTicketById(id);
    if (!ticket) return false;
    ticket.status = status;
    ticket.lastUpdated = 'Just now';
    return true;
  }

  public updateTicketPriority(id: string, priority: TicketPriority): boolean {
    const ticket = this.getTicketById(id);
    if (!ticket) return false;
    ticket.priority = priority;
    ticket.lastUpdated = 'Just now';
    return true;
  }

  public assignTicketAgent(id: string, agentName: string): boolean {
    const ticket = this.getTicketById(id);
    if (!ticket) return false;
    const agentObj = this.agents.find((a) => a.name === agentName);
    if (!agentObj) return false;

    ticket.assignedAgent = agentObj.name;
    ticket.assignedAgentAvatar = agentObj.avatar;
    ticket.lastUpdated = 'Just now';
    return true;
  }

  public replyToTicket(
    id: string,
    message: string,
    senderName: string = 'David Chen',
    senderType: 'agent' | 'customer' = 'agent',
  ): boolean {
    const ticket = this.getTicketById(id);
    if (!ticket) return false;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      senderType,
      avatar: senderName.split(' ').map((n) => n[0]).join('').slice(0, 2),
      timestamp: 'Just now',
      message,
    };

    ticket.conversation.push(newMessage);
    ticket.lastUpdated = 'Just now';
    if (ticket.status === 'Open' && senderType === 'agent') {
      ticket.status = 'In Progress';
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER CHAT & AI CONVERSATIONS
  // ---------------------------------------------------------------------------
  public getConversations(): CustomerConversation[] {
    return [...this.conversations];
  }

  public sendChatMessage(conversationId: string, text: string, senderName: string = 'David Chen'): boolean {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return false;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: 'AGT-101',
      senderName,
      senderType: 'agent' as const,
      avatar: 'DC',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    conv.messages.push(newMsg);
    conv.lastMessage = `${senderName}: ${text}`;
    conv.lastMessageTime = 'Just now';
    conv.handledBy = 'Human Agent';
    return true;
  }

  public takeOverAiChat(conversationId: string, agentName: string = 'David Chen'): boolean {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return false;

    conv.handledBy = 'Human Agent';
    conv.assignedAgent = agentName;
    const takeoverMsg = {
      id: `m-takeover-${Date.now()}`,
      senderId: 'SYSTEM',
      senderName: 'System Notice',
      senderType: 'agent' as const,
      avatar: 'DC',
      text: `Support agent ${agentName} has taken over this conversation session from AI Bot.`,
      timestamp: 'Just now',
    };
    conv.messages.push(takeoverMsg);
    conv.lastMessage = `${agentName} took over chat.`;
    conv.lastMessageTime = 'Just now';
    return true;
  }

  public resolveChat(conversationId: string): boolean {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return false;
    conv.status = 'Resolved';
    return true;
  }

  // ---------------------------------------------------------------------------
  // AGENT INTERNAL CHAT
  // ---------------------------------------------------------------------------
  public getInternalChannels(): AgentChatChannel[] {
    return [...this.internalChannels];
  }

  public sendInternalMessage(channelId: string, text: string, senderName: string = 'David Chen'): boolean {
    const chan = this.internalChannels.find((c) => c.id === channelId);
    if (!chan) return false;

    const newMsg = {
      id: `im-${Date.now()}`,
      senderId: 'AGT-101',
      senderName,
      senderAvatar: 'DC',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    chan.messages.push(newMsg);
    chan.lastMessage = `${senderName}: ${text}`;
    chan.lastMessageTime = 'Just now';
    return true;
  }

  // ---------------------------------------------------------------------------
  // AGENTS
  // ---------------------------------------------------------------------------
  public getAgents(): AgentUser[] {
    return [...this.agents];
  }

  // ---------------------------------------------------------------------------
  // CALLS
  // ---------------------------------------------------------------------------
  public getCalls(): CustomerCallRecord[] {
    return [...this.calls];
  }

  public logCall(data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCompany?: string;
    agentName: string;
    callType: 'Inbound' | 'Outbound';
    category: TicketCategory;
    durationMinutes: number;
    notes: string;
    followUpStatus: FollowUpStatus;
    transcript?: string;
    transcriptSegments?: TranscriptSegment[];
  }): CustomerCallRecord {
    const initials = data.customerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const mins = String(data.durationMinutes).padStart(2, '0');
    const durationStr = `${mins}m 00s`;

    const newCall: CustomerCallRecord = {
      id: `CALL-${Date.now().toString().slice(-4)}`,
      callReference: `CAL-2026-${Math.floor(900 + Math.random() * 100)}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerAvatar: initials || 'CU',
      customerCompany: data.customerCompany || 'Enterprise Client',
      agentName: data.agentName,
      agentAvatar: data.agentName.split(' ').map((n) => n[0]).join('').slice(0, 2),
      callDate: new Date().toISOString().split('T')[0],
      callTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: durationStr,
      durationSeconds: data.durationMinutes * 60,
      callStatus: 'Completed',
      callType: data.callType,
      category: data.category,
      notes: data.notes,
      transcript: data.transcript,
      transcriptSegments: data.transcriptSegments,
      followUpStatus: data.followUpStatus,
    };

    this.calls = [newCall, ...this.calls];
    return newCall;
  }

  public updateCallFollowUp(callId: string, status: FollowUpStatus): boolean {
    const call = this.calls.find((c) => c.id === callId);
    if (!call) return false;
    call.followUpStatus = status;
    return true;
  }

  public updateCallTranscript(callId: string, transcript: string, segments?: TranscriptSegment[]): boolean {
    const call = this.calls.find((c) => c.id === callId);
    if (!call) return false;
    call.transcript = transcript;
    if (segments) {
      call.transcriptSegments = segments;
    }
    return true;
  }
}

export const customerCareService = new CustomerCareService();
