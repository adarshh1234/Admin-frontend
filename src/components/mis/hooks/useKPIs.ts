import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';

export function useKPIs() {
  const {
    dailyRows,
    monthlyRows,
    staffData,
    openPositionsData,
    crmDeals,
    duesData,
    annualRows,
    recurringExpenses,
    marketingData,
    expansionData,
    kpis,
  } = useDashboard();

  return useMemo(() => {
    if (kpis) {
      return {
        dau: kpis.dau,
        mau: kpis.mau,
        totalStaff: kpis.totalStaff,
        openPositions: kpis.openPositions,
        pipeline: Math.round(kpis.pipeline),
        overdue: kpis.overdue,
        margin: String(kpis.margin),
        recurringTotal: kpis.recurringTotal,
        overallMktRoi: String(kpis.overallMktRoi),
        highPotential: kpis.highPotential,
        cashFlow: kpis.cashFlow,
        rois: String(kpis.rois),
        assets: kpis.assets,
        liquidity: kpis.liquidity,
        revenue: kpis.revenue,
      };
    }

    const lastDaily = dailyRows[dailyRows.length - 1];
    const dau = lastDaily ? lastDaily.dau : 0;

    const lastMonthly = monthlyRows[monthlyRows.length - 1];
    const mau = lastMonthly ? lastMonthly.mau : 0;

    const totalStaff = staffData.length;
    const openPositions = openPositionsData?.length || dailyRows.reduce((acc, r) => acc + r.postings, 0);

    const openDeals = crmDeals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
    const pipeline = openDeals.reduce((acc, d) => acc + d.value * d.probability, 0);

    const overdue = duesData.filter((d) => d.status === 'Overdue').reduce((acc, d) => acc + d.amount, 0);

    const lastAnnual = annualRows[annualRows.length - 1];
    const margin = lastAnnual ? ((lastAnnual.revenue - lastAnnual.opex) / lastAnnual.revenue) * 100 : 0;

    const recurringTotal = recurringExpenses.reduce((acc, r) => acc + r.monthly, 0);

    const totalMktSpend = marketingData.reduce((acc, m) => acc + m.spend, 0);
    const totalMktRev = marketingData.reduce((acc, m) => acc + m.revenue, 0);
    const overallMktRoi = totalMktSpend ? ((totalMktRev - totalMktSpend) / totalMktSpend) * 100 : 0;

    const highPotential = expansionData.filter((e) => e.currentRevenue + e.potentialRevenue > 1500000).length;

    const monthlyRev = lastMonthly ? (lastMonthly.subRev + lastMonthly.adRev) : 400000;
    const monthlyNetCashFlow = monthlyRev - recurringTotal;
    const totalAssets = 2112000;
    const totalLiquidity = 1669000;
    const overallReturn = 22.5;

    return {
      dau,
      mau,
      totalStaff,
      openPositions,
      pipeline: Math.round(pipeline),
      overdue,
      margin: margin.toFixed(1),
      recurringTotal,
      overallMktRoi: overallMktRoi.toFixed(1),
      highPotential,
      cashFlow: monthlyNetCashFlow,
      rois: overallReturn.toFixed(1),
      assets: totalAssets,
      liquidity: totalLiquidity,
      revenue: monthlyRev,
    };
  }, [
    kpis,
    dailyRows,
    monthlyRows,
    staffData,
    openPositionsData,
    crmDeals,
    duesData,
    annualRows,
    recurringExpenses,
    marketingData,
    expansionData,
  ]);
}
