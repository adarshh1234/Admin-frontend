import { API_BASE_URL } from './apiConfig';
import { authService } from './auth.service';
import type {
  DailyRow,
  WeeklyRow,
  MonthlyRow,
  AnnualRow,
  StaffMember,
  CRMDeal,
  DueItem,
  RecurringExpense,
  TaxLegalItem,
  MarketingChannel,
  SocialMediaPlatform,
  ExpansionMarket,
  Targets,
  AISuggestion,
  AIIssue,
  TotalStaffDetail,
  OpenPositionDetail,
} from '../components/mis/types';

export interface MISKPIData {
  dau: number;
  mau: number;
  totalStaff: number;
  openPositions: number;
  pipeline: number;
  overdue: number;
  margin: number;
  recurringTotal: number;
  overallMktRoi: number;
  highPotential: number;
  cashFlow: number;
  rois: number;
  assets: number;
  liquidity: number;
  revenue: number;
}

export interface MISDashboardResponse {
  kpis: MISKPIData;
  dailyRows: DailyRow[];
  weeklyRows: WeeklyRow[];
  monthlyRows: MonthlyRow[];
  annualRows: AnnualRow[];
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
  targets: Targets;
}

export const misService = {
  /**
   * Fetch complete live MIS dashboard data
   */
  async getDashboardData(period: string = 'monthly'): Promise<MISDashboardResponse | null> {
    try {
      const headers = authService.getAuthHeaders();
      let response = await fetch(`${API_BASE_URL}/api/mis/overview?period=${encodeURIComponent(period)}`, {
        headers,
      });

      if (!response.ok) {
        // Fallback to public summary if unauthorized or legacy preview
        response = await fetch(`${API_BASE_URL}/api/mis/public-summary?period=${encodeURIComponent(period)}`);
      }

      if (!response.ok) {
        throw new Error(`MIS API responded with status ${response.status}`);
      }

      const json = await response.json();
      if (json.success && json.data) {
        return json.data as MISDashboardResponse;
      }
      return null;
    } catch (err) {
      console.warn('Failed to fetch real MIS data from backend, falling back to local defaults:', err);
      return null;
    }
  },
};

export default misService;
