import React from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../../hooks/useToast';

const HR_STATS = [
  { title: 'Total Employees', value: '248 Active', icon: 'fa-users', color: '#2563eb', bg: '#eff6ff' },
  { title: 'On Leave Today', value: '6 Members', icon: 'fa-calendar-minus', color: '#d97706', bg: '#fef3c7' },
  { title: 'Open Requisitions', value: '14 Positions', icon: 'fa-user-plus', color: '#16a34a', bg: '#f0fdf4' },
  { title: 'Payroll Bandwidth', value: '$1.42M / mo', icon: 'fa-wallet', color: '#9333ea', bg: '#faf5ff' },
];

const LEAVE_REQUESTS = [
  { id: 1, name: 'Dr. Sarah Mitchell', dept: 'Clinical Ops', type: 'Annual Leave', dates: '18 Sep – 22 Sep (5 Days)', reason: 'Medical Conference Speaker' },
  { id: 2, name: 'David Chen', dept: 'Engineering', type: 'Casual Leave', dates: '16 Sep (1 Day)', reason: 'Personal Appointment' },
  { id: 3, name: 'Nisha Verma', dept: 'Product', type: 'Medical Leave', dates: '12 Sep – 15 Sep (4 Days)', reason: 'Recovery' },
];

export const HrmsTab: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {HR_STATS.map((s) => (
          <div key={s.title} className="panel" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7a99' }}>{s.title}</span>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: s.bg,
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className={`fas ${s.icon}`} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2540' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Leave Approvals and Roster */}
      <div className="panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2540', margin: 0 }}>
            <i className="fas fa-calendar-check" style={{ color: '#2563eb', marginRight: 8 }} />
            Pending Leave &amp; Attendance Requests
          </h3>
          <span className="tag-blue" style={{ fontSize: 11 }}>
            3 Pending Review
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                {['Staff Member', 'Department', 'Leave Type', 'Dates & Duration', 'Reason', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#6b7a99',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEAVE_REQUESTS.map((req) => (
                <tr
                  key={req.id}
                  style={{ borderBottom: '1px solid #f0f3fa', transition: 'background 0.12s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1a2540' }}>{req.name}</td>
                  <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: 500 }}>{req.dept}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {req.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{req.dates}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{req.reason}</td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ fontSize: 11, padding: '3px 10px', marginRight: 6 }}
                      onClick={() => showToast(`Approved leave request for ${req.name}`, 'success')}
                    >
                      <i className="fas fa-check" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ fontSize: 11, padding: '3px 10px', color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={() => showToast(`Declined leave request for ${req.name}`, 'error')}
                    >
                      <i className="fas fa-times" /> Decline
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
