import { useState } from 'react';
import type { Repository } from '../../types/gitmite';
import { Loader } from '../common/Loader';

interface RepositoryListProps {
  repositories: Repository[];
  isLoading: boolean;
  onSelectRepository: (repo: Repository) => void;
  onOpenCreateModal: () => void;
  onOpenTokenModal: () => void;
}

export function RepositoryList({
  repositories,
  isLoading,
  onSelectRepository,
  onOpenCreateModal,
  onOpenTokenModal,
}: RepositoryListProps) {
  const [search, setSearch] = useState('');

  const filtered = repositories.filter((repo) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      repo.name.toLowerCase().includes(q) ||
      repo.slug.toLowerCase().includes(q) ||
      (repo.description && repo.description.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Action Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 400 }}>
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: 13,
            }}
          />
          <input
            className="form-control"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn-outline"
            onClick={onOpenTokenModal}
          >
            <i className="fas fa-key" style={{ marginRight: 6, color: '#d97706' }} />
            Git Tokens
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenCreateModal}
          >
            <i className="fas fa-plus" style={{ marginRight: 6 }} />
            New Repository
          </button>
        </div>
      </div>

      {/* Repositories View */}
      {isLoading ? (
        <div style={{ padding: 40, background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Loader label="Loading repositories..." />
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'grid',
              placeItems: 'center',
              fontSize: 24,
              margin: '0 auto 16px',
            }}
          >
            <i className="fas fa-code-branch" />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#0f172a' }}>
            {search ? 'No matching repositories found' : 'No repositories yet'}
          </h3>
          <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: 13, maxWidth: 450, marginLeft: 'auto', marginRight: 'auto' }}>
            {search
              ? `No repositories matched "${search}". Try searching for a different keyword or slug.`
              : 'Create your first Git repository to start tracking commits, managing branches, and hosting code on Gitmite.'}
          </p>
          {!search && (
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenCreateModal}
            >
              <i className="fas fa-plus" style={{ marginRight: 6 }} />
              Create Repository
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((repo) => (
            <div
              key={repo.id}
              onClick={() => onSelectRepository(repo)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-book-bookmark" style={{ color: '#2563eb', fontSize: 14 }} />
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
                      {repo.name}
                    </span>
                  </div>
                  <span
                    className={repo.visibility === 'PUBLIC' ? 'tag-green' : 'tag-blue'}
                    style={{
                      fontSize: 10.5,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: repo.visibility === 'PUBLIC' ? '#dcfce7' : '#dbeafe',
                      color: repo.visibility === 'PUBLIC' ? '#15803d' : '#1d4ed8',
                      fontWeight: 600,
                    }}
                  >
                    {repo.visibility}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: '#2563eb', fontFamily: 'monospace', marginBottom: 8 }}>
                  /{repo.slug}
                </div>

                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.5,
                    minHeight: 38,
                  }}
                >
                  {repo.description || (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      No description provided.
                    </span>
                  )}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#94a3b8',
                }}
              >
                <span>Created {new Date(repo.createdAt).toLocaleDateString()}</span>
                <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Browse <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
