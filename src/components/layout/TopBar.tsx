import { forwardRef } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onHamburgerClick: () => void;
  onGlobalAction: () => void;
  showActions?: boolean;
}

export const TopBar = forwardRef<HTMLButtonElement, TopBarProps>(function TopBar(
  { onHamburgerClick, onGlobalAction, showActions = true },
  hamburgerRef,
) {
  const { user, isSuperAdmin, logout } = useAuth();
  const displayName = user?.displayName || user?.username || 'Executive User';
  const roleName = user?.role || 'ERP User';

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Button className="hamburger" id="hamburgerBtn" ref={hamburgerRef} onClick={onHamburgerClick}>
          <i className="fas fa-bars" />
        </Button>
        <div className="greeting">
          <h1 id="pageTitle">
            Welcome back, <span>{displayName}</span>
          </h1>
          <p id="pageSubtitle">
            <i className="fas fa-shield-alt" style={{ color: '#2563eb', marginRight: 6 }} />
            {roleName} · ERP Full Module Navigation
          </p>
        </div>
      </div>

      {showActions && (
        <div className="actions">
          <Button variant="primary" id="globalActionBtn" onClick={onGlobalAction}>
            <i className="fas fa-plus" /> New
          </Button>
          <div className="topbar-user-avatar" title={`${displayName} (${roleName})`}>
            <i className="fas fa-user" />
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              const wasSuperAdmin = isSuperAdmin;
              await logout();
              window.location.pathname = wasSuperAdmin ? '/super-admin/login' : '/admin/login';
            }}
            style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Sign out of ERP session"
          >
            <i className="fas fa-sign-out-alt" />
            <span>Sign Out</span>
          </Button>
        </div>
      )}
    </div>
  );
});
