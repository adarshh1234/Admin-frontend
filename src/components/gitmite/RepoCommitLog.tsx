import { useCallback, useEffect, useState } from 'react';
import { gitmiteService } from '../../services/gitmite.service';
import type { GitCommit } from '../../types/gitmite';
import { Loader } from '../common/Loader';
import { RepoCommitDiff } from './RepoCommitDiff';

interface RepoCommitLogProps {
  slug: string;
  selectedBranch: string;
}

export function RepoCommitLog({ slug, selectedBranch }: RepoCommitLogProps) {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(null);

  const loadCommits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gitmiteService.getCommits(slug, selectedBranch || undefined);
      setCommits(data);
    } catch {
      setError('Unable to load commits or repository has no commit history yet.');
      setCommits([]);
    } finally {
      setIsLoading(false);
    }
  }, [slug, selectedBranch]);

  useEffect(() => {
    setSelectedCommitHash(null);
    loadCommits();
  }, [loadCommits]);

  if (selectedCommitHash) {
    return (
      <RepoCommitDiff
        slug={slug}
        commitHash={selectedCommitHash}
        onBack={() => setSelectedCommitHash(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: 40, background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Loader label="Loading commit history..." />
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#f1f5f9',
            color: '#64748b',
            display: 'grid',
            placeItems: 'center',
            fontSize: 20,
            margin: '0 auto 12px',
          }}
        >
          <i className="fas fa-history" />
        </div>
        <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#0f172a' }}>
          {error || 'No commits found'}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
          Push commits from your terminal using <code>git push</code> to see your commit history here.
        </p>
      </div>
    );
  }

  return (
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
          padding: '12px 18px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: '#334155',
        }}
      >
        <span>
          <i className="fas fa-history" style={{ marginRight: 6, color: '#2563eb' }} />
          Commit History ({commits.length} commits)
        </span>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
          branch: <code>{selectedBranch || 'HEAD'}</code>
        </span>
      </div>

      <div>
        {commits.map((commit) => (
          <div
            key={commit.hash}
            onClick={() => setSelectedCommitHash(commit.hash)}
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1e293b',
                  marginBottom: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {commit.subject}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
                <span style={{ fontWeight: 500, color: '#475569' }}>{commit.authorName}</span>
                <span>·</span>
                <span>{new Date(commit.authoredAt).toLocaleDateString()} at {new Date(commit.authoredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#2563eb',
                  fontWeight: 600,
                }}
              >
                {commit.shortHash}
              </span>
              <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
