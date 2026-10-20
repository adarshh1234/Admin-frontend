import { useState, useEffect, useRef } from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../../hooks/useToast';
import type { CustomerCallRecord, TicketCategory, FollowUpStatus } from '../../../types/customerCare';
import {
  type IncomingCallCandidate,
  type LogCallPayload,
  type ManualCallAttendTabProps,
  SAMPLE_INCOMING_QUEUE,
  useLiveTranscription,
  LiveTranscriptionPanel,
  ActiveCallDesk,
  IncomingCallAlert,
  IncomingCallQueue,
  ManualCallHistoryTable,
  ManualDialerModal,
  ViewTranscriptModal,
} from '../telephony';

export type { LogCallPayload };

export function ManualCallAttendTab({
  calls,
  agents,
  onLogCall,
  onUpdateFollowUp,
}: ManualCallAttendTabProps) {
  const { showToast } = useToast();

  // Agent workstation state
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.name || 'David Chen');
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy' | 'wrapup' | 'offline'>('available');

  // Incoming call queue state
  const [incomingQueue, setIncomingQueue] = useState<IncomingCallCandidate[]>(SAMPLE_INCOMING_QUEUE);
  const [ringingCall, setRingingCall] = useState<IncomingCallCandidate | null>(SAMPLE_INCOMING_QUEUE[0] || null);

  // Active call state
  const [activeCall, setActiveCall] = useState<{
    candidate: IncomingCallCandidate;
    startTime: number;
    isMuted: boolean;
    isOnHold: boolean;
  } | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Call Notes & wrap-up state
  const [callNotes, setCallNotes] = useState<string>('');
  const [callCategory, setCallCategory] = useState<TicketCategory>('Technical Support');
  const [followUp, setFollowUp] = useState<FollowUpStatus>('Required');

  // Transcription hook
  const {
    isSpeechSupported,
    isTranscribing,
    isTranscriptionPaused,
    activeSpeaker,
    setActiveSpeaker,
    transcriptSegments,
    setTranscriptSegments,
    interimText,
    transcriptionSeconds,
    micPermissionError,
    transcriptEndRef,
    handleStartTranscription,
    handlePauseTranscription,
    handleResumeTranscription,
    handleStopTranscription,
    handleClearTranscript,
    handleCopyTranscript,
    handleDownloadTranscript,
    getFormattedTranscriptText,
  } = useLiveTranscription();

  // Modals state
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [activeViewTranscriptCall, setActiveViewTranscriptCall] = useState<CustomerCallRecord | null>(null);

  // Active call duration timer
  useEffect(() => {
    if (activeCall) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCall]);

  function formatDuration(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function handleAcceptCall(candidate: IncomingCallCandidate) {
    setIncomingQueue((prev) => prev.filter((c) => c.id !== candidate.id));
    if (ringingCall?.id === candidate.id) {
      setRingingCall(null);
    }

    setActiveCall({
      candidate,
      startTime: Date.now(),
      isMuted: false,
      isOnHold: false,
    });
    setElapsedSeconds(0);
    setCallNotes(`[Call Attended by ${selectedAgent}]\nCaller Inquiry: ${candidate.reason}\n\n`);
    setCallCategory(candidate.category);
    setFollowUp('Required');
    setAgentStatus('busy');
    showToast(`Call connected with ${candidate.customerName}`, 'success');

    if (isSpeechSupported && !isTranscribing) {
      handleStartTranscription();
    }
  }

  function handleRejectCall(candidate: IncomingCallCandidate) {
    setIncomingQueue((prev) => prev.filter((c) => c.id !== candidate.id));
    if (ringingCall?.id === candidate.id) {
      setRingingCall(null);
    }

    onLogCall({
      customerName: candidate.customerName,
      customerPhone: candidate.customerPhone,
      customerEmail: candidate.customerEmail,
      customerCompany: candidate.customerCompany,
      agentName: selectedAgent,
      callType: 'Inbound',
      category: candidate.category,
      durationMinutes: 0,
      notes: `Inbound call rejected / routed to voicemail. Reason: ${candidate.reason}`,
      followUpStatus: 'Required',
    });
    showToast(`Call from ${candidate.customerName} routed to voicemail`, 'info');
  }

  function handleEndActiveCall() {
    if (!activeCall) return;

    handleStopTranscription();

    const finalDurationSec = elapsedSeconds;
    const finalDurationMin = Math.max(1, Math.ceil(finalDurationSec / 60));
    const fullTranscript = getFormattedTranscriptText();

    onLogCall({
      customerName: activeCall.candidate.customerName,
      customerPhone: activeCall.candidate.customerPhone,
      customerEmail: activeCall.candidate.customerEmail,
      customerCompany: activeCall.candidate.customerCompany,
      agentName: selectedAgent,
      callType: 'Inbound',
      category: callCategory,
      durationMinutes: finalDurationMin,
      notes: callNotes.trim() || 'Call completed normally without additional notes.',
      followUpStatus: followUp,
      transcript: fullTranscript || undefined,
      transcriptSegments: transcriptSegments.length > 0 ? transcriptSegments : undefined,
    });

    showToast(`Call ended with ${activeCall.candidate.customerName} (${formatDuration(finalDurationSec)})`, 'success');
    setActiveCall(null);
    setElapsedSeconds(0);
    setCallNotes('');
    setTranscriptSegments([]);
    setAgentStatus('available');
  }

  function handleSimulateIncomingCall() {
    const randomId = Math.floor(100 + Math.random() * 900);
    const mockCustomers = [
      {
        name: 'Dr. Suresh Ranganathan',
        phone: '+91 99401 22891',
        email: 'suresh@medicity.org',
        company: 'MediCity Multi-Specialty',
        avatar: 'SR',
        tier: 'Enterprise' as const,
        category: 'Clinical Operations' as TicketCategory,
        reason: 'Patient electronic consent portal validation failed for surgery batch',
      },
      {
        name: 'Pooja Hegde',
        phone: '+91 98840 77123',
        email: 'pooja.h@biotechlabs.in',
        company: 'BioTech Diagnostics',
        avatar: 'PH',
        tier: 'VIP' as const,
        category: 'Technical Support' as TicketCategory,
        reason: 'Need API key regeneration for HL7 webhook endpoints',
      },
      {
        name: 'Vikramaditya Rao',
        phone: '+91 98200 66543',
        email: 'v.rao@apollo.org',
        company: 'Apollo Health Enterprises',
        avatar: 'VR',
        tier: 'Enterprise' as const,
        category: 'Billing & Accounts' as TicketCategory,
        reason: 'Billing inquiry regarding Q3 telemetry platform expansion',
      },
    ];

    const pick = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const newIncoming: IncomingCallCandidate = {
      id: `INC-${randomId}`,
      customerName: pick.name,
      customerPhone: pick.phone,
      customerEmail: pick.email,
      customerAvatar: pick.avatar,
      customerCompany: pick.company,
      customerTier: pick.tier,
      category: pick.category,
      reason: pick.reason,
      ringingSince: Date.now(),
    };

    setIncomingQueue((prev) => [newIncoming, ...prev]);
    setRingingCall(newIncoming);
    showToast(`Simulated incoming call from ${pick.name}`, 'info');
  }

  function handleStartOutboundCall(phone: string, name: string) {
    const newCandidate: IncomingCallCandidate = {
      id: `OUT-${Date.now().toString().slice(-4)}`,
      customerName: name || 'Direct Dial Customer',
      customerPhone: phone,
      customerEmail: 'direct.outbound@client.com',
      customerAvatar: (name[0] || 'D').toUpperCase(),
      customerCompany: 'Direct Outbound',
      customerTier: 'Standard',
      category: 'General Inquiry',
      reason: 'Manual Outbound Call initiated by agent',
      ringingSince: Date.now(),
    };

    setIsDialerOpen(false);

    setActiveCall({
      candidate: newCandidate,
      startTime: Date.now(),
      isMuted: false,
      isOnHold: false,
    });
    setElapsedSeconds(0);
    setCallNotes(`[Outbound Call Initiated by ${selectedAgent}]\nRecipient: ${newCandidate.customerName} (${newCandidate.customerPhone})\n\n`);
    setCallCategory('General Inquiry');
    setFollowUp('Required');
    setAgentStatus('busy');
    showToast(`Dialing outbound to ${newCandidate.customerName}...`, 'info');

    if (isSpeechSupported && !isTranscribing) {
      handleStartTranscription();
    }
  }

  function handleAddTranscriptToNotes() {
    const formatted = getFormattedTranscriptText();
    if (!formatted.trim()) {
      showToast('No transcript segments to append.', 'warning');
      return;
    }
    setCallNotes((prev) => {
      const header = prev.trim() ? '\n\n--- [LIVE CALL TRANSCRIPT] ---\n' : '--- [LIVE CALL TRANSCRIPT] ---\n';
      return `${prev.trim()}${header}${formatted}\n`;
    });
    showToast('Extracted transcript appended into Call Notes!', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── 1. AGENT WORKSTATION & TELEPHONY CONTROLS ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '20px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
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
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            }}
          >
            <i className="fas fa-headset" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#0f172a' }}>
                Manual Call Attend & Telephony Desk
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: agentStatus === 'available' ? '#ecfdf5' : '#fffbeb',
                  color: agentStatus === 'available' ? '#059669' : '#d97706',
                  border: `1px solid ${agentStatus === 'available' ? '#a7f3d0' : '#fde68a'}`,
                }}
              >
                {agentStatus === 'available' ? 'Agent Ready' : agentStatus.toUpperCase()}
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
              Real-time inbound queue, manual call pickup, live audio timer, speech-to-text transcription, notes & follow-up management
            </p>
          </div>
        </div>

        {/* Action Buttons & Agent Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <i className="fas fa-user-circle" style={{ color: '#0284c7' }} />
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.name}>
                  {ag.name} ({ag.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSimulateIncomingCall}
            style={{
              borderColor: '#0284c7',
              color: '#0284c7',
              fontSize: 13,
              fontWeight: 700,
              gap: 6,
            }}
          >
            <i className="fas fa-satellite-dish" />
            <span>Simulate Incoming Call</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsDialerOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              gap: 6,
            }}
          >
            <i className="fas fa-phone-alt" />
            <span>Dial Outbound</span>
          </Button>
        </div>
      </div>

      {/* ── 2. QUICK METRICS ROW ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <div style={{ background: '#ffffff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            <i className="fas fa-phone-volume" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Calls Attended Today</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{calls.length + (activeCall ? 1 : 0)}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            <i className="fas fa-stopwatch" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Avg Handling Time (AHT)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>4m 18s</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            <i className="fas fa-inbox" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Incoming Queue Waiting</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: incomingQueue.length > 0 ? '#d97706' : '#0f172a' }}>
              {incomingQueue.length} {incomingQueue.length === 1 ? 'call' : 'calls'}
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            <i className="fas fa-microphone-alt" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Speech AI Transcripts</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              {calls.filter((c) => Boolean(c.transcript)).length + (transcriptSegments.length > 0 ? 1 : 0)}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. LIVE RINGING CALL ALERT ── */}
      <IncomingCallAlert
        ringingCall={!activeCall ? ringingCall : null}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      {/* ── 4. ACTIVE CALL WORKSTATION PANEL ── */}
      <ActiveCallDesk
        activeCall={activeCall}
        selectedAgent={selectedAgent}
        elapsedSeconds={elapsedSeconds}
        callNotes={callNotes}
        callCategory={callCategory}
        followUp={followUp}
        onSetCallNotes={setCallNotes}
        onSetCallCategory={setCallCategory}
        onSetFollowUp={setFollowUp}
        onToggleMute={() => setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))}
        onToggleHold={() => setActiveCall((prev) => (prev ? { ...prev, isOnHold: !prev.isOnHold } : null))}
        onEndCall={handleEndActiveCall}
      />

      {/* ── 5. VOICE TO TEXT / LIVE CALL TRANSCRIPTION PANEL ── */}
      <LiveTranscriptionPanel
        isSpeechSupported={isSpeechSupported}
        isTranscribing={isTranscribing}
        isTranscriptionPaused={isTranscriptionPaused}
        activeSpeaker={activeSpeaker}
        setActiveSpeaker={setActiveSpeaker}
        transcriptSegments={transcriptSegments}
        interimText={interimText}
        transcriptionSeconds={transcriptionSeconds}
        micPermissionError={micPermissionError}
        transcriptEndRef={transcriptEndRef}
        onStart={handleStartTranscription}
        onStop={handleStopTranscription}
        onPause={handlePauseTranscription}
        onResume={handleResumeTranscription}
        onClear={handleClearTranscript}
        onCopy={handleCopyTranscript}
        onDownload={() => handleDownloadTranscript(activeCall?.candidate.customerName)}
        onAddToNotes={handleAddTranscriptToNotes}
      />

      {/* ── 6. INCOMING CALL QUEUE ── */}
      <IncomingCallQueue
        incomingQueue={incomingQueue}
        onAcceptCall={handleAcceptCall}
        onRejectCall={handleRejectCall}
        onSimulateIncomingCall={handleSimulateIncomingCall}
      />

      {/* ── 7. RECENT MANUAL & ATTENDED CALL HISTORY ── */}
      <ManualCallHistoryTable
        calls={calls}
        activeCallId={activeCall?.candidate.id}
        onUpdateFollowUp={onUpdateFollowUp}
        onViewTranscript={(call) => setActiveViewTranscriptCall(call)}
      />

      {/* ── 8. VIEW SAVED CALL TRANSCRIPT MODAL ── */}
      <ViewTranscriptModal
        call={activeViewTranscriptCall}
        onClose={() => setActiveViewTranscriptCall(null)}
      />

      {/* ── 9. MANUAL OUTBOUND DIALER MODAL ── */}
      <ManualDialerModal
        isOpen={isDialerOpen}
        onClose={() => setIsDialerOpen(false)}
        onDial={handleStartOutboundCall}
      />
    </div>
  );
}
