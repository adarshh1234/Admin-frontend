import { useState } from 'react';
import { Button } from '../../common/Button';

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  showReasonInput?: boolean;
  reasonPlaceholder?: string;
  icon?: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'warning',
  showReasonInput = false,
  reasonPlaceholder = 'Enter reason (optional)...',
  icon = 'fa-exclamation-triangle',
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const headerColors = {
    danger: { bg: '#fef2f2', border: '#fecaca', iconBg: '#ef4444', iconColor: '#fff', titleColor: '#991b1b' },
    warning: { bg: '#fffbeb', border: '#fde68a', iconBg: '#f59e0b', iconColor: '#fff', titleColor: '#92400e' },
    primary: { bg: '#eff6ff', border: '#bfdbfe', iconBg: '#3b82f6', iconColor: '#fff', titleColor: '#1e40af' },
  }[variant];

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
        maxWidth: 460,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          background: headerColors.bg,
          borderBottom: `1px solid ${headerColors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: headerColors.iconBg,
            color: headerColors.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}>
            <i className={`fas ${icon}`} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: headerColors.titleColor }}>
              {title}
            </h3>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
            {message}
          </p>

          {showReasonInput && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Administrative Reason / Audit Note:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={reasonPlaceholder}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={() => {
                onConfirm(reason.trim() || undefined);
                onClose();
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
