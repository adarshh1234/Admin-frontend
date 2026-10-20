import React, { useState } from 'react';
import { ExploreOpportunitiesManagement } from '../platform/ExploreOpportunitiesManagement';
import { InterviewManagement } from '../platform/InterviewManagement';
import { ResumeManagement } from '../platform/ResumeManagement';

interface PlatformManagementPageProps {
  initialTab?: 'explore' | 'interviews' | 'resumes';
  onNavigateTab?: (tab: 'explore' | 'interviews' | 'resumes') => void;
}

export function PlatformManagementPage({ initialTab = 'explore', onNavigateTab }: PlatformManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'explore' | 'interviews' | 'resumes'>(initialTab);

  const handleTabChange = (tab: 'explore' | 'interviews' | 'resumes') => {
    setActiveTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <div style={{ padding: '4px 0 28px', maxWidth: '100%' }}>
      {/* Top Section Tab Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          border: '1px solid #e2edf8',
          borderRadius: 16,
          padding: '10px 18px',
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0, 102, 204, 0.03)',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleTabChange('explore')}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === 'explore' ? '#0066cc' : '#f8fafc',
              color: activeTab === 'explore' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-compass" />
            <span>Explore Opportunities</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('interviews')}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === 'interviews' ? '#0066cc' : '#f8fafc',
              color: activeTab === 'interviews' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-user-check" />
            <span>Interview Management</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('resumes')}
            style={{
              padding: '9px 18px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === 'resumes' ? '#0066cc' : '#f8fafc',
              color: activeTab === 'resumes' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fas fa-file-alt" />
            <span>Resume Management</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>Platform Live Sync Active</span>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'explore' && <ExploreOpportunitiesManagement />}
      {activeTab === 'interviews' && <InterviewManagement />}
      {activeTab === 'resumes' && <ResumeManagement />}
    </div>
  );
}

export default PlatformManagementPage;
