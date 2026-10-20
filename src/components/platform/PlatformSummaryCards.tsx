import type { UserSummaryStats } from '../../types/platformUsers';

interface PlatformSummaryCardsProps {
  stats: UserSummaryStats;
  entityName: string; // e.g., 'Candidates', 'Startups', 'Companies', 'Institutions'
  icon: string;
}

export function PlatformSummaryCards({ stats, entityName, icon }: PlatformSummaryCardsProps) {
  const cards = [
    {
      title: `Total ${entityName}`,
      value: stats.total,
      icon: icon || 'fa-users',
      bg: '#eff6ff',
      color: '#2563eb',
      sub: 'All registered records',
    },
    {
      title: 'Active Accounts',
      value: stats.active,
      icon: 'fa-check-circle',
      bg: '#f0fdf4',
      color: '#16a34a',
      sub: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total`,
    },
    {
      title: 'Pending Verification',
      value: stats.pending,
      icon: 'fa-hourglass-half',
      bg: '#fefce8',
      color: '#ca8a04',
      sub: 'Action required',
    },
    {
      title: 'Suspended',
      value: stats.suspended,
      icon: 'fa-ban',
      bg: '#fef2f2',
      color: '#dc2626',
      sub: 'Restricted access',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 20,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          className="panel"
          style={{
            padding: '18px 20px',
            borderRadius: 14,
            border: '1px solid #e9edf4',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{c.title}</span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: c.bg,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              <i className={`fas ${c.icon}`} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
