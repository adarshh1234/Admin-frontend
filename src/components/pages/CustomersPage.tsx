import { UserManagementTabbedView, type UMTab } from './UserManagementPage';

interface CustomersPageProps {
  initialTab?: UMTab;
  activeTab?: UMTab;
  onTabChange?: (tab: UMTab) => void;
  onNavigateDashboard?: () => void;
}

export function CustomersPage({
  initialTab = 'user-management',
  activeTab,
  onTabChange,
  onNavigateDashboard,
}: CustomersPageProps) {
  return (
    <UserManagementTabbedView
      initialTab={initialTab}
      activeTab={activeTab}
      onTabChange={onTabChange}
      onNavigateDashboard={onNavigateDashboard}
    />
  );
}

export default CustomersPage;
