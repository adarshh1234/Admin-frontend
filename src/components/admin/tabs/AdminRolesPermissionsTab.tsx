import { useState } from 'react';
import { Button } from '../../common/Button';
import { PLATFORM_CORE_MODULES } from '../../../data/adminData';
import type { RoleDefinition, ActionPermissions } from '../../../types/admin';

interface AdminRolesPermissionsTabProps {
  roles: RoleDefinition[];
  onOpenCreateRole: () => void;
  onUpdateRoleMatrix: (roleId: string, matrix: Record<string, ActionPermissions>) => void;
  onDeleteRole: (roleId: string) => void;
}

export function AdminRolesPermissionsTab({
  roles,
  onOpenCreateRole,
  onUpdateRoleMatrix,
  onDeleteRole,
}: AdminRolesPermissionsTabProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'ROLE-001');
  const [matrixState, setMatrixState] = useState<Record<string, ActionPermissions>>(() => {
    const active = roles.find((r) => r.id === selectedRoleId) || roles[0];
    return JSON.parse(JSON.stringify(active?.matrix || {}));
  });
  const [isDirty, setIsDirty] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [searchModule, setSearchModule] = useState('');

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  function handleSelectRole(roleId: string) {
    setSelectedRoleId(roleId);
    const target = roles.find((r) => r.id === roleId);
    if (target) {
      setMatrixState(JSON.parse(JSON.stringify(target.matrix)));
      setIsDirty(false);
    }
  }

  function handleTogglePermission(moduleName: string, actionKey: keyof ActionPermissions) {
    setMatrixState((prev) => {
      const current = prev[moduleName] || { view: false, edit: false, delete: false, manage: false };
      const updated = { ...current, [actionKey]: !current[actionKey] };

      // Logical cascading
      if (actionKey !== 'view' && updated[actionKey]) {
        updated.view = true;
      }
      if (actionKey === 'view' && !updated.view) {
        updated.edit = false;
        updated.delete = false;
        updated.manage = false;
      }

      setIsDirty(true);
      return {
        ...prev,
        [moduleName]: updated,
      };
    });
  }

  function handleSetAllForModule(moduleName: string, enableAll: boolean) {
    setMatrixState((prev) => {
      setIsDirty(true);
      return {
        ...prev,
        [moduleName]: {
          view: enableAll,
          edit: enableAll,
          delete: enableAll,
          manage: enableAll,
        },
      };
    });
  }

  function handleGrantAllView() {
    setMatrixState((prev) => {
      const updated: Record<string, ActionPermissions> = {};
      PLATFORM_CORE_MODULES.forEach((mod) => {
        updated[mod] = {
          view: true,
          edit: prev[mod]?.edit || false,
          delete: prev[mod]?.delete || false,
          manage: prev[mod]?.manage || false,
        };
      });
      setIsDirty(true);
      return updated;
    });
  }

  function handleGrantAllFull() {
    setMatrixState(() => {
      const updated: Record<string, ActionPermissions> = {};
      PLATFORM_CORE_MODULES.forEach((mod) => {
        updated[mod] = { view: true, edit: true, delete: true, manage: true };
      });
      setIsDirty(true);
      return updated;
    });
  }

  function handleResetMatrix() {
    if (currentRole) {
      setMatrixState(JSON.parse(JSON.stringify(currentRole.matrix)));
      setIsDirty(false);
    }
  }

  function handleSaveMatrix() {
    onUpdateRoleMatrix(selectedRoleId, matrixState);
    setIsDirty(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  const filteredModules = PLATFORM_CORE_MODULES.filter((m) =>
    m.toLowerCase().includes(searchModule.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Section: Role Cards Carousel / Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Platform Roles ({roles.length})
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              Select a role template to configure its access matrix across all modules
            </p>
          </div>
          <Button type="button" variant="primary" onClick={onOpenCreateRole}>
            <i className="fas fa-plus" style={{ marginRight: 6 }} />
            Create Role
          </Button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {roles.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                style={{
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: role.badgeColor,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{role.name}</span>
                  </div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: role.isSystem ? '#f1f5f9' : '#e0e7ff',
                    color: role.isSystem ? '#64748b' : '#4338ca',
                    textTransform: 'uppercase',
                  }}>
                    {role.isSystem ? 'System' : 'Custom'}
                  </span>
                </div>

                <p style={{
                  margin: '0 0 10px',
                  fontSize: 12,
                  color: '#64748b',
                  lineHeight: 1.4,
                  height: 34,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {role.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                  <span>{role.userCount} assigned staff</span>
                  {!role.isSystem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRole(role.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '2px 4px',
                      }}
                      title="Delete Custom Role"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Matrix Section */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: 24,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        {/* Matrix Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 20,
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                Access Matrix: {currentRole.name}
              </h3>
              {isDirty && (
                <span style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  Unsaved Changes
                </span>
              )}
              {savedNotice && (
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  Saved Successfully!
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Configure granular module capabilities (View, Edit, Delete, Manage) for this role
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleGrantAllView}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              Grant All View
            </button>
            <button
              type="button"
              onClick={handleGrantAllFull}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              Grant Full Access
            </button>
            {isDirty && (
              <Button type="button" variant="secondary" onClick={handleResetMatrix}>
                Discard
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              disabled={!isDirty}
              onClick={handleSaveMatrix}
            >
              <i className="fas fa-save" style={{ marginRight: 6 }} />
              Save Matrix Changes
            </Button>
          </div>
        </div>

        {/* Matrix Filter Bar */}
        <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <input
              type="text"
              placeholder="Search matrix modules..."
              value={searchModule}
              onChange={(e) => setSearchModule(e.target.value)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-check text-emerald-500" style={{ color: '#10b981' }} /> Allowed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-minus text-gray-400" style={{ color: '#94a3b8' }} /> Restrict
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Module</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center', width: 100 }}>View</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center', width: 100 }}>Edit</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center', width: 100 }}>Delete</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center', width: 100 }}>Manage</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right', width: 120 }}>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((mod) => {
                const act = matrixState[mod] || { view: false, edit: false, delete: false, manage: false };
                const isAll = act.view && act.edit && act.delete && act.manage;
                const isNone = !act.view && !act.edit && !act.delete && !act.manage;

                return (
                  <tr
                    key={mod}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isNone ? '#fafafa' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className={`fas ${act.view ? 'fa-folder-open' : 'fa-folder'} text-slate-400`} style={{ color: act.view ? '#0284c7' : '#94a3b8' }} />
                        <span>{mod}</span>
                      </div>
                    </td>

                    {/* View */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.view}
                        onChange={() => handleTogglePermission(mod, 'view')}
                        style={{ width: 18, height: 18, accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                    </td>

                    {/* Edit */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.edit}
                        onChange={() => handleTogglePermission(mod, 'edit')}
                        style={{ width: 18, height: 18, accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                    </td>

                    {/* Delete */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.delete}
                        onChange={() => handleTogglePermission(mod, 'delete')}
                        style={{ width: 18, height: 18, accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                    </td>

                    {/* Manage */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={act.manage}
                        onChange={() => handleTogglePermission(mod, 'manage')}
                        style={{ width: 18, height: 18, accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                    </td>

                    {/* Quick Row Action */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleSetAllForModule(mod, !isAll)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isAll ? '#dc2626' : '#0284c7',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isAll ? 'Clear All' : 'Select All'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
