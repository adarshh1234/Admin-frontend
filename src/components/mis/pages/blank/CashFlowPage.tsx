import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext';

interface BankAccountRecord {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: 'Active' | 'Primary' | 'Escrow' | 'Restricted';
}

interface ChequeRecord {
  chequeNo: string;
  payee: string;
  bankAccount: string;
  amount: number;
  date: string;
  type: 'Issued' | 'Upcoming';
  status: 'Cleared' | 'In Clearing' | 'Scheduled' | 'Pending Approval';
}

const BANK_ACCOUNTS: BankAccountRecord[] = [
  {
    id: 'BA-01',
    name: 'Curemaso Core Operating Account',
    bank: 'JPMorgan Chase Bank',
    accountNumber: '•••• 8492',
    accountType: 'Commercial Checking',
    balance: 840000,
    status: 'Primary',
  },
  {
    id: 'BA-02',
    name: 'Strategic Treasury & Liquid Yield',
    bank: 'Goldman Sachs Asset Management',
    accountNumber: '•••• 3128',
    accountType: 'Money Market Reserve (5.15% APY)',
    balance: 1250000,
    status: 'Active',
  },
  {
    id: 'BA-03',
    name: 'International Escrow & Multi-Currency',
    bank: 'Standard Chartered Global',
    accountNumber: '•••• 9041',
    accountType: 'Escrow & Settlements',
    balance: 420000,
    status: 'Escrow',
  },
  {
    id: 'BA-04',
    name: 'Statutory Payroll & Tax Escrow',
    bank: 'Silicon Valley Bank / First Citizens',
    accountNumber: '•••• 6714',
    accountType: 'Statutory Payroll Checking',
    balance: 310000,
    status: 'Restricted',
  },
  {
    id: 'BA-05',
    name: 'APAC Regional Healthcare Operating',
    bank: 'HDFC Enterprise Bank',
    accountNumber: '•••• 5520',
    accountType: 'Corporate Current Account',
    balance: 630000,
    status: 'Active',
  },
];

const CHEQUES_ISSUED: ChequeRecord[] = [
  {
    chequeNo: 'CHQ-99201',
    payee: 'AWS Cloud & Diagnostic GPU Cluster',
    bankAccount: 'JPMorgan Chase (•••• 8492)',
    amount: 14200,
    date: '2026-09-11',
    type: 'Issued',
    status: 'Cleared',
  },
  {
    chequeNo: 'CHQ-99202',
    payee: 'Apollo Diagnostic Lab Test Kits & Consumables',
    bankAccount: 'JPMorgan Chase (•••• 8492)',
    amount: 28500,
    date: '2026-09-12',
    type: 'Issued',
    status: 'In Clearing',
  },
  {
    chequeNo: 'CHQ-99203',
    payee: 'MedEquip Express Mobility Vans Fleet Maintenance',
    bankAccount: 'HDFC Enterprise (•••• 5520)',
    amount: 9400,
    date: '2026-09-13',
    type: 'Issued',
    status: 'In Clearing',
  },
  {
    chequeNo: 'CHQ-99204',
    payee: 'Global Clinical Compliance & Legal Retainer',
    bankAccount: 'Standard Chartered (•••• 9041)',
    amount: 18000,
    date: '2026-09-14',
    type: 'Issued',
    status: 'Cleared',
  },
];

const UPCOMING_CHEQUES: ChequeRecord[] = [
  {
    chequeNo: 'CHQ-99205',
    payee: 'Q3 Enterprise EHR Security Audit Partners',
    bankAccount: 'JPMorgan Chase (•••• 8492)',
    amount: 22000,
    date: '2026-09-18',
    type: 'Upcoming',
    status: 'Scheduled',
  },
  {
    chequeNo: 'CHQ-99206',
    payee: 'Regional Hospital Network Integration CapEx',
    bankAccount: 'Goldman Sachs (•••• 3128)',
    amount: 65000,
    date: '2026-09-24',
    type: 'Upcoming',
    status: 'Pending Approval',
  },
  {
    chequeNo: 'CHQ-99207',
    payee: 'Quarterly Staff Incentive & Doctor Advocate Bonus',
    bankAccount: 'SVB / First Citizens (•••• 6714)',
    amount: 42800,
    date: '2026-09-30',
    type: 'Upcoming',
    status: 'Scheduled',
  },
];

export default function CashFlowPage() {
  const navigate = useNavigate();
  const { monthlyRows, recurringExpenses } = useDashboard();
  const [chequeView, setChequeView] = useState<'issued' | 'upcoming'>('issued');

  const totalMonthlyRecurring = useMemo(
    () => recurringExpenses.reduce((acc, r) => acc + r.monthly, 0),
    [recurringExpenses],
  );

  const cashFlowData = useMemo(() => {
    return monthlyRows.map((m) => {
      const inflow = (m.subRev || 0) + (m.adRev || 0);
      const outflow = inflow * 0.45 + totalMonthlyRecurring * 0.5;
      const netCash = inflow - outflow;
      return {
        month: m.month,
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        netCash: Math.round(netCash),
        margin: inflow > 0 ? ((netCash / inflow) * 100).toFixed(1) : '0.0',
      };
    });
  }, [monthlyRows, totalMonthlyRecurring]);

  const latestCF = cashFlowData[cashFlowData.length - 1] || { inflow: 241300, outflow: 91500, netCash: 149800, margin: '62.1' };
  const totalInflows = cashFlowData.reduce((acc, c) => acc + c.inflow, 0);
  const totalOutflows = cashFlowData.reduce((acc, c) => acc + c.outflow, 0);
  const totalNetCash = totalInflows - totalOutflows;

  const chartData = {
    labels: cashFlowData.map((c) => c.month),
    datasets: [
      {
        label: 'Gross Inflows (₹)',
        data: cashFlowData.map((c) => c.inflow),
        backgroundColor: 'rgba(37, 99, 235, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Disbursements & OPEX (₹)',
        data: cashFlowData.map((c) => c.outflow),
        backgroundColor: 'rgba(220, 38, 38, 0.75)',
        borderRadius: 6,
      },
      {
        label: 'Net Cash Flow (₹)',
        data: cashFlowData.map((c) => c.netCash),
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

  const totalBankBalance = BANK_ACCOUNTS.reduce((acc, b) => acc + b.balance, 0);

  return (
    <div id="mis-dashboard-capture">
      {/* Header Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button type="button" onClick={() => navigate('/')} className="mis-btn-action">
          <i className="fas fa-arrow-left" /> Back to Dashboard
        </button>
        <h2 style={{ fontSize: '20px', color: 'var(--admin-text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-money-bill-wave" style={{ color: 'var(--admin-primary)' }} />
          Cash Flow &amp; Liquidity Operations Detail View
        </h2>
      </div>

      {/* Top 4 Domain KPI Cards */}
      <div className="mis-kpi-grid">
        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-money-bill-wave" />
            </span>
            Monthly Net Cash Flow
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>
            ₹{latestCF.netCash.toLocaleString()}
          </div>
          <div className="mis-kpi-sub">Latest month net balance</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon">
              <i className="fas fa-hand-holding-usd" />
            </span>
            Total Collections
          </div>
          <div className="mis-kpi-value">₹{latestCF.inflow.toLocaleString()}</div>
          <div className="mis-kpi-sub">Gross customer &amp; client inflows</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <i className="fas fa-receipt" />
            </span>
            Total Disbursements
          </div>
          <div className="mis-kpi-value" style={{ color: '#dc2626' }}>
            ₹{latestCF.outflow.toLocaleString()}
          </div>
          <div className="mis-kpi-sub">Operational OPEX &amp; vendor payouts</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <i className="fas fa-building-columns" />
            </span>
            Total Liquid Bank Balance
          </div>
          <div className="mis-kpi-value">₹{totalBankBalance.toLocaleString()}</div>
          <div className="mis-kpi-sub">Across 5 institutional accounts</div>
        </div>
      </div>

      {/* Cash Flow Trends Chart */}
      <div className="mis-panel" style={{ marginBottom: 24 }}>
        <div className="mis-section-title">
          <i className="fas fa-chart-bar" style={{ color: 'var(--admin-primary)' }} /> Multi-Month Inflow vs. Outflow Cash Trajectory
        </div>
        <div className="mis-formula-note">
          Monthly Net Cash Flow = (Subscription Inflows + Marketplace Take Rate) − (Fixed Facilities + Payroll OPEX + Diagnostic EMIs)
        </div>
        <div className="mis-chart-container" style={{ height: 320 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Bank Account Balances Grid */}
      <div className="mis-panel" style={{ marginBottom: 24 }}>
        <div className="mis-section-title">
          <i className="fas fa-university" style={{ color: 'var(--admin-primary)' }} /> Corporate Banking &amp; Treasury Balances
        </div>
        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Account Name</th>
                <th>Bank Institution</th>
                <th>Account Number</th>
                <th>Account Classification</th>
                <th>Liquid Balance (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {BANK_ACCOUNTS.map((acc) => (
                <tr key={acc.id}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{acc.id}</td>
                  <td style={{ fontWeight: 600 }}>{acc.name}</td>
                  <td>{acc.bank}</td>
                  <td><code>{acc.accountNumber}</code></td>
                  <td>{acc.accountType}</td>
                  <td style={{ fontWeight: 700 }}>₹{acc.balance.toLocaleString()}</td>
                  <td>
                    <span className={`mis-tag ${acc.status === 'Primary' || acc.status === 'Active' ? 'mis-tag-green' : acc.status === 'Escrow' ? 'mis-tag-blue' : 'mis-tag-amber'}`}>
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cheques & Payment Disbursements Schedule */}
      <div className="mis-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="mis-section-title" style={{ margin: 0 }}>
            <i className="fas fa-money-check-dollar" style={{ color: 'var(--admin-primary)' }} /> Cheque Clearance &amp; Payment Disbursements
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setChequeView('issued')}
              className={`mis-btn-action ${chequeView === 'issued' ? 'mis-btn-action-primary' : ''}`}
            >
              Issued Cheques ({CHEQUES_ISSUED.length})
            </button>
            <button
              type="button"
              onClick={() => setChequeView('upcoming')}
              className={`mis-btn-action ${chequeView === 'upcoming' ? 'mis-btn-action-primary' : ''}`}
            >
              Upcoming Scheduled ({UPCOMING_CHEQUES.length})
            </button>
          </div>
        </div>

        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Cheque No.</th>
                <th>Payee Beneficiary</th>
                <th>Disbursing Bank Account</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Clearance Status</th>
              </tr>
            </thead>
            <tbody>
              {(chequeView === 'issued' ? CHEQUES_ISSUED : UPCOMING_CHEQUES).map((c) => (
                <tr key={c.chequeNo}>
                  <td style={{ fontWeight: 700 }}>{c.chequeNo}</td>
                  <td style={{ fontWeight: 600 }}>{c.payee}</td>
                  <td>{c.bankAccount}</td>
                  <td style={{ fontWeight: 700 }}>₹{c.amount.toLocaleString()}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`mis-tag ${c.status === 'Cleared' ? 'mis-tag-green' : c.status === 'In Clearing' ? 'mis-tag-amber' : c.status === 'Scheduled' ? 'mis-tag-blue' : 'mis-tag-red'}`}>
                      {c.status}
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
