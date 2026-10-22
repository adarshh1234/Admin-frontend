import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Loader } from '../common/Loader';
import { creditsService } from '../../services/credits.service';
import { CreditPlansPricingView } from './userManagement/CreditPlansPricingView';
import type {
  CreditAccountCategory,
  CreditAccountItem,
  CreditCategoryStats,
  AccountCreditDetails,
  CreditPricingConfigData,
  CreditTransactionRecord,
} from '../../types/credits';

export type CreditMgmtTab = CreditAccountCategory | 'pricing';

interface CreditManagementPageProps {
  onNavigateDashboard?: () => void;
  initialTab?: CreditMgmtTab;
}

export const CreditManagementPage: React.FC<CreditManagementPageProps> = ({ onNavigateDashboard, initialTab }) => {
  const { user: currentUser, isSuperAdmin, isAdmin } = useAuth();
  const { showToast } = useToast();

  // 5 Primary Tabs: 1. Customers, 2. Company, 3. Institution, 4. Startups, 5. Credit Plans & Pricing
  const [activeTab, setActiveTab] = useState<CreditMgmtTab>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const tabParam = new URLSearchParams(window.location.search).get('tab');
      if (tabParam === 'pricing' || tabParam === 'credit-pricing') return 'pricing';
      if (tabParam === 'customers' || tabParam === 'company' || tabParam === 'institution' || tabParam === 'startups') {
        return tabParam as CreditAccountCategory;
      }
    }
    return 'customers';
  });

  // Accounts state
  const [accounts, setAccounts] = useState<CreditAccountItem[]>([]);
  const [stats, setStats] = useState<CreditCategoryStats>({
    totalAccounts: 0,
    circulatingCredits: 0,
    activeSubscriptions: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [adjustingAccount, setAdjustingAccount] = useState<CreditAccountItem | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustAmount, setAdjustAmount] = useState<number | ''>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState<boolean>(false);
  const [showAdjustConfirm, setShowAdjustConfirm] = useState<boolean>(false);

  // Account Details & Ledger Drawer / Modal
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<AccountCreditDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [detailTxType, setDetailTxType] = useState<string>('All');
  const [detailTxStatus, setDetailTxStatus] = useState<string>('All');

  // Pricing & Configuration Modal
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [pricingConfig, setPricingConfig] = useState<CreditPricingConfigData | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState<boolean>(false);
  const [pricingActiveSubtab, setPricingActiveSubtab] = useState<'rules' | 'features' | 'audit'>('rules');
  const [editBaseValue, setEditBaseValue] = useState<number>(10);
  const [editPromoCredits, setEditPromoCredits] = useState<number>(20);
  const [editReferralCredits, setEditReferralCredits] = useState<number>(10);
  const [pricingUpdateReason, setPricingUpdateReason] = useState<string>('');
  const [isSavingPricing, setIsSavingPricing] = useState<boolean>(false);

  // Global Ledger Modal
  const [isGlobalLedgerOpen, setIsGlobalLedgerOpen] = useState<boolean>(false);
  const [globalTransactions, setGlobalTransactions] = useState<CreditTransactionRecord[]>([]);
  const [globalTxPagination, setGlobalTxPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [globalTxType, setGlobalTxType] = useState<string>('All');
  const [globalTxSearch, setGlobalTxSearch] = useState<string>('');
  const [isLoadingGlobalTx, setIsLoadingGlobalTx] = useState<boolean>(false);

  // Fetch accounts for active tab
  const fetchAccounts = useCallback(async () => {
    if (activeTab === 'pricing') return;
    setIsLoading(true);
    try {
      const res = await creditsService.getAccounts({
        category: activeTab,
        search,
        page: pagination.page,
        limit: pagination.limit,
      });
      setAccounts(res.data);
      setPagination(res.pagination);
      setStats(res.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load credit accounts', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, search, pagination.page, pagination.limit, showToast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Handle Tab Switch
  const handleTabChange = (tab: CreditMgmtTab) => {
    setActiveTab(tab);
    setSearch('');
    setStatusFilter('All');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Filter accounts in-memory by status if selected
  const filteredAccounts = useMemo(() => {
    if (statusFilter === 'All') return accounts;
    return accounts.filter((a) => a.accountStatus.toLowerCase() === statusFilter.toLowerCase());
  }, [accounts, statusFilter]);

  // Open Adjust Balance Modal
  const handleOpenAdjust = (account: CreditAccountItem) => {
    setAdjustingAccount(account);
    setAdjustType('add');
    setAdjustAmount('');
    setAdjustReason('');
    setShowAdjustConfirm(false);
  };

  // Submit Adjustment
  const handleConfirmAdjust = async () => {
    if (!adjustingAccount || !adjustAmount || adjustAmount <= 0) {
      showToast('Please enter a valid credit amount greater than 0', 'warning');
      return;
    }
    if (!adjustReason.trim() || adjustReason.trim().length < 3) {
      showToast('A mandatory reason is required (minimum 3 characters)', 'warning');
      return;
    }
    if (adjustType === 'deduct' && adjustingAccount.balance < adjustAmount) {
      showToast(
        `Cannot deduct ${adjustAmount} credits: account current balance is only ${adjustingAccount.balance}`,
        'error',
      );
      return;
    }

    setIsSubmittingAdjust(true);
    try {
      const idempotencyKey = `adj-${adjustingAccount.id}-${Date.now()}`;
      const res = await creditsService.adjustBalance({
        id: adjustingAccount.id,
        amount: Number(adjustAmount),
        type: adjustType,
        reason: adjustReason.trim(),
        idempotencyKey,
      });

      showToast(res.message, 'success');
      setAdjustingAccount(null);
      setShowAdjustConfirm(false);
      fetchAccounts();

      // If details drawer is open for this account, refresh it
      if (selectedAccountDetails && selectedAccountDetails.id === adjustingAccount.id) {
        handleOpenDetails(adjustingAccount);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust credit balance', 'error');
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  // Open Details & Ledger Drawer
  const handleOpenDetails = async (account: CreditAccountItem) => {
    setIsLoadingDetails(true);
    try {
      const detailsCategory: CreditAccountCategory =
        activeTab === 'pricing'
          ? ((account.category?.toLowerCase() as CreditAccountCategory) || 'customers')
          : activeTab;
      const details = await creditsService.getAccountDetails({
        id: account.id,
        category: detailsCategory,
        type: detailTxType,
        status: detailTxStatus,
      });
      setSelectedAccountDetails(details);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch account details', 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Refresh Account Details Ledger with filters
  const refreshAccountLedger = async (type: string, status: string) => {
    if (!selectedAccountDetails) return;
    setIsLoadingDetails(true);
    try {
      const detailsCategory: CreditAccountCategory =
        activeTab === 'pricing'
          ? ((selectedAccountDetails.category?.toLowerCase() as CreditAccountCategory) || 'customers')
          : activeTab;
      const details = await creditsService.getAccountDetails({
        id: selectedAccountDetails.id,
        category: detailsCategory,
        type,
        status,
      });
      setSelectedAccountDetails(details);
    } catch (err: any) {
      showToast(err.message || 'Failed to filter ledger', 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Open Pricing Modal
  const handleOpenPricingModal = async () => {
    setIsPricingModalOpen(true);
    setIsLoadingPricing(true);
    try {
      const config = await creditsService.getPricingConfig();
      setPricingConfig(config);
      setEditBaseValue(config.creditValueInr || 10);
      setEditPromoCredits(config.initialPromotionalCredits || 20);
      setEditReferralCredits(config.referralRewardCredits || 10);
      setPricingUpdateReason('');
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch pricing config', 'error');
    } finally {
      setIsLoadingPricing(false);
    }
  };

  // Save Pricing Changes
  const handleSavePricing = async () => {
    if (!pricingUpdateReason.trim() || pricingUpdateReason.trim().length < 3) {
      showToast('A mandatory reason is required to update credit pricing rules', 'warning');
      return;
    }
    if (editBaseValue < 1) {
      showToast('Base credit value must be at least ₹1', 'warning');
      return;
    }

    setIsSavingPricing(true);
    try {
      const updated = await creditsService.updatePricingConfig({
        creditValueInr: Number(editBaseValue),
        initialPromotionalCredits: Number(editPromoCredits),
        referralRewardCredits: Number(editReferralCredits),
        reason: pricingUpdateReason.trim(),
      });
      setPricingConfig(updated);
      showToast('Credit pricing rules updated successfully and recorded in audit log', 'success');
      setPricingUpdateReason('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update pricing rules', 'error');
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Open Global Ledger Modal
  const handleOpenGlobalLedger = async () => {
    setIsGlobalLedgerOpen(true);
    setIsLoadingGlobalTx(true);
    try {
      const res = await creditsService.getTransactions({
        page: globalTxPagination.page,
        limit: globalTxPagination.limit,
        type: globalTxType,
        search: globalTxSearch,
      });
      setGlobalTransactions(res.data);
      setGlobalTxPagination(res.pagination);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch global transactions', 'error');
    } finally {
      setIsLoadingGlobalTx(false);
    }
  };

  return (
    <div className="credit-management-page" style={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onNavigateDashboard && (
            <button
              type="button"
              onClick={onNavigateDashboard}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              title="Return to Dashboard"
            >
              <i className="fas fa-arrow-left" />
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #091e42, #0265c2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '18px',
                  boxShadow: '0 4px 12px rgba(2, 101, 194, 0.25)',
                }}
              >
                <i className="fas fa-coins" />
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#091e42',
                  letterSpacing: '-0.02em',
                }}
              >
                Credit Management
              </h1>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              {activeTab === 'pricing'
                ? 'Manage credit subscription plans, service charges, credit allocations, and pricing rules across account categories.'
                : isSuperAdmin
                ? 'System-wide governance of account credit balances, dynamic pricing, and transaction ledgers.'
                : 'Manage credit balances, evaluate transactions, and review billing allocations.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            id="globalLedgerBtn"
            variant="outline"
            onClick={handleOpenGlobalLedger}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
            }}
          >
            <i className="fas fa-receipt" style={{ color: '#0265c2' }} />
            <span>Global Ledger</span>
          </Button>

          <Button
            id="creditPricingBtn"
            variant="outline"
            onClick={handleOpenPricingModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
            }}
          >
            <i className="fas fa-sliders-h" style={{ color: '#7c3aed' }} />
            <span>Pricing & Service Rules</span>
          </Button>

          <Button
            id="refreshCreditsBtn"
            variant="primary"
            onClick={fetchAccounts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0b2546 0%, #0265c2 100%)',
              boxShadow: '0 4px 12px rgba(2, 101, 194, 0.25)',
            }}
          >
            <i className="fas fa-sync-alt" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── Five Primary Tabs (Customers, Company, Institution, Startups, Credit Plans & Pricing) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          id="tab-customers"
          onClick={() => handleTabChange('customers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'customers' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'customers' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'customers' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-user-graduate" />
          <span>1. Customers</span>
        </button>

        <button
          type="button"
          id="tab-company"
          onClick={() => handleTabChange('company')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'company' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'company' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'company' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-building" />
          <span>2. Company</span>
        </button>

        <button
          type="button"
          id="tab-institution"
          onClick={() => handleTabChange('institution')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'institution' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'institution' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'institution' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-university" />
          <span>3. Institution</span>
        </button>

        <button
          type="button"
          id="tab-startups"
          onClick={() => handleTabChange('startups')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'startups' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'startups' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'startups' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-rocket" />
          <span>4. Startups</span>
        </button>

        <button
          type="button"
          id="tab-pricing"
          onClick={() => handleTabChange('pricing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'pricing' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'pricing' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'pricing' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="fas fa-tags" />
          <span>5. Credit Plans & Pricing</span>
        </button>
      </div>

      {activeTab === 'pricing' ? (
        <CreditPlansPricingView />
      ) : (
        <>

      {/* ── KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        {/* Total Circulating Credits */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-coins" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Circulating Credits ({activeTab})
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.circulatingCredits.toLocaleString()}{' '}
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                (₹{(stats.circulatingCredits * 10).toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Total Accounts in Category */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-users" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Accounts ({activeTab})
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.totalAccounts.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-crown" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Active Subscriptions
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.activeSubscriptions.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Authoritative Base Exchange */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '18px 20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-balance-scale" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Standard Valuation
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              1 Credit = ₹10 <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>INR</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Input
              type="text"
              placeholder={`Search ${activeTab} by name, email, or ID...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              style={{ paddingLeft: '34px', borderRadius: '10px' }}
            />
            <i
              className="fas fa-search"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '13px',
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
          </select>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
          Showing {filteredAccounts.length} of {pagination.total} accounts
        </div>
      </div>

      {/* ── Accounts Table ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Loader />
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#64748b' }}>Loading credit accounts...</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#f1f5f9',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                margin: '0 auto 12px',
              }}
            >
              <i className="fas fa-folder-open" />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              No {activeTab} accounts found
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
              {search ? 'Try clearing your search filters.' : `No ${activeTab} accounts exist in the platform.`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafd', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Account & Name</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Contact Info</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Credit Balance</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Subscription / Plan</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fbfcfe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Account & Name */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #0265c2, #7c3aed)',
                            color: '#ffffff',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            flexShrink: 0,
                          }}
                        >
                          {(acc.name[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#091e42' }}>{acc.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                            ID: {acc.id.substring(0, 10)}... • {acc.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ color: '#334155', fontWeight: 500 }}>{acc.email}</div>
                      {acc.phone && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{acc.phone}</div>
                      )}
                    </td>

                    {/* Credit Balance */}
                    <td style={{ padding: '14px 18px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          background: acc.balance > 0 ? '#fef3c7' : '#fee2e2',
                          border: acc.balance > 0 ? '1px solid #fde68a' : '1px solid #fecaca',
                          color: acc.balance > 0 ? '#b45309' : '#dc2626',
                          fontWeight: 800,
                          fontSize: '13px',
                        }}
                      >
                        <i className="fas fa-coins" />
                        <span>{acc.balance} Credits</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontWeight: 500 }}>
                        ₹{(acc.balance * 10).toLocaleString()} INR
                      </div>
                    </td>

                    {/* Subscription / Plan */}
                    <td style={{ padding: '14px 18px' }}>
                      {acc.activeSubscription ? (
                        <div>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: '#ecfdf5',
                              color: '#059669',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            <i className="fas fa-check-circle" style={{ fontSize: '10px' }} />
                            <span>{acc.activeSubscription.planName}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            {acc.activeSubscription.billingCycle} • Exp:{' '}
                            {new Date(acc.activeSubscription.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Standard (No Active Sub)</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: acc.accountStatus === 'Active' ? '#f0fdf4' : '#fee2e2',
                          color: acc.accountStatus === 'Active' ? '#16a34a' : '#dc2626',
                          border: acc.accountStatus === 'Active' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                        }}
                      >
                        {acc.accountStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                          id={`adjust-btn-${acc.id}`}
                          className="adjust-balance-btn"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenAdjust(acc)}
                          style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '12px',
                          }}
                        >
                          <i className="fas fa-sliders-h" style={{ marginRight: '5px' }} />
                          Adjust Balance
                        </Button>

                        <Button
                          id={`ledger-btn-${acc.id}`}
                          className="view-ledger-btn"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDetails(acc)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: '#334155',
                          }}
                        >
                          <i className="fas fa-history" style={{ marginRight: '5px' }} />
                          Ledger
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#64748b',
            }}
          >
            <div>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* ── MODAL: Adjust Balance ── */}
      {adjustingAccount && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 30, 66, 0.54)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  <i className="fas fa-coins" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    Adjust Credit Balance
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                    {adjustingAccount.name} ({adjustingAccount.category})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingAccount(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Type Switcher */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Adjustment Operation
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: adjustType === 'add' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      background: adjustType === 'add' ? '#f0fdf4' : '#ffffff',
                      color: adjustType === 'add' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fas fa-plus-circle" />
                    <span>Add Credits (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: adjustType === 'deduct' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                      background: adjustType === 'deduct' ? '#fef2f2' : '#ffffff',
                      color: adjustType === 'deduct' ? '#b91c1c' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fas fa-minus-circle" />
                    <span>Deduct Credits (-)</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Credits Amount (1 Credit = ₹10)
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={adjustAmount === '' ? '' : adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))}
                />
              </div>

              {/* Live Balance Preview Calculation */}
              {adjustAmount !== '' && adjustAmount > 0 && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '18px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Previous Balance:</span>
                    <span style={{ fontWeight: 600 }}>{adjustingAccount.balance} Credits</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: adjustType === 'add' ? '#16a34a' : '#dc2626', marginTop: '4px' }}>
                    <span>{adjustType === 'add' ? 'Addition (+):' : 'Deduction (-):'}</span>
                    <span style={{ fontWeight: 700 }}>{adjustType === 'add' ? `+${adjustAmount}` : `-${adjustAmount}`} Credits</span>
                  </div>
                  <div style={{ height: '1px', background: '#cbd5e1', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#091e42', fontWeight: 800 }}>
                    <span>Resulting Balance:</span>
                    <span>
                      {adjustType === 'add'
                        ? adjustingAccount.balance + Number(adjustAmount)
                        : adjustingAccount.balance - Number(adjustAmount)}{' '}
                      Credits
                    </span>
                  </div>
                  {adjustType === 'deduct' && adjustingAccount.balance < adjustAmount && (
                    <div style={{ color: '#dc2626', fontWeight: 600, marginTop: '8px' }}>
                      ⚠️ Warning: Resulting balance cannot be negative! Maximum deductible is {adjustingAccount.balance}.
                    </div>
                  )}
                </div>
              )}

              {/* Mandatory Reason */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Mandatory Audit Reason <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why this adjustment is being made (e.g., Customer support gesture, billing resolution, package correction)..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Confirm prompt inside modal if clicked submit */}
              {showAdjustConfirm ? (
                <div
                  style={{
                    background: '#fffbeb',
                    borderRadius: '10px',
                    padding: '14px',
                    border: '1px solid #fde68a',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#92400e', fontSize: '13px', marginBottom: '4px' }}>
                    Confirm Balance Adjustment?
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#78350f' }}>
                    Are you sure you want to {adjustType === 'add' ? 'add' : 'deduct'} <strong>{adjustAmount} credits</strong>{' '}
                    for <strong>{adjustingAccount.name}</strong>? This action is immediate and will be logged in the permanent transaction ledger.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
                    <Button variant="outline" size="sm" onClick={() => setShowAdjustConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant={adjustType === 'deduct' ? 'danger' : 'primary'}
                      size="sm"
                      loading={isSubmittingAdjust}
                      onClick={handleConfirmAdjust}
                    >
                      Yes, Apply Adjustment
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button variant="outline" onClick={() => setAdjustingAccount(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    disabled={
                      !adjustAmount ||
                      adjustAmount <= 0 ||
                      !adjustReason.trim() ||
                      (adjustType === 'deduct' && adjustingAccount.balance < adjustAmount)
                    }
                    onClick={() => setShowAdjustConfirm(true)}
                  >
                    Proceed to Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DRAWER / MODAL: Account Details & Transaction History ── */}
      {selectedAccountDetails && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 30, 66, 0.54)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '960px',
              maxHeight: '90vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    {selectedAccountDetails.name}
                  </h3>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#eff6ff',
                      color: '#2563eb',
                    }}
                  >
                    {selectedAccountDetails.category}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                  {selectedAccountDetails.email} • Referral Code:{' '}
                  <strong>{selectedAccountDetails.referralCode || 'N/A'}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 700 }}>CURRENT BALANCE</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>
                    {selectedAccountDetails.balance} Credits{' '}
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                      (₹{(selectedAccountDetails.balance * 10).toLocaleString()})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAccountDetails(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Active & Historical Subscriptions */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  Subscriptions & Package Allocations
                </h4>
                {selectedAccountDetails.subscriptions.length === 0 ? (
                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                    No subscriptions or package purchases recorded for this account.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafd', color: '#475569', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px' }}>Plan Name</th>
                          <th style={{ padding: '8px 12px' }}>Billing Cycle</th>
                          <th style={{ padding: '8px 12px' }}>Credits Granted</th>
                          <th style={{ padding: '8px 12px' }}>Price Paid</th>
                          <th style={{ padding: '8px 12px' }}>Expiry Date</th>
                          <th style={{ padding: '8px 12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAccountDetails.subscriptions.map((s) => (
                          <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{s.planName}</td>
                            <td style={{ padding: '8px 12px' }}>{s.billingCycle}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: '#059669' }}>+{s.creditsIncluded} cr</td>
                            <td style={{ padding: '8px 12px' }}>₹{s.priceInr}</td>
                            <td style={{ padding: '8px 12px' }}>{new Date(s.expiresAt).toLocaleDateString()}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  background: s.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                                  color: s.status === 'active' ? '#059669' : '#64748b',
                                }}
                              >
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Transactions Ledger */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                    Credit Transaction Ledger ({selectedAccountDetails.transactions.length})
                  </h4>

                  {/* Filter for type */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={detailTxType}
                      onChange={(e) => {
                        setDetailTxType(e.target.value);
                        refreshAccountLedger(e.target.value, detailTxStatus);
                      }}
                      style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="All">All Types</option>
                      <option value="purchase">Purchases (+)</option>
                      <option value="spend">Spends / Deductions (-)</option>
                      <option value="grant">Promotions / Grants (+)</option>
                      <option value="referral">Referrals (+)</option>
                      <option value="refund">Refunds</option>
                    </select>
                  </div>
                </div>

                {isLoadingDetails ? (
                  <div style={{ padding: '30px', textAlign: 'center' }}>
                    <Loader />
                  </div>
                ) : selectedAccountDetails.transactions.length === 0 ? (
                  <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
                    No transactions match the selected filter.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafd', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '10px 12px' }}>Date & Time</th>
                          <th style={{ padding: '10px 12px' }}>Type</th>
                          <th style={{ padding: '10px 12px' }}>Credits</th>
                          <th style={{ padding: '10px 12px' }}>Balance Flow</th>
                          <th style={{ padding: '10px 12px' }}>Reason & Feature</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAccountDetails.transactions.map((tx) => {
                          const isPositive = tx.type === 'purchase' || tx.type === 'grant' || tx.type === 'referral';
                          return (
                            <tr key={tx._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', color: '#64748b' }}>
                                {new Date(tx.createdAt).toLocaleString()}
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    background: isPositive ? '#ecfdf5' : '#fef2f2',
                                    color: isPositive ? '#059669' : '#dc2626',
                                  }}
                                >
                                  {tx.type}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: '10px 12px',
                                  fontWeight: 800,
                                  color: isPositive ? '#059669' : '#dc2626',
                                }}
                              >
                                {isPositive ? `+${tx.amount}` : `-${tx.amount}`}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#64748b' }}>
                                {tx.balanceBefore !== undefined && tx.balanceAfter !== undefined ? (
                                  <span>
                                    {tx.balanceBefore} → <strong>{tx.balanceAfter}</strong>
                                  </span>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td style={{ padding: '10px 12px', maxWidth: '300px' }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{tx.reason}</div>
                                {tx.feature && (
                                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Feature: {tx.feature}</div>
                                )}
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: tx.status === 'completed' ? '#16a34a' : '#ea580c',
                                  }}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Pricing Configuration & Audit History ── */}
      {isPricingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 30, 66, 0.54)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '880px',
              maxHeight: '90vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#f3e8ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  <i className="fas fa-sliders-h" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    Credit Pricing & Service Cost Configuration
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                    Authoritative baseline: 1 Credit = ₹10 • Initial Welcome: 20 Credits • Referral: 10 Credits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPricingModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafd' }}>
              <button
                type="button"
                onClick={() => setPricingActiveSubtab('rules')}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: pricingActiveSubtab === 'rules' ? '#ffffff' : 'transparent',
                  borderBottom: pricingActiveSubtab === 'rules' ? '2px solid #0265c2' : 'none',
                  color: pricingActiveSubtab === 'rules' ? '#0265c2' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                1. Core Valuation & Promotional Rules
              </button>
              <button
                type="button"
                onClick={() => setPricingActiveSubtab('features')}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: pricingActiveSubtab === 'features' ? '#ffffff' : 'transparent',
                  borderBottom: pricingActiveSubtab === 'features' ? '2px solid #0265c2' : 'none',
                  color: pricingActiveSubtab === 'features' ? '#0265c2' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                2. Feature & Service Charges
              </button>
              <button
                type="button"
                onClick={() => setPricingActiveSubtab('audit')}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: pricingActiveSubtab === 'audit' ? '#ffffff' : 'transparent',
                  borderBottom: pricingActiveSubtab === 'audit' ? '2px solid #0265c2' : 'none',
                  color: pricingActiveSubtab === 'audit' ? '#0265c2' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                3. Audit History Log ({pricingConfig?.auditLog?.length || 0})
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {isLoadingPricing ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Loader />
                </div>
              ) : pricingActiveSubtab === 'rules' ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Base Credit Value (INR per 1 Credit)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={editBaseValue}
                        onChange={(e) => setEditBaseValue(Number(e.target.value))}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Default standard: ₹10 = 1 Credit
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Initial Welcome Promotional Credits
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={editPromoCredits}
                        onChange={(e) => setEditPromoCredits(Number(e.target.value))}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Default: 20 Credits (₹200 value)
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Refer & Earn Reward Credits
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={editReferralCredits}
                        onChange={(e) => setEditReferralCredits(Number(e.target.value))}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Default: 10 Credits (₹100 value)
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Mandatory Reason for Updating Pricing Rules <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Specify business reason for updating platform-wide pricing configuration..."
                      value={pricingUpdateReason}
                      onChange={(e) => setPricingUpdateReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button
                      variant="primary"
                      loading={isSavingPricing}
                      disabled={!pricingUpdateReason.trim()}
                      onClick={handleSavePricing}
                    >
                      Save Pricing Rules & Log Audit
                    </Button>
                  </div>
                </div>
              ) : pricingActiveSubtab === 'features' ? (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                    Standard Feature Charges & Deductions
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafd', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '10px 12px' }}>Feature / Service</th>
                          <th style={{ padding: '10px 12px' }}>Category</th>
                          <th style={{ padding: '10px 12px' }}>Charging Unit</th>
                          <th style={{ padding: '10px 12px' }}>Credits</th>
                          <th style={{ padding: '10px 12px' }}>Price (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(pricingConfig?.featurePricing) ? (
                          pricingConfig.featurePricing.map((item: any) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#091e42' }}>{item.name}</td>
                              <td style={{ padding: '10px 12px', textTransform: 'capitalize', color: '#64748b' }}>
                                {item.category}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#64748b' }}>{item.chargingUnit}</td>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#d97706' }}>
                                {item.credits} cr
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#059669' }}>
                                ₹{item.priceInr}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                              Features catalog loaded from backend.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                    Pricing Audit Trail
                  </h4>
                  {(!pricingConfig?.auditLog || pricingConfig.auditLog.length === 0) ? (
                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      No pricing changes have been logged yet. All baseline rules are currently active.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f8fafd', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '10px 12px' }}>Timestamp</th>
                            <th style={{ padding: '10px 12px' }}>Admin</th>
                            <th style={{ padding: '10px 12px' }}>Rule / Field</th>
                            <th style={{ padding: '10px 12px' }}>Previous</th>
                            <th style={{ padding: '10px 12px' }}>New Value</th>
                            <th style={{ padding: '10px 12px' }}>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricingConfig.auditLog.map((log, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', color: '#64748b' }}>
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                                {log.adminName} ({log.adminRole})
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0265c2' }}>
                                {log.itemName || log.itemKey}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#dc2626' }}>{String(log.previousValue)}</td>
                              <td style={{ padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>
                                {String(log.newValue)}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#334155' }}>{log.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Global Audit Ledger ── */}
      {isGlobalLedgerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 30, 66, 0.54)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1040px',
              maxHeight: '90vh',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}
                >
                  <i className="fas fa-receipt" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    Global Credit Transaction Ledger
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                    Auditable real-time record of all credit grants, spends, purchases, and manual administrative adjustments.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGlobalLedgerOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Filter */}
            <div
              style={{
                padding: '12px 24px',
                background: '#f8fafd',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <select
                value={globalTxType}
                onChange={(e) => {
                  setGlobalTxType(e.target.value);
                  handleOpenGlobalLedger();
                }}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              >
                <option value="All">All Transaction Types</option>
                <option value="grant">Grants / Manual Adjustments (+)</option>
                <option value="spend">Spends / Deductions (-)</option>
                <option value="purchase">Purchases (+)</option>
                <option value="referral">Referrals (+)</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {isLoadingGlobalTx ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Loader />
                </div>
              ) : globalTransactions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No transactions recorded in the ledger yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafd', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 12px' }}>Date & Time</th>
                        <th style={{ padding: '10px 12px' }}>Account</th>
                        <th style={{ padding: '10px 12px' }}>Type</th>
                        <th style={{ padding: '10px 12px' }}>Credits</th>
                        <th style={{ padding: '10px 12px' }}>Balance Flow</th>
                        <th style={{ padding: '10px 12px' }}>Reason & Feature</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalTransactions.map((tx: any) => {
                        const isPositive = tx.type === 'purchase' || tx.type === 'grant' || tx.type === 'referral';
                        const accountName = tx.orgId?.name || tx.userId?.fullName || tx.userId?.displayName || tx.userId?.username || 'Platform User';
                        return (
                          <tr key={tx._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 12px', color: '#64748b' }}>
                              {new Date(tx.createdAt).toLocaleString()}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#091e42' }}>
                              {accountName}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  textTransform: 'capitalize',
                                  background: isPositive ? '#ecfdf5' : '#fef2f2',
                                  color: isPositive ? '#059669' : '#dc2626',
                                }}
                              >
                                {tx.type}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: '10px 12px',
                                fontWeight: 800,
                                color: isPositive ? '#059669' : '#dc2626',
                              }}
                            >
                              {isPositive ? `+${tx.amount}` : `-${tx.amount}`}
                            </td>
                            <td style={{ padding: '10px 12px', color: '#64748b' }}>
                              {tx.balanceBefore !== undefined && tx.balanceAfter !== undefined ? (
                                <span>
                                  {tx.balanceBefore} → <strong>{tx.balanceAfter}</strong>
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td style={{ padding: '10px 12px', maxWidth: '300px' }}>
                              <div style={{ fontWeight: 600, color: '#1e293b' }}>{tx.reason}</div>
                              {tx.feature && (
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Feature: {tx.feature}</div>
                              )}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditManagementPage;
