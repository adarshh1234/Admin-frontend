import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

interface LiquidityRatio {
  ratioName: string;
  currentValue: string;
  targetBenchmark: string;
  description: string;
  status: 'Strong' | 'Optimal' | 'Caution';
}

const LIQUIDITY_RATIOS: LiquidityRatio[] = [
  {
    ratioName: 'Current Ratio (CR)',
    currentValue: '2.84 : 1',
    targetBenchmark: '> 2.0 : 1',
    description: 'Current Assets / Current Liabilities. Indicates ability to cover short-term obligations.',
    status: 'Strong',
  },
  {
    ratioName: 'Quick Ratio (Acid-Test)',
    currentValue: '2.42 : 1',
    targetBenchmark: '> 1.5 : 1',
    description: '(Cash + Marketable Securities + Accounts Receivable) / Current Liabilities.',
    status: 'Strong',
  },
  {
    ratioName: 'Cash Ratio',
    currentValue: '1.65 : 1',
    targetBenchmark: '> 1.0 : 1',
    description: 'Immediate Liquid Cash Reserves / Total Current Liabilities.',
    status: 'Optimal',
  },
  {
    ratioName: 'Operating Cash Flow Ratio',
    currentValue: '1.92 : 1',
    targetBenchmark: '> 1.2 : 1',
    description: 'Operating Cash Flow / Current Liabilities. Reflects core cash-generation health.',
    status: 'Strong',
  },
  {
    ratioName: 'Days Sales Outstanding (DSO)',
    currentValue: '22.4 Days',
    targetBenchmark: '< 30 Days',
    description: 'Average time taken to collect receivables from partner clinics and hospital networks.',
    status: 'Optimal',
  },
];

interface LiquidAccount {
  accountName: string;
  institution: string;
  category: string;
  balance: number;
  yieldApy: string;
  status: 'Instant Access' | 'T+1 Settlement' | 'Reserve';
}

const LIQUID_ACCOUNTS: LiquidAccount[] = [
  {
    accountName: 'Corporate Primary Operating Account',
    institution: 'JPMorgan Chase Bank',
    category: 'Demand Checking',
    balance: 840000,
    yieldApy: '1.25%',
    status: 'Instant Access',
  },
  {
    accountName: 'Strategic Treasury Yield Fund',
    institution: 'Goldman Sachs Asset Management',
    category: 'Money Market Liquidity (AAA)',
    balance: 1250000,
    yieldApy: '5.15%',
    status: 'T+1 Settlement',
  },
  {
    accountName: 'APAC Regional Clearing Current Account',
    institution: 'HDFC Enterprise Bank',
    category: 'Operational Current',
    balance: 630000,
    yieldApy: '3.50%',
    status: 'Instant Access',
  },
  {
    accountName: 'International Settlement Escrow',
    institution: 'Standard Chartered Global',
    category: 'Multi-Currency Escrow',
    balance: 100000,
    yieldApy: '2.10%',
    status: 'Reserve',
  },
];

export default function LiquidityPage() {
  const navigate = useNavigate();

  const totalLiquidity = LIQUID_ACCOUNTS.reduce((acc, a) => acc + a.balance, 0);

  const chartData = {
    labels: ['Current Ratio', 'Quick Ratio', 'Cash Ratio', 'Operating CF Ratio'],
    datasets: [
      {
        label: 'Actual Ratio',
        data: [2.84, 2.42, 1.65, 1.92],
        backgroundColor: 'rgba(37, 99, 235, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Benchmark Minimum',
        data: [2.0, 1.5, 1.0, 1.2],
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
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
          callback: (value: number | string) => `${value}x`,
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
          <i className="fas fa-hand-holding-usd" style={{ color: 'var(--admin-primary)' }} />
          Liquidity Coverage &amp; Solvency Detail View
        </h2>
      </div>

      {/* Top 4 Domain KPI Cards */}
      <div className="mis-kpi-grid">
        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon">
              <i className="fas fa-hand-holding-usd" />
            </span>
            Total Available Liquidity
          </div>
          <div className="mis-kpi-value">₹{totalLiquidity.toLocaleString()}</div>
          <div className="mis-kpi-sub">Instant + T+1 liquid reserves</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-shield-halved" />
            </span>
            Current Ratio (CR)
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>2.84 : 1</div>
          <div className="mis-kpi-sub">Target benchmark &gt; 2.0 : 1</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fas fa-bolt" />
            </span>
            Quick Ratio (Acid-Test)
          </div>
          <div className="mis-kpi-value">2.42 : 1</div>
          <div className="mis-kpi-sub">Target benchmark &gt; 1.5 : 1</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-clock" />
            </span>
            Cash Buffer Runway
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>16.8 Months</div>
          <div className="mis-kpi-sub">Zero-inflow survival coverage</div>
        </div>
      </div>

      {/* Liquidity Ratios Benchmark Chart */}
      <div className="mis-panel" style={{ marginBottom: 24 }}>
        <div className="mis-section-title">
          <i className="fas fa-chart-column" style={{ color: 'var(--admin-primary)' }} /> Solvency &amp; Liquidity Coverage Ratios vs. Target Benchmarks
        </div>
        <div className="mis-formula-note">
          Current Ratio = Current Assets / Current Liabilities • Quick Ratio = (Cash + Marketable Securities + Receivables) / Current Liabilities
        </div>
        <div className="mis-chart-container" style={{ height: 300 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Liquidity Ratios Detailed Matrix */}
      <div className="mis-panel" style={{ marginBottom: 24 }}>
        <div className="mis-section-title">
          <i className="fas fa-scale-balanced" style={{ color: 'var(--admin-primary)' }} /> Core Liquidity Ratios Matrix
        </div>
        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Liquidity Ratio Metric</th>
                <th>Current Ratio Value</th>
                <th>Target Benchmark</th>
                <th>Interpretation &amp; Coverage Description</th>
                <th>Solvency Status</th>
              </tr>
            </thead>
            <tbody>
              {LIQUIDITY_RATIOS.map((r) => (
                <tr key={r.ratioName}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{r.ratioName}</td>
                  <td style={{ fontWeight: 800, fontSize: 14 }}>{r.currentValue}</td>
                  <td><code>{r.targetBenchmark}</code></td>
                  <td style={{ fontSize: 12.5, color: '#64748b' }}>{r.description}</td>
                  <td>
                    <span className="mis-tag mis-tag-green">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liquid Reserves & Institution Accounts */}
      <div className="mis-panel">
        <div className="mis-section-title">
          <i className="fas fa-vault" style={{ color: 'var(--admin-primary)' }} /> Institutional Cash Reserves &amp; Yield Accounts
        </div>
        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Banking Institution</th>
                <th>Asset Category</th>
                <th>Liquid Balance (₹)</th>
                <th>Yield (APY)</th>
                <th>Liquidity Settlement Tier</th>
              </tr>
            </thead>
            <tbody>
              {LIQUID_ACCOUNTS.map((acc) => (
                <tr key={acc.accountName}>
                  <td style={{ fontWeight: 600 }}>{acc.accountName}</td>
                  <td>{acc.institution}</td>
                  <td><span className="mis-tag mis-tag-blue">{acc.category}</span></td>
                  <td style={{ fontWeight: 700 }}>₹{acc.balance.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>{acc.yieldApy}</td>
                  <td>
                    <span className={`mis-tag ${acc.status === 'Instant Access' ? 'mis-tag-green' : acc.status === 'T+1 Settlement' ? 'mis-tag-blue' : 'mis-tag-amber'}`}>
                      {acc.status}
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
