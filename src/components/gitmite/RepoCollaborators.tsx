import { useCallback, useEffect, useState } from 'react';
import { gitmiteService } from '../../services/gitmite.service';
import type { RepositoryMember, RepositoryMemberRole } from '../../types/gitmite';
import { Loader } from '../common/Loader';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../services/taskmiteApiClient';

interface RepoCollaboratorsProps {
  slug: string;
}

export function RepoCollaborators({ slug }: RepoCollaboratorsProps) {
  const { showToast } = useToast();
  const [members, setMembers] = useState<RepositoryMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [roleInput, setRoleInput] = useState<RepositoryMemberRole>('WRITE');
  const [isAdding, setIsAdding] = useState(false);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await gitmiteService.getMembers(slug);
      setMembers(data);
    } catch {
      showToast('Failed to load repository members.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [slug, showToast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameInput.trim()) {
      showToast('Please enter a username to add as collaborator.', 'error');
      return;
    }

    setIsAdding(true);
    try {
      await gitmiteService.addMember(slug, {
        username: usernameInput.trim(),
        role: roleInput,
      });
      showToast(`User "${usernameInput.trim()}" added with ${roleInput} role.`, 'success');
      setUsernameInput('');
      setRoleInput('WRITE');
      await loadMembers();
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to add member.';
      showToast(msg, 'error');
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRoleChange(userId: number, newRole: RepositoryMemberRole) {
    try {
      await gitmiteService.updateMember(slug, userId, { role: newRole });
      showToast('Collaborator role updated.', 'success');
      await loadMembers();
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to update member role.';
      showToast(msg, 'error');
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!confirm('Are you sure you want to remove this collaborator?')) return;

    try {
      await gitmiteService.removeMember(slug, userId);
      showToast('Collaborator removed.', 'info');
      await loadMembers();
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to remove member.';
      showToast(msg, 'error');
    }
  }

  function getRoleBadge(role: RepositoryMemberRole) {
    switch (role) {
      case 'ADMIN':
        return <span className="tag-purple" style={{ fontSize: 11, background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>ADMIN</span>;
      case 'WRITE':
        return <span className="tag-green" style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>WRITE</span>;
      case 'READ':
      default:
        return <span className="tag-blue" style={{ fontSize: 11, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>READ</span>;
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
      {/* Member List */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: 600,
            color: '#334155',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fas fa-users" style={{ color: '#2563eb' }} />
          Collaborators ({members.length})
        </div>

        {isLoading ? (
          <div style={{ padding: 30 }}>
            <Loader label="Loading members..." />
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            No additional collaborators added yet. The repository owner always has full access.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafbfc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>User ID</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '10px 16px', fontWeight: 600 }}>Added</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.userId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>
                    <i className="fas fa-user-circle" style={{ marginRight: 8, color: '#94a3b8' }} />
                    User #{member.userId}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {getRoleBadge(member.role)}
                      <select
                        style={{
                          fontSize: 12,
                          padding: '3px 8px',
                          borderRadius: 4,
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                        }}
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value as RepositoryMemberRole)}
                      >
                        <option value="READ">READ</option>
                        <option value="WRITE">WRITE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.userId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontSize: 13,
                      }}
                      title="Remove Collaborator"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Collaborator Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: 18,
        }}
      >
        <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
          Add Collaborator
        </h4>
        <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>
          Grant another user read, write, or admin permissions for this repository.
        </p>

        <form onSubmit={handleAddMember}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: '#334155' }}>
              Username *
            </label>
            <input
              className="form-control"
              placeholder="e.g. alice"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4, color: '#334155' }}>
              Permission Role
            </label>
            <select
              className="form-control"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as RepositoryMemberRole)}
            >
              <option value="READ">READ (Pull & browse only)</option>
              <option value="WRITE">WRITE (Push & Pull commits)</option>
              <option value="ADMIN">ADMIN (Full management)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isAdding}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <i className="fas fa-user-plus" style={{ marginRight: 6 }} />
            {isAdding ? 'Adding...' : 'Add Collaborator'}
          </button>
        </form>
      </div>
    </div>
  );
}
