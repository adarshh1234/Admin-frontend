import { useState } from 'react';
import { gitmiteService } from '../../services/gitmite.service';
import type { Repository, RepositoryVisibility } from '../../types/gitmite';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../services/taskmiteApiClient';

interface RepoSettingsProps {
  repository: Repository;
  onRepositoryUpdated: (updated: Repository) => void;
}

export function RepoSettings({ repository, onRepositoryUpdated }: RepoSettingsProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(repository.name);
  const [description, setDescription] = useState(repository.description || '');
  const [visibility, setVisibility] = useState<RepositoryVisibility>(repository.visibility);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await gitmiteService.updateRepository(repository.slug, {
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
      });
      showToast('Repository settings updated successfully.', 'success');
      onRepositoryUpdated(updated);
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to update repository settings.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: 24,
        }}
      >
        <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
          Repository Settings
        </h4>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Display Name
            </label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Slug (Identifier)
            </label>
            <input
              className="form-control"
              value={repository.slug}
              disabled
              style={{ background: '#f1f5f9', color: '#64748b' }}
            />
            <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'block' }}>
              The repository slug cannot be changed once created.
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Description
            </label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Visibility
            </label>
            <select
              className="form-control"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as RepositoryVisibility)}
            >
              <option value="PRIVATE">Private (Only owner and designated members)</option>
              <option value="PUBLIC">Public (Accessible to all authenticated users)</option>
            </select>
          </div>

          <div
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              marginBottom: 20,
              fontSize: 12.5,
              color: '#64748b',
              lineHeight: 1.6,
            }}
          >
            <div><strong>Created at:</strong> {new Date(repository.createdAt).toLocaleString()}</div>
            {repository.localPath && <div><strong>Storage path:</strong> <code>{repository.localPath}</code></div>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
          >
            <i className="fas fa-save" style={{ marginRight: 6 }} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
