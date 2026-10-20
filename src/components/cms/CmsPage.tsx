import React, { useState, useEffect, useRef } from 'react';
import type { LandingPageCmsData } from '../../types/cms';
import { cmsService } from '../../services/cms.service';
import { useToast } from '../../hooks/useToast';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { type CmsTab, DEFAULT_EXPLORE_OPPORTUNITIES } from './types';
import { CmsHeader } from './CmsHeader';
import {
  HeroTab,
  CinematicTab,
  StatsTab,
  FeaturesTab,
  DimensionsTab,
  ExploreOpportunitiesTab,
  BlogTab,
  VideoTab,
  TestimonialsTab,
  CtaFooterTab,
  SectionVisibilityTab,
} from './tabs';

export interface CmsPageProps {
  initialTab?: CmsTab;
}

export function CmsPage({ initialTab = 'hero' }: CmsPageProps = {}) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CmsTab>(initialTab);
  const [cmsData, setCmsData] = useState<LandingPageCmsData | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetField, setUploadTargetField] = useState<string | null>(null);

  // Load CMS data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await cmsService.getCmsData('draft');
      if (!data.exploreOpportunities) {
        data.exploreOpportunities = DEFAULT_EXPLORE_OPPORTUNITIES;
      }
      if (data.sectionVisibility && data.sectionVisibility.exploreOpportunities === undefined) {
        data.sectionVisibility.exploreOpportunities = true;
      }
      setCmsData(data);
    } catch (err: unknown) {
      console.error('Failed to load CMS data:', err);
      showToast('Could not reach backend API, loading defaults.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!cmsData) return;
    setSaving(true);
    try {
      const updated = await cmsService.saveDraft(cmsData);
      setCmsData(updated);
      showToast('CMS draft saved successfully to database!', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error(err);
      showToast(`Save failed: ${errorMsg}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!cmsData) return;
    setPublishing(true);
    try {
      await cmsService.saveDraft(cmsData);
      const published = await cmsService.publishContent();
      setCmsData(published);
      showToast('🎉 Landing page published LIVE! Visitors now see the latest changes.', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error(err);
      showToast(`Publish failed: ${errorMsg}`, 'error');
    } finally {
      setPublishing(false);
    }
  }

  async function handleReset() {
    if (!window.confirm('Reset all CMS content back to initial defaults?')) return;
    setLoading(true);
    try {
      const resetData = await cmsService.resetToDefaults();
      setCmsData(resetData);
      showToast('CMS content reset to baseline defaults.', 'info');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Reset failed: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleTriggerUpload(fieldPath: string) {
    setUploadTargetField(fieldPath);
    fileInputRef.current?.click();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetField) return;
    setUploading(true);
    try {
      const result = await cmsService.uploadMedia(file);
      showToast('Media uploaded successfully!', 'success');
      updateNestedField(uploadTargetField, result.url);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Upload failed: ${errorMsg}`, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function updateNestedField(path: string, value: unknown) {
    if (!cmsData) return;
    const parts = path.split('.');
    setCmsData((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      let curr = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]];
      }
      curr[parts[parts.length - 1]] = value;
      return clone;
    });
  }

  if (loading || !cmsData) {
    return (
      <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
        <Loader label="Connecting to CMS Backend & Database..." />
      </div>
    );
  }

  const TABS_CONFIG = [
    { id: 'hero', label: 'Hero Section', icon: 'fa-star' },
    { id: 'cinematic', label: 'Cinematic Showcase', icon: 'fa-play-circle' },
    { id: 'stats', label: 'Stats & The Shift', icon: 'fa-chart-bar' },
    { id: 'features', label: 'Core Features', icon: 'fa-cube' },
    { id: 'dimensions', label: '6 Dimensions', icon: 'fa-shapes' },
    { id: 'explore-opportunities', label: 'Explore Opportunities', icon: 'fa-compass' },
    { id: 'blog', label: 'Editorial Matrix', icon: 'fa-book-open' },
    { id: 'video', label: 'Video Showcase', icon: 'fa-video' },
    { id: 'testimonials', label: 'Why & Testimonials', icon: 'fa-quote-left' },
    { id: 'cta-footer', label: 'CTA & Footer', icon: 'fa-flag' },
    { id: 'visibility', label: 'Section Visibility', icon: 'fa-toggle-on' },
  ];

  return (
    <div className="cms-admin-container" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept="image/*,video/*"
      />

      <CmsHeader
        cmsData={cmsData}
        saving={saving}
        publishing={publishing}
        onReset={handleReset}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      {/* Tabs Navigation */}
      <div className="tab-nav crm-tab-nav" style={{ marginBottom: 20, overflowX: 'auto' }}>
        {TABS_CONFIG.map((t) => (
          <Button
            key={t.id}
            type="button"
            className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id as CmsTab)}
            style={{ fontSize: 13, padding: '9px 15px' }}
          >
            <i className={`fas ${t.icon}`} style={{ marginRight: 6 }} />
            <span>{t.label}</span>
          </Button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <HeroTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'cinematic' && (
        <CinematicTab
          cmsData={cmsData}
          uploading={uploading}
          updateNestedField={updateNestedField}
          onTriggerUpload={handleTriggerUpload}
        />
      )}

      {activeTab === 'stats' && (
        <StatsTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'features' && (
        <FeaturesTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'dimensions' && (
        <DimensionsTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'explore-opportunities' && (
        <ExploreOpportunitiesTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'blog' && (
        <BlogTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'video' && (
        <VideoTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'testimonials' && (
        <TestimonialsTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'cta-footer' && (
        <CtaFooterTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}

      {activeTab === 'visibility' && (
        <SectionVisibilityTab cmsData={cmsData} updateNestedField={updateNestedField} />
      )}
    </div>
  );
}

export default CmsPage;
