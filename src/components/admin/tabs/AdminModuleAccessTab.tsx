import { useState } from 'react';
import { Button } from '../../common/Button';
import { PLATFORM_CORE_MODULES } from '../../../data/adminData';
import type { AdminStaffUser, RoleDefinition, PermissionLevel } from '../../../types/admin';

interface AdminModuleAccessTabProps {
  staffUsers: AdminStaffUser[];
  roles: RoleDefinition[];
  onUpdatePermissions: (userId: string, permissions: Record<string, PermissionLevel>) => void;
}

export function AdminModuleAccessTab({
  staffUsers,
  roles,
  onUpdatePermissions,
}: AdminModuleAccessTabProps) {
  // Default to John Miller (ADM-103) from prompt example
  const [selectedUserId, setSelectedUserId] = useState<string>(
    staffUsers.find((u) => u.username.includes('john'))?.id || staffUsers[0]?.id || 'ADM-101',
  );
  const selectedUser = staffUsers.find((u) => u.id === selectedUserId) || staffUsers[0];
  const selectedUserRole = roles.find((r) => r.name === selectedUser?.role) || roles[0];

  const [currentPermissions, setCurrentPermissions] = useState<Record<string, PermissionLevel>>(() => {
    return getEffectivePermissions(selectedUser, selectedUserRole);
  });
  const [isDirty, setIsDirty] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  function getEffectivePermissions(user: AdminStaffUser, role: RoleDefinition) {
    const result: Record<string, PermissionLevel> = {};
    PLATFORM_CORE_MODULES.forEach((mod) => {
      result[mod] = user?.customPermissions?.[mod] || role?.defaultPermissions[mod] || 'No Access';
    });
    return result;
  }

  function handleUserSelect(userId: string) {
    setSelectedUserId(userId);
    const user = staffUsers.find((u) => u.id === userId);
    if (user) {
      const role = roles.find((r) => r.name === user.role) || roles[0];
      setCurrentPermissions(getEffectivePermissions(user, role));
      setIsDirty(false);
    }
  }

  function handleLevelChange(mod: string, level: PermissionLevel) {
    setCurrentPermissions((prev) => {
      setIsDirty(true);
      return {
        ...prev,
        [mod]: level,
      };
    });
  }

  function handleSave() {
    if (selectedUser) {
      onUpdatePermissions(selectedUser.id, currentPermissions);
      setIsDirty(false);
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    }
  }

  function handleResetToRole() {
    if (selectedUserRole) {
      const resetPerms: Record<string, PermissionLevel> = {};
      PLATFORM_CORE_MODULES.forEach((mod) => {
        resetPerms[mod] = selectedUserRole.defaultPermissions[mod] || 'No Access';
      });
      setCurrentPermissions(resetPerms);
      setIsDirty(true);
    }
  }

  const levelStyles: Record<PermissionLevel, { bg: string; color: string; border: string; icon: string }> = {
    'No Access': { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1', icon: 'fa-times' },
    View: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd', icon: 'fa-eye' },
    'View & Edit': { bg: '#fef3c7', color: '#b45309', border: '#fde68a', icon: 'fa-edit' },
    'Full Access': { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', icon: 'fa-bolt' },
  };

  const allowedCount = Object.values(currentPermissions).filter((v) => v !== 'No Access').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner: User Selector & Summary Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 800,
          }}>
            {selectedUser.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                {selectedUser.name}
              </h3>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 600,
                fontSize: 12,
                padding: '2px 10px',
                borderRadius: 12,
              }}>
                Role: {selectedUser.role}
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
              @{selectedUser.username} • Department: <strong>{selectedUser.department}</strong> • {allowedCount} Modules Configured
            </div>
          </div>
        </div>

        {/* User Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
              Select Admin / Staff:
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserSelect(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 13,
                color: '#1e293b',
                fontWeight: 600,
                outline: 'none',
                minWidth: 220,
              }}
            >
              {staffUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
            <Button type="button" variant="secondary" onClick={handleResetToRole}>
              Reset to Role
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!isDirty}
              onClick={handleSave}
            >
              <i className="fas fa-save" style={{ marginRight: 6 }} />
              Apply Access
            </Button>
          </div>
        </div>
      </div>

      {savedAlert && (
        <div style={{
          padding: '12px 16px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          color: '#15803d',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <i className="fas fa-check-circle" style={{ fontSize: 16 }} />
          <span>Module permissions successfully saved for <strong>{selectedUser.name}</strong>.</span>
        </div>
      )}

      {/* Module Permission Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {PLATFORM_CORE_MODULES.map((mod) => {
          const currentLevel = currentPermissions[mod] || 'No Access';
          const style = levelStyles[currentLevel];
          const isInherited = !selectedUser.customPermissions?.[mod];

          return (
            <div
              key={mod}
              style={{
                background: '#ffffff',
                border: currentLevel === 'No Access' ? '1px solid #e2e8f0' : `1px solid ${style.border}`,
                borderRadius: 12,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: style.bg,
                      color: style.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}>
                      <i className={`fas ${style.icon}`} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{mod}</span>
                  </div>

                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: isInherited ? '#64748b' : '#0284c7',
                    background: isInherited ? '#f1f5f9' : '#e0f2fe',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {isInherited ? 'Role Default' : 'Custom'}
                  </span>
                </div>
              </div>

              {/* Permission Level Selector Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginTop: 12 }}>
                {(['No Access', 'View', 'View & Edit', 'Full Access'] as PermissionLevel[]).map((lvl) => {
                  const isSelected = currentLevel === lvl;
                  const pillStyle = levelStyles[lvl];

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelChange(mod, lvl)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: 6,
                        border: isSelected ? `1.5px solid ${pillStyle.color}` : '1px solid #e2e8f0',
                        background: isSelected ? pillStyle.bg : '#ffffff',
                        color: isSelected ? pillStyle.color : '#64748b',
                        fontSize: 11,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        transition: 'all 0.1s ease',
                      }}
                      title={lvl}
                    >
                      {lvl === 'View & Edit' ? 'V & E' : lvl === 'Full Access' ? 'Full' : lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
