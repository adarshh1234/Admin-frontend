import { useCallback, useEffect, useState } from 'react';
import { gitmiteService } from '../../services/gitmite.service';
import type { GitTreeEntry } from '../../types/gitmite';
import { Loader } from '../common/Loader';
import { useToast } from '../../context/ToastContext';

interface RepoFileBrowserProps {
  slug: string;
  selectedBranch: string;
  onNavigateToCommits: () => void;
}

export function RepoFileBrowser({
  slug,
  selectedBranch,
}: RepoFileBrowserProps) {
  const { showToast } = useToast();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [entries, setEntries] = useState<GitTreeEntry[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Blob viewer state
  const [activeBlobPath, setActiveBlobPath] = useState<string | null>(null);
  const [blobContent, setBlobContent] = useState<string | null>(null);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadTree = useCallback(async (path: string) => {
    setIsLoadingTree(true);
    setError(null);
    try {
      const data = await gitmiteService.getTree(slug, selectedBranch || undefined, path || undefined);
      const sorted = [...data].sort((a, b) => {
        if (a.type === 'tree' && b.type !== 'tree') return -1;
        if (a.type !== 'tree' && b.type === 'tree') return 1;
        return a.name.localeCompare(b.name);
      });
      setEntries(sorted);
    } catch {
      setError('Unable to load directory tree or repository is currently empty.');
      setEntries([]);
    } finally {
      setIsLoadingTree(false);
    }
  }, [slug, selectedBranch]);

  useEffect(() => {
    setActiveBlobPath(null);
    setBlobContent(null);
    loadTree(currentPath);
  }, [loadTree, currentPath]);

  async function handleEntryClick(entry: GitTreeEntry) {
    const fullPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

    if (entry.type === 'tree') {
      setCurrentPath(fullPath);
    } else {
      // It's a blob
      setActiveBlobPath(fullPath);
      setIsLoadingBlob(true);
      try {
        const res = await gitmiteService.getBlob(slug, fullPath, selectedBranch || undefined);
        setBlobContent(res.content);
      } catch {
        showToast(`Failed to load file "${entry.name}".`, 'error');
        setActiveBlobPath(null);
      } finally {
        setIsLoadingBlob(false);
      }
    }
  }

  function handleBreadcrumbClick(targetPath: string) {
    setActiveBlobPath(null);
    setBlobContent(null);
    setCurrentPath(targetPath);
  }

  function handleCopyBlob() {
    if (blobContent === null) return;
    navigator.clipboard.writeText(blobContent);
    setCopied(true);
    showToast('File content copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2000);
  }

  const pathParts = currentPath.split('/').filter(Boolean);
  const cloneUrl = `http://localhost:5000/git/${slug}.git`;

  return (
    <div>
      {/* Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 14px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px 8px 0 0',
          fontSize: 13,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => handleBreadcrumbClick('')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="fas fa-home" /> {slug}
        </button>

        {pathParts.map((part, index) => {
          const subPath = pathParts.slice(0, index + 1).join('/');
          const isLast = index === pathParts.length - 1 && !activeBlobPath;
          return (
            <span key={subPath} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#94a3b8' }}>/</span>
              {isLast ? (
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{part}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(subPath)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {part}
                </button>
              )}
            </span>
          );
        })}

        {activeBlobPath && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {activeBlobPath.split('/').pop()}
            </span>
          </span>
        )}
      </div>

      {/* Content Area */}
      {isLoadingTree || isLoadingBlob ? (
        <div style={{ padding: 40, border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff' }}>
          <Loader label="Loading repository files..." />
        </div>
      ) : activeBlobPath && blobContent !== null ? (
        /* File Blob Viewer */
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              fontSize: 12,
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-file-code" style={{ color: '#64748b' }} />
              <span>
                {blobContent.split('\n').length} lines · {new Blob([blobContent]).size} bytes
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={handleCopyBlob}
              >
                <i className={copied ? 'fas fa-check' : 'fas fa-copy'} /> {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => {
                  setActiveBlobPath(null);
                  setBlobContent(null);
                }}
              >
                <i className="fas fa-arrow-left" /> Close
              </button>
            </div>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '16px',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: 13,
              lineHeight: 1.5,
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              overflowX: 'auto',
              maxHeight: 600,
            }}
          >
            <code>
              {blobContent.split('\n').map((line, idx) => (
                <div key={idx} style={{ display: 'flex' }}>
                  <span
                    style={{
                      width: 44,
                      userSelect: 'none',
                      color: '#475569',
                      textAlign: 'right',
                      paddingRight: 16,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ flex: 1 }}>{line || ' '}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      ) : entries.length === 0 ? (
        /* Empty State */
        <div
          style={{
            padding: '36px 24px',
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            background: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'grid',
              placeItems: 'center',
              fontSize: 22,
              margin: '0 auto 16px',
            }}
          >
            <i className="fas fa-folder-open" />
          </div>

          <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#0f172a' }}>
            {error || 'This repository is empty'}
          </h4>
          <p style={{ margin: '0 auto 24px', maxWidth: 500, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            No commits or branches have been pushed to this repository yet. Get started by pushing an existing repository or creating a new commit.
          </p>

          <div
            style={{
              textAlign: 'left',
              maxWidth: 600,
              margin: '0 auto',
              background: '#0f172a',
              color: '#f8fafc',
              padding: '16px 20px',
              borderRadius: 8,
              fontFamily: 'Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.7,
            }}
          >
            <div style={{ color: '#94a3b8', marginBottom: 4 }}># Push an existing repository from your computer</div>
            <div>git remote add origin {cloneUrl}</div>
            <div>git branch -M main</div>
            <div>git push -u origin main</div>
          </div>
        </div>
      ) : (
        /* Directory Tree Table */
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {currentPath && (
                <tr
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: '#fafbfc' }}
                  onClick={() => {
                    const parent = pathParts.slice(0, -1).join('/');
                    handleBreadcrumbClick(parent);
                  }}
                >
                  <td style={{ padding: '10px 16px', width: 36, color: '#64748b' }}>
                    <i className="fas fa-level-up-alt" />
                  </td>
                  <td colSpan={2} style={{ padding: '10px 16px', color: '#2563eb', fontWeight: 500 }}>
                    ..
                  </td>
                </tr>
              )}

              {entries.map((entry) => (
                <tr
                  key={entry.hash + entry.name}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  onClick={() => handleEntryClick(entry)}
                >
                  <td style={{ padding: '10px 16px', width: 36 }}>
                    {entry.type === 'tree' ? (
                      <i className="fas fa-folder" style={{ color: '#3b82f6' }} />
                    ) : (
                      <i className="fas fa-file-alt" style={{ color: '#94a3b8' }} />
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: entry.type === 'tree' ? 600 : 400, color: '#1e293b' }}>
                    {entry.name}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#94a3b8', fontSize: 12 }}>
                    <span style={{ fontFamily: 'monospace' }}>{entry.hash.slice(0, 7)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
