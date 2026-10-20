import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { gitmiteService } from '../../services/gitmite.service';
import type { Repository } from '../../types/gitmite';
import { CreateRepositoryModal } from './CreateRepositoryModal';
import { GitTokenModal } from './GitTokenModal';
import { RepositoryList } from './RepositoryList';
import { RepositoryWorkspace } from './RepositoryWorkspace';

export function GitmitePage() {
  const { showToast } = useToast();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const loadRepositories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await gitmiteService.getRepositories();
      setRepositories(data);
    } catch {
      showToast('Failed to load repositories.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  function handleRepositoryCreated(newRepo: Repository) {
    setRepositories((prev) => [newRepo, ...prev]);
    setSelectedRepo(newRepo);
  }

  function handleRepositoryUpdated(updated: Repository) {
    setRepositories((prev) =>
      prev.map((r) => (r.slug === updated.slug ? updated : r)),
    );
    if (selectedRepo && selectedRepo.slug === updated.slug) {
      setSelectedRepo(updated);
    }
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 48 }}>
      {selectedRepo ? (
        <RepositoryWorkspace
          repository={selectedRepo}
          onBackToList={() => setSelectedRepo(null)}
          onRepositoryUpdated={handleRepositoryUpdated}
        />
      ) : (
        <div>
          {/* Header Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 20,
                }}
              >
                <i className="fas fa-code-fork" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                  Gitmite
                </h1>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                  Git repository hosting, branch browsing, commit history & access controls.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsTokenModalOpen(true)}
              >
                <i className="fas fa-key" style={{ marginRight: 6, color: '#d97706' }} />
                Git Tokens
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} />
                New Repository
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Repos</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                  {repositories.length}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-book-bookmark" />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Public Repos</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#16a34a' }}>
                  {repositories.filter((r) => r.visibility === 'PUBLIC').length}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f0fdf4',
                  color: '#16a34a',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-globe" />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Private Repos</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#2563eb' }}>
                  {repositories.filter((r) => r.visibility === 'PRIVATE').length}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-lock" />
              </div>
            </div>
          </div>

          <RepositoryList
            repositories={repositories}
            isLoading={isLoading}
            onSelectRepository={setSelectedRepo}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
          />
        </div>
      )}

      <CreateRepositoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRepositoryCreated={handleRepositoryCreated}
      />

      <GitTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
    </div>
  );
}
