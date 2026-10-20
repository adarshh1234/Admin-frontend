import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { gitmiteService } from '../../services/gitmite.service';
import { ApiError } from '../../services/taskmiteApiClient';

interface GitTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitTokenModal({ isOpen, onClose }: GitTokenModalProps) {
  const { showToast } = useToast();
  const [tokenName, setTokenName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdToken, setCreatedToken] = useState<{
    id: number;
    name: string;
    token: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenName.trim()) {
      showToast('Token name is required (e.g., "Work Laptop").', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await gitmiteService.createGitToken({ name: tokenName.trim() });
      setCreatedToken(res);
      setTokenName('');
      showToast('Git Personal Access Token generated!', 'success');
    } catch (error) {
      const msg =
        error instanceof ApiError ? error.message : 'Failed to generate token.';
      showToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    if (!createdToken) return;
    navigator.clipboard.writeText(createdToken.token);
    setCopied(true);
    showToast('Token copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 3000);
  }

  function handleModalClose() {
    setCreatedToken(null);
    setTokenName('');
    setCopied(false);
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
      onClick={handleModalClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: 580,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8faff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#fef3c7',
                color: '#d97706',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
              }}
            >
              <i className="fas fa-key" />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
              Git Personal Access Tokens (PAT)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 16,
              padding: 4,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {createdToken ? (
            <div>
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 600, marginBottom: 8 }}>
                  <i className="fas fa-check-circle" /> Token "{createdToken.name}" Created
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#047857' }}>
                  Make sure to copy your Personal Access Token now. You won’t be able to see it again!
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    background: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: 13,
                      color: '#0f172a',
                      wordBreak: 'break-all',
                    }}
                  >
                    {createdToken.token}
                  </code>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={handleCopy}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <i className={copied ? 'fas fa-check' : 'fas fa-copy'} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 12,
                  color: '#475569',
                  lineHeight: 1.6,
                }}
              >
                <strong>How to use with Git CLI:</strong>
                <div style={{ marginTop: 4 }}>
                  When prompted for credentials by <code>git clone</code> or <code>git push</code>:
                  <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                    <li><strong>Username:</strong> Your admin username (e.g. <code>admin</code>)</li>
                    <li><strong>Password:</strong> Paste this Personal Access Token</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setCreatedToken(null)}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                Personal access tokens allow you to authenticate with the Git server over HTTP (for <code>git clone</code>, <code>git fetch</code>, and <code>git push</code>) without exposing your account password.
              </p>

              <form onSubmit={handleGenerate}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                    Token Name / Description *
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g. MacBook Pro, CI/CD Runner"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={handleModalClose}
                    disabled={isGenerating}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isGenerating}
                  >
                    <i className="fas fa-key" style={{ marginRight: 6 }} />
                    {isGenerating ? 'Generating...' : 'Generate Token'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
