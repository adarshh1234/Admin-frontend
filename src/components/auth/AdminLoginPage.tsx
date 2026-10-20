import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginPageProps {
  onSuccess?: () => void;
  onNavigateSuperAdminPortal?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onNavigateSuperAdminPortal,
}) => {
  const { loginAdmin } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your Admin or Staff ID / Username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginAdmin(username.trim(), password);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.pathname = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseAdminDemo = () => {
    setUsername('sarah.mitchell');
    setPassword('Admin@123');
    setError(null);
  };

  const handleUseStaffDemo = () => {
    setUsername('john.manager');
    setPassword('Staff@123');
    setError(null);
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
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
      }}
    >
      {/* Background geometric design patterns */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 101, 194, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 116, 144, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.02)',
          padding: '42px 36px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0b2546 0%, #0265c2 100%)',
              boxShadow: '0 10px 24px rgba(2, 101, 194, 0.25)',
              marginBottom: '16px',
            }}
          >
            <i className="fas fa-lock" style={{ fontSize: '24px', color: '#ffffff' }} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <i className="fas fa-id-badge" style={{ fontSize: '11px' }} />
            Administrator & Staff Portal
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#091e42',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            Sign in to ERP Workspace
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Enter your assigned administrator or staff credentials to proceed.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '12px 14px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: 1.4,
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ marginTop: '2px', color: '#dc2626' }} />
            <div style={{ flex: 1 }}>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Admin ID / Username */}
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="admin-username"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Admin ID / Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. sarah.mitchell or ADM-101"
                autoComplete="username"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px 12px 42px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0265c2';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <i
                className="fas fa-user"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Password with Show/Hide */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 42px 12px 42px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0265c2';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                }}
              />
              <i
                className="fas fa-lock"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '14px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0b2546 0%, #0265c2 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(2, 101, 194, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: isSubmitting ? 0.75 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-circle-notch fa-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" />
                <span>Sign In to ERP</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fills */}
        <div
          style={{
            marginTop: '22px',
            padding: '12px',
            borderRadius: '10px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
          }}
        >
          <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>
            Quick-Fill Test Credentials:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleUseAdminDemo}
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <i className="fas fa-user-shield" style={{ color: '#0265c2' }} />
              Admin (Dr. Sarah)
            </button>
            <button
              type="button"
              onClick={handleUseStaffDemo}
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <i className="fas fa-user" style={{ color: '#059669' }} />
              Staff (John Miller)
            </button>
          </div>
        </div>

        {/* Notice on Administrator accounts */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            color: '#92400e',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="fas fa-shield-alt" style={{ color: '#d97706', fontSize: '13px' }} />
          <span>Admin accounts are created and issued by the Super Admin.</span>
        </div>

        {/* Link to Super Admin Login */}
        <div
          style={{
            marginTop: '22px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#64748b',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '18px',
          }}
        >
          Need Super Administrator executive access?{' '}
          <button
            type="button"
            onClick={() => {
              if (onNavigateSuperAdminPortal) {
                onNavigateSuperAdminPortal();
              } else {
                window.location.pathname = '/super-admin/login';
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0265c2',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Super Admin Portal &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
