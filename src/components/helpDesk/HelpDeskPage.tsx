import { useState } from 'react';
import { helpDeskService } from '../../services/helpDesk.service';
import { useToast } from '../../hooks/useToast';

import { HelpDeskOverviewTab } from './tabs/HelpDeskOverviewTab';
import { KnowledgeBaseTab } from './tabs/KnowledgeBaseTab';
import { FaqsTab } from './tabs/FaqsTab';
import { SupportCategoriesTab } from './tabs/SupportCategoriesTab';
import { SupportArticlesTab } from './tabs/SupportArticlesTab';
import { HelpDeskSettingsTab } from './tabs/HelpDeskSettingsTab';

import { CreateArticleModal } from './modals/CreateArticleModal';
import { CreateFaqModal } from './modals/CreateFaqModal';
import { CreateCategoryModal } from './modals/CreateCategoryModal';
import { ViewArticleModal } from './modals/ViewArticleModal';

import type {
  HelpDeskTab,
  SupportArticle,
  FaqStatus,
  HelpDeskSettings,
} from '../../types/helpDesk';

interface HelpDeskPageProps {
  onNavigateDashboard?: () => void;
}

export function HelpDeskPage({ onNavigateDashboard }: HelpDeskPageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<HelpDeskTab>('overview');

  const [categories, setCategories] = useState(() => helpDeskService.getCategories());
  const [articles, setArticles] = useState(() => helpDeskService.getArticles());
  const [faqs, setFaqs] = useState(() => helpDeskService.getFaqs());
  const [settings, setSettings] = useState(() => helpDeskService.getSettings());

  // Modal states
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false);
  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<SupportArticle | null>(null);

  function refreshAll() {
    setCategories(helpDeskService.getCategories());
    setArticles(helpDeskService.getArticles());
    setFaqs(helpDeskService.getFaqs());
    setSettings(helpDeskService.getSettings());
  }

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  function handleCreateArticle(data: Parameters<typeof helpDeskService.createArticle>[0]) {
    const newArt = helpDeskService.createArticle(data);
    refreshAll();
    showToast(`Article '${newArt.title}' published successfully.`, 'success');
  }

  function handleDeleteArticle(id: string) {
    helpDeskService.deleteArticle(id);
    refreshAll();
    showToast('Article removed.', 'info');
  }

  function handleCreateFaq(data: Parameters<typeof helpDeskService.createFaq>[0]) {
    helpDeskService.createFaq(data);
    refreshAll();
    showToast('FAQ created successfully.', 'success');
  }

  function handleUpdateFaqStatus(id: string, status: FaqStatus) {
    helpDeskService.updateFaq(id, { status });
    refreshAll();
    showToast(`FAQ status updated to ${status}.`, 'info');
  }

  function handleDeleteFaq(id: string) {
    helpDeskService.deleteFaq(id);
    refreshAll();
    showToast('FAQ deleted.', 'info');
  }

  function handleCreateCategory(data: Parameters<typeof helpDeskService.createCategory>[0]) {
    const newCat = helpDeskService.createCategory(data);
    refreshAll();
    showToast(`Category '${newCat.name}' created.`, 'success');
  }

  function handleUpdateCategoryStatus(id: string, status: 'Active' | 'Archived') {
    helpDeskService.updateCategory(id, { status });
    refreshAll();
    showToast(`Category status set to ${status}.`, 'info');
  }

  function handleDeleteCategory(id: string) {
    helpDeskService.deleteCategory(id);
    refreshAll();
    showToast('Category deleted.', 'info');
  }

  function handleUpdateSettings(updates: Partial<HelpDeskSettings>) {
    helpDeskService.updateSettings(updates);
    refreshAll();
    showToast('Help Desk configuration saved.', 'success');
  }

  const tabs: { id: HelpDeskTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: 'fa-book', count: articles.length },
    { id: 'faqs', label: 'FAQs', icon: 'fa-question-circle', count: faqs.length },
    { id: 'support-categories', label: 'Support Categories', icon: 'fa-layer-group', count: categories.length },
    { id: 'support-articles', label: 'Support Articles', icon: 'fa-file-alt', count: articles.length },
    { id: 'settings', label: 'Help Desk Settings', icon: 'fa-cog' },
  ];

  return (
    <div style={{ padding: '24px 32px 60px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onNavigateDashboard && (
            <button
              type="button"
              onClick={onNavigateDashboard}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
              title="Back to Dashboard"
            >
              <i className="fas fa-arrow-left" />
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #091e42, #0265c2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 16,
              }}>
                <i className="fas fa-life-ring" />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: '#091e42',
                letterSpacing: '-0.02em',
              }}>
                Help Desk & Documentation Hub
              </h1>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Centralized self-service knowledge base, FAQs, and support taxonomy governance
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: 30,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>KB Live Published</span>
          <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>Public Help Portal Online</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#ffffff',
        padding: '6px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        marginBottom: 24,
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #091e42, #0265c2)' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fas ${tab.icon}`} style={{ fontSize: 13, color: isActive ? '#ffffff' : '#94a3b8' }} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  padding: '2px 7px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <HelpDeskOverviewTab
          categories={categories}
          articles={articles}
          faqs={faqs}
          onNavigateTab={setActiveTab}
          onOpenCreateArticle={() => setIsCreateArticleOpen(true)}
          onOpenCreateFaq={() => setIsCreateFaqOpen(true)}
          onSelectArticle={(art) => setViewingArticle(art)}
        />
      )}

      {activeTab === 'knowledge-base' && (
        <KnowledgeBaseTab
          articles={articles}
          categories={categories}
          onOpenCreateArticle={() => setIsCreateArticleOpen(true)}
          onSelectArticle={(art) => setViewingArticle(art)}
        />
      )}

      {activeTab === 'faqs' && (
        <FaqsTab
          faqs={faqs}
          categories={categories}
          onOpenCreateFaq={() => setIsCreateFaqOpen(true)}
          onUpdateStatus={handleUpdateFaqStatus}
          onDeleteFaq={handleDeleteFaq}
        />
      )}

      {activeTab === 'support-categories' && (
        <SupportCategoriesTab
          categories={categories}
          onOpenCreateCategory={() => setIsCreateCategoryOpen(true)}
          onUpdateCategoryStatus={handleUpdateCategoryStatus}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'support-articles' && (
        <SupportArticlesTab
          articles={articles}
          categories={categories}
          onOpenCreateArticle={() => setIsCreateArticleOpen(true)}
          onSelectArticle={(art) => setViewingArticle(art)}
          onDeleteArticle={handleDeleteArticle}
        />
      )}

      {activeTab === 'settings' && (
        <HelpDeskSettingsTab
          settings={settings}
          categories={categories}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      {/* Modals */}
      <CreateArticleModal
        isOpen={isCreateArticleOpen}
        categories={categories}
        onClose={() => setIsCreateArticleOpen(false)}
        onSubmit={handleCreateArticle}
      />

      <CreateFaqModal
        isOpen={isCreateFaqOpen}
        categories={categories}
        onClose={() => setIsCreateFaqOpen(false)}
        onSubmit={handleCreateFaq}
      />

      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <ViewArticleModal
        isOpen={!!viewingArticle}
        article={viewingArticle}
        onClose={() => setViewingArticle(null)}
        onEdit={(art) => {
          setViewingArticle(null);
          setIsCreateArticleOpen(true);
        }}
      />
    </div>
  );
}

export default HelpDeskPage;
