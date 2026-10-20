import { useState, Suspense, lazy } from 'react';
import { DashboardProvider } from '../mis/context/DashboardContext';
import { Button } from '../common/Button';
import '../mis/chartSetup';
import '../mis/mis.css';
import { Loader } from '../common/Loader';

const DailyPage = lazy(() => import('../mis/pages/DailyPage'));
const MonthlyPage = lazy(() => import('../mis/pages/MonthlyPage'));
const QuarterlyPage = lazy(() => import('../mis/pages/QuarterlyPage'));
const AnnualPage = lazy(() => import('../mis/pages/AnnualPage'));
const CashFlowPage = lazy(() => import('../mis/pages/CashFlowPage'));

type MainTab = 'daily-sales' | 'cash-flow-management';
type SalesSubTab = 'daily' | 'monthly' | 'quarterly' | 'annually';

export function CashFlowSectionPage() {
  const [mainTab, setMainTab] = useState<MainTab>('daily-sales');
  const [salesSubTab, setSalesSubTab] = useState<SalesSubTab>('daily');

  return (
    <DashboardProvider>
      <div className="mis-module">
        {/* Main Section Tabs */}
        <div className="tab-nav" style={{ marginBottom: mainTab === 'daily-sales' ? 14 : 20 }}>
          <Button
            type="button"
            className={`tab-btn${mainTab === 'daily-sales' ? ' active' : ''}`}
            onClick={() => setMainTab('daily-sales')}
          >
            <i className="fas fa-chart-line" style={{ marginRight: 6 }} /> Daily Sales
          </Button>
          <Button
            type="button"
            className={`tab-btn${mainTab === 'cash-flow-management' ? ' active' : ''}`}
            onClick={() => setMainTab('cash-flow-management')}
          >
            <i className="fas fa-wallet" style={{ marginRight: 6 }} /> Cash Flow Management
          </Button>
        </div>

        {/* 4 Sub-Tabs Inside Daily Sales Only */}
        {mainTab === 'daily-sales' && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 20,
              padding: '6px 8px',
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e9edf4',
              width: 'fit-content',
            }}
          >
            <Button
              type="button"
              className={`tab-btn${salesSubTab === 'daily' ? ' active' : ''}`}
              onClick={() => setSalesSubTab('daily')}
              style={{
                fontSize: 12.5,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
              }}
            >
              <i className="fas fa-calendar-day" style={{ marginRight: 6 }} /> Daily
            </Button>
            <Button
              type="button"
              className={`tab-btn${salesSubTab === 'monthly' ? ' active' : ''}`}
              onClick={() => setSalesSubTab('monthly')}
              style={{
                fontSize: 12.5,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
              }}
            >
              <i className="fas fa-calendar-alt" style={{ marginRight: 6 }} /> Monthly
            </Button>
            <Button
              type="button"
              className={`tab-btn${salesSubTab === 'quarterly' ? ' active' : ''}`}
              onClick={() => setSalesSubTab('quarterly')}
              style={{
                fontSize: 12.5,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
              }}
            >
              <i className="fas fa-chart-pie" style={{ marginRight: 6 }} /> Quarterly
            </Button>
            <Button
              type="button"
              className={`tab-btn${salesSubTab === 'annually' ? ' active' : ''}`}
              onClick={() => setSalesSubTab('annually')}
              style={{
                fontSize: 12.5,
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
              }}
            >
              <i className="fas fa-calendar" style={{ marginRight: 6 }} /> Annually
            </Button>
          </div>
        )}

        {/* Content Panels */}
        <div className="mis-panel" style={{ padding: 0 }}>
          <Suspense fallback={<Loader label="Loading data..." />}>
            {mainTab === 'daily-sales' && (
              <>
                {salesSubTab === 'daily' && <DailyPage />}
                {salesSubTab === 'monthly' && <MonthlyPage />}
                {salesSubTab === 'quarterly' && <QuarterlyPage />}
                {salesSubTab === 'annually' && <AnnualPage />}
              </>
            )}
            {mainTab === 'cash-flow-management' && <CashFlowPage />}
          </Suspense>
        </div>
      </div>
    </DashboardProvider>
  );
}

export default CashFlowSectionPage;
