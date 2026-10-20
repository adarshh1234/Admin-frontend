import { forwardRef, useState } from 'react';
import type { ModuleItem } from '../../types/module';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeModuleId: number;
  specialModules: ModuleItem[];
  filteredModules: ModuleItem[];
  searchQuery: string;
  isOpen: boolean;
  isCollapsed: boolean;
  isHoverExpanded: boolean;
  onSearchChange: (query: string) => void;
  onSelectModule: (id: number) => void;
  onToggleCollapse: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    activeModuleId,
    specialModules,
    filteredModules,
    searchQuery,
    isOpen,
    isCollapsed,
    isHoverExpanded,
    onSearchChange,
    onSelectModule,
    onToggleCollapse,
    onMouseEnter,
    onMouseLeave,
  },
  ref,
) {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [cmsExpanded, setCmsExpanded] = useState<boolean>(true);
  const collapsed = isCollapsed && !isHoverExpanded;

  return (
    <div className={`sidebar-wrapper${isOpen ? ' open' : ''}${isCollapsed ? ' collapsed' : ''}`}>
      <aside
        className={`sidebar${isOpen ? ' open' : ''}${isCollapsed ? ' collapsed' : ''}${isHoverExpanded ? ' hover-expanded' : ''}`}
        id="sidebar"
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          onMouseLeave();
          setUserMenuOpen(false);
        }}
      >
        <div className="logo">
          <span className="logo-text">E.</span>
          <small>ERP</small>
          <Button
            className="collapse-toggle"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className="fas fa-bars" />
          </Button>
        </div>

        <div className="sidebar-divider" />

        <div className="search-box">
          <Input
            type="text"
            id="sidebarSearch"
            placeholder={collapsed ? '' : 'Filter modules...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            title={collapsed ? 'Search modules' : undefined}
          />
          <i className="fas fa-search" />
        </div>

        <div className="sidebar-divider" />

        <nav className="menu-list" id="menuList">
          {/* Special Pages */}
          {specialModules.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`menu-item${item.id === activeModuleId ? ' active' : ''}`}
              title={collapsed ? item.name : undefined}
              onClick={(e) => {
                e.preventDefault();
                onSelectModule(item.id);
              }}
            >
              <i className={`fas ${item.icon || 'fa-circle'}`} />
              <span className="menu-label">{item.name}</span>
            </a>
          ))}

          {/* Filtered Non-special Modules */}
          {filteredModules.length === 0 ? (
            !collapsed && (
              <div style={{ padding: '12px 14px', fontSize: 13, color: '#8e9bb5' }}>No modules found</div>
            )
          ) : (
            filteredModules.map((item) => {
              if ([55, 56, 57, 58].includes(item.id)) return null;

              if (item.id === 7) {
                const isCmsParentActive = activeModuleId === 7 || activeModuleId === 55;
                const isSubmenuVisible = !collapsed && (cmsExpanded || isCmsParentActive);
                return (
                  <div key={item.id} className="menu-group-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                    <a
                      href="#"
                      className={`menu-item${isCmsParentActive ? ' active' : ''}`}
                      title={collapsed ? item.name : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setCmsExpanded((prev) => !prev);
                        onSelectModule(7);
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <i className={`fas ${item.icon || 'fa-layer-group'}`} />
                        <span className="menu-label">{item.name}</span>
                      </div>
                      {!collapsed && (
                        <i
                          className={`fas fa-chevron-${isSubmenuVisible ? 'down' : 'right'}`}
                          style={{
                            fontSize: 10,
                            color: isCmsParentActive ? '#2563eb' : '#94a3b8',
                            width: 'auto',
                            marginRight: 2,
                            transition: 'transform 0.15s ease'
                          }}
                        />
                      )}
                    </a>

                    {/* CMS Submenu: Explore Opportunities */}
                    {isSubmenuVisible && (
                      <div
                        className="sidebar-submenu"
                        style={{
                          paddingLeft: 10,
                          marginTop: 3,
                          marginBottom: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          borderLeft: '2px solid #cbd5e1',
                          marginLeft: 24,
                          position: 'relative'
                        }}
                      >
                        <a
                          href="#"
                          className={`menu-item submenu-item${activeModuleId === 55 ? ' active' : ''}`}
                          title="Explore Opportunities"
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectModule(55);
                          }}
                          style={{
                            fontSize: 12.5,
                            padding: '7px 10px',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            position: 'relative'
                          }}
                        >
                          <i
                            className="fas fa-compass"
                            style={{
                              fontSize: 13,
                              width: 16,
                              color: activeModuleId === 55 ? '#2563eb' : '#7a8aa0'
                            }}
                          />
                          <span className="menu-label">Explore Opportunities</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              }

              const isExternal = item.id === 11;
              const externalHref = isExternal ? (import.meta.env.VITE_HUREMASO_URL || 'http://localhost:5173') : '#';

              return (
                <a
                  key={item.id}
                  href={externalHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`menu-item${item.id === activeModuleId ? ' active' : ''}`}
                  title={collapsed ? (isExternal ? `${item.name} (Opens in new tab)` : item.name) : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectModule(item.id);
                  }}
                >
                  <i className={`fas ${item.icon || 'fa-circle'}`} />
                  <span className="menu-label" style={isExternal ? { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' } : undefined}>
                    <span>{item.name}</span>
                    {isExternal && !collapsed && (
                      <i className="fas fa-external-link-alt" style={{ fontSize: '10px', opacity: 0.65, marginLeft: '6px' }} />
                    )}
                  </span>
                </a>
              );
            })
          )}
        </nav>

        {(() => {
          const { user, logout, isSuperAdmin } = useAuth();
          const displayName = user?.displayName || user?.username || 'Executive User';
          const displayRole = user?.role || 'ERP User';
          const displayEmail = user?.email || 'user@curemaso.com';
          const initial = (displayName[0] || 'U').toUpperCase();

          return (
            <div className="user-card">
              <div className="avatar">{initial}</div>
              {!collapsed && (
                <>
                  <div className="info">
                    <div className="name" title={displayName}>
                      {displayName}
                    </div>
                    <div className="role">{displayRole}</div>
                  </div>
                  <Button
                    type="button"
                    className="user-card-menu-btn"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    title="Account options"
                  >
                    <i className="fas fa-ellipsis-v" />
                  </Button>

                  {userMenuOpen && (
                    <div className="user-card-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">{displayName}</div>
                        <div className="user-dropdown-email">{displayEmail}</div>
                        <div style={{ fontSize: '11px', color: '#0265c2', fontWeight: 600, marginTop: '2px' }}>
                          Role: {displayRole}
                        </div>
                      </div>
                      <div className="user-dropdown-divider" />
                      <Button
                        type="button"
                        className="user-dropdown-item signout-btn"
                        onClick={async () => {
                          setUserMenuOpen(false);
                          if (window.confirm('Are you sure you want to sign out?')) {
                            const wasSuperAdmin = isSuperAdmin;
                            await logout();
                            window.location.pathname = wasSuperAdmin ? '/super-admin/login' : '/admin/login';
                          }
                        }}
                      >
                        <i className="fas fa-sign-out-alt" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}
      </aside>
    </div>
  );
});

