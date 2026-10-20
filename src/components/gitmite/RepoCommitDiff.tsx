import { useEffect, useState } from 'react';
import { gitmiteService } from '../../services/gitmite.service';
import type { GitCommitDetails, GitDiffResponse } from '../../types/gitmite';
import { Loader } from '../common/Loader';
import { useToast } from '../../context/ToastContext';

interface RepoCommitDiffProps {
  slug: string;
  commitHash: string;
  onBack: () => void;
}

export function RepoCommitDiff({
  slug,
  commitHash,
  onBack,
}: RepoCommitDiffProps) {
  const { showToast } = useToast();
  const [details, setDetails] = useState<GitCommitDetails | null>(null);
  const [diffData, setDiffData] = useState<GitDiffResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommitAndDiff() {
      setIsLoading(true);
      try {
        const [commitDetails, commitDiff] = await Promise.all([
          gitmiteService.getCommit(slug, commitHash),
          gitmiteService.getCommitDiff(slug, commitHash),
        ]);
        setDetails(commitDetails);
        setDiffData(commitDiff);
      } catch {
        showToast('Failed to load commit details or diff.', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommitAndDiff();
  }, [slug, commitHash, showToast]);

  if (isLoading) {
    return (
      <div style={{ padding: 40, background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Loader label="Loading commit details and diff..." />
      </div>
    );
  }

  if (!details || !diffData) {
    return (
      <div style={{ padding: 24, background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <button type="button" className="btn-outline" onClick={onBack} style={{ marginBottom: 12 }}>
          <i className="fas fa-arrow-left" /> Back to commits
        </button>
        <p style={{ color: '#ef4444' }}>Unable to find or load this commit.</p>
      </div>
    );
  }

  const diffLines = diffData.diff ? diffData.diff.split('\n') : [];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="btn-outline"
          onClick={onBack}
          style={{ padding: '6px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <i className="fas fa-arrow-left" /> Back to Commits
        </button>
      </div>

      {/* Commit Meta Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px 8px 0 0',
          border: '1px solid #e2e8f0',
          padding: 20,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>
              {details.subject}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#64748b', flexWrap: 'wrap' }}>
              <span>
                <i className="fas fa-user-circle" style={{ marginRight: 6, color: '#2563eb' }} />
                <strong>{details.authorName}</strong> ({details.authorEmail})
              </span>
              <span>·</span>
              <span>
                Authored {new Date(details.authoredAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: '#f1f5f9',
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#334155',
              border: '1px solid #cbd5e1',
              whiteSpace: 'nowrap',
            }}
          >
            commit {details.shortHash}
          </div>
        </div>

        {details.parentHashes && details.parentHashes.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
            <span>Parents: </span>
            {details.parentHashes.map((parent) => (
              <span
                key={parent}
                style={{
                  fontFamily: 'monospace',
                  background: '#f8fafc',
                  padding: '2px 6px',
                  borderRadius: 4,
                  marginRight: 6,
                }}
              >
                {parent.slice(0, 7)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Diff Box */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          background: '#0f172a',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            fontSize: 12,
            color: '#94a3b8',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Unified Diff ({diffLines.length} lines)</span>
        </div>

        {diffLines.length === 0 ? (
          <div style={{ padding: 24, color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
            Empty diff or initial commit with no changes against parent.
          </div>
        ) : (
          <pre
            style={{
              margin: 0,
              padding: '12px 0',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: 12.5,
              lineHeight: 1.5,
              color: '#e2e8f0',
              overflowX: 'auto',
              maxHeight: 700,
            }}
          >
            <code>
              {diffLines.map((line, idx) => {
                let bg = 'transparent';
                let color = '#e2e8f0';

                if (line.startsWith('+++') || line.startsWith('---')) {
                  color = '#94a3b8';
                  bg = 'rgba(148, 163, 184, 0.1)';
                } else if (line.startsWith('+')) {
                  bg = 'rgba(34, 197, 94, 0.15)';
                  color = '#4ade80';
                } else if (line.startsWith('-')) {
                  bg = 'rgba(239, 68, 68, 0.15)';
                  color = '#f87171';
                } else if (line.startsWith('@@')) {
                  bg = 'rgba(59, 130, 246, 0.15)';
                  color = '#60a5fa';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: bg,
                      color,
                      padding: '1px 16px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {line || ' '}
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
