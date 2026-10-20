import React from 'react';
import { Button } from '../../common/Button';
import type { IncomingCallCandidate } from './telephonyTypes';
import type { TicketCategory, FollowUpStatus } from '../../../types/customerCare';

interface ActiveCallData {
  candidate: IncomingCallCandidate;
  startTime: number;
  isMuted: boolean;
  isOnHold: boolean;
}

interface ActiveCallDeskProps {
  activeCall: ActiveCallData | null;
  selectedAgent: string;
  elapsedSeconds: number;
  callNotes: string;
  callCategory: TicketCategory;
  followUp: FollowUpStatus;
  onSetCallNotes: (notes: string | ((prev: string) => string)) => void;
  onSetCallCategory: (cat: TicketCategory) => void;
  onSetFollowUp: (status: FollowUpStatus) => void;
  onToggleMute: () => void;
  onToggleHold: () => void;
  onEndCall: () => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ActiveCallDesk: React.FC<ActiveCallDeskProps> = ({
  activeCall,
  selectedAgent,
  elapsedSeconds,
  callNotes,
  callCategory,
  followUp,
  onSetCallNotes,
  onSetCallCategory,
  onSetFollowUp,
  onToggleMute,
  onToggleHold,
  onEndCall,
}) => {
  if (!activeCall) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 18,
        border: '2px solid #0284c7',
        boxShadow: '0 8px 30px rgba(2, 132, 199, 0.15)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #091e42 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#22c55e',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              boxShadow: '0 0 0 4px rgba(255,255,255,0.2)',
            }}
          >
            {activeCall.candidate.customerAvatar}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff', display: 'inline-block' }} />
                Active Call Connected
              </span>
              <span style={{ fontSize: 13, color: '#bae6fd', fontWeight: 600 }}>
                Attending Agent: {selectedAgent}
              </span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
              {activeCall.candidate.customerName}
            </h3>
            <div style={{ fontSize: 13, color: '#e0f2fe', marginTop: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span><i className="fas fa-phone-alt" style={{ marginRight: 6 }} />{activeCall.candidate.customerPhone}</span>
              <span>•</span>
              <span><i className="fas fa-building" style={{ marginRight: 6 }} />{activeCall.candidate.customerCompany}</span>
              <span>•</span>
              <span><i className="fas fa-envelope" style={{ marginRight: 6 }} />{activeCall.candidate.customerEmail}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Call Duration
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
              {formatDuration(elapsedSeconds)}
            </div>
          </div>

          <Button
            type="button"
            onClick={onEndCall}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 14,
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-phone-slash" />
            <span>End & Save Call</span>
          </Button>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 2fr)', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Telephony Controls
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Button
              type="button"
              variant={activeCall.isMuted ? 'primary' : 'outline'}
              onClick={onToggleMute}
              style={{ fontSize: 12.5, fontWeight: 600, padding: '10px', gap: 6, justifyContent: 'center' }}
            >
              <i className={`fas fa-microphone${activeCall.isMuted ? '-slash' : ''}`} />
              <span>{activeCall.isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>

            <Button
              type="button"
              variant={activeCall.isOnHold ? 'primary' : 'outline'}
              onClick={onToggleHold}
              style={{ fontSize: 12.5, fontWeight: 600, padding: '10px', gap: 6, justifyContent: 'center' }}
            >
              <i className="fas fa-pause" />
              <span>{activeCall.isOnHold ? 'Resume' : 'Hold Call'}</span>
            </Button>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>Caller Metadata & SLA</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Customer Tier:</span>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>{activeCall.candidate.customerTier}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Preferred Category:</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>{activeCall.candidate.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Initial Reason:</span>
              <span style={{ fontWeight: 500, color: '#334155', textAlign: 'right', maxWidth: '60%' }}>
                {activeCall.candidate.reason}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Call Notes & Follow-up Configuration
            </h4>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['FHIR latency solved', 'Sent custom quotation', 'Callback requested', 'Escalated to Lead'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSetCallNotes((prev) => `${prev}• ${tag}\n`)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11.5,
                    color: '#475569',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            value={callNotes}
            onChange={(e) => onSetCallNotes(e.target.value)}
            placeholder="Type real-time notes during or after the call..."
            style={{
              width: '100%',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.5,
              color: '#1e293b',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Ticket / Inquiry Category
              </label>
              <select
                value={callCategory}
                onChange={(e) => onSetCallCategory(e.target.value as TicketCategory)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  color: '#1e293b',
                  background: '#ffffff',
                }}
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Billing & Accounts">Billing & Accounts</option>
                <option value="Clinical Operations">Clinical Operations</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Emergency Escalation">Emergency Escalation</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Onboarding & Access">Onboarding & Access</option>
                <option value="Compliance & Security">Compliance & Security</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Post-Call Follow-Up Status
              </label>
              <select
                value={followUp}
                onChange={(e) => onSetFollowUp(e.target.value as FollowUpStatus)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  color: '#1e293b',
                  background: '#ffffff',
                }}
              >
                <option value="Required">Follow-Up Required (Schedule Callback)</option>
                <option value="Completed">Completed (Issue Resolved On Call)</option>
                <option value="None">None Required</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
