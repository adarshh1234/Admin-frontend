import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext';

interface RevenueStream {
  stream: string;
  category: string;
  monthlyRev: number;
  annualRev: number;
  contribution: number;
  growthYoY: number;
  status: 'Accelerating' | 'Stable' | 'High Margin';
}

const REVENUE_STREAMS: RevenueStream[] = [
  {
    stream: 'Clinic ERP & Telehealth SaaS Subscriptions',
    category: 'Recurring SaaS',
    monthlyRev: 145000,
    annualRev: 1740000,
    contribution: 42.5,
    growthYoY: 34.2,
    status: 'Accelerating',
  },
  {
    stream: 'Doctor AI Copilot Add-On Licenses',
    category: 'AI Software',
    monthlyRev: 68000,
    annualRev: 816000,
    contribution: 19.9,
    growthYoY: 58.0,
    status: 'Accelerating',
  },
  {
    stream: 'Hospital Enterprise Integration & Custom Modules',
    category: 'Enterprise Contract',
    monthlyRev: 55000,
    annualRev: 660000,
    contribution: 16.1,
    growthYoY: 18.5,
    status: 'High Margin',
  },
  {
    stream: 'In-Platform Diagnostics & Lab Transaction Cuts',
    category: 'Marketplace Take Rate',
    monthlyRev: 45000,
    annualRev: 540000,
    contribution: 13.2,
    growthYoY: 28.4,
    status: 'Stable',
  },
  {
    stream: 'Pharmaceutical & B2B Sponsored Ad Placements',
    category: 'Ad Platform',
    monthlyRev: 28000,
    annualRev: 336000,
    contribution: 8.3,
    growthYoY: 22.1,
    status: 'Stable',
  },
];

export default function RevenuePage() {
  const navigate = useNavigate();
  const { monthlyRows } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStreams = useMemo(() => {
    if (selectedCategory === 'all') return REVENUE_STREAMS;
    return REVENUE_STREAMS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const totalMonthlyRev = REVENUE_STREAMS.reduce((acc, s) => acc + s.monthlyRev, 0);
  const totalAnnualRev = REVENUE_STREAMS.reduce((acc, s) => acc + s.annualRev, 0);
  const saasRevenuePercent = '62.4';

  const lineChartData = {
    labels: monthlyRows.map((m) => m.month),
    datasets: [
      {
        label: 'Subscription Revenue (₹)',
        data: monthlyRows.map((m) => m.subRev),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Advertising & Marketplace Revenue (₹)',
        data: monthlyRows.map((m) => m.adRev),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
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

  const doughnutData = {
    labels: REVENUE_STREAMS.map((s) => s.stream.split(' ')[0] + ' ' + (s.stream.split(' ')[1] || '')),
    datasets: [
      {
        data: REVENUE_STREAMS.map((s) => s.contribution),
        backgroundColor: ['#2563eb', '#16a34a', '#9333ea', '#d97706', '#0284c7'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
          <i className="fas fa-chart-line" style={{ color: 'var(--admin-primary)' }} />
          Revenue Streams &amp; Trajectory Detail View
        </h2>
      </div>

      {/* Top 4 Domain KPI Cards */}
      <div className="mis-kpi-grid">
        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon">
              <i className="fas fa-chart-line" />
            </span>
            Current Period Revenue
          </div>
          <div className="mis-kpi-value">₹{totalMonthlyRev.toLocaleString()}</div>
          <div className="mis-kpi-sub">Monthly consolidated revenue</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fas fa-calendar-check" />
            </span>
            Annualized Run-Rate (ARR)
          </div>
          <div className="mis-kpi-value">₹{totalAnnualRev.toLocaleString()}</div>
          <div className="mis-kpi-sub">Projected 12-month ARR</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-arrow-trend-up" />
            </span>
            YoY Revenue Growth
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>+29.4%</div>
          <div className="mis-kpi-sub">Trailing 12-month acceleration</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <i className="fas fa-pie-chart" />
            </span>
            SaaS &amp; Recurring Mix
          </div>
          <div className="mis-kpi-value" style={{ color: '#9333ea' }}>{saasRevenuePercent}%</div>
          <div className="mis-kpi-sub">Predictable high-margin revenue</div>
        </div>
      </div>

      {/* Multi-Month Trajectory & Revenue Mix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="mis-panel" style={{ flex: 1.5 }}>
          <div className="mis-section-title">
            <i className="fas fa-chart-line" style={{ color: 'var(--admin-primary)' }} /> Multi-Month Revenue Trajectory
          </div>
          <div className="mis-chart-container" style={{ height: 280 }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="mis-panel">
          <div className="mis-section-title">
            <i className="fas fa-chart-pie" style={{ color: 'var(--admin-primary)' }} /> Revenue Share by Stream (%)
          </div>
          <div className="mis-chart-container" style={{ height: 280 }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Revenue Streams Detailed Table */}
      <div className="mis-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="mis-section-title" style={{ margin: 0 }}>
            <i className="fas fa-table-list" style={{ color: 'var(--admin-primary)' }} /> Core Revenue Channels &amp; Performance Ledger
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
            }}
          >
            <option value="all">All Channel Types</option>
            <option value="Recurring SaaS">Recurring SaaS</option>
            <option value="AI Software">AI Software</option>
            <option value="Enterprise Contract">Enterprise Contract</option>
            <option value="Marketplace Take Rate">Marketplace Take Rate</option>
            <option value="Ad Platform">Ad Platform</option>
          </select>
        </div>

        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Revenue Channel / Product Stream</th>
                <th>Channel Classification</th>
                <th>Monthly Run (₹)</th>
                <th>Annualized (₹)</th>
                <th>Revenue Mix (%)</th>
                <th>YoY Growth</th>
                <th>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStreams.map((item) => (
                <tr key={item.stream}>
                  <td style={{ fontWeight: 600 }}>{item.stream}</td>
                  <td><span className="mis-tag mis-tag-blue">{item.category}</span></td>
                  <td style={{ fontWeight: 700 }}>₹{item.monthlyRev.toLocaleString()}</td>
                  <td>₹{item.annualRev.toLocaleString()}</td>
                  <td style={{ fontWeight: 700 }}>{item.contribution}%</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>+{item.growthYoY}%</td>
                  <td>
                    <span className={`mis-tag ${item.status === 'Accelerating' ? 'mis-tag-green' : item.status === 'High Margin' ? 'mis-tag-blue' : 'mis-tag-amber'}`}>
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
