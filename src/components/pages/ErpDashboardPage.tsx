import { useState, useEffect, useCallback } from 'react';
import { Button } from '../common/Button';
import { ErpDashboardTab } from '../erp/ErpDashboardTab';
import { ErpProfileTab } from '../erp/ErpProfileTab';
import { ErpReportsTab } from '../erp/ErpReportsTab';
import { ErpSettingsTab } from '../erp/ErpSettingsTab';
import { ErpAllModulesTab } from '../erp/ErpAllModulesTab';

interface ErpDashboardPageProps {
  onNavigateModule: (id: number) => void;
}

type TabType = 'dashboard' | 'profile' | 'reports' | 'settings' | 'modules';

export function ErpDashboardPage({ onNavigateModule }: ErpDashboardPageProps) {
  const getInitialTab = (): TabType => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (
        tabParam === 'dashboard' ||
        tabParam === 'profile' ||
        tabParam === 'reports' ||
        tabParam === 'settings' ||
        tabParam === 'modules'
      ) {
        return tabParam as TabType;
      }
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (
        tabParam === 'profile' ||
        tabParam === 'reports' ||
        tabParam === 'settings' ||
        tabParam === 'modules'
      ) {
        setActiveTab(tabParam as TabType);
      } else {
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleDashboardNavigate = useCallback(
    (id: number) => {
      if (id === 1) {
        handleTabChange('dashboard');
      } else if (id === 2) {
        handleTabChange('profile');
      } else if (id === 4) {
        handleTabChange('reports');
      } else if (id === 5) {
        handleTabChange('settings');
      } else {
        onNavigateModule(id);
      }
    },
    [handleTabChange, onNavigateModule],
  );

  return (
    <div>
      {/* ===== SUB-TAB NAVIGATION ===== */}
      <div className="tab-nav">
        <Button
          type="button"
          id="erpTabDashboard"
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          <i className="fas fa-th-large" /> Dashboard
        </Button>
        <Button
          type="button"
          id="erpTabProfile"
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <i className="fas fa-user" /> Profile
        </Button>
        <Button
          type="button"
          id="erpTabReports"
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleTabChange('reports')}
        >
          <i className="fas fa-chart-pie" /> Reports
        </Button>
        <Button
          type="button"
          id="erpTabSettings"
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          <i className="fas fa-cog" /> Settings
        </Button>
        <Button
          type="button"
          id="erpTabModules"
          className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => handleTabChange('modules')}
        >
          <i className="fas fa-cubes" /> All Modules
        </Button>
      </div>

      {/* TAB CONTENTS */}
      <div className={`tab-content ${activeTab === 'dashboard' ? 'active' : ''}`}>
        <ErpDashboardTab onNavigateModule={handleDashboardNavigate} />
      </div>

      <div className={`tab-content ${activeTab === 'profile' ? 'active' : ''}`}>
        <ErpProfileTab />
      </div>

      <div className={`tab-content ${activeTab === 'reports' ? 'active' : ''}`}>
        <ErpReportsTab onNavigateDashboard={() => handleTabChange('dashboard')} />
      </div>

      <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
        <ErpSettingsTab />
      </div>

      <div className={`tab-content ${activeTab === 'modules' ? 'active' : ''}`}>
        <ErpAllModulesTab onNavigateModule={onNavigateModule} />
      </div>
    </div>
  );
}
