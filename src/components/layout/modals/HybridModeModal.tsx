import { useState, useEffect } from 'react';
import { Button } from '../../common/Button';

interface HybridModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'hybrid' | 'manual' | 'ai';
  onSelectMode: (mode: 'hybrid' | 'manual' | 'ai') => void;
}

export function HybridModeModal({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}: HybridModeModalProps) {
  const [selectedActiveMode, setSelectedActiveMode] = useState<'hybrid' | 'manual' | 'ai'>(currentMode);
  const [manualSettings, setManualSettings] = useState({
    requireApprovalForDeals: true,
    manualTicketAssignment: false,
    strictFinancialConfirmation: true,
  });

  const [aiSettings, setAiSettings] = useState({
    smartInlineSuggestions: true,
    sentimentClassification: true,
    predictiveCashflow: true,
    aiConfidenceThreshold: 85,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSelectedActiveMode(currentMode);
  }, [currentMode]);

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

  function handleApplyMode() {
    onSelectMode(selectedActiveMode);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
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
          maxWidth: 720,
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
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <i className="fas fa-sliders" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                  Hybrid Mode
                </h3>
                <span
                  style={{
                    background: selectedActiveMode === 'hybrid' ? '#e0f2fe' : '#f1f5f9',
                    color: selectedActiveMode === 'hybrid' ? '#0369a1' : '#64748b',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  {selectedActiveMode === 'hybrid'
                    ? 'Co-Pilot Active'
                    : selectedActiveMode === 'manual'
                    ? 'Manual Only'
                    : 'AI Autonomous'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                Combines fine-grained manual operator controls with automated AI assistance
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
            title="Close Hybrid Mode"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Mode Selector Cards */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Operating Mode
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
            {/* Hybrid Mode Card */}
            <div
              onClick={() => setSelectedActiveMode('hybrid')}
              style={{
                border: selectedActiveMode === 'hybrid' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: selectedActiveMode === 'hybrid' ? '#eff6ff' : '#ffffff',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: selectedActiveMode === 'hybrid' ? '#1e40af' : '#0f172a' }}>
                  <i className="fas fa-layer-group" style={{ marginRight: 6, color: '#2563eb' }} />
                  Hybrid Co-Pilot
                </span>
                {selectedActiveMode === 'hybrid' && (
                  <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: 14 }} />
                )}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                Balanced human supervisory control paired with proactive AI smart assists.
              </div>
            </div>

            {/* Manual Mode Card */}
            <div
              onClick={() => setSelectedActiveMode('manual')}
              style={{
                border: selectedActiveMode === 'manual' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: selectedActiveMode === 'manual' ? '#eff6ff' : '#ffffff',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: selectedActiveMode === 'manual' ? '#1e40af' : '#0f172a' }}>
                  <i className="fas fa-hand" style={{ marginRight: 6, color: '#64748b' }} />
                  Manual Controls
                </span>
                {selectedActiveMode === 'manual' && (
                  <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: 14 }} />
                )}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                100% human-directed execution without automated background actions.
              </div>
            </div>

            {/* Full AI Mode Card */}
            <div
              onClick={() => setSelectedActiveMode('ai')}
              style={{
                border: selectedActiveMode === 'ai' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                background: selectedActiveMode === 'ai' ? '#faf5ff' : '#ffffff',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: selectedActiveMode === 'ai' ? '#6b21a8' : '#0f172a' }}>
                  <i className="fas fa-wand-magic-sparkles" style={{ marginRight: 6, color: '#7c3aed' }} />
                  AI Autonomous
                </span>
                {selectedActiveMode === 'ai' && (
                  <i className="fas fa-check-circle" style={{ color: '#7c3aed', fontSize: 14 }} />
                )}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                Full automated agent autonomy with automated triage and routing.
              </div>
            </div>
          </div>
        </div>

        {/* Dual UI Sections: 1. Manual Controls vs 2. AI Assistance */}
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* SECTION 1: MANUAL CONTROLS AREA */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                <i className="fas fa-sliders" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  1. Manual Controls Area
                </h4>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>Human validation &amp; override rules</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={manualSettings.requireApprovalForDeals}
                  onChange={(e) => setManualSettings((prev) => ({ ...prev, requireApprovalForDeals: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#2563eb' }}
                />
                <span>
                  <strong>Require Human Approval for Deals:</strong> Stage changes require operator sign-off.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={manualSettings.manualTicketAssignment}
                  onChange={(e) => setManualSettings((prev) => ({ ...prev, manualTicketAssignment: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#2563eb' }}
                />
                <span>
                  <strong>Manual Ticket Routing:</strong> Keep ticket assignment under support supervisor control.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={manualSettings.strictFinancialConfirmation}
                  onChange={(e) => setManualSettings((prev) => ({ ...prev, strictFinancialConfirmation: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#2563eb' }}
                />
                <span>
                  <strong>Strict Financial Confirmation:</strong> Cheque issuing and disbursements require 2FA authorization.
                </span>
              </label>
            </div>
          </div>

          {/* SECTION 2: AI ASSISTANCE AREA */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#faf5ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                <i className="fas fa-robot" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  2. AI Assistance Area
                </h4>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>Automated telemetry &amp; intelligent copilot</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aiSettings.smartInlineSuggestions}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, smartInlineSuggestions: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#9333ea' }}
                />
                <span>
                  <strong>Inline Smart Responses:</strong> Suggest contextual KB articles &amp; canned replies in live chat.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aiSettings.sentimentClassification}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, sentimentClassification: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#9333ea' }}
                />
                <span>
                  <strong>Sentiment &amp; SLA Auto-Triage:</strong> Auto-flag urgent tickets and triage escalation tiers.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aiSettings.predictiveCashflow}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, predictiveCashflow: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: '#9333ea' }}
                />
                <span>
                  <strong>Predictive Forecasting:</strong> Project rolling 90-day cash flow &amp; OPEX burn automatically.
                </span>
              </label>

              <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginBottom: 4 }}>
                  <span>AI Autonomy Confidence Level</span>
                  <span style={{ fontWeight: 700, color: '#9333ea' }}>{aiSettings.aiConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={aiSettings.aiConfidenceThreshold}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, aiConfidenceThreshold: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#9333ea' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Alert if applied */}
        {savedSuccess && (
          <div style={{ margin: '0 24px 16px', padding: '10px 16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, color: '#15803d', fontSize: 13, fontWeight: 600 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }} />
            Operating mode updated to {selectedActiveMode.toUpperCase()}. Ready for workflow execution.
          </div>
        )}

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
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Current System State: <strong>{selectedActiveMode === 'hybrid' ? 'Hybrid (Human + AI)' : selectedActiveMode === 'manual' ? 'Manual Direct' : 'Full AI Agent'}</strong>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleApplyMode}>
              <i className="fas fa-check" style={{ marginRight: 6 }} />
              Apply &amp; Activate Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
