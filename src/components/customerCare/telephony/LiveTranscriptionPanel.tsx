import React from 'react';
import { Button } from '../../common/Button';
import type { TranscriptSegment } from '../../../types/customerCare';

interface LiveTranscriptionPanelProps {
  isSpeechSupported: boolean;
  isTranscribing: boolean;
  isTranscriptionPaused: boolean;
  activeSpeaker: 'Agent' | 'Customer';
  setActiveSpeaker: (speaker: 'Agent' | 'Customer') => void;
  transcriptSegments: TranscriptSegment[];
  interimText: string;
  transcriptionSeconds: number;
  micPermissionError: string | null;
  transcriptEndRef: React.RefObject<HTMLDivElement | null>;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onAddToNotes: () => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const LiveTranscriptionPanel: React.FC<LiveTranscriptionPanelProps> = ({
  isSpeechSupported,
  isTranscribing,
  isTranscriptionPaused,
  activeSpeaker,
  setActiveSpeaker,
  transcriptSegments,
  interimText,
  transcriptionSeconds,
  micPermissionError,
  transcriptEndRef,
  onStart,
  onStop,
  onPause,
  onResume,
  onClear,
  onCopy,
  onDownload,
  onAddToNotes,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: '22px 24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
            }}
          >
            <i className="fas fa-microphone-lines" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                Voice-to-Text / Live Call Transcription
              </h3>
              {isTranscribing && !isTranscriptionPaused && (
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Listening Live
                </span>
              )}
              {isTranscriptionPaused && (
                <span
                  style={{
                    background: '#fffbeb',
                    color: '#d97706',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Paused
                </span>
              )}
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              Real-time speech capture with speaker tagging (Agent / Customer), audio dictation, and notes sync
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {isTranscribing && (
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className="fas fa-circle" style={{ color: isTranscriptionPaused ? '#f59e0b' : '#ef4444', fontSize: 8 }} />
              <span>{formatDuration(transcriptionSeconds)}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: 3, borderRadius: 10 }}>
            <button
              type="button"
              onClick={() => setActiveSpeaker('Agent')}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                background: activeSpeaker === 'Agent' ? '#0066cc' : 'transparent',
                color: activeSpeaker === 'Agent' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fas fa-user-tie" />
              <span>Speaker: Agent</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSpeaker('Customer')}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                background: activeSpeaker === 'Customer' ? '#059669' : 'transparent',
                color: activeSpeaker === 'Customer' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fas fa-user" />
              <span>Speaker: Customer</span>
            </button>
          </div>
        </div>
      </div>

      {!isSpeechSupported && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 13,
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="fas fa-exclamation-triangle" style={{ fontSize: 16 }} />
          <span>
            <strong>Speech Recognition Notice:</strong> Native browser voice transcription is not supported in this browser engine. For live mic dictation, please open in Google Chrome, Microsoft Edge, or a Chromium-based browser.
          </span>
        </div>
      )}

      {micPermissionError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 13,
            color: '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="fas fa-microphone-slash" style={{ fontSize: 16 }} />
          <span>{micPermissionError}</span>
        </div>
      )}

      {/* Transcript Message Scroll View */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 16,
          minHeight: 220,
          maxHeight: 340,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {transcriptSegments.length === 0 && !interimText ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            <i className="fas fa-microphone" style={{ fontSize: 28, marginBottom: 10, display: 'block', color: '#cbd5e1' }} />
            <div>Live conversation speech will transcribe into this feed in real time.</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Click <strong>"Start Recording"</strong> below to begin voice-to-text capture.
            </div>
          </div>
        ) : (
          <>
            {transcriptSegments.map((seg) => {
              const isAgent = seg.speaker === 'Agent';
              return (
                <div
                  key={seg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  {!isAgent && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      CU
                    </div>
                  )}

                  <div
                    style={{
                      background: isAgent ? '#eff6ff' : '#ffffff',
                      border: `1px solid ${isAgent ? '#bfdbfe' : '#e2e8f0'}`,
                      borderRadius: 12,
                      padding: '10px 14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: isAgent ? '#0066cc' : '#059669',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {seg.speaker}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{seg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                      {seg.text}
                    </div>
                  </div>

                  {isAgent && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#eff6ff',
                        color: '#0066cc',
                        border: '1px solid #bfdbfe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      AG
                    </div>
                  )}
                </div>
              );
            })}

            {interimText && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  alignSelf: activeSpeaker === 'Agent' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  opacity: 0.85,
                }}
              >
                <div
                  style={{
                    background: activeSpeaker === 'Agent' ? '#eff6ff' : '#ffffff',
                    border: '1px dashed #0284c7',
                    borderRadius: 12,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontStyle: 'italic',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <i className="fas fa-ellipsis fa-fade" />
                  <span>{interimText}</span>
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </>
        )}
      </div>

      {/* Recording Controls & Transcript Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {!isTranscribing ? (
            <Button
              type="button"
              variant="primary"
              onClick={onStart}
              disabled={!isSpeechSupported}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                gap: 8,
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <i className="fas fa-microphone" />
              <span>Start Recording</span>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={onStop}
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  gap: 8,
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                }}
              >
                <i className="fas fa-stop" />
                <span>Stop Recording</span>
              </Button>

              {isTranscriptionPaused ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onResume}
                  style={{ fontSize: 13, fontWeight: 700, gap: 6, color: '#059669', borderColor: '#a7f3d0' }}
                >
                  <i className="fas fa-play" />
                  <span>Resume</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPause}
                  style={{ fontSize: 13, fontWeight: 700, gap: 6, color: '#d97706', borderColor: '#fde68a' }}
                >
                  <i className="fas fa-pause" />
                  <span>Pause</span>
                </Button>
              )}
            </>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={transcriptSegments.length === 0}
            style={{ fontSize: 12.5, padding: '7px 12px', gap: 6 }}
          >
            <i className="fas fa-trash-alt" />
            <span>Clear</span>
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onCopy}
            disabled={transcriptSegments.length === 0}
            style={{ fontSize: 12.5, padding: '7px 12px', gap: 6 }}
          >
            <i className="fas fa-copy" />
            <span>Copy</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onDownload}
            disabled={transcriptSegments.length === 0}
            style={{ fontSize: 12.5, padding: '7px 12px', gap: 6 }}
          >
            <i className="fas fa-download" />
            <span>Download</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onAddToNotes}
            disabled={transcriptSegments.length === 0}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 700,
              padding: '7px 14px',
              gap: 6,
              borderColor: '#059669',
            }}
          >
            <i className="fas fa-plus" />
            <span>Add to Call Notes</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
