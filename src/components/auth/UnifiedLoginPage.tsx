import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export type UserRoleType = 'Super Admin' | 'Admin' | 'Staff';

interface UnifiedLoginPageProps {
  initialRole?: UserRoleType;
  onSuccess?: () => void;
}

interface RoleConfig {
  id: UserRoleType;
  label: string;
  icon: string;
  activeColor: string;
  iconColor: string;
  idLabel: string;
  placeholder: string;
  helperText: string;
  demoUsername: string;
  demoPassword: string;
  demoLabel: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'Super Admin',
    label: 'Super Admin',
    icon: 'fa-crown',
    activeColor: '#d97706',
    iconColor: '#d97706',
    idLabel: 'Super Admin ID / username',
    placeholder: 'e.g. labeeb.eee or SA-001',
    helperText: 'Full enterprise control, security audit & central governance',
    demoUsername: 'labeeb.eee',
    demoPassword: 'SuperAdmin@123',
    demoLabel: 'labeeb.eee (SA-001)',
  },
  {
    id: 'Admin',
    label: 'Admin',
    icon: 'fa-user-shield',
    activeColor: '#2563eb',
    iconColor: '#2563eb',
    idLabel: 'Admin ID / username',
    placeholder: 'e.g. sarah.mitchell or ADM-101',
    helperText: 'Departmental management, reporting & staff account oversight',
    demoUsername: 'sarah.mitchell',
    demoPassword: 'Admin@123',
    demoLabel: 'sarah.mitchell (ADM-101)',
  },
  {
    id: 'Staff',
    label: 'Staff',
    icon: 'fa-user',
    activeColor: '#059669',
    iconColor: '#059669',
    idLabel: 'Staff ID / username',
    placeholder: 'e.g. john.manager or STF-101',
    helperText: 'Daily workflow execution, tasks, CRM & permitted enterprise tools',
    demoUsername: 'john.manager',
    demoPassword: 'Staff@123',
    demoLabel: 'john.manager (STF-101)',
  },
];

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({
  initialRole = 'Staff',
  onSuccess,
}) => {
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRoleType>(initialRole);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync initialRole if it changes via routing
  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const activeRoleConfig = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleRoleChange = (role: UserRoleType) => {
    if (role === selectedRole) return;
    setSelectedRole(role);
    setError(null);
  };

  const handleFillDemo = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError(`Please enter your ${activeRoleConfig.idLabel}.`);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(username.trim(), password, selectedRole);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.pathname = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Background soft ambient accents */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Centered White Form Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.02)',
          padding: '38px 34px',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Logo & Application Name */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 800,
                width: '38px',
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '11px',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.28)',
                letterSpacing: '-0.5px',
              }}
            >
              E.
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              ERP
            </span>
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px',
              letterSpacing: '-0.025em',
            }}
          >
            Sign In to ERP
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Role-based enterprise access. Choose your portal role below to sign in to your workspace.
          </p>
        </div>

        {/* ── Horizontally Aligned Segmented Role Switcher (Wakheel.com Style) ── */}
        <div style={{ marginBottom: '22px' }}>
          <div
            role="tablist"
            aria-label="Select User Role"
            style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              gap: '4px',
            }}
          >
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  id={`role-tab-${role.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleRoleChange(role.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 8px',
                    borderRadius: '9px',
                    border: isSelected ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
                    background: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#0f172a' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? '0 2px 6px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)'
                      : 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#334155';
                      e.currentTarget.style.background = '#e9eff6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <i
                    className={`fas ${role.icon}`}
                    style={{
                      fontSize: '12px',
                      color: isSelected ? role.iconColor : '#94a3b8',
                      transition: 'color 0.18s ease',
                    }}
                  />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Guidance Subtitle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '10px',
              fontSize: '11.5px',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: activeRoleConfig.activeColor,
                display: 'inline-block',
              }}
            />
            <span>{activeRoleConfig.helperText}</span>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            role="alert"
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '11px 14px',
              borderRadius: '10px',
              marginBottom: '18px',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: 1.45,
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ marginTop: '2px', color: '#dc2626', fontSize: '13px' }} />
            <div style={{ flex: 1 }}>{error}</div>
          </div>
        )}

        {/* Dynamic Role Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username / User ID Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="erp-login-identifier"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              {activeRoleConfig.idLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="erp-login-identifier"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeRoleConfig.placeholder}
                disabled={isSubmitting}
                autoComplete="username"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 14px 11px 40px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = activeRoleConfig.activeColor;
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = `0 0 0 3px ${activeRoleConfig.activeColor}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <i
                className="fas fa-user-circle"
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="erp-login-password"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="erp-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                disabled={isSubmitting}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 42px 11px 40px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = activeRoleConfig.activeColor;
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = `0 0 0 3px ${activeRoleConfig.activeColor}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <i
                className="fas fa-lock"
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '14px',
                }}
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {/* Submit Sign In Button */}
          <button
            type="submit"
            id="erp-signin-btn"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.16)',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f172a 0%, #020617 100%)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15, 23, 42, 0.24)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.16)';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }} />
                <span>Authenticating {selectedRole}...</span>
              </>
            ) : (
              <>
                <span>Sign In as {selectedRole}</span>
                <i className="fas fa-arrow-right" style={{ fontSize: '12px' }} />
              </>
            )}
          </button>
        </form>

        {/* ── Quick Demo Credentials Assistance ── */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Demo Credentials ({selectedRole})
            </span>
            <button
              type="button"
              id="autofill-demo-btn"
              onClick={() => handleFillDemo(activeRoleConfig.demoUsername, activeRoleConfig.demoPassword)}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eef2ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
            >
              <i className="fas fa-magic" style={{ fontSize: '10px' }} />
              <span>Autofill</span>
            </button>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e9edf4',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#475569',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>User ID: </span>
              <code>{activeRoleConfig.demoUsername}</code>
            </div>
            <div>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>Pass: </span>
              <code>{activeRoleConfig.demoPassword}</code>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <i className="fas fa-shield-halved" style={{ color: '#10b981', fontSize: '11px' }} />
          <span>256-bit TLS Encrypted Session & Role-Verified Access Control</span>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
