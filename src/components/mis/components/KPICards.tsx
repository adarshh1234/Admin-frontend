import { useNavigate } from 'react-router-dom';
import { useKPIs } from '../hooks/useKPIs';

export default function MISKPICards() {
  const k = useKPIs();
  const navigate = useNavigate();

  return (
    <section className="mis-kpi-grid" id="mis-kpiContainer">
      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/daily-active-users')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-chart-line" /></span> Daily Active Users
          </div>
        </div>
        <div className="mis-kpi-value">{k.dau.toLocaleString()}</div>
        <div className="mis-kpi-sub">Latest day</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/monthly-active-users')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-users" /></span> Monthly Active Users
          </div>
        </div>
        <div className="mis-kpi-value">{k.mau.toLocaleString()}</div>
        <div className="mis-kpi-sub">Latest month</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/total-staff')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-id-badge" /></span> Total Staff
          </div>
        </div>
        <div className="mis-kpi-value">{k.totalStaff}</div>
        <div className="mis-kpi-sub">Active employees</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/open-positions')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-briefcase" /></span> Open Positions
          </div>
        </div>
        <div className="mis-kpi-value">{k.openPositions.toLocaleString()}</div>
        <div className="mis-kpi-sub">Active job postings</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/pipeline-value')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-funnel-dollar" /></span> Pipeline Value
          </div>
        </div>
        <div className="mis-kpi-value">${k.pipeline.toLocaleString()}</div>
        <div className="mis-kpi-sub">CRM open deals</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/overdue-dues')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><i className="fas fa-exclamation-triangle" /></span> Overdue Dues
          </div>
        </div>
        <div className="mis-kpi-value" style={{ color: '#dc2626' }}>${k.overdue.toLocaleString()}</div>
        <div className="mis-kpi-sub">Accounts payable</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/net-profit-margin')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}><i className="fas fa-percentage" /></span> Net Profit Margin
          </div>
        </div>
        <div className="mis-kpi-value" style={{ color: '#16a34a' }}>{k.margin}%</div>
        <div className="mis-kpi-sub">Annual latest</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/recurring-expenses')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-file-invoice-dollar" /></span> Recurring Expenses
          </div>
        </div>
        <div className="mis-kpi-value">${k.recurringTotal.toLocaleString()}</div>
        <div className="mis-kpi-sub">Monthly total</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/marketing-roi')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-bullhorn" /></span> Marketing ROI
          </div>
        </div>
        <div className="mis-kpi-value">{k.overallMktRoi}%</div>
        <div className="mis-kpi-sub">Overall</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/high-potential-markets')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-globe" /></span> Expansion Markets
          </div>
        </div>
        <div className="mis-kpi-value">{k.highPotential}</div>
        <div className="mis-kpi-sub">High potential tiers</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/cash-flow')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-money-bill-wave" /></span> Cash Flow
          </div>
        </div>
        <div className="mis-kpi-value">₹{k.cashFlow.toLocaleString()}</div>
        <div className="mis-kpi-sub">Monthly Net Cash Flow</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/rois')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon" style={{ background: '#d1fae5', color: '#16a34a' }}><i className="fas fa-percentage" /></span> ROIs
          </div>
        </div>
        <div className="mis-kpi-value" style={{ color: '#16a34a' }}>{k.rois}%</div>
        <div className="mis-kpi-sub">Overall Return</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/assets')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-boxes" /></span> Assets
          </div>
        </div>
        <div className="mis-kpi-value">₹{k.assets.toLocaleString()}</div>
        <div className="mis-kpi-sub">Total Assets</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/liquidity')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-hand-holding-usd" /></span> Liquidity
          </div>
        </div>
        <div className="mis-kpi-value">₹{k.liquidity.toLocaleString()}</div>
        <div className="mis-kpi-sub">Available Liquidity</div>
      </div>

      <div className="mis-kpi-card mis-kpi-card-interactive" onClick={() => navigate('/revenue')}>
        <div className="mis-kpi-header">
          <div className="mis-kpi-label">
            <span className="mis-kpi-icon"><i className="fas fa-chart-line" /></span> Revenue
          </div>
        </div>
        <div className="mis-kpi-value">₹{k.revenue.toLocaleString()}</div>
        <div className="mis-kpi-sub">Current Period Revenue</div>
      </div>
    </section>
  );
}
