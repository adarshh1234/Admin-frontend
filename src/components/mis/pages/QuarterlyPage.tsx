import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../context/DashboardContext';
import type { MonthlyRow, QuarterlyRow } from '../types';

function buildQuarterlyRows(monthlyRows: MonthlyRow[]): QuarterlyRow[] {
  const qRows: QuarterlyRow[] = [];
  for (let q = 3; q >= 0; q--) {
    const months = monthlyRows.slice(q * 3, q * 3 + 3);
    if (!months.length) continue;
    const s = (key: keyof MonthlyRow) => months.reduce((acc, r) => acc + (r[key] as number), 0);
    const a = (key: keyof MonthlyRow) => (months.length ? s(key) / months.length : 0);
    qRows.push({
      quarter: `Q${4 - q}`,
      mauAvg: a('mau'),
      subRev: s('subRev'),
      adRev: s('adRev'),
      totalRev: s('subRev') + s('adRev'),
      qoq: null,
    });
  }
  qRows.forEach((row, idx) => {
    if (idx === 0) row.qoq = null;
    else {
      const prev = qRows[idx - 1];
      row.qoq = (((row.totalRev - prev.totalRev) / prev.totalRev) * 100).toFixed(1) + '%';
    }
  });
  return qRows;
}

export default function QuarterlyPage() {
  const { monthlyRows } = useDashboard();
  const quarterlyRows = useMemo(() => buildQuarterlyRows(monthlyRows), [monthlyRows]);

  const chartData = {
    labels: quarterlyRows.map((r) => r.quarter),
    datasets: [
      {
        label: 'Subscription Revenue ($)',
        data: quarterlyRows.map((r) => r.subRev),
        backgroundColor: '#1F3864',
      },
      {
        label: 'Ad Revenue ($)',
        data: quarterlyRows.map((r) => r.adRev),
        backgroundColor: '#7B93BC',
      },
      {
        label: 'Total Revenue ($)',
        data: quarterlyRows.map((r) => r.totalRev),
        backgroundColor: '#2E7D32',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: false },
      y: { stacked: false },
    },
  };

  const totalSub = quarterlyRows.reduce((acc, r) => acc + r.subRev, 0);
  const totalAd = quarterlyRows.reduce((acc, r) => acc + r.adRev, 0);
  const totalRev = quarterlyRows.reduce((acc, r) => acc + r.totalRev, 0);
  const avgMau = quarterlyRows.length
    ? Math.round(quarterlyRows.reduce((acc, r) => acc + r.mauAvg, 0) / quarterlyRows.length)
    : 0;

  return (
    <section id="tab-quarterly" className="mis-tab-panel">
      <div className="mis-section-title">Quarterly Sales Tracking — Executive Review</div>
      <div className="mis-section-desc">
        Consolidated quarterly sales performance, subscription vs ad revenues, and automated QoQ expansion metrics.
      </div>
      <div className="mis-formula-note">
        Total Revenue = Subscription Revenue + Ad Revenue · QoQ Growth = ((Current Quarter Total − Previous Quarter Total) ÷ Previous Quarter Total) × 100.
      </div>

      <div className="mis-chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mis-table-responsive">
        <table className="mis-table" id="mis-quarterlyTable">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>MAU (avg)</th>
              <th>Subscription Revenue ($)</th>
              <th>Ad Revenue ($)</th>
              <th>Total Revenue ($)</th>
              <th>QoQ Growth</th>
            </tr>
          </thead>
          <tbody>
            {quarterlyRows.map((row) => (
              <tr key={row.quarter}>
                <td style={{ fontWeight: 600 }}>{row.quarter}</td>
                <td>{Math.round(row.mauAvg).toLocaleString()}</td>
                <td style={{ color: '#1F3864', fontWeight: 600 }}>${row.subRev.toLocaleString()}</td>
                <td style={{ color: '#4b5563', fontWeight: 600 }}>${row.adRev.toLocaleString()}</td>
                <td style={{ color: '#2E7D32', fontWeight: 700 }}>${row.totalRev.toLocaleString()}</td>
                <td>
                  <span
                    className={
                      row.qoq && row.qoq.includes('-')
                        ? 'mis-tag mis-tag-red'
                        : row.qoq
                        ? 'mis-tag mis-tag-green'
                        : 'mis-tag'
                    }
                  >
                    {row.qoq || '— Base'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Consolidated Year Total</td>
              <td>avg {avgMau.toLocaleString()}</td>
              <td>${totalSub.toLocaleString()}</td>
              <td>${totalAd.toLocaleString()}</td>
              <td style={{ fontWeight: 800, color: '#2E7D32' }}>${totalRev.toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
