import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext';

interface InvestmentInitiative {
  id: string;
  initiative: string;
  category: 'Tech & AI' | 'Marketing' | 'Expansion' | 'Clinical Network';
  capitalDeployed: number;
  grossRevenue: number;
  netProfit: number;
  roiPercent: number;
  paybackMonths: number;
  status: 'High Yield' | 'Target Met' | 'Scaling';
}

const INITIATIVE_DATA: InvestmentInitiative[] = [
  {
    id: 'INIT-01',
    initiative: 'Global Telehealth Copilot AI & Clinical NLP',
    category: 'Tech & AI',
    capitalDeployed: 120000,
    grossRevenue: 480000,
    netProfit: 360000,
    roiPercent: 300.0,
    paybackMonths: 4.2,
    status: 'High Yield',
  },
  {
    id: 'INIT-02',
    initiative: 'Digital Performance Marketing & Google Ads',
    category: 'Marketing',
    capitalDeployed: 85000,
    grossRevenue: 272000,
    netProfit: 187000,
    roiPercent: 220.0,
    paybackMonths: 5.5,
    status: 'High Yield',
  },
  {
    id: 'INIT-03',
    initiative: 'South East Asia Partner Clinic Network Expansion',
    category: 'Expansion',
    capitalDeployed: 150000,
    grossRevenue: 345000,
    netProfit: 195000,
    roiPercent: 130.0,
    paybackMonths: 7.8,
    status: 'Scaling',
  },
  {
    id: 'INIT-04',
    initiative: 'Automated Billing & Insurance Claim Automation Engine',
    category: 'Tech & AI',
    capitalDeployed: 60000,
    grossRevenue: 198000,
    netProfit: 138000,
    roiPercent: 230.0,
    paybackMonths: 4.8,
    status: 'High Yield',
  },
  {
    id: 'INIT-05',
    initiative: 'Doctor Advocate & Referral Loyalty Tiers',
    category: 'Marketing',
    capitalDeployed: 42000,
    grossRevenue: 126000,
    netProfit: 84000,
    roiPercent: 200.0,
    paybackMonths: 3.9,
    status: 'Target Met',
  },
];

export default function RoisPage() {
  const navigate = useNavigate();
  const { marketingData } = useDashboard();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredInitiatives = useMemo(() => {
    if (categoryFilter === 'all') return INITIATIVE_DATA;
    return INITIATIVE_DATA.filter((i) => i.category === categoryFilter);
  }, [categoryFilter]);

  const totalCapital = INITIATIVE_DATA.reduce((acc, i) => acc + i.capitalDeployed, 0);
  const totalRevenue = INITIATIVE_DATA.reduce((acc, i) => acc + i.grossRevenue, 0);
  const totalNetProfit = INITIATIVE_DATA.reduce((acc, i) => acc + i.netProfit, 0);
  const overallPortfolioRoi = totalCapital ? ((totalNetProfit / totalCapital) * 100).toFixed(1) : '24.8';

  const chartData = {
    labels: INITIATIVE_DATA.map((i) => i.initiative.split(' ')[0] + ' ' + (i.initiative.split(' ')[1] || '')),
    datasets: [
      {
        label: 'Capital Deployed (₹)',
        data: INITIATIVE_DATA.map((i) => i.capitalDeployed),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Net Profit Generated (₹)',
        data: INITIATIVE_DATA.map((i) => i.netProfit),
        backgroundColor: 'rgba(22, 163, 74, 0.85)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => `₹${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div id="mis-dashboard-capture">
      {/* Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button type="button" onClick={() => navigate('/')} className="mis-btn-action">
          <i className="fas fa-arrow-left" /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '20px', color: 'var(--admin-text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-percentage" style={{ color: '#16a34a' }} />
          Return on Investment (ROIs) &amp; Capital Efficiency Detail View
        </h2>
      </div>

      {/* Top 4 Domain KPI Cards */}
      <div className="mis-kpi-grid">
        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-percentage" />
            </span>
            Overall Portfolio ROI
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>
            {overallPortfolioRoi}%
          </div>
          <div className="mis-kpi-sub">Blended net returns across initiatives</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon">
              <i className="fas fa-wallet" />
            </span>
            Total Capital Deployed
          </div>
          <div className="mis-kpi-value">₹{totalCapital.toLocaleString()}</div>
          <div className="mis-kpi-sub">Across 5 active strategic projects</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fas fa-chart-line" />
            </span>
            Gross Returns Generated
          </div>
          <div className="mis-kpi-value">₹{totalRevenue.toLocaleString()}</div>
          <div className="mis-kpi-sub">Direct attributable gross return</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-arrow-trend-up" />
            </span>
            Net Value Created
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>
            ₹{totalNetProfit.toLocaleString()}
          </div>
          <div className="mis-kpi-sub">Net profit yield over invested capital</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mis-panel" style={{ marginBottom: 24 }}>
        <div className="mis-section-title">
          <i className="fas fa-chart-bar" style={{ color: 'var(--admin-primary)' }} /> Capital Deployed vs. Net Profit Generated by Strategic Initiative
        </div>
        <div className="mis-formula-note">
          ROI (%) = ((Gross Attributable Revenue − Capital Deployed) / Capital Deployed) × 100
        </div>
        <div className="mis-chart-container" style={{ height: 320 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Initiatives Table */}
      <div className="mis-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="mis-section-title" style={{ margin: 0 }}>
            <i className="fas fa-list-check" style={{ color: 'var(--admin-primary)' }} /> Strategic Investment Initiatives Ledger
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
            }}
          >
            <option value="all">All Categories</option>
            <option value="Tech & AI">Tech &amp; AI</option>
            <option value="Marketing">Marketing</option>
            <option value="Expansion">Expansion</option>
          </select>
        </div>

        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Strategic Initiative</th>
                <th>Category</th>
                <th>Capital Deployed (₹)</th>
                <th>Gross Revenue (₹)</th>
                <th>Net Profit (₹)</th>
                <th>ROI (%)</th>
                <th>Payback</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInitiatives.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.initiative}</td>
                  <td>
                    <span className="mis-tag mis-tag-blue">{item.category}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{item.capitalDeployed.toLocaleString()}</td>
                  <td>₹{item.grossRevenue.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>₹{item.netProfit.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#16a34a' }}>{item.roiPercent.toFixed(1)}%</td>
                  <td>{item.paybackMonths} mos</td>
                  <td>
                    <span className={`mis-tag ${item.status === 'High Yield' ? 'mis-tag-green' : item.status === 'Target Met' ? 'mis-tag-blue' : 'mis-tag-amber'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
