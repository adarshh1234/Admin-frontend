export type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory =
  | 'Technical Support'
  | 'Billing & Accounts'
  | 'Clinical Operations'
  | 'Feature Request'
  | 'Onboarding & Access'
  | 'Compliance & Security'
  | 'General Inquiry'
  | 'Emergency Escalation';

export interface TicketMessage {
  id: string;
  sender: string;
  senderType: 'customer' | 'agent' | 'system' | 'ai';
  avatar: string;
  timestamp: string;
  message: string;
  attachments?: { name: string; size: string; url?: string }[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  customerCompany?: string;
  customerTier?: 'Standard' | 'Enterprise' | 'VIP';
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgent: string;
  assignedAgentAvatar: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  conversation: TicketMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'agent' | 'ai';
  avatar: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  confidenceScore?: number;
}

export interface CustomerConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  customerCompany: string;
  channel: 'Live Web' | 'Mobile App' | 'WhatsApp' | 'Email';
  status: 'Active' | 'Waiting' | 'Resolved';
  isOnline: boolean;
  handledBy: 'AI Bot' | 'Human Agent';
  assignedAgent?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  sentiment: 'Positive' | 'Neutral' | 'Frustrated';
  messages: ChatMessage[];
}

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  isOnline: boolean;
  statusMessage?: string;
  activeChatsCount: number;
  openTicketsCount: number;
  rating: number;
}

export interface InternalAgentMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachments?: { name: string; size: string }[];
}

export interface AgentChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: AgentUser[];
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: InternalAgentMessage[];
}

export type CallStatus = 'Completed' | 'Missed' | 'Voicemail' | 'In Progress' | 'Ringing' | 'Active';
export type CallType = 'Inbound' | 'Outbound';
export type FollowUpStatus = 'Required' | 'Completed' | 'None';

export interface TranscriptSegment {
  id: string;
  speaker: 'Agent' | 'Customer';
  text: string;
  timestamp: string;
}

export interface CustomerCallRecord {
  id: string;
  callReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar: string;
  customerCompany: string;
  agentName: string;
  agentAvatar: string;
  callDate: string;
  callTime: string;
  duration: string;
  durationSeconds: number;
  callStatus: CallStatus;
  callType: CallType;
  category: TicketCategory;
  notes: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  recordingUrl?: string;
  followUpStatus: FollowUpStatus;
  linkedTicketId?: string;
}

export type CustomerCareTab =
  | 'overview'
  | 'tickets'
  | 'customer-chat'
  | 'agent-chat'
  | 'ai-chat'
  | 'monitor'
  | 'customer-calls'
  | 'manual-calls';
