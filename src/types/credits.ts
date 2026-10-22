export type CreditAccountCategory = 'customers' | 'company' | 'institution' | 'startups';

export interface CreditAccountItem {
  id: string;
  accountId: string;
  userId?: string | null;
  orgId?: string | null;
  category: 'Customers' | 'Company' | 'Institution' | 'Startup';
  name: string;
  email: string;
  phone?: string;
  role: string;
  industry?: string;
  accountStatus: string;
  balance: number;
  referralCode?: string;
  activeSubscription?: {
    planName: string;
    billingCycle: string;
    expiresAt: string;
  } | null;
  createdAt?: string;
}

export interface CreditCategoryStats {
  totalAccounts: number;
  circulatingCredits: number;
  activeSubscriptions: number;
}

export interface CreditTransactionRecord {
  _id: string;
  orgId?: any;
  userId?: any;
  type: 'purchase' | 'spend' | 'grant' | 'referral' | 'refund';
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  feature?: string;
  reason: string;
  orderId?: string;
  paymentId?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

export interface UserSubscriptionRecord {
  _id: string;
  planId: string;
  planName: string;
  billingCycle: string;
  creditsIncluded: number;
  priceInr: number;
  startDate: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'cancelled';
  orderId?: string;
}

export interface AccountCreditDetails {
  id: string;
  name: string;
  email: string;
  category: string;
  balance: number;
  referralCode?: string;
  promotionalGranted?: boolean;
  subscriptions: UserSubscriptionRecord[];
  transactions: CreditTransactionRecord[];
  paymentOrders: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeaturePriceItem {
  id: string;
  name: string;
  chargingUnit: string;
  credits: number;
  priceInr: number;
  category: string;
  description?: string;
}

export interface PricingAuditEntry {
  _id?: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  itemKey: string;
  itemName: string;
  field: string;
  previousValue: any;
  newValue: any;
  reason: string;
  timestamp: string;
}

export interface CreditPricingConfigData {
  creditValueInr: number;
  initialPromotionalCredits: number;
  referralRewardCredits: number;
  creditPacks: Array<{
    id: string;
    name: string;
    credits: number;
    priceInr: number;
    popular?: boolean;
  }>;
  featurePricing: FeaturePriceItem[] | Record<string, FeaturePriceItem>;
  subscriptionPlans: Array<any>;
  candidatePlans?: PlanCategoryGroup[];
  companyPlans?: PlanCategoryGroup[];
  startupPlans?: PlanCategoryGroup[];
  institutionPlans?: PlanCategoryGroup[];
  status?: 'published' | 'draft';
  draftData?: any;
  auditLog: PricingAuditEntry[];
  lastUpdatedBy?: string;
  lastUpdatedByRole?: string;
  updatedAt?: string;
}

export interface PlanServiceItem {
  id: string;
  name: string;
  chargingUnit: string;
  credits: number;
  priceInr: number;
  category: string;
  description?: string;
  active?: boolean;
  caseByCase?: boolean;
  durationDays?: number;
  providerFeeNote?: string;
  actionUrl?: string;
}

export interface PlanCategoryGroup {
  id: string;
  title: string;
  description: string;
  items: PlanServiceItem[];
}

export interface SubscriptionDurationTier {
  credits: number;
  priceInr: number;
  days: number;
}

export interface SubscriptionPlanDetail {
  id: string;
  name: string;
  targetRole: string;
  category?: string;
  active?: boolean;
  durations: {
    monthly: SubscriptionDurationTier;
    six_months: SubscriptionDurationTier;
    yearly: SubscriptionDurationTier;
  };
  features: string[];
}

export interface CategoryPricingData {
  category: string;
  creditValueInr: number;
  initialPromotionalCredits: number;
  referralRewardCredits: number;
  status: 'published' | 'draft';
  hasDraft: boolean;
  plans: PlanCategoryGroup[];
  subscriptions: SubscriptionPlanDetail[];
}
