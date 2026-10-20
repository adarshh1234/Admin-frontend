import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SecurityPolicyConfig, ActiveSession } from '../../../types/admin';

interface AdminLoginSecurityTabProps {
  policy: SecurityPolicyConfig;
  activeSessions: ActiveSession[];
  onUpdatePolicy: (updates: Partial<SecurityPolicyConfig>) => void;
  onRevokeSession: (sessionId: string) => void;
  onRevokeAllOtherSessions: () => void;
}

export function AdminLoginSecurityTab({
  policy,
  activeSessions,
  onUpdatePolicy,
  onRevokeSession,
  onRevokeAllOtherSessions,
}: AdminLoginSecurityTabProps) {
  const [currentPolicy, setCurrentPolicy] = useState<SecurityPolicyConfig>(policy);
  const [newIpRange, setNewIpRange] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  function handleAddIpRange() {
    if (!newIpRange.trim()) return;
    const updatedRanges = [...currentPolicy.ipAccessControl.allowedRanges, newIpRange.trim()];
    setCurrentPolicy((prev) => ({
      ...prev,
      ipAccessControl: { ...prev.ipAccessControl, allowedRanges: updatedRanges },
    }));
    setNewIpRange('');
    setIsDirty(true);
  }

  function handleRemoveIpRange(range: string) {
    const updatedRanges = currentPolicy.ipAccessControl.allowedRanges.filter((r) => r !== range);
    setCurrentPolicy((prev) => ({
      ...prev,
      ipAccessControl: { ...prev.ipAccessControl, allowedRanges: updatedRanges },
    }));
    setIsDirty(true);
  }

  function handleSavePolicy() {
    onUpdatePolicy(currentPolicy);
    setIsDirty(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Security Policies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Policy Card 1: Password Security Policy */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-key" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Password Strength & Expiration
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Credential enforcement rules</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Minimum Password Length (Chars)
              </label>
              <Input
                type="number"
                min={8}
                max={32}
                value={currentPolicy.passwordPolicy.minLength}
                onChange={(e) => {
                  setCurrentPolicy((prev) => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value, 10) || 8 },
                  }));
                  setIsDirty(true);
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={currentPolicy.passwordPolicy.requireUppercase}
                  onChange={(e) => {
                    setCurrentPolicy((prev) => ({
                      ...prev,
                      passwordPolicy: { ...prev.passwordPolicy, requireUppercase: e.target.checked },
                    }));
                    setIsDirty(true);
                  }}
                  style={{ accentColor: '#2563eb' }}
                />
                <span>Require Uppercase & Lowercase letters</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={currentPolicy.passwordPolicy.requireSpecialChars}
                  onChange={(e) => {
                    setCurrentPolicy((prev) => ({
                      ...prev,
                      passwordPolicy: { ...prev.passwordPolicy, requireSpecialChars: e.target.checked },
                    }));
                    setIsDirty(true);
                  }}
                  style={{ accentColor: '#2563eb' }}
                />
                <span>Require Numbers & Special Characters (@, #, $, etc.)</span>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Password Expiry Cycle (Days)
              </label>
              <select
                value={currentPolicy.passwordPolicy.expiryDays}
                onChange={(e) => {
                  setCurrentPolicy((prev) => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, expiryDays: parseInt(e.target.value, 10) },
                  }));
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                <option value={30}>Every 30 Days</option>
                <option value={60}>Every 60 Days</option>
                <option value={90}>Every 90 Days (Recommended)</option>
                <option value={180}>Every 180 Days</option>
                <option value={0}>Never Expire</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policy Card 2: Account Lockout & Login Defense */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-lock" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Account Lockout Defense
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Brute-force protection rules</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Max Failed Login Attempts Before Lockout
              </label>
              <select
                value={currentPolicy.lockoutPolicy.maxFailedAttempts}
                onChange={(e) => {
                  setCurrentPolicy((prev) => ({
                    ...prev,
                    lockoutPolicy: { ...prev.lockoutPolicy, maxFailedAttempts: parseInt(e.target.value, 10) },
                  }));
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                <option value={3}>3 Failed Attempts</option>
                <option value={5}>5 Failed Attempts (Standard)</option>
                <option value={10}>10 Failed Attempts</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Lockout Duration
              </label>
              <select
                value={currentPolicy.lockoutPolicy.lockoutDurationMinutes}
                onChange={(e) => {
                  setCurrentPolicy((prev) => ({
                    ...prev,
                    lockoutPolicy: { ...prev.lockoutPolicy, lockoutDurationMinutes: parseInt(e.target.value, 10) },
                  }));
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={0}>Requires Admin Manual Unlock</option>
              </select>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={currentPolicy.lockoutPolicy.notifyAdminOnLockout}
                  onChange={(e) => {
                    setCurrentPolicy((prev) => ({
                      ...prev,
                      lockoutPolicy: { ...prev.lockoutPolicy, notifyAdminOnLockout: e.target.checked },
                    }));
                    setIsDirty(true);
                  }}
                  style={{ accentColor: '#dc2626' }}
                />
                <span>Alert security admins upon account lock event</span>
              </label>
            </div>
          </div>
        </div>

        {/* Policy Card 3: 2FA & MFA Enforcement */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#f5f3ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-shield-alt" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Two-Factor (2FA / MFA) Policy
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Multi-factor authentication rules</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                MFA Enforcement Scope
              </label>
              <select
                value={currentPolicy.twoFactorPolicy.enforcement}
                onChange={(e) => {
                  setCurrentPolicy((prev) => ({
                    ...prev,
                    twoFactorPolicy: {
                      ...prev.twoFactorPolicy,
                      enforcement: e.target.value as any,
                    },
                  }));
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                <option value="Disabled">Disabled</option>
                <option value="Optional">Optional (User Selected)</option>
                <option value="Mandatory for Admins">Mandatory for Admin & Staff (Recommended)</option>
                <option value="Mandatory for All">Mandatory for All Platform Users</option>
              </select>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Allowed Authentication Methods:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['TOTP (Authenticator App)', 'SMS OTP', 'Email OTP', 'FIDO2 Hardware Key'].map((method) => (
                  <span
                    key={method}
                    style={{
                      background: '#ede9fe',
                      color: '#6d28d9',
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    ✓ {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Card 4: IP Whitelisting */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-network-wired" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                IP Allowlist & Subnets
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Network-level access control</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                type="text"
                placeholder="e.g. 192.168.1.0/24 or 10.0.0.1"
                value={newIpRange}
                onChange={(e) => setNewIpRange(e.target.value)}
              />
              <Button type="button" variant="secondary" onClick={handleAddIpRange}>
                Add
              </Button>
            </div>

            <div style={{
              maxHeight: 120,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {currentPolicy.ipAccessControl.allowedRanges.map((ip) => (
                <div
                  key={ip}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                >
                  <span>{ip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIpRange(ip)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button for Policies */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        {savedAlert && (
          <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }} />
            Security policies updated!
          </span>
        )}
        <Button
          type="button"
          variant="primary"
          disabled={!isDirty}
          onClick={handleSavePolicy}
        >
          <i className="fas fa-shield-check" style={{ marginRight: 6 }} />
          Save Security Policy Settings
        </Button>
      </div>

      {/* Active Login Sessions Management */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: 24,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Active Login Sessions ({activeSessions.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Inspect live authenticated device sessions and terminate unauthorized or stale logins
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={onRevokeAllOtherSessions}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: 6 }} />
            Terminate All Other Sessions
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>User / Principal</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Device & Browser</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>IP & Location</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Login Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Activity</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((session) => (
                <tr
                  key={session.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: session.isCurrent ? '#f0fdf4' : '#ffffff',
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {session.userName}{' '}
                      {session.isCurrent && (
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          marginLeft: 6,
                        }}>
                          CURRENT SESSION
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{session.userRole}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>{session.device}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{session.browser}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                      {session.ipAddress}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{session.location}</div>
                  </td>

                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {session.loginTime}
                  </td>

                  <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: 600 }}>
                    {session.lastActive}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {!session.isCurrent ? (
                      <button
                        type="button"
                        onClick={() => onRevokeSession(session.id)}
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          borderRadius: 6,
                          padding: '4px 10px',
                          color: '#dc2626',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Revoke
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
