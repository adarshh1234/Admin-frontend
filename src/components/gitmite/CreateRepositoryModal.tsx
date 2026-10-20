import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { gitmiteService } from '../../services/gitmite.service';
import type { Repository, RepositoryVisibility } from '../../types/gitmite';
import { ApiError } from '../../services/taskmiteApiClient';

interface CreateRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepositoryCreated: (repo: Repository) => void;
}

export function CreateRepositoryModal({
  isOpen,
  onClose,
  onRepositoryCreated,
}: CreateRepositoryModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<RepositoryVisibility>('PRIVATE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!isSlugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    if (!trimmedName) {
      showToast('Repository name is required.', 'error');
      return;
    }

    if (!trimmedSlug) {
      showToast('Repository slug identifier is required.', 'error');
      return;
    }

    if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(trimmedSlug)) {
      showToast(
        'Slug must be 3-64 lowercase alphanumeric characters or hyphens, starting and ending with alphanumeric.',
        'error',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newRepo = await gitmiteService.createRepository({
        name: trimmedName,
        slug: trimmedSlug,
        description: description.trim() || undefined,
        visibility,
      });

      showToast(`Repository "${newRepo.name}" created successfully.`, 'success');
      setName('');
      setSlug('');
      setDescription('');
      setIsSlugTouched(false);
      setVisibility('PRIVATE');
      onRepositoryCreated(newRepo);
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to create repository.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          width: '100%',
          maxWidth: 540,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8faff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
              }}
            >
              <i className="fas fa-code-branch" />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
              Create New Repository
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 16,
              padding: 4,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Repository Name *
            </label>
            <input
              className="form-control"
              placeholder="e.g. Payments Microservice"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Slug Identifier *
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRight: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px 0 0 6px',
                  fontSize: 13,
                  color: '#64748b',
                }}
              >
                /git/
              </span>
              <input
                className="form-control"
                style={{ borderRadius: '0 6px 6px 0' }}
                placeholder="payments-microservice"
                value={slug}
                onChange={(e) => {
                  setIsSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </div>
            <span style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'block' }}>
              Used in the clone URL: <code>http://localhost:5000/git/{slug || 'slug'}.git</code>
            </span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Brief summary of repository purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#334155' }}>
              Visibility
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: 12,
                  border: `2px solid ${visibility === 'PRIVATE' ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: visibility === 'PRIVATE' ? '#f0f7ff' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'PRIVATE'}
                  onChange={() => setVisibility('PRIVATE')}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                    <i className="fas fa-lock" style={{ marginRight: 6, color: '#64748b' }} />
                    Private
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Only you and collaborators can view and clone.
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: 12,
                  border: `2px solid ${visibility === 'PUBLIC' ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: visibility === 'PUBLIC' ? '#f0f7ff' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                    <i className="fas fa-globe" style={{ marginRight: 6, color: '#2563eb' }} />
                    Public
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Anyone on the network can view and clone.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              <i className="fas fa-plus" style={{ marginRight: 6 }} />
              {isSubmitting ? 'Initializing...' : 'Create Repository'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
