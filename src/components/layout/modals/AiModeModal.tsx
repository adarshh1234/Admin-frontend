import { useState, useEffect } from 'react';
import { Button } from '../../common/Button';

interface AiModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiModeModal({ isOpen, onClose }: AiModeModalProps) {
  const [activeSubMode, setActiveSubMode] = useState<'voice' | 'chat'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'system'; text: string; time: string }[]
  >([
    {
      sender: 'system',
      text: 'AI Mode initialized. Voice and Command channels are active and ready.',
      time: 'Just now',
    },
  ]);

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function toggleVoiceListening() {
    if (!isListening) {
      setIsListening(true);
      setVoiceTranscript('Listening... Speak clearly into your microphone.');
    } else {
      setIsListening(false);
      setVoiceTranscript('Voice capture stopped. Ready for next voice instruction.');
    }
  }

  function handleSendCommand(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const userMsg = commandInput.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: timeStr },
      {
        sender: 'system',
        text: `Command '${userMsg}' received. Ready for backend AI processing engine execution.`,
        time: timeStr,
      },
    ]);
    setCommandInput('');
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              }}
            >
              <i className="fas fa-wand-magic-sparkles" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                  AI Mode
                </h3>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  Active Engine
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                Autonomous intelligence with real-time Voice and Command capabilities
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: 18,
              padding: 4,
              borderRadius: 6,
            }}
            title="Close AI Mode"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Mode Selector Tabs (Voice vs Chat/Command) */}
        <div style={{ padding: '20px 24px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              background: '#f1f5f9',
              padding: 4,
              borderRadius: 12,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSubMode('voice')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeSubMode === 'voice' ? '#ffffff' : 'transparent',
                color: activeSubMode === 'voice' ? '#2563eb' : '#64748b',
                fontWeight: activeSubMode === 'voice' ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: activeSubMode === 'voice' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fas fa-microphone" />
              <span>Voice Interaction</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubMode('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeSubMode === 'chat' ? '#ffffff' : 'transparent',
                color: activeSubMode === 'chat' ? '#2563eb' : '#64748b',
                fontWeight: activeSubMode === 'chat' ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: activeSubMode === 'chat' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fas fa-terminal" />
              <span>Chat / Command</span>
            </button>
          </div>
        </div>

        {/* Mode Body Content */}
        <div style={{ padding: 24 }}>
          {activeSubMode === 'voice' ? (
            /* Option 1: VOICE INTERACTION */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
              {/* Animated Microphone Pulsar */}
              <div
                onClick={toggleVoiceListening}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: isListening
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  cursor: 'pointer',
                  boxShadow: isListening
                    ? '0 0 0 12px rgba(239, 68, 68, 0.2), 0 8px 24px rgba(239, 68, 68, 0.4)'
                    : '0 0 0 8px rgba(37, 99, 235, 0.15), 0 8px 24px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.25s ease',
                  marginBottom: 20,
                }}
              >
                <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`} />
              </div>

              <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {isListening ? 'Listening for voice command...' : 'Click microphone to start speaking'}
              </h4>

              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', maxWidth: 440 }}>
                Voice UI is structured and ready for future speech-to-text API integration. Try saying queries such as <em>"Summarize weekly sales"</em> or <em>"Create urgent ticket"</em>.
              </p>

              {/* Status Box */}
              <div
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '14px 18px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Voice Input Stream
                  </span>
                  <span style={{ fontSize: 11, color: isListening ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                    <i className="fas fa-circle" style={{ fontSize: 8, marginRight: 4 }} />
                    {isListening ? 'Mic Active' : 'Standby'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: isListening ? '#0f172a' : '#64748b', fontStyle: isListening ? 'normal' : 'italic' }}>
                  {voiceTranscript || 'No voice input detected yet. Ready to capture sound input.'}
                </div>
              </div>
            </div>
          ) : (
            /* Option 2: CHAT / COMMAND */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Chat Stream History */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 16,
                  height: 220,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                        color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                        border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        fontSize: 13,
                        lineHeight: 1.45,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      }}
                    >
                      {msg.text}
                    </div>
                    <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, marginInline: 4 }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Command Suggestions */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>
                  Examples:
                </span>
                {['/summary', '/open-tickets', '/daily-kpi', '/export-data'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => setCommandInput(cmd)}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 11.5,
                      color: '#334155',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendCommand} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Type an AI command or question (e.g. /summary, create note)..."
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
                <Button type="submit" variant="primary" style={{ padding: '0 20px' }}>
                  <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
                  Execute
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>AI Architecture: Ready for API / Model Hookup</span>
          </div>

          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
