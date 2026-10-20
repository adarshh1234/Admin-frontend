import React, { useState } from 'react';
import { Button } from '../common/Button';
import {
  UserManagementPage as FullUserManagementPage,
  UserManagementComingSoon,
  UserManagementTab,
  CandidatesTab,
  BulkCandidatesTab,
  HrmsTab,
  type UMTab,
  type UserManagementPageProps,
  type UserManagementTabbedViewProps,
} from './userManagement';

export {
  FullUserManagementPage,
  UserManagementComingSoon,
  UserManagementTab,
  CandidatesTab,
  BulkCandidatesTab,
  HrmsTab,
};
export type { UMTab, CandidateSubTab } from './userManagement';

// ---------------------------------------------------------------------------
// TABBED VIEW (Used in Customers section or standalone modules)
// ---------------------------------------------------------------------------
export function UserManagementTabbedView({
  initialTab = 'user-management',
  activeTab: controlledTab,
  onTabChange,
  onNavigateDashboard,
}: UserManagementTabbedViewProps) {
  const [internalTab, setInternalTab] = useState<UMTab>(initialTab);
  const currentTab = controlledTab || internalTab;

  const handleTabClick = (tab: UMTab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div>
      {/* Tab navigation */}
      <div className="tab-nav" style={{ marginBottom: 20 }}>
        <Button
          type="button"
          className={`tab-btn${currentTab === 'user-management' ? ' active' : ''}`}
          onClick={() => handleTabClick('user-management')}
        >
          <i className="fas fa-users-cog" style={{ marginRight: 6 }} /> User Management
        </Button>
        <Button
          type="button"
          className={`tab-btn${currentTab === 'candidates' ? ' active' : ''}`}
          onClick={() => handleTabClick('candidates')}
        >
          <i className="fas fa-user-graduate" style={{ marginRight: 6 }} /> Candidates
        </Button>
        <Button
          type="button"
          className={`tab-btn${currentTab === 'bulk-candidates' ? ' active' : ''}`}
          onClick={() => handleTabClick('bulk-candidates')}
        >
          <i className="fas fa-layer-group" style={{ marginRight: 6 }} /> Bulk Candidates
        </Button>
        <Button
          type="button"
          className={`tab-btn${currentTab === 'hrms' ? ' active' : ''}`}
          onClick={() => handleTabClick('hrms')}
        >
          <i className="fas fa-sitemap" style={{ marginRight: 6 }} /> HRMS
        </Button>
        <Button
          type="button"
          className={`tab-btn${currentTab === 'acmaso' ? ' active' : ''}`}
          onClick={() => handleTabClick('acmaso')}
        >
          <i className="fas fa-coins" style={{ marginRight: 6 }} /> Acmaso
        </Button>
      </div>

      {/* Tab contents */}
      <div className={`tab-content${currentTab === 'user-management' ? ' active' : ''}`}>
        {currentTab === 'user-management' && (
          <FullUserManagementPage onNavigateDashboard={onNavigateDashboard} />
        )}
      </div>

      <div className={`tab-content${currentTab === 'candidates' ? ' active' : ''}`}>
        {currentTab === 'candidates' && <CandidatesTab />}
      </div>

      <div className={`tab-content${currentTab === 'bulk-candidates' ? ' active' : ''}`}>
        {currentTab === 'bulk-candidates' && <BulkCandidatesTab />}
      </div>

      <div className={`tab-content${currentTab === 'hrms' ? ' active' : ''}`}>
        {currentTab === 'hrms' && <HrmsTab />}
      </div>

      <div className={`tab-content${currentTab === 'acmaso' ? ' active' : ''}`}>
        {currentTab === 'acmaso' && <div style={{ minHeight: 400 }} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN USER MANAGEMENT PAGE
// ---------------------------------------------------------------------------
export function UserManagementPage({ onNavigateDashboard }: UserManagementPageProps) {
  return <FullUserManagementPage onNavigateDashboard={onNavigateDashboard} />;
}

export default UserManagementPage;
