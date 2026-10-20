import React, { useState } from 'react';
import { userService, type UserAccount } from '../../../../services/user.service';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !user) return null;

  const [mode, setMode] = useState<'generate' | 'custom'>('generate');
  const [customPassword, setCustomPassword] = useState('');
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'custom' && (!customPassword || customPassword.length < 6)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await userService.resetPassword(
        user.id || (user._id as string),
        mode === 'custom' ? customPassword : undefined,
      );

      if (res.generatedPassword) {
        setGeneratedResult(res.generatedPassword);
      } else {
        onSuccess(`Password successfully reset for @${user.username || user.displayName || user.email || 'user'}.`);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset user password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setGeneratedResult(null);
    setCustomPassword('');
    setError(null);
    setMode('generate');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fffbeb',
            borderTop: '4px solid #d97706',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <i className="fas fa-key" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#92400e' }}>
                Reset Password: {user.displayName || user.fullName || user.username || 'User'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#b45309' }}>
                User ID: {user.userId || user.id || user._id}{user.username ? ` · @${user.username}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#92400e',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {generatedResult ? (
            <div>
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>
                  Temporary Password Generated:
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px dashed #86efac',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#15803d',
                    fontFamily: 'monospace',
                    marginBottom: '10px',
                    wordBreak: 'break-all',
                  }}
                >
                  {generatedResult}
                </div>
                <Button variant="outline" onClick={handleCopy} style={{ fontSize: '12px', padding: '6px 14px' }}>
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} style={{ marginRight: '6px' }} />
                  {copied ? 'Copied to Clipboard!' : 'Copy Temporary Password'}
                </Button>
              </div>

              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px' }}>
                Provide this temporary password securely to the user. Previous sessions on all devices have been terminated.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    onSuccess(`Password successfully reset for @${user.username}.`);
                    handleClose();
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '13px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Security notice */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '18px',
                  fontSize: '12.5px',
                  color: '#1e40af',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                <i className="fas fa-info-circle" style={{ marginTop: '2px', color: '#2563eb' }} />
                <div>
                  <strong>Session Invalidation Notice:</strong> Resetting credentials will immediately revoke all active JWT tokens and sessions for this user.
                </div>
              </div>

              {/* Mode Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Reset Method
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label
                    style={{
                      flex: 1,
                      border: mode === 'generate' ? '2px solid #0265c2' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      background: mode === 'generate' ? '#f0f7ff' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: mode === 'generate' ? '#0265c2' : '#475569',
                    }}
                  >
                    <input
                      type="radio"
                      name="resetMode"
                      checked={mode === 'generate'}
                      onChange={() => setMode('generate')}
                    />
                    Generate Temp Password
                  </label>
                  <label
                    style={{
                      flex: 1,
                      border: mode === 'custom' ? '2px solid #0265c2' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      background: mode === 'custom' ? '#f0f7ff' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: mode === 'custom' ? '#0265c2' : '#475569',
                    }}
                  >
                    <input
                      type="radio"
                      name="resetMode"
                      checked={mode === 'custom'}
                      onChange={() => setMode('custom')}
                    />
                    Set Custom Password
                  </label>
                </div>
              </div>

              {mode === 'custom' && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password (min. 6 chars)"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Confirm Password Reset'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
