import { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { ToastContainer } from './components/common/ToastContainer';
import { Loader } from './components/common/Loader';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './hooks/useToast';
import { useErpNavigation } from './hooks/useErpNavigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SuperAdminLoginPage } from './components/auth/SuperAdminLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { UnifiedLoginPage } from './components/auth/UnifiedLoginPage';
import { Button } from './components/common/Button';
import { isModuleAccessible } from './utils/permission.utils';
import type { UMTab } from './components/pages/UserManagementPage';

const ErpDashboardPage = lazy(() =>
  import('./components/pages/ErpDashboardPage').then((m) => ({ default: m.ErpDashboardPage })),
);
const ProfilePage = lazy(() =>
  import('./components/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const CalendarPage = lazy(() =>
  import('./components/pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const ReportsPage = lazy(() =>
  import('./components/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
const SettingsPage = lazy(() =>
  import('./components/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const ModuleDetailPage = lazy(() =>
  import('./components/pages/ModuleDetailPage').then((m) => ({ default: m.ModuleDetailPage })),
);
const CuremasoApp = lazy(() =>
  import('./components/curemaso/CuremasoApp').then((m) => ({ default: m.CuremasoApp })),
);
const HuremasoApp = lazy(() =>
  import('./components/huremaso/HuremasoApp').then((m) => ({ default: m.HuremasoApp })),
);
const UserManagementPage = lazy(() =>
  import('./components/pages/UserManagementPage').then((m) => ({ default: m.UserManagementPage })),
);
const CreditManagementPage = lazy(() =>
  import('./components/pages/CreditManagementPage').then((m) => ({ default: m.CreditManagementPage })),
);
const AdminPage = lazy(() =>
  import('./components/admin/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const CustomersPage = lazy(() =>
  import('./components/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })),
);

const MISModule = lazy(() =>
  import('./components/mis/components/MISModule')
);
const CmsPage = lazy(() =>
  import('./components/cms/CmsPage').then((m) => ({ default: m.CmsPage }))
);
const MarketingPage = lazy(() =>
  import('./components/pages/MarketingPage').then((m) => ({ default: m.MarketingPage }))
);
const HrmDataPage = lazy(() =>
  import('./components/pages/HrmDataPage').then((m) => ({ default: m.HrmDataPage }))
);
const CashFlowSectionPage = lazy(() =>
  import('./components/pages/CashFlowSectionPage').then((m) => ({ default: m.CashFlowSectionPage }))
);
const AcmasoModule = lazy(() =>
  import('./components/acmaso/AcmasoModule').then((m) => ({ default: m.AcmasoModule }))
);
const CandidatesPage = lazy(() =>
  import('./components/pages/CandidatesPage').then((m) => ({ default: m.CandidatesPage }))
);
const StartupsPage = lazy(() =>
  import('./components/pages/StartupsPage').then((m) => ({ default: m.StartupsPage }))
);
const CompaniesPage = lazy(() =>
  import('./components/pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage }))
);
const InstitutionsPage = lazy(() =>
  import('./components/pages/InstitutionsPage').then((m) => ({ default: m.InstitutionsPage }))
);
const InPlatformPromotionPage = lazy(() =>
  import('./components/pages/InPlatformPromotionPage').then((m) => ({ default: m.InPlatformPromotionPage }))
);
const CustomerCarePage = lazy(() =>
  import('./components/pages/CustomerCarePage').then((m) => ({ default: m.CustomerCarePage }))
);
const HelpDeskPage = lazy(() =>
  import('./components/pages/HelpDeskPage').then((m) => ({ default: m.HelpDeskPage }))
);
const TaskmiteModule = lazy(() =>
  import('./components/taskmite/TaskmiteModule').then((m) => ({ default: m.TaskmiteModule }))
);
const GitmiteModule = lazy(() =>
  import('./components/gitmite/GitmiteModule').then((m) => ({ default: m.GitmiteModule }))
);
const OperationsPage = lazy(() =>
  import('./components/pages/OperationsPage').then((m) => ({ default: m.OperationsPage }))
);
const ExploreOpportunitiesPage = lazy(() =>
  import('./components/pages/ExploreOpportunitiesPage').then((m) => ({ default: m.ExploreOpportunitiesPage }))
);
const InterviewManagementPage = lazy(() =>
  import('./components/pages/InterviewManagementPage').then((m) => ({ default: m.InterviewManagementPage }))
);
const ResumeManagementPage = lazy(() =>
  import('./components/pages/ResumeManagementPage').then((m) => ({ default: m.ResumeManagementPage }))
);
const PlatformManagementPage = lazy(() =>
  import('./components/pages/PlatformManagementPage').then((m) => ({ default: m.PlatformManagementPage }))
);

function AppShell() {
  const {
    activeModuleId,
    activeModule,
    specialModules,
    filteredNonSpecialModules,
    searchQuery,
    setSearchQuery,
    navigateTo,
  } = useErpNavigation(1);

  const [customerTab, setCustomerTab] = useState<UMTab>('user-management');
  const { showToast } = useToast();
  const { isStaff, isAdmin, isSuperAdmin, user } = useAuth();

  const isAllowed = useCallback(
    (moduleId: number) => isModuleAccessible(moduleId, user, isSuperAdmin, isAdmin),
    [user, isSuperAdmin, isAdmin],
  );

  // Filter modules visible in navigation for Staff
  const visibleSpecialModules = useMemo(
    () => specialModules.filter((m) => isAllowed(m.id)),
    [specialModules, isAllowed],
  );

  const visibleFilteredModules = useMemo(
    () => filteredNonSpecialModules.filter((m) => isAllowed(m.id)),
    [filteredNonSpecialModules, isAllowed],
  );

  // If active module is not allowed for Staff, automatically redirect to their first permitted module
  useEffect(() => {
    if (isStaff && !isAllowed(activeModuleId)) {
      const allModulesList = [...specialModules, ...filteredNonSpecialModules];
      const firstAllowed = allModulesList.find((m) => isAllowed(m.id));
      if (firstAllowed && firstAllowed.id !== activeModuleId) {
        navigateTo(firstAllowed.id);
      }
    }
  }, [isStaff, isAllowed, activeModuleId, specialModules, filteredNonSpecialModules, navigateTo]);

  const handleSelectModule = useCallback(
    (id: number) => {
      // Role & module-level permission verification
      if (!isAllowed(id)) {
        showToast(
          'Access restricted: You do not have permission to access this module.',
          'warning',
        );
        return;
      }

      if (id === 11) {
        // Open standalone Huremaso application in a new browser tab
        const targetUrl = import.meta.env.VITE_HUREMASO_URL || 'http://localhost:5173';
        const opened = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (!opened) {
          showToast(
            'Pop-up blocked. Please allow pop-ups for this site to open Huremaso in a new tab.',
            'warning',
          );
        }
        return;
      }

      navigateTo(id);
    },
    [isAllowed, navigateTo, showToast],
  );

  function handleGlobalAction() {
    showToast('New action item created.', 'success');
  }

  function renderPageContent() {
    // Permission check for the active module
    if (!isAllowed(activeModuleId)) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', margin: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px' }}>
            <i className="fas fa-lock" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
            Restricted Module Access
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto 20px' }}>
            You do not have permission to access this module. Please contact your administrator to request access.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              const allModulesList = [...specialModules, ...filteredNonSpecialModules];
              const firstAllowed = allModulesList.find((m) => isAllowed(m.id));
              navigateTo(firstAllowed ? firstAllowed.id : 1);
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '6px' }} /> Return to Permitted Module
          </Button>
        </div>
      );
    }

    switch (activeModuleId) {
      case 1:
        return <ErpDashboardPage onNavigateModule={handleSelectModule} />;
      case 2:
        return <ProfilePage />;
      case 3:
        return <CalendarPage />;
      case 4:
        return <ReportsPage onNavigateDashboard={() => navigateTo(1)} />;
      case 5:
        return <SettingsPage />;
      case 6:
        return <MISModule />;
      case 7:
        return <CmsPage />;
      case 8:
        return <CashFlowSectionPage />;
      case 9:
        return <UserManagementPage onNavigateDashboard={() => navigateTo(1)} />;
      case 43:
        return <CreditManagementPage onNavigateDashboard={() => navigateTo(1)} />;
      case 53:
        return <AdminPage onNavigateDashboard={() => navigateTo(1)} onNavigateModule={handleSelectModule} />;
      case 10:
        return <CuremasoApp />;
      case 11:
        return <HuremasoApp onNavigateDashboard={() => navigateTo(1)} />;
      case 12:
        return <MarketingPage />;
      case 13:
        return <OperationsPage />;
      case 17:
        return <TaskmiteModule />;
      case 18:
        return <GitmiteModule />;
      case 21:
        return <CustomerCarePage onNavigateDashboard={() => navigateTo(1)} />;
      case 54:
        return <HelpDeskPage onNavigateDashboard={() => navigateTo(1)} />;
      case 38:
        return <StartupsPage />;
      case 39:
        return <CompaniesPage />;
      case 40:
        return <InstitutionsPage />;
      case 41:
        return (
          <CustomersPage
            initialTab={customerTab}
            activeTab={customerTab}
            onTabChange={setCustomerTab}
            onNavigateDashboard={() => navigateTo(1)}
          />
        );
      case 44:
        return <InPlatformPromotionPage />;
      case 49:
        return <HrmDataPage />;
      case 50:
        return <AcmasoModule />;
      case 51:
        return <CandidatesPage />;
      case 55:
        return <ExploreOpportunitiesPage />;
      case 56:
        return <InterviewManagementPage />;
      case 57:
        return <ResumeManagementPage />;
      case 58:
        return <PlatformManagementPage />;
      default:
        return <ModuleDetailPage key={activeModule.id} module={activeModule} />;
    }
  }

  return (
    <Layout
      activeModuleId={activeModuleId}
      specialModules={visibleSpecialModules}
      filteredModules={visibleFilteredModules}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectModule={handleSelectModule}
      onGlobalAction={handleGlobalAction}
    >
      <div className="page active" key={activeModuleId}>
        <Suspense fallback={<Loader label="Loading module…" />}>
          {renderPageContent()}
        </Suspense>
      </div>
    </Layout>
  );
}

function MainRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Listen to browser navigation events
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPath = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Loading state while verifying token
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}
      >
        <Loader label="Verifying ERP security credentials..." />
      </div>
    );
  }

  // 1. Unified ERP Login Page (supports initialRole, keeping all 3 roles on the unified page)
  if (currentPath === '/super-admin/login') {
    return (
      <UnifiedLoginPage
        initialRole="Super Admin"
        onSuccess={() => navigateToPath('/')}
      />
    );
  }

  if (currentPath === '/admin/login') {
    return (
      <UnifiedLoginPage
        initialRole="Admin"
        onSuccess={() => navigateToPath('/')}
      />
    );
  }

  if (currentPath === '/login') {
    return (
      <UnifiedLoginPage
        initialRole="Staff"
        onSuccess={() => navigateToPath('/')}
      />
    );
  }

  // 2. Protected ERP Workspace Routes
  if (!isAuthenticated) {
    if (currentPath.startsWith('/super-admin')) {
      return (
        <UnifiedLoginPage
          initialRole="Super Admin"
          onSuccess={() => navigateToPath('/')}
        />
      );
    }

    // Default unauthenticated redirect to Unified Login Page
    return (
      <UnifiedLoginPage
        initialRole="Staff"
        onSuccess={() => navigateToPath('/')}
      />
    );
  }

  return <AppShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainRouter />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}
