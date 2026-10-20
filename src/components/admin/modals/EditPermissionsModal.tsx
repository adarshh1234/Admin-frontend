import { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { PLATFORM_CORE_MODULES } from '../../../data/adminData';
import type { AdminStaffUser, PermissionLevel, ActionPermissions, RoleDefinition } from '../../../types/admin';

interface EditPermissionsModalProps {
  isOpen: boolean;
  user: AdminStaffUser | null;
  roles: RoleDefinition[];
  onClose: () => void;
  onSubmit: (
    userId: string,
    permissions: Record<string, PermissionLevel>,
    actions: Record<string, ActionPermissions>,
  ) => void;
}

export function EditPermissionsModal({
  isOpen,
  user,
  roles,
  onClose,
  onSubmit,
}: EditPermissionsModalProps) {
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>({});
  const [actions, setActions] = useState<Record<string, ActionPermissions>>({});
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (user) {
      const userRoleDef = roles.find((r) => r.name === user.role);
      const initialPerms: Record<string, PermissionLevel> = {};
      const initialActions: Record<string, ActionPermissions> = {};

      PLATFORM_CORE_MODULES.forEach((mod) => {
        // user custom override or role default
        initialPerms[mod] =
          user.customPermissions?.[mod] ||
          userRoleDef?.defaultPermissions[mod] ||
          'No Access';

        initialActions[mod] =
          user.customActions?.[mod] ||
          userRoleDef?.matrix[mod] || {
            view: initialPerms[mod] !== 'No Access',
            edit: initialPerms[mod] === 'View & Edit' || initialPerms[mod] === 'Full Access',
            delete: initialPerms[mod] === 'Full Access',
            manage: initialPerms[mod] === 'Full Access',
          };
      });

      setPermissions(initialPerms);
      setActions(initialActions);
    }
  }, [user, roles]);

  if (!isOpen || !user) return null;

  function handleLevelChange(mod: string, level: PermissionLevel) {
    setPermissions((prev) => ({ ...prev, [mod]: level }));
    setActions((prev) => {
      if (level === 'Full Access') {
        return { ...prev, [mod]: { view: true, edit: true, delete: true, manage: true } };
      } else if (level === 'View & Edit') {
        return { ...prev, [mod]: { view: true, edit: true, delete: false, manage: false } };
      } else if (level === 'View') {
        return { ...prev, [mod]: { view: true, edit: false, delete: false, manage: false } };
      } else {
        return { ...prev, [mod]: { view: false, edit: false, delete: false, manage: false } };
      }
    });
  }

  function handleActionToggle(mod: string, actionKey: keyof ActionPermissions) {
    setActions((prev) => {
      const current = prev[mod] || { view: false, edit: false, delete: false, manage: false };
      const updated = { ...current, [actionKey]: !current[actionKey] };

      // If enabling edit/delete/manage, view must be true
      if (actionKey !== 'view' && updated[actionKey]) {
        updated.view = true;
      }
      // If disabling view, disable everything
      if (actionKey === 'view' && !updated.view) {
        updated.edit = false;
        updated.delete = false;
        updated.manage = false;
      }

      // Re-evaluate level
      let newLevel: PermissionLevel = 'No Access';
      if (updated.manage || (updated.view && updated.edit && updated.delete)) {
        newLevel = 'Full Access';
      } else if (updated.view && updated.edit) {
        newLevel = 'View & Edit';
      } else if (updated.view) {
        newLevel = 'View';
      }

      setPermissions((p) => ({ ...p, [mod]: newLevel }));
      return { ...prev, [mod]: updated };
    });
  }

  function handleResetToRoleDefault() {
    const userRoleDef = roles.find((r) => r.name === user?.role);
    if (!userRoleDef) return;

    const initialPerms: Record<string, PermissionLevel> = {};
    const initialActions: Record<string, ActionPermissions> = {};

    PLATFORM_CORE_MODULES.forEach((mod) => {
      initialPerms[mod] = userRoleDef.defaultPermissions[mod] || 'No Access';
      initialActions[mod] = userRoleDef.matrix[mod] || {
        view: initialPerms[mod] !== 'No Access',
        edit: initialPerms[mod] === 'View & Edit' || initialPerms[mod] === 'Full Access',
        delete: initialPerms[mod] === 'Full Access',
        manage: initialPerms[mod] === 'Full Access',
      };
    });

    setPermissions(initialPerms);
    setActions(initialActions);
  }

  function handleGrantAll(level: PermissionLevel) {
    PLATFORM_CORE_MODULES.forEach((mod) => {
      handleLevelChange(mod, level);
    });
  }

  const filteredModules = PLATFORM_CORE_MODULES.filter((m) =>
    m.toLowerCase().includes(searchFilter.toLowerCase()),
  );

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
        maxWidth: 820,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              <i className="fas fa-sliders-h" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                Module Permissions: {user.name}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                @{user.username} • Role: <strong>{user.role}</strong> ({user.department})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ position: 'relative', width: 240 }}>
            <input
              type="text"
              placeholder="Search modules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <i className="fas fa-search" style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8', fontSize: 13 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleGrantAll('View')}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              All View
            </button>
            <button
              type="button"
              onClick={() => handleGrantAll('Full Access')}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              All Full Access
            </button>
            <button
              type="button"
              onClick={handleResetToRoleDefault}
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                cursor: 'pointer',
                color: '#0284c7',
                fontWeight: 600,
              }}
            >
              Reset to Role Default
            </button>
          </div>
        </div>

        {/* Permissions List / Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Module</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, width: 220 }}>Access Level</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center', width: 70 }}>View</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center', width: 70 }}>Edit</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center', width: 70 }}>Delete</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'center', width: 70 }}>Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((mod) => {
                const currentLevel = permissions[mod] || 'No Access';
                const act = actions[mod] || { view: false, edit: false, delete: false, manage: false };

                const levelBadgeStyles: Record<PermissionLevel, { bg: string; color: string; border: string }> = {
                  'No Access': { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' },
                  View: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
                  'View & Edit': { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
                  'Full Access': { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
                };

                return (
                  <tr
                    key={mod}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: currentLevel === 'No Access' ? '#ffffff' : '#fafcff',
                    }}
                  >
                    <td style={{ padding: '12px 12px', fontWeight: 600, color: '#1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i
                          className={`fas ${
                            currentLevel === 'No Access'
                              ? 'fa-ban text-gray-400'
                              : currentLevel === 'Full Access'
                              ? 'fa-bolt text-emerald-500'
                              : 'fa-check-circle text-blue-500'
                          }`}
                          style={{
                            color:
                              currentLevel === 'No Access'
                                ? '#94a3b8'
                                : currentLevel === 'Full Access'
                                ? '#10b981'
                                : '#0284c7',
                            fontSize: 14,
                          }}
                        />
                        <span>{mod}</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <select
                        value={currentLevel}
                        onChange={(e) => handleLevelChange(mod, e.target.value as PermissionLevel)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: `1px solid ${levelBadgeStyles[currentLevel].border}`,
                          background: levelBadgeStyles[currentLevel].bg,
                          color: levelBadgeStyles[currentLevel].color,
                          fontWeight: 600,
                          fontSize: 12,
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="No Access">No Access</option>
                        <option value="View">View</option>
                        <option value="View & Edit">View & Edit</option>
                        <option value="Full Access">Full Access</option>
                      </select>
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.view}
                        onChange={() => handleActionToggle(mod, 'view')}
                        style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.edit}
                        onChange={() => handleActionToggle(mod, 'edit')}
                        style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.delete}
                        onChange={() => handleActionToggle(mod, 'delete')}
                        style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.manage}
                        onChange={() => handleActionToggle(mod, 'manage')}
                        style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Active module permissions:{' '}
            <strong style={{ color: '#0f172a' }}>
              {Object.values(permissions).filter((v) => v !== 'No Access').length} of {PLATFORM_CORE_MODULES.length}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onSubmit(user.id, permissions, actions);
                onClose();
              }}
            >
              <i className="fas fa-save" style={{ marginRight: 6 }} />
              Save Permissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
