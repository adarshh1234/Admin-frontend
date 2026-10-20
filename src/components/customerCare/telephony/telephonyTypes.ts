import type {
  CustomerCallRecord,
  FollowUpStatus,
  AgentUser,
  TicketCategory,
  TranscriptSegment,
} from '../../../types/customerCare';

export interface IncomingCallCandidate {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar: string;
  customerCompany: string;
  customerTier: 'Enterprise' | 'VIP' | 'Standard' | 'Clinical Network';
  category: TicketCategory;
  reason: string;
  ringingSince: number;
}

export const SAMPLE_INCOMING_QUEUE: IncomingCallCandidate[] = [
  {
    id: 'INC-701',
    customerName: 'Dr. Rajiv Malhotra',
    customerPhone: '+91 98112 33455',
    customerEmail: 'rajiv.m@maxhealthcare.in',
    customerAvatar: 'RM',
    customerCompany: 'Max Healthcare Institute',
    customerTier: 'Enterprise',
    category: 'Technical Support',
    reason: 'FHIR telemetry sync gateway reporting connection timeout on node 04',
    ringingSince: Date.now() - 15000,
  },
  {
    id: 'INC-702',
    customerName: 'Kavita Menon',
    customerPhone: '+91 97401 88920',
    customerEmail: 'kavita.m@manipalhealth.com',
    customerAvatar: 'KM',
    customerCompany: 'Manipal Global Hospitals',
    customerTier: 'VIP',
    category: 'Billing & Accounts',
    reason: 'Monthly enterprise license true-up clarification and invoices',
    ringingSince: Date.now() - 5000,
  },
];

export interface LogCallPayload {
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
}

export interface ManualCallAttendTabProps {
  calls: CustomerCallRecord[];
  agents: AgentUser[];
  onLogCall: (callData: LogCallPayload) => void;
  onUpdateFollowUp: (callId: string, status: FollowUpStatus) => void;
}
