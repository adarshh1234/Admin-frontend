import { useState } from 'react';
import { Button } from '../../common/Button';

interface ResetPasswordModalProps {
  isOpen: boolean;
  targetUser: {
    id: string;
    name: string;
    username: string;
    email: string;
    type?: string;
  } | null;
  onClose: () => void;
  onConfirm: (options: {
    method: 'generate_temp' | 'send_email_link';
    forceChangeOnLogin: boolean;
  }) => { success: boolean; tempPassword?: string; message: string };
}

export function ResetPasswordModal({
  isOpen,
  targetUser,
  onClose,
  onConfirm,
}: ResetPasswordModalProps) {
  const [method, setMethod] = useState<'generate_temp' | 'send_email_link'>('generate_temp');
  const [forceChangeOnLogin, setForceChangeOnLogin] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  if (!isOpen || !targetUser) return null;

  function handleReset() {
    const res = onConfirm({
      method,
      forceChangeOnLogin,
    });
    if (res.tempPassword) {
      setGeneratedPassword(res.tempPassword);
    }
    setResultMsg(res.message);
  }

  function handleCopy() {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleCloseModal() {
    setGeneratedPassword(null);
    setResultMsg(null);
    setCopied(false);
    onClose();
  }

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
        maxWidth: 500,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              <i className="fas fa-key" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Reset Account Password</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Security credential management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Target User Info */}
          <div style={{
            background: '#f1f5f9',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{targetUser.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>@{targetUser.username} • {targetUser.email}</div>
            </div>
            {targetUser.type && (
              <span style={{
                background: '#e2e8f0',
                color: '#475569',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
              }}>
                {targetUser.type}
              </span>
            )}
          </div>

          {!resultMsg ? (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
                  Select Reset Method:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 14,
                    borderRadius: 10,
                    border: method === 'generate_temp' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: method === 'generate_temp' ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="radio"
                      name="resetMethod"
                      checked={method === 'generate_temp'}
                      onChange={() => setMethod('generate_temp')}
                      style={{ marginTop: 3, accentColor: '#0284c7' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                        Generate Secure Temporary Password
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        Generate a high-entropy 14-character temporary password to provide securely to the user.
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 14,
                    borderRadius: 10,
                    border: method === 'send_email_link' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: method === 'send_email_link' ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="radio"
                      name="resetMethod"
                      checked={method === 'send_email_link'}
                      onChange={() => setMethod('send_email_link')}
                      style={{ marginTop: 3, accentColor: '#0284c7' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                        Send Password Reset Link via Email
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        Dispatches a cryptographically signed password reset URL valid for 60 minutes to {targetUser.email}.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 24,
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={forceChangeOnLogin}
                    onChange={(e) => setForceChangeOnLogin(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#0284c7' }}
                  />
                  <span>Require password change on user's subsequent login</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={handleReset}>
                  <i className="fas fa-redo-alt" style={{ marginRight: 6 }} />
                  Proceed with Reset
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div style={{
                padding: '16px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 10,
                color: '#166534',
                fontSize: 14,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <i className="fas fa-check-circle" style={{ fontSize: 20, marginTop: 2, color: '#16a34a' }} />
                <div>
                  <strong>Password Reset Processed!</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>{resultMsg}</p>
                </div>
              </div>

              {generatedPassword && (
                <div style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: 10,
                  padding: '16px',
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 6 }}>
                    Temporary Credential (One-Time Display)
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'monospace',
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#38bdf8',
                  }}>
                    <span>{generatedPassword}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      style={{
                        background: copied ? '#10b981' : '#334155',
                        border: 'none',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'background 0.2s',
                      }}
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 8 }}>
                    <i className="fas fa-shield-alt" style={{ marginRight: 4 }} />
                    This temporary password is never saved in plaintext and will expire after initial use.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="button" variant="primary" onClick={handleCloseModal}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
