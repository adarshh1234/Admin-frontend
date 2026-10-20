import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';

interface CorporateAsset {
  tag: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  depreciatedValue: number;
  location: string;
  status: 'Optimal' | 'In Use' | 'Maintenance' | 'Active';
}

const ASSET_RECORDS: CorporateAsset[] = [
  {
    tag: 'AST-CLINIC-01',
    name: 'Diagnostic AI Cloud Server Clusters (8x H100 Nodes)',
    category: 'IT Infrastructure',
    purchaseDate: '2023-05-10',
    purchaseValue: 240000,
    depreciatedValue: 185000,
    location: 'AWS Cloud & Hybrid Data Center',
    status: 'Optimal',
  },
  {
    tag: 'AST-MED-02',
    name: 'Teleconsultation HD Terminal Kits (120 Partner Units)',
    category: 'Medical Hardware',
    purchaseDate: '2024-01-15',
    purchaseValue: 180000,
    depreciatedValue: 152000,
    location: 'Network Partner Clinics',
    status: 'In Use',
  },
  {
    tag: 'AST-PAT-03',
    name: 'Proprietary Triage AI Algorithm Global Patents',
    category: 'Healthcare IP',
    purchaseDate: '2022-09-01',
    purchaseValue: 350000,
    depreciatedValue: 320000,
    location: 'USPTO / Global WIPO Registry',
    status: 'Active',
  },
  {
    tag: 'AST-SOFT-04',
    name: 'Enterprise EHR & HIPAA Core Architecture Database',
    category: 'Digital Software',
    purchaseDate: '2023-11-20',
    purchaseValue: 210000,
    depreciatedValue: 178000,
    location: 'Cloud Multi-Region Distributed',
    status: 'Optimal',
  },
  {
    tag: 'AST-FAC-05',
    name: 'Central Diagnostic Operations & Telehealth Hub',
    category: 'Central Facility',
    purchaseDate: '2023-03-01',
    purchaseValue: 580000,
    depreciatedValue: 410000,
    location: 'Corporate HQ Diagnostic Wing',
    status: 'Active',
  },
];

export default function AssetsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAssets = useMemo(() => {
    if (selectedCategory === 'all') return ASSET_RECORDS;
    return ASSET_RECORDS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const totalPurchaseValue = ASSET_RECORDS.reduce((acc, a) => acc + a.purchaseValue, 0);
  const totalDepreciatedValue = ASSET_RECORDS.reduce((acc, a) => acc + a.depreciatedValue, 0);
  const totalAccumulatedDepreciation = totalPurchaseValue - totalDepreciatedValue;

  const chartData = {
    labels: ASSET_RECORDS.map((a) => a.category),
    datasets: [
      {
        data: ASSET_RECORDS.map((a) => a.depreciatedValue),
        backgroundColor: ['#2563eb', '#16a34a', '#9333ea', '#d97706', '#0284c7'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
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
          <i className="fas fa-boxes" style={{ color: 'var(--admin-primary)' }} />
          Corporate Assets &amp; Infrastructure Detail View
        </h2>
      </div>

      {/* Top 4 Domain KPI Cards */}
      <div className="mis-kpi-grid">
        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon">
              <i className="fas fa-boxes" />
            </span>
            Total Asset Book Value
          </div>
          <div className="mis-kpi-value">₹{totalDepreciatedValue.toLocaleString()}</div>
          <div className="mis-kpi-sub">Net balance sheet valuation</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fas fa-shopping-cart" />
            </span>
            Historical Acquisition Cost
          </div>
          <div className="mis-kpi-value">₹{totalPurchaseValue.toLocaleString()}</div>
          <div className="mis-kpi-sub">Initial capital expenditure</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <i className="fas fa-arrow-trend-down" />
            </span>
            Accumulated Depreciation
          </div>
          <div className="mis-kpi-value" style={{ color: '#d97706' }}>
            ₹{totalAccumulatedDepreciation.toLocaleString()}
          </div>
          <div className="mis-kpi-sub">Scheduled book depreciation</div>
        </div>

        <div className="mis-kpi-card">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
              <i className="fas fa-check-circle" />
            </span>
            Active Asset Clusters
          </div>
          <div className="mis-kpi-value" style={{ color: '#16a34a' }}>
            {ASSET_RECORDS.length} Units
          </div>
          <div className="mis-kpi-sub">100% operational status</div>
        </div>
      </div>

      {/* Distribution Chart & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="mis-panel">
          <div className="mis-section-title">
            <i className="fas fa-chart-pie" style={{ color: 'var(--admin-primary)' }} /> Asset Valuation by Category
          </div>
          <div className="mis-chart-container" style={{ height: 260 }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="mis-panel">
          <div className="mis-section-title">
            <i className="fas fa-layer-group" style={{ color: 'var(--admin-primary)' }} /> Asset Category Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {ASSET_RECORDS.map((a) => (
              <div key={a.tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--admin-text-main)' }}>{a.name}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>{a.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--admin-primary)' }}>₹{a.depreciatedValue.toLocaleString()}</div>
                  <span className="mis-tag mis-tag-green" style={{ fontSize: 10 }}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Master Asset Register Table */}
      <div className="mis-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="mis-section-title" style={{ margin: 0 }}>
            <i className="fas fa-list" style={{ color: 'var(--admin-primary)' }} /> Enterprise Fixed &amp; Digital Asset Register
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
            <option value="all">All Asset Classes</option>
            <option value="IT Infrastructure">IT Infrastructure</option>
            <option value="Medical Hardware">Medical Hardware</option>
            <option value="Healthcare IP">Healthcare IP</option>
            <option value="Digital Software">Digital Software</option>
            <option value="Central Facility">Central Facility</option>
          </select>
        </div>

        <div className="mis-table-responsive">
          <table className="mis-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Description</th>
                <th>Category</th>
                <th>Acquisition Date</th>
                <th>Purchase Cost (₹)</th>
                <th>Depreciated Value (₹)</th>
                <th>Location / Registry</th>
                <th>Operational Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.tag}>
                  <td style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{asset.tag}</td>
                  <td style={{ fontWeight: 600 }}>{asset.name}</td>
                  <td>
                    <span className="mis-tag mis-tag-blue">{asset.category}</span>
                  </td>
                  <td>{asset.purchaseDate}</td>
                  <td>₹{asset.purchaseValue.toLocaleString()}</td>
                  <td style={{ fontWeight: 700 }}>₹{asset.depreciatedValue.toLocaleString()}</td>
                  <td>{asset.location}</td>
                  <td>
                    <span className={`mis-tag ${asset.status === 'Optimal' || asset.status === 'Active' ? 'mis-tag-green' : 'mis-tag-blue'}`}>
                      {asset.status}
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
