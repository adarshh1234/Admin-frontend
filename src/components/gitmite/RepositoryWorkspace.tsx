import { useEffect, useState } from 'react';
import type { Repository } from '../../types/gitmite';
import { gitmiteService } from '../../services/gitmite.service';
import { useToast } from '../../context/ToastContext';
import { RepoFileBrowser } from './RepoFileBrowser';
import { RepoCommitLog } from './RepoCommitLog';
import { RepoCollaborators } from './RepoCollaborators';
import { RepoSettings } from './RepoSettings';
import { GitTokenModal } from './GitTokenModal';

interface RepositoryWorkspaceProps {
  repository: Repository;
  onBackToList: () => void;
  onRepositoryUpdated: (updated: Repository) => void;
}

type TabType = 'files' | 'commits' | 'collaborators' | 'cli' | 'settings';

export function RepositoryWorkspace({
  repository: initialRepo,
  onBackToList,
  onRepositoryUpdated,
}: RepositoryWorkspaceProps) {
  const { showToast } = useToast();
  const [repository, setRepository] = useState<Repository>(initialRepo);
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [copiedClone, setCopiedClone] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    setRepository(initialRepo);
  }, [initialRepo]);

  useEffect(() => {
    async function loadBranches() {
      try {
        const branchList = await gitmiteService.getBranches(repository.slug);
        setBranches(branchList);
        if (branchList.length > 0) {
          const preferred =
            branchList.find((b) => b === 'main' || b === 'master') || branchList[0];
          setSelectedBranch(preferred);
        } else {
          setSelectedBranch('');
        }
      } catch {
        setBranches([]);
      }
    }

    loadBranches();
  }, [repository.slug]);

  const cloneUrl = `http://localhost:5000/git/${repository.slug}.git`;

  function handleCopyCloneUrl() {
    navigator.clipboard.writeText(cloneUrl);
    setCopiedClone(true);
    showToast('Clone URL copied to clipboard.', 'info');
    setTimeout(() => setCopiedClone(false), 2000);
  }

  function handleRepoUpdated(updated: Repository) {
    setRepository(updated);
    onRepositoryUpdated(updated);
  }

  return (
    <div>
      {/* Top Bar with Back button, Title & Clone Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={onBackToList}
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />
              Repositories
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fas fa-code-branch" style={{ color: '#2563eb', fontSize: 18 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                    {repository.name}
                  </h2>
                  <span
                    className={repository.visibility === 'PUBLIC' ? 'tag-green' : 'tag-blue'}
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: repository.visibility === 'PUBLIC' ? '#dcfce7' : '#dbeafe',
                      color: repository.visibility === 'PUBLIC' ? '#15803d' : '#1d4ed8',
                      fontWeight: 600,
                    }}
                  >
                    {repository.visibility}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  slug: <code>{repository.slug}</code>
                  {repository.description && ` · ${repository.description}`}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Clone URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                overflow: 'hidden',
                fontSize: 12.5,
              }}
            >
              <span style={{ padding: '6px 10px', color: '#64748b', background: '#e2e8f0', fontWeight: 600 }}>
                Git
              </span>
              <span style={{ padding: '6px 12px', fontFamily: 'monospace', color: '#1e293b' }}>
                {cloneUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyCloneUrl}
                style={{
                  background: '#ffffff',
                  border: 'none',
                  borderLeft: '1px solid #cbd5e1',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#2563eb',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <i className={copiedClone ? 'fas fa-check' : 'fas fa-copy'} />
                {copiedClone ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsTokenModalOpen(true)}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              <i className="fas fa-key" style={{ marginRight: 6, color: '#d97706' }} />
              Git Tokens
            </button>
          </div>
        </div>

        {/* Branch selector & Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9',
            marginTop: 16,
            paddingTop: 14,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Branch Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-code-fork" style={{ color: '#64748b', fontSize: 13 }} />
            {branches.length > 0 ? (
              <select
                className="form-control"
                style={{ padding: '4px 10px', fontSize: 12.5, width: 'auto', minWidth: 120 }}
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic' }}>
                No branches yet
              </span>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className={activeTab === 'files' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={() => setActiveTab('files')}
            >
              <i className="fas fa-folder-open" style={{ marginRight: 6 }} />
              Files
            </button>

            <button
              type="button"
              className={activeTab === 'commits' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={() => setActiveTab('commits')}
            >
              <i className="fas fa-history" style={{ marginRight: 6 }} />
              Commits
            </button>

            <button
              type="button"
              className={activeTab === 'collaborators' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={() => setActiveTab('collaborators')}
            >
              <i className="fas fa-users" style={{ marginRight: 6 }} />
              Collaborators
            </button>

            <button
              type="button"
              className={activeTab === 'cli' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={() => setActiveTab('cli')}
            >
              <i className="fas fa-terminal" style={{ marginRight: 6 }} />
              CLI Setup
            </button>

            <button
              type="button"
              className={activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog" style={{ marginRight: 6 }} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Body */}
      {activeTab === 'files' && (
        <RepoFileBrowser
          slug={repository.slug}
          selectedBranch={selectedBranch}
          onNavigateToCommits={() => setActiveTab('commits')}
        />
      )}

      {activeTab === 'commits' && (
        <RepoCommitLog
          slug={repository.slug}
          selectedBranch={selectedBranch}
        />
      )}

      {activeTab === 'collaborators' && (
        <RepoCollaborators slug={repository.slug} />
      )}

      {activeTab === 'cli' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: 24,
            maxWidth: 720,
          }}
        >
          <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
            <i className="fas fa-terminal" style={{ color: '#2563eb', marginRight: 8 }} />
            Git CLI Remote Setup & Transport
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            This repository is hosted by your Admin Backend Smart HTTP Git server. You can clone, push, and pull using standard Git CLI commands.
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Clone an existing repository
            </label>
            <pre
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                padding: '12px 16px',
                borderRadius: 6,
                fontFamily: 'Consolas, monospace',
                fontSize: 12.5,
                margin: 0,
              }}
            >
              git clone {cloneUrl}
            </pre>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Push an existing local repository
            </label>
            <pre
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                padding: '12px 16px',
                borderRadius: 6,
                fontFamily: 'Consolas, monospace',
                fontSize: 12.5,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              git remote add origin {cloneUrl}{'\n'}
              git branch -M main{'\n'}
              git push -u origin main
            </pre>
          </div>

          <div
            style={{
              padding: 16,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              fontSize: 13,
              color: '#334155',
            }}
          >
            <strong>Authentication requirement:</strong>
            <p style={{ margin: '6px 0 12px', fontSize: 12.5, color: '#64748b' }}>
              When Git prompts for credentials, use your username and a Personal Access Token (PAT).
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsTokenModalOpen(true)}
              style={{ fontSize: 12 }}
            >
              <i className="fas fa-key" style={{ marginRight: 6 }} />
              Generate Personal Access Token
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <RepoSettings
          repository={repository}
          onRepositoryUpdated={handleRepoUpdated}
        />
      )}

      <GitTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
    </div>
  );
}
