import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import type {
  DailyRow, WeeklyRow, MonthlyRow, AnnualRow, StaffMember, CRMDeal,
  DueItem, RecurringExpense, TaxLegalItem, MarketingChannel,
  SocialMediaPlatform, ExpansionMarket, TotalStaffDetail, OpenPositionDetail,
  AISuggestion, AIIssue,
} from '../types';
import {
  genDailyRows, genWeeklyRows, genMonthlyRows, initialAnnualRows,
  initialStaffData, initialCrmDeals, initialDuesData, initialRecurringExpenses,
  initialTaxLegal, initialMarketingData, initialSocialMediaData, initialExpansionData,
  targets as defaultTargets,
} from '../data/initialData';
import { mockTotalStaff, mockOpenPositions } from '../data/userData';
import { misService, type MISKPIData } from '../../../services/mis.service';

interface DashboardState {
  dailyRows: DailyRow[];
  setDailyRows: React.Dispatch<React.SetStateAction<DailyRow[]>>;
  weeklyRows: WeeklyRow[];
  setWeeklyRows: React.Dispatch<React.SetStateAction<WeeklyRow[]>>;
  monthlyRows: MonthlyRow[];
  setMonthlyRows: React.Dispatch<React.SetStateAction<MonthlyRow[]>>;
  annualRows: AnnualRow[];
  setAnnualRows: React.Dispatch<React.SetStateAction<AnnualRow[]>>;
  staffData: StaffMember[];
  totalStaffDetails: TotalStaffDetail[];
  openPositionsData: OpenPositionDetail[];
  crmDeals: CRMDeal[];
  duesData: DueItem[];
  recurringExpenses: RecurringExpense[];
  taxLegal: TaxLegalItem[];
  marketingData: MarketingChannel[];
  socialMediaData: SocialMediaPlatform[];
  expansionData: ExpansionMarket[];
  aiSuggestions: AISuggestion[];
  aiIssues: AIIssue[];
  targets: typeof defaultTargets;
  kpis: MISKPIData | null;
  loading: boolean;
  error: string | null;
  refreshData: (period?: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dailyRows, setDailyRows] = useState<DailyRow[]>(() => genDailyRows());
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>(() => genWeeklyRows());
  const [monthlyRows, setMonthlyRows] = useState<MonthlyRow[]>(() => genMonthlyRows());
  const [annualRows, setAnnualRows] = useState<AnnualRow[]>(() => initialAnnualRows);

  const [staffData, setStaffData] = useState<StaffMember[]>(() => initialStaffData);
  const [totalStaffDetails, setTotalStaffDetails] = useState<TotalStaffDetail[]>(() => mockTotalStaff as unknown as TotalStaffDetail[]);
  const [openPositionsData, setOpenPositionsData] = useState<OpenPositionDetail[]>(() => mockOpenPositions as unknown as OpenPositionDetail[]);
  const [crmDeals, setCrmDeals] = useState<CRMDeal[]>(() => initialCrmDeals);
  const [duesData, setDuesData] = useState<DueItem[]>(() => initialDuesData);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => initialRecurringExpenses);
  const [taxLegal, setTaxLegal] = useState<TaxLegalItem[]>(() => initialTaxLegal);
  const [marketingData, setMarketingData] = useState<MarketingChannel[]>(() => initialMarketingData);
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaPlatform[]>(() => initialSocialMediaData);
  const [expansionData, setExpansionData] = useState<ExpansionMarket[]>(() => initialExpansionData);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiIssues, setAiIssues] = useState<AIIssue[]>([]);
  const [targets, setTargets] = useState<typeof defaultTargets>(() => defaultTargets);
  const [kpis, setKpis] = useState<MISKPIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async (period: string = 'monthly') => {
    try {
      setLoading(true);
      setError(null);
      const data = await misService.getDashboardData(period);
      if (data) {
        if (data.dailyRows?.length) setDailyRows(data.dailyRows);
        if (data.weeklyRows?.length) setWeeklyRows(data.weeklyRows);
        if (data.monthlyRows?.length) setMonthlyRows(data.monthlyRows);
        if (data.annualRows?.length) setAnnualRows(data.annualRows);
        if (data.staffData?.length) setStaffData(data.staffData);
        if (data.totalStaffDetails?.length) setTotalStaffDetails(data.totalStaffDetails);
        if (data.openPositionsData?.length) setOpenPositionsData(data.openPositionsData);
        if (data.crmDeals?.length) setCrmDeals(data.crmDeals);
        if (data.duesData?.length) setDuesData(data.duesData);
        if (data.recurringExpenses?.length) setRecurringExpenses(data.recurringExpenses);
        if (data.taxLegal?.length) setTaxLegal(data.taxLegal);
        if (data.marketingData?.length) setMarketingData(data.marketingData);
        if (data.socialMediaData?.length) setSocialMediaData(data.socialMediaData);
        if (data.expansionData?.length) setExpansionData(data.expansionData);
        if (data.aiSuggestions?.length) setAiSuggestions(data.aiSuggestions);
        if (data.aiIssues?.length) setAiIssues(data.aiIssues);
        if (data.targets) setTargets(data.targets);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch live MIS data';
      setError(msg);
      console.error('Error refreshing MIS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData('monthly');
  }, [refreshData]);

  const value = useMemo<DashboardState>(() => ({
    dailyRows, setDailyRows,
    weeklyRows, setWeeklyRows,
    monthlyRows, setMonthlyRows,
    annualRows, setAnnualRows,
    staffData, totalStaffDetails, openPositionsData,
    crmDeals, duesData, recurringExpenses, taxLegal,
    marketingData, socialMediaData, expansionData,
    aiSuggestions, aiIssues,
    targets,
    kpis,
    loading,
    error,
    refreshData,
  }), [
    dailyRows, weeklyRows, monthlyRows, annualRows,
    staffData, totalStaffDetails, openPositionsData,
    crmDeals, duesData, recurringExpenses, taxLegal,
    marketingData, socialMediaData, expansionData,
    aiSuggestions, aiIssues,
    targets, kpis, loading, error, refreshData,
  ]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
