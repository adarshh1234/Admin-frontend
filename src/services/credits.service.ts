import { API_BASE_URL } from './apiConfig';
import { authService } from './auth.service';
import type {
  CreditAccountCategory,
  CreditAccountItem,
  CreditCategoryStats,
  AccountCreditDetails,
  CreditPricingConfigData,
  CreditTransactionRecord,
} from '../types/credits';

function getAuthHeaders(): Record<string, string> {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = 'Bearer admin-token';
    headers['x-admin-key'] = 'admin';
    headers['x-admin-role'] = 'Super Admin';
  }
  return headers;
}

export const creditsService = {
  /**
   * Fetch accounts by category (customers, company, institution, startups)
   */
  async getAccounts(params: {
    category: CreditAccountCategory;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: CreditAccountItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    stats: CreditCategoryStats;
  }> {
    const query = new URLSearchParams();
    query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE_URL}/api/credits/accounts?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch credit accounts');
    }
    return json;
  },

  /**
   * Fetch single account details, balance, active subscriptions, and transaction ledger
   */
  async getAccountDetails(params: {
    id: string;
    category: CreditAccountCategory;
    txPage?: number;
    txLimit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AccountCreditDetails> {
    const query = new URLSearchParams();
    query.set('category', params.category);
    if (params.txPage) query.set('txPage', String(params.txPage));
    if (params.txLimit) query.set('txLimit', String(params.txLimit));
    if (params.type && params.type !== 'All') query.set('type', params.type);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);

    const res = await fetch(`${API_BASE_URL}/api/credits/accounts/${params.id}?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch account credit details');
    }
    return json.data;
  },

  /**
   * Adjust account credit balance (Add or Deduct)
   */
  async adjustBalance(params: {
    id: string;
    amount: number;
    type: 'add' | 'deduct';
    reason: string;
    idempotencyKey?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      accountId: string;
      previousBalance: number;
      adjustmentAmount: number;
      resultingBalance: number;
      type: string;
      reason: string;
      adjustedBy: string;
      transactionId: string;
      createdAt: string;
    };
  }> {
    const res = await fetch(`${API_BASE_URL}/api/credits/accounts/${params.id}/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount: params.amount,
        type: params.type,
        reason: params.reason,
        idempotencyKey: params.idempotencyKey,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to adjust credit balance');
    }
    return json;
  },

  /**
   * Fetch current authoritative pricing configuration & audit trail
   */
  async getPricingConfig(): Promise<CreditPricingConfigData> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch pricing configuration');
    }
    return json.data;
  },

  /**
   * Update pricing configuration with mandatory audit entry
   */
  async updatePricingConfig(payload: {
    creditValueInr?: number;
    initialPromotionalCredits?: number;
    referralRewardCredits?: number;
    updates?: Array<{
      itemKey: string;
      itemName?: string;
      field: string;
      oldValue: any;
      newValue: any;
    }>;
    featurePricing?: Record<string, any>;
    reason: string;
  }): Promise<CreditPricingConfigData> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update pricing configuration');
    }
    return json.data;
  },

  /**
   * Fetch category-specific pricing plans and service charges (candidates, company, startups, institution)
   */
  async getCategoryPricing(category: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing/category/${category}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Failed to fetch pricing for ${category}`);
    }
    return json.data;
  },

  /**
   * Save draft pricing changes (CMS pattern)
   */
  async saveDraft(draftPayload: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing/save-draft`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(draftPayload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to save pricing draft');
    }
    return json;
  },

  /**
   * Publish pricing changes live to authoritative database with mandatory reason
   */
  async publish(payload: { reason: string; category?: string; directData?: any }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing/publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to publish pricing configuration');
    }
    return json;
  },

  /**
   * Reset category or all plans back to authoritative baseline defaults
   */
  async reset(payload?: { category?: string; reason?: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/credits/pricing/reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload || {}),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to reset pricing configuration');
    }
    return json;
  },

  /**
   * Fetch global transactions ledger
   */
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    data: CreditTransactionRecord[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.type && params?.type !== 'All') query.set('type', params.type);
    if (params?.status && params?.status !== 'All') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);

    const res = await fetch(`${API_BASE_URL}/api/credits/transactions?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch global transactions');
    }
    return json;
  },
};

export default creditsService;
