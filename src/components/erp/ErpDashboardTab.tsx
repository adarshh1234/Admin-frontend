import { useMemo } from 'react';
import { ALL_MODULES } from '../../data/modulesData';
import { useAuth } from '../../context/AuthContext';
import { isModuleAccessible } from '../../utils/permission.utils';

interface ErpDashboardTabProps {
  onNavigateModule: (id: number) => void;
}

export function ErpDashboardTab({ onNavigateModule }: ErpDashboardTabProps) {
  const { user, isSuperAdmin, isAdmin } = useAuth();

  const allowedModules = useMemo(() => {
    return ALL_MODULES.filter((m) => isModuleAccessible(m.id, user, isSuperAdmin, isAdmin));
  }, [user, isSuperAdmin, isAdmin]);

  const quickModules = useMemo(() => {
    return allowedModules.slice(0, 8);
  }, [allowedModules]);

  const displayName = user?.displayName || user?.username || 'Executive User';
  const roleName = user?.role || (isSuperAdmin ? 'Super Admin' : 'Admin');

  return (
    <div>
      {/* Blue Gradient Header / Hero Banner */}
      <div
        className="dashboard-hero-banner"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #072e5b 0%, #063970 50%, #0284c7 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          marginBottom: 24,
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25), 0 8px 12px -6px rgba(7, 46, 91, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Background Decorative Blur Orbs */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '25%',
            bottom: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.2)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            {/* Tag Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: 9999,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <i className="fas fa-chart-line" /> Executive Overview
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.22)',
                  border: '1px solid rgba(110, 231, 183, 0.35)',
                  color: '#a7f3d0',
                  padding: '4px 12px',
                  borderRadius: 9999,
                }}
              >
                <i className="fas fa-check-circle" style={{ color: '#6ee7b7' }} /> Real-time System Sync Active
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 1.25,
              }}
            >
              Admin Operations &amp; Intelligence Hub
            </h2>

            {/* Subtitle */}
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 13.5,
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.5,
              }}
            >
              Enterprise-grade telemetry, role governance, and real-time synchronization across all LetGetIn ERP modules.
            </p>
          </div>

          {/* Right Action / Summary Glass Card */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '14px 18px',
              borderRadius: 16,
              backdropFilter: 'blur(8px)',
              minWidth: 200,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Active Session
              </span>
              <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: 14, color: '#ffffff' }}>
                {displayName}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                color: 'rgba(255, 255, 255, 0.85)',
                paddingTop: 6,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <i className="fas fa-shield-alt" style={{ color: '#60a5fa' }} />
              <span>
                <strong>{roleName}</strong> · {allowedModules.length} Modules Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats">
        <div className="card">
          <div className="label">
            <i className="fas fa-cubes" /> Modules
          </div>
          <div className="value">{allowedModules.length}</div>
          <div className="sub">
            <span className="up">
              <i className="fas fa-arrow-up" /> +2
            </span>
          </div>
        </div>
        <div className="card">
          <div className="label">
            <i className="fas fa-users" /> Active Users
          </div>
          <div className="value">1,284</div>
          <div className="sub">
            <span className="up">
              <i className="fas fa-arrow-up" /> +12%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="label">
            <i className="fas fa-tasks" /> Tasks
          </div>
          <div className="value">347</div>
          <div className="sub">
            <span className="up">89 done</span>
          </div>
        </div>
        <div className="card">
          <div className="label">
            <i className="fas fa-calendar-check" /> Meetings
          </div>
          <div className="value">18</div>
          <div className="sub">
            <span className="down">
              <i className="fas fa-arrow-down" /> 3 today
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            <i className="fas fa-rocket" style={{ color: '#2563eb', marginRight: 8 }} /> Quick Access
          </h3>
        </div>
        <div className="modules-grid">
          {quickModules.map((m) => (
            <div key={m.id} className="module-card" onClick={() => onNavigateModule(m.id)}>
              <div className="icon">
                <i className={`fas ${m.icon}`} />
              </div>
              <div className="info">
                <div className="name">{m.name}</div>
                <div className="desc">{m.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            <i className="far fa-clock" style={{ color: '#2563eb', marginRight: 8 }} /> Recent Activity
          </h3>
          <span className="text-muted" style={{ fontSize: 13 }}>
            Last 7 days
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="flex-between flex-center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f4fe' }}>
            <span>
              <i className="fas fa-check-circle" style={{ color: '#16a34a', marginRight: 8 }} /> Module "CRM" updated
            </span>
            <span className="text-muted" style={{ fontSize: 13 }}>
              2h ago
            </span>
          </div>
          <div className="flex-between flex-center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f4fe' }}>
            <span>
              <i className="fas fa-user-plus" style={{ color: '#2563eb', marginRight: 8 }} /> New user onboarded
            </span>
            <span className="text-muted" style={{ fontSize: 13 }}>
              4h ago
            </span>
          </div>
          <div className="flex-between flex-center" style={{ padding: '8px 0' }}>
            <span>
              <i className="fas fa-file-invoice" style={{ color: '#f59e0b', marginRight: 8 }} /> Report #045 generated
            </span>
            <span className="text-muted" style={{ fontSize: 13 }}>
              6h ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
