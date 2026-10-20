import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useToast } from '../../hooks/useToast';

interface AdCampaign {
  id: string;
  name: string;
  advertiser: string;
  placement: string;
  format: 'Banner 728x90' | 'Sidebar Card 300x250' | 'Top Sponsored Result' | 'In-Feed Native';
  budget: string;
  spent: string;
  impressions: number;
  clicks: number;
  ctr: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Pending Review' | 'Completed';
}

const INITIAL_ADS: AdCampaign[] = [
  {
    id: 'AD-101',
    name: 'Apollo Health Tech Hiring Blitz',
    advertiser: 'Apollo Health City',
    placement: 'Candidate Feed Banner',
    format: 'In-Feed Native',
    budget: '$4,500',
    spent: '$2,850',
    impressions: 48200,
    clicks: 1940,
    ctr: '4.02%',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'Active',
  },
  {
    id: 'AD-102',
    name: 'MediSync AI Series A Launch Spotlight',
    advertiser: 'MediSync AI',
    placement: 'Homepage Top Spotlight',
    format: 'Banner 728x90',
    budget: '$2,200',
    spent: '$2,200',
    impressions: 62400,
    clicks: 3120,
    ctr: '5.00%',
    startDate: '2026-08-15',
    endDate: '2026-09-10',
    status: 'Completed',
  },
  {
    id: 'AD-103',
    name: 'IIT Kharagpur Placement Summit 2026',
    advertiser: 'IIT Kharagpur',
    placement: 'Sidebar Widget Slot #1',
    format: 'Sidebar Card 300x250',
    budget: '$1,800',
    spent: '$950',
    impressions: 29500,
    clicks: 1180,
    ctr: '4.00%',
    startDate: '2026-09-05',
    endDate: '2026-09-25',
    status: 'Active',
  },
  {
    id: 'AD-104',
    name: 'TechMed Diagnostics Talent Outreach',
    advertiser: 'TechMed Diagnostics Global',
    placement: 'Search Top Sponsored Slot',
    format: 'Top Sponsored Result',
    budget: '$3,000',
    spent: '$450',
    impressions: 14200,
    clicks: 580,
    ctr: '4.08%',
    startDate: '2026-09-12',
    endDate: '2026-10-12',
    status: 'Active',
  },
  {
    id: 'AD-105',
    name: 'CyberShield Quantum Dev Challenge',
    advertiser: 'CyberShield Quantum',
    placement: 'Candidate Feed Banner',
    format: 'In-Feed Native',
    budget: '$1,500',
    spent: '$0',
    impressions: 0,
    clicks: 0,
    ctr: '0.00%',
    startDate: '2026-09-20',
    endDate: '2026-10-20',
    status: 'Pending Review',
  },
];

export function InPlatformPromotionPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'ad-management' | 'placements' | 'analytics'>('ad-management');
  const [ads, setAds] = useState<AdCampaign[]>(INITIAL_ADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // New Ad Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newAd, setNewAd] = useState<Partial<AdCampaign>>({
    name: '',
    advertiser: '',
    placement: 'Candidate Feed Banner',
    format: 'In-Feed Native',
    budget: '$2,000',
    status: 'Active',
  });

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(search.toLowerCase()) ||
      ad.advertiser.toLowerCase().includes(search.toLowerCase()) ||
      ad.placement.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalImpressions = ads.reduce((acc, ad) => acc + ad.impressions, 0);
  const totalClicks = ads.reduce((acc, ad) => acc + ad.clicks, 0);
  const activeCount = ads.filter((a) => a.status === 'Active').length;

  function handleCreateAd(e: React.FormEvent) {
    e.preventDefault();
    if (!newAd.name || !newAd.advertiser) {
      showToast('Ad Name and Advertiser are required.', 'error');
      return;
    }
    const created: AdCampaign = {
      id: `AD-${100 + ads.length + 1}`,
      name: newAd.name,
      advertiser: newAd.advertiser,
      placement: newAd.placement || 'Candidate Feed Banner',
      format: newAd.format || 'In-Feed Native',
      budget: newAd.budget || '$1,500',
      spent: '$0',
      impressions: 0,
      clicks: 0,
      ctr: '0.00%',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: (newAd.status as any) || 'Active',
    };
    setAds([created, ...ads]);
    showToast(`Ad campaign "${created.name}" created successfully.`, 'success');
    setModalOpen(false);
  }

  function handleToggleStatus(ad: AdCampaign) {
    const nextStatus = ad.status === 'Active' ? 'Paused' : 'Active';
    setAds(ads.map((a) => (a.id === ad.id ? { ...a, status: nextStatus } : a)));
    showToast(`Ad campaign status set to ${nextStatus}.`, 'info');
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this ad campaign?')) {
      setAds(ads.filter((a) => a.id !== id));
      showToast('Ad campaign removed.', 'info');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner Header */}
      <div
        className="panel"
        style={{
          padding: '24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0b1a33 0%, #1e3a8a 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 10px 25px rgba(6, 40, 79, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            <i className="fas fa-bullhorn" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              In Platform Promotion
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#93c5fd' }}>
              Manage in-platform promotions, sponsored banner placements, and advertisement performance.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            fontSize: 13,
          }}
        >
          <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Ad Campaign
        </Button>
      </div>

      {/* Internal Tabs Navigation */}
      <div className="tab-nav" style={{ marginBottom: 4 }}>
        <Button
          type="button"
          className={`tab-btn${activeTab === 'ad-management' ? ' active' : ''}`}
          onClick={() => setActiveTab('ad-management')}
        >
          <i className="fas fa-ad" style={{ marginRight: 6 }} /> Ad Management
        </Button>
        <Button
          type="button"
          className={`tab-btn${activeTab === 'placements' ? ' active' : ''}`}
          onClick={() => setActiveTab('placements')}
        >
          <i className="fas fa-layer-group" style={{ marginRight: 6 }} /> Banner Placement Slots
        </Button>
        <Button
          type="button"
          className={`tab-btn${activeTab === 'analytics' ? ' active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <i className="fas fa-chart-line" style={{ marginRight: 6 }} /> Impression Analytics
        </Button>
      </div>

      {/* TAB 1: AD MANAGEMENT */}
      {activeTab === 'ad-management' && (
        <>
          {/* Summary Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="panel" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e9edf4', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Total Campaigns</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  <i className="fas fa-ad" />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{ads.length}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Across all platform slots</div>
            </div>

            <div className="panel" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e9edf4', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Active Running Ads</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  <i className="fas fa-play-circle" />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{activeCount}</div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>Delivering impressions</div>
            </div>

            <div className="panel" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e9edf4', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Total Impressions</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  <i className="fas fa-eye" />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{totalImpressions.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{totalClicks.toLocaleString()} total clicks</div>
            </div>

            <div className="panel" style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid #e9edf4', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Avg. Platform CTR</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fefce8', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  <i className="fas fa-mouse-pointer" />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'}%
              </div>
              <div style={{ fontSize: 12, color: '#ca8a04', marginTop: 4 }}>High engagement rate</div>
            </div>
          </div>

          {/* Ad Management Table */}
          <div className="panel" style={{ padding: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid #e9edf4', background: '#ffffff' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9edf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ position: 'relative', width: 320 }}>
                <Input
                  type="text"
                  placeholder="Search ads by campaign, advertiser, placement…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 34, height: 38, width: '100%', fontSize: 13 }}
                />
                <i
                  className="fas fa-search"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: 8, border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: 12.5, background: '#ffffff' }}
                >
                  <option value="all">All Campaigns</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Campaign / Ad Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Advertiser</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Placement &amp; Format</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Budget / Spent</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Impressions</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>CTR</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#64748b' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                        No ad campaigns found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredAds.map((ad) => (
                      <tr
                        key={ad.id}
                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{ad.name}</div>
                          <div style={{ fontSize: 11.5, color: '#64748b' }}>ID: {ad.id} • {ad.startDate} to {ad.endDate}</div>
                        </td>

                        <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>
                          {ad.advertiser}
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ color: '#2563eb', fontWeight: 500 }}>{ad.placement}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{ad.format}</div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{ad.budget}</div>
                          <div style={{ fontSize: 11.5, color: '#16a34a' }}>Spent: {ad.spent}</div>
                        </td>

                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>
                          {ad.impressions.toLocaleString()}
                        </td>

                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0284c7' }}>
                          {ad.ctr}
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 10px',
                              borderRadius: 20,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background:
                                ad.status === 'Active'
                                  ? '#dcfce7'
                                  : ad.status === 'Paused'
                                  ? '#fef3c7'
                                  : ad.status === 'Completed'
                                  ? '#f1f5f9'
                                  : '#fee2e2',
                              color:
                                ad.status === 'Active'
                                  ? '#15803d'
                                  : ad.status === 'Paused'
                                  ? '#b45309'
                                  : ad.status === 'Completed'
                                  ? '#64748b'
                                  : '#b91c1c',
                            }}
                          >
                            <i
                              className={`fas ${
                                ad.status === 'Active'
                                  ? 'fa-play-circle'
                                  : ad.status === 'Paused'
                                  ? 'fa-pause-circle'
                                  : ad.status === 'Completed'
                                  ? 'fa-check-circle'
                                  : 'fa-clock'
                              }`}
                            />
                            {ad.status}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              title={ad.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                              onClick={() => handleToggleStatus(ad)}
                              style={{ padding: '4px 8px', fontSize: 12 }}
                            >
                              <i className={`fas ${ad.status === 'Active' ? 'fa-pause' : 'fa-play'}`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Campaign Analytics"
                              onClick={() => showToast(`Opening performance telemetry for ${ad.name}`, 'info')}
                              style={{ padding: '4px 8px', fontSize: 12, color: '#2563eb' }}
                            >
                              <i className="fas fa-chart-bar" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Delete Ad"
                              onClick={() => handleDelete(ad.id)}
                              style={{ padding: '4px 8px', fontSize: 12, color: '#dc2626' }}
                            >
                              <i className="fas fa-trash-alt" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PLACEMENTS */}
      {activeTab === 'placements' && (
        <div className="panel" style={{ padding: 24, borderRadius: 14, background: '#ffffff', border: '1px solid #e9edf4' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
            Active Platform Advertisement Slots
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { slot: 'Homepage Hero Banner', format: 'Leaderboard 728x90', price: '$850 / week', availability: 'Occupied by MediSync AI' },
              { slot: 'Candidate Feed In-Stream', format: 'Native Card 600x320', price: '$650 / week', availability: '2 Slots Available' },
              { slot: 'Sidebar Spotlight', format: 'Square 300x250', price: '$400 / week', availability: 'Occupied by IIT Kharagpur' },
              { slot: 'Search Top Sponsored Slot', format: 'Text & Pill Badge', price: '$500 / week', availability: '1 Slot Available' },
            ].map((p) => (
              <div key={p.slot} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{p.slot}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Format: {p.format}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{p.price}</span>
                  <span style={{ fontSize: 11.5, color: '#2563eb', fontWeight: 600 }}>{p.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="panel" style={{ padding: 24, borderRadius: 14, background: '#ffffff', border: '1px solid #e9edf4' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
            In-Platform Promotion Reach &amp; Conversion Telemetry
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: 13, color: '#64748b' }}>
            Aggregated monthly metrics across verified recruiters, campus drives, and candidate impressions.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Monthly Impressions</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>154,300</div>
              <div style={{ fontSize: 11.5, color: '#16a34a', marginTop: 4 }}>+18.4% vs last month</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Click-Throughs</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>6,820</div>
              <div style={{ fontSize: 11.5, color: '#16a34a', marginTop: 4 }}>+12.1% conversion rate</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Ad Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>$13,000</div>
              <div style={{ fontSize: 11.5, color: '#16a34a', marginTop: 4 }}>Target achieved (104%)</div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE AD MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                Create New Ad Campaign
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleCreateAd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Campaign / Ad Title *
                </label>
                <Input
                  required
                  value={newAd.name || ''}
                  onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                  placeholder="e.g. Fortis Healthcare Hiring Banner"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Advertiser Entity Name *
                </label>
                <Input
                  required
                  value={newAd.advertiser || ''}
                  onChange={(e) => setNewAd({ ...newAd, advertiser: e.target.value })}
                  placeholder="e.g. Fortis Hospitals Group"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Placement Slot
                  </label>
                  <select
                    value={newAd.placement || 'Candidate Feed Banner'}
                    onChange={(e) => setNewAd({ ...newAd, placement: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                  >
                    <option value="Candidate Feed Banner">Candidate Feed Banner</option>
                    <option value="Homepage Top Spotlight">Homepage Top Spotlight</option>
                    <option value="Sidebar Widget Slot #1">Sidebar Widget Slot #1</option>
                    <option value="Search Top Sponsored Slot">Search Top Sponsored Slot</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Ad Budget
                  </label>
                  <Input
                    value={newAd.budget || '$2,000'}
                    onChange={(e) => setNewAd({ ...newAd, budget: e.target.value })}
                    placeholder="$2,000"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fas fa-paper-plane" style={{ marginRight: 6 }} /> Launch Campaign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InPlatformPromotionPage;
