import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import { creditsService } from '../../../services/credits.service';
import type {
  CreditPricingConfigData,
  PlanCategoryGroup,
  PlanServiceItem,
  SubscriptionPlanDetail,
  PricingAuditEntry,
} from '../../../types/credits';
import { Button } from '../../common/Button';
import { Loader } from '../../common/Loader';

type AccountCategoryTab = 'candidates' | 'company' | 'startups' | 'institution';

interface CreditPlansPricingViewProps {
  initialCategory?: AccountCategoryTab;
}

export const CreditPlansPricingView: React.FC<CreditPlansPricingViewProps> = ({
  initialCategory = 'candidates',
}) => {
  const { user: currentUser, isSuperAdmin, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<AccountCategoryTab>(initialCategory);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Full config state
  const [config, setConfig] = useState<CreditPricingConfigData | null>(null);

  // Active Category working plans & subscriptions
  const [categoryPlans, setCategoryPlans] = useState<PlanCategoryGroup[]>([]);
  const [categorySubscriptions, setCategorySubscriptions] = useState<SubscriptionPlanDetail[]>([]);

  // Search filter inside service table
  const [serviceSearch, setServiceSearch] = useState<string>('');

  // Modals state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanDetail | null>(null);
  const [editingService, setEditingService] = useState<{
    groupId: string;
    item: PlanServiceItem;
  } | null>(null);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [publishReason, setPublishReason] = useState<string>('');

  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Global Payments & Credits Kill Switch
  const [isTogglePaymentsModalOpen, setIsTogglePaymentsModalOpen] = useState<boolean>(false);
  const [togglingPayments, setTogglingPayments] = useState<boolean>(false);
  const [togglePaymentsReason, setTogglePaymentsReason] = useState<string>('');

  const paymentsCreditsEnabled = config?.paymentsCreditsEnabled !== false;

  const handleTogglePayments = async () => {
    try {
      setTogglingPayments(true);
      const targetState = !paymentsCreditsEnabled;
      const res = await creditsService.togglePaymentsCredits({
        enabled: targetState,
        reason: togglePaymentsReason.trim() || undefined,
      });

      showToast(
        targetState
          ? 'Payments and credits have been successfully enabled platform-wide.'
          : 'Payments and credits have been temporarily disabled platform-wide.',
        targetState ? 'success' : 'warning'
      );

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              paymentsCreditsEnabled: res.paymentsCreditsEnabled,
              paymentsCreditsDisabledReason: res.paymentsCreditsDisabledReason,
              paymentsCreditsDisabledAt: res.paymentsCreditsDisabledAt,
              paymentsCreditsDisabledBy: res.paymentsCreditsDisabledBy,
            }
          : prev
      );
      setIsTogglePaymentsModalOpen(false);
      setTogglePaymentsReason('');
      await loadPricingData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update payments and credits state.', 'error');
    } finally {
      setTogglingPayments(false);
    }
  };

  // Load authoritative pricing config from backend
  const loadPricingData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await creditsService.getPricingConfig();
      setConfig(data);
      setHasUnsavedChanges(data.status === 'draft');
    } catch (err: any) {
      showToast(err.message || 'Failed to load pricing configuration.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPricingData();
  }, [loadPricingData]);

  // Synchronize working state when active category or config changes
  useEffect(() => {
    if (!config) return;

    if (activeCategory === 'candidates') {
      setCategoryPlans(config.candidatePlans || []);
      setCategorySubscriptions([]);
    } else if (activeCategory === 'company') {
      setCategoryPlans(config.companyPlans || []);
      setCategorySubscriptions(
        (config.subscriptionPlans || []).filter((s) =>
          ['job_posting', 'hrms', 'recruitment_suite'].includes(s.id)
        )
      );
    } else if (activeCategory === 'startups') {
      setCategoryPlans(config.startupPlans || []);
      setCategorySubscriptions(
        (config.subscriptionPlans || []).filter((s) =>
          ['job_posting', 'hrms', 'startup'].includes(s.id)
        )
      );
    } else if (activeCategory === 'institution') {
      setCategoryPlans(config.institutionPlans || []);
      setCategorySubscriptions(
        (config.subscriptionPlans || []).filter((s) => ['institution'].includes(s.id))
      );
    }
  }, [config, activeCategory]);

  // Save Staged Draft
  const handleSaveDraft = async () => {
    if (!config) return;
    try {
      setSaving(true);
      const draftPayload: any = {
        creditValueInr: config.creditValueInr,
        initialPromotionalCredits: config.initialPromotionalCredits,
        referralRewardCredits: config.referralRewardCredits,
      };

      if (activeCategory === 'candidates') {
        draftPayload.candidatePlans = categoryPlans;
      } else if (activeCategory === 'company') {
        draftPayload.companyPlans = categoryPlans;
        draftPayload.subscriptionPlans = (config.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      } else if (activeCategory === 'startups') {
        draftPayload.startupPlans = categoryPlans;
        draftPayload.subscriptionPlans = (config.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      } else if (activeCategory === 'institution') {
        draftPayload.institutionPlans = categoryPlans;
        draftPayload.subscriptionPlans = (config.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      }

      await creditsService.saveDraft(draftPayload);
      setHasUnsavedChanges(true);
      showToast('Changes saved as draft. Publish when ready to apply live.', 'success');
      loadPricingData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save draft.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Publish Live
  const handlePublishLive = async () => {
    if (!publishReason.trim() || publishReason.trim().length < 3) {
      showToast('A mandatory reason is required to publish pricing changes (min 3 chars).', 'error');
      return;
    }

    try {
      setPublishing(true);
      const directData: any = {};
      if (activeCategory === 'candidates') {
        directData.candidatePlans = categoryPlans;
      } else if (activeCategory === 'company') {
        directData.companyPlans = categoryPlans;
        directData.subscriptionPlans = (config?.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      } else if (activeCategory === 'startups') {
        directData.startupPlans = categoryPlans;
        directData.subscriptionPlans = (config?.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      } else if (activeCategory === 'institution') {
        directData.institutionPlans = categoryPlans;
        directData.subscriptionPlans = (config?.subscriptionPlans || []).map((s) => {
          const updated = categorySubscriptions.find((sub) => sub.id === s.id);
          return updated || s;
        });
      }

      const res = await creditsService.publish({
        reason: publishReason.trim(),
        category: activeCategory,
        directData,
      });

      showToast(res.message || 'Pricing and plans successfully published LIVE!', 'success');
      setIsPublishModalOpen(false);
      setPublishReason('');
      setHasUnsavedChanges(false);
      loadPricingData();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish changes.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Reset Category Defaults
  const handleResetDefaults = async () => {
    try {
      setLoading(true);
      await creditsService.reset({
        category: activeCategory,
        reason: `Administrator reset ${activeCategory} plans to default baseline rules`,
      });
      showToast(`Reset ${activeCategory} configuration to authoritative defaults.`, 'success');
      setIsResetConfirmOpen(false);
      setHasUnsavedChanges(false);
      loadPricingData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset pricing defaults.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update a Service Item in state
  const handleSaveServiceEdit = (updatedItem: PlanServiceItem, groupId: string) => {
    setCategoryPlans((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          items: group.items.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
        };
      })
    );
    setHasUnsavedChanges(true);
    setEditingService(null);
    showToast(`Updated "${updatedItem.name}" in staged draft. Click "Save Draft" or "Publish LIVE".`, 'info');
  };

  // Update a Subscription Plan in state
  const handleSavePlanEdit = (updatedPlan: SubscriptionPlanDetail) => {
    setCategorySubscriptions((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setHasUnsavedChanges(true);
    setEditingPlan(null);
    showToast(`Updated plan "${updatedPlan.name}" in staged draft. Click "Save Draft" or "Publish LIVE".`, 'info');
  };

  // Filtered Services List
  const filteredCategoryPlans = useMemo(() => {
    if (!serviceSearch.trim()) return categoryPlans;
    const term = serviceSearch.toLowerCase().trim();
    return categoryPlans
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (it) =>
            it.name.toLowerCase().includes(term) ||
            it.chargingUnit.toLowerCase().includes(term) ||
            (it.description && it.description.toLowerCase().includes(term))
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [categoryPlans, serviceSearch]);

  const categoryLabels: Record<AccountCategoryTab, { title: string; icon: string; badge: string }> = {
    candidates: {
      title: 'Candidates / Customers',
      icon: 'fa-user-graduate',
      badge: 'B2C Marketplace',
    },
    company: {
      title: 'Company',
      icon: 'fa-building',
      badge: 'Corporate Recruiters',
    },
    startups: {
      title: 'Startups',
      icon: 'fa-rocket',
      badge: 'Growth Ecosystem',
    },
    institution: {
      title: 'Institution',
      icon: 'fa-university',
      badge: 'Campus & Academic',
    },
  };

  if (loading && !config) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <Loader label="Loading configuration..." />
        <p style={{ marginTop: 16, color: '#64748b', fontSize: 14 }}>
          Loading authoritative credit plans & pricing configuration...
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* CMS Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #091e42 0%, #0052cc 100%)',
          color: '#ffffff',
          borderRadius: 16,
          padding: '24px 28px',
          boxShadow: '0 8px 24px rgba(9, 30, 66, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: '#ffffff',
              }}
            >
              <i className="fas fa-tags" />
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Credit Plans & Pricing Management
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                background: hasUnsavedChanges ? '#f59e0b' : '#10b981',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'inline-block',
                }}
              />
              {hasUnsavedChanges ? 'Draft Staged' : 'Live Published'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#e0f2fe', maxWidth: 760 }}>
            Configure and publish credit plans, subscription tiers, and service charges for all four
            LetGetIn account categories. Changes immediately synchronize with live user wallets, checkout
            flows, and deduction services.
          </p>
        </div>

        {/* Global CMS Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsResetConfirmOpen(true)}
            style={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.08)',
              fontSize: 13,
            }}
          >
            <i className="fas fa-undo" style={{ marginRight: 6 }} /> Reset Defaults
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAuditModalOpen(true)}
            style={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.08)',
              fontSize: 13,
            }}
          >
            <i className="fas fa-history" style={{ marginRight: 6 }} /> Audit Trail ({config?.auditLog?.length || 0})
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            style={{
              background: '#0284c7',
              borderColor: '#0284c7',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {saving ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-circle-notch fa-spin" /> Saving...
              </span>
            ) : (
              <>
                <i className="fas fa-save" style={{ marginRight: 6 }} /> Save Draft
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsPublishModalOpen(true)}
            disabled={saving || publishing}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderColor: '#059669',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            }}
          >
            <i className="fas fa-paper-plane" style={{ marginRight: 6 }} /> Publish LIVE
          </Button>

          {/* Global Payment & Credits Kill Switch */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTogglePaymentsModalOpen(true)}
            disabled={togglingPayments || saving || publishing}
            style={{
              borderColor: paymentsCreditsEnabled ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.55)',
              color: '#ffffff',
              background: paymentsCreditsEnabled ? 'rgba(239, 68, 68, 0.22)' : 'rgba(16, 185, 129, 0.28)',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: paymentsCreditsEnabled ? '0 0 10px rgba(239, 68, 68, 0.2)' : '0 0 10px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            {togglingPayments ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-circle-notch fa-spin" /> Updating...
              </span>
            ) : paymentsCreditsEnabled ? (
              <>
                <i className="fas fa-ban" /> Disable Payments & Credits
              </>
            ) : (
              <>
                <i className="fas fa-check-circle" /> Enable Payments & Credits
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Kill Switch Disabled Notice Banner */}
      {!paymentsCreditsEnabled && (
        <div
          style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fca5a5',
            borderRadius: 14,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              <i className="fas fa-exclamation-triangle" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#991b1b' }}>
                Platform Payments & Credits Are Temporarily Disabled
              </div>
              <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 2 }}>
                {config?.paymentsCreditsDisabledReason || 'New purchases, credit top-ups, paid subscriptions, and new paid premium operations are currently blocked.'} Existing user balances and records are preserved.
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTogglePaymentsModalOpen(true)}
            style={{
              borderColor: '#dc2626',
              color: '#dc2626',
              background: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <i className="fas fa-check-circle" style={{ marginRight: 6 }} /> Re-Enable
          </Button>
        </div>
      )}

      {/* Four Category Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {(['candidates', 'company', 'startups', 'institution'] as AccountCategoryTab[]).map((cat) => {
          const isSelected = activeCategory === cat;
          const info = categoryLabels[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setServiceSearch('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 18px',
                borderRadius: 14,
                border: isSelected ? '2px solid #0052cc' : '1px solid #e2e8f0',
                background: isSelected ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 82, 204, 0.08)' : 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isSelected ? '#0052cc' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                <i className={`fas ${info.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? '#0052cc' : '#091e42',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {info.title}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{info.badge}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Baseline Rules Summary Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '18px 22px',
          border: '1px solid #e2e8f0',
          marginBottom: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#0052cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <i className="fas fa-coins" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Base Credit Valuation
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#091e42', marginTop: 2 }}>
              1 Credit = ₹{config?.creditValueInr || 10} INR
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <i className="fas fa-gift" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Initial Welcome Grant
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#091e42', marginTop: 2 }}>
              {config?.initialPromotionalCredits || 20} Credits (₹{(config?.initialPromotionalCredits || 20) * (config?.creditValueInr || 10)})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#fdf2f8',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <i className="fas fa-share-alt" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Refer & Earn Reward
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#091e42', marginTop: 2 }}>
              {config?.referralRewardCredits || 10} Credits (₹{(config?.referralRewardCredits || 10) * (config?.creditValueInr || 10)})
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Section (Company, Startups, Institution) */}
      {categorySubscriptions.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
                Subscription Plans — {categoryLabels[activeCategory].title}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                Manage recurring credits included and subscription prices across Monthly, 6 Months, and Yearly duration tiers.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {categorySubscriptions.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  padding: '20px 22px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: '#eff6ff',
                          color: '#0052cc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                        }}
                      >
                        <i className="fas fa-crown" />
                      </div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#091e42' }}>
                        {plan.name}
                      </h4>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        background: plan.active !== false ? '#f0fdf4' : '#f1f5f9',
                        color: plan.active !== false ? '#16a34a' : '#64748b',
                      }}
                    >
                      {plan.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Durations Table */}
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 12,
                      marginTop: 12,
                      marginBottom: 16,
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b' }}>Billing Cycle</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>Credits</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', color: '#64748b' }}>Price (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#091e42' }}>Monthly (30d)</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0052cc', fontWeight: 700 }}>
                          {plan.durations?.monthly?.credits || 0}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#091e42' }}>
                          ₹{plan.durations?.monthly?.priceInr?.toLocaleString() || 0}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#091e42' }}>6 Months (180d)</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0052cc', fontWeight: 700 }}>
                          {plan.durations?.six_months?.credits || 0}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#091e42' }}>
                          ₹{plan.durations?.six_months?.priceInr?.toLocaleString() || 0}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#091e42' }}>Yearly (365d)</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0052cc', fontWeight: 700 }}>
                          {plan.durations?.yearly?.credits || 0}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#091e42' }}>
                          ₹{plan.durations?.yearly?.priceInr?.toLocaleString() || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Features list */}
                  {plan.features && plan.features.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                        Included Features
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#475569' }}>
                        {plan.features.map((f, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingPlan(plan)}
                    style={{ width: '100%', fontSize: 13, borderColor: '#cbd5e1' }}
                  >
                    <i className="fas fa-pencil-alt" style={{ marginRight: 6 }} /> Edit Plan & Pricing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Charges Section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
              Service Charges Catalog — {categoryLabels[activeCategory].title}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Authoritative credit deductions and INR charges per action.
            </p>
          </div>

          {/* Search filter */}
          <div style={{ position: 'relative', width: 280 }}>
            <input
              type="text"
              placeholder="Search services & charges..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <i
              className="fas fa-search"
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Groups of Service Charges */}
        {filteredCategoryPlans.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#64748b',
            }}
          >
            <i className="fas fa-search" style={{ fontSize: 24, marginBottom: 10, color: '#cbd5e1' }} />
            <p style={{ margin: 0, fontSize: 14 }}>No services matched your search filter.</p>
          </div>
        ) : (
          filteredCategoryPlans.map((group) => (
            <div
              key={group.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                marginBottom: 20,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {/* Group Header */}
              <div
                style={{
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#091e42' }}>
                    {group.title}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                    {group.description}
                  </p>
                </div>
                <span
                  style={{
                    background: '#eff6ff',
                    color: '#0052cc',
                    padding: '3px 9px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {group.items.length} {group.items.length === 1 ? 'Service' : 'Services'}
                </span>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 12 }}>
                      <th style={{ padding: '12px 18px', textAlign: 'left' }}>Service / Action</th>
                      <th style={{ padding: '12px 18px', textAlign: 'left' }}>Charging Unit</th>
                      <th style={{ padding: '12px 18px', textAlign: 'center' }}>Credits</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Equivalent INR</th>
                      <th style={{ padding: '12px 18px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.1s ease',
                        }}
                      >
                        <td style={{ padding: '12px 18px' }}>
                          <div style={{ fontWeight: 600, color: '#091e42' }}>{item.name}</div>
                          {item.description && (
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                              {item.description}
                            </div>
                          )}
                          {item.providerFeeNote && (
                            <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>
                              <i className="fas fa-info-circle" style={{ marginRight: 4 }} />
                              {item.providerFeeNote}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 18px', color: '#475569' }}>
                          {item.chargingUnit}
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                          {item.caseByCase ? (
                            <span
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '3px 8px',
                                borderRadius: 10,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              Case-by-case
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#0052cc',
                                padding: '4px 10px',
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 13,
                              }}
                            >
                              {item.credits} Credits
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, color: '#091e42' }}>
                          {item.caseByCase ? 'Agreed Quote' : `₹${item.priceInr.toLocaleString()}`}
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 700,
                              background: item.active !== false ? '#f0fdf4' : '#f1f5f9',
                              color: item.active !== false ? '#16a34a' : '#64748b',
                            }}
                          >
                            {item.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setEditingService({ groupId: group.id, item })}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#0052cc',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <i className="fas fa-pencil-alt" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT SUBSCRIPTION PLAN MODAL */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          creditValueInr={config?.creditValueInr || 10}
          onClose={() => setEditingPlan(null)}
          onSave={handleSavePlanEdit}
        />
      )}

      {/* EDIT SERVICE CHARGE MODAL */}
      {editingService && (
        <EditServiceModal
          item={editingService.item}
          groupId={editingService.groupId}
          creditValueInr={config?.creditValueInr || 10}
          onClose={() => setEditingService(null)}
          onSave={handleSaveServiceEdit}
        />
      )}

      {/* PUBLISH CONFIRMATION MODAL */}
      {isPublishModalOpen && (
        <PublishModal
          category={activeCategory}
          publishing={publishing}
          reason={publishReason}
          onReasonChange={setPublishReason}
          onClose={() => setIsPublishModalOpen(false)}
          onConfirm={handlePublishLive}
        />
      )}

      {/* AUDIT TRAIL MODAL */}
      {isAuditModalOpen && (
        <AuditTrailModal
          auditLog={config?.auditLog || []}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {/* RESET CONFIRMATION MODAL */}
      {isResetConfirmOpen && (
        <ResetConfirmModal
          categoryTitle={categoryLabels[activeCategory].title}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={handleResetDefaults}
        />
      )}

      {/* KILL SWITCH CONFIRMATION MODAL */}
      {isTogglePaymentsModalOpen && (
        <TogglePaymentsModal
          currentEnabled={paymentsCreditsEnabled}
          reason={togglePaymentsReason}
          setReason={setTogglePaymentsReason}
          onClose={() => setIsTogglePaymentsModalOpen(false)}
          onConfirm={handleTogglePayments}
          isSubmitting={togglingPayments}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Edit Subscription Plan
// ---------------------------------------------------------------------------
interface EditPlanModalProps {
  plan: SubscriptionPlanDetail;
  creditValueInr: number;
  onClose: () => void;
  onSave: (plan: SubscriptionPlanDetail) => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, creditValueInr, onClose, onSave }) => {
  const [name, setName] = useState(plan.name);
  const [active, setActive] = useState(plan.active !== false);

  const [monthlyCredits, setMonthlyCredits] = useState(plan.durations?.monthly?.credits || 50);
  const [monthlyPrice, setMonthlyPrice] = useState(plan.durations?.monthly?.priceInr || 500);

  const [sixMonthsCredits, setSixMonthsCredits] = useState(plan.durations?.six_months?.credits || 250);
  const [sixMonthsPrice, setSixMonthsPrice] = useState(plan.durations?.six_months?.priceInr || 2500);

  const [yearlyCredits, setYearlyCredits] = useState(plan.durations?.yearly?.credits || 500);
  const [yearlyPrice, setYearlyPrice] = useState(plan.durations?.yearly?.priceInr || 5000);

  const [features, setFeatures] = useState<string[]>(plan.features || []);
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: SubscriptionPlanDetail = {
      ...plan,
      name: name.trim(),
      active,
      durations: {
        monthly: { credits: Number(monthlyCredits), priceInr: Number(monthlyPrice), days: 30 },
        six_months: { credits: Number(sixMonthsCredits), priceInr: Number(sixMonthsPrice), days: 180 },
        yearly: { credits: Number(yearlyCredits), priceInr: Number(yearlyPrice), days: 365 },
      },
      features,
    };
    onSave(updated);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 620,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#eff6ff',
                color: '#0052cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-crown" />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
              Edit Subscription Plan
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 6 }}>
              Plan Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="planActiveCheck"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="planActiveCheck" style={{ fontSize: 13, fontWeight: 600, color: '#091e42', cursor: 'pointer' }}>
              Plan is Active and Visible to Customers
            </label>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#091e42', marginBottom: 10 }}>
            Duration Tiers (Credits & Price in INR)
          </div>

          {/* Monthly */}
          <div
            style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              marginBottom: 12,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13, color: '#091e42' }}>Monthly (30 Days)</div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Credits</label>
              <input
                type="number"
                min="0"
                value={monthlyCredits}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyCredits(val);
                  setMonthlyPrice(val * creditValueInr);
                }}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* 6 Months */}
          <div
            style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              marginBottom: 12,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13, color: '#091e42' }}>6 Months (180 Days)</div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Credits</label>
              <input
                type="number"
                min="0"
                value={sixMonthsCredits}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSixMonthsCredits(val);
                  setSixMonthsPrice(val * creditValueInr);
                }}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={sixMonthsPrice}
                onChange={(e) => setSixMonthsPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Yearly */}
          <div
            style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              marginBottom: 18,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13, color: '#091e42' }}>Yearly (365 Days)</div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Credits</label>
              <input
                type="number"
                min="0"
                value={yearlyCredits}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setYearlyCredits(val);
                  setYearlyPrice(val * creditValueInr);
                }}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Price (₹)</label>
              <input
                type="number"
                min="0"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Features Management */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 6 }}>
              Included Features
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Add feature bullet point..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
              <Button type="button" variant="outline" onClick={handleAddFeature}>
                <i className="fas fa-plus" />
              </Button>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155' }}>
              {features.map((feat, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    style={{ border: 'none', background: 'transparent', color: '#ef4444', marginLeft: 8, cursor: 'pointer' }}
                  >
                    <i className="fas fa-times" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply to Staged Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Edit Service Charge
// ---------------------------------------------------------------------------
interface EditServiceModalProps {
  item: PlanServiceItem;
  groupId: string;
  creditValueInr: number;
  onClose: () => void;
  onSave: (item: PlanServiceItem, groupId: string) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  item,
  groupId,
  creditValueInr,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(item.name);
  const [chargingUnit, setChargingUnit] = useState(item.chargingUnit);
  const [credits, setCredits] = useState(item.credits);
  const [priceInr, setPriceInr] = useState(item.priceInr);
  const [description, setDescription] = useState(item.description || '');
  const [active, setActive] = useState(item.active !== false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !chargingUnit.trim()) return;

    onSave(
      {
        ...item,
        name: name.trim(),
        chargingUnit: chargingUnit.trim(),
        credits: Number(credits),
        priceInr: Number(priceInr),
        description: description.trim(),
        active,
      },
      groupId
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: '#eff6ff',
                color: '#0052cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-pencil-alt" />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
              Edit Service Charge
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 4 }}>
              Service Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 4 }}>
              Charging Unit *
            </label>
            <input
              type="text"
              value={chargingUnit}
              onChange={(e) => setChargingUnit(e.target.value)}
              required
              placeholder="e.g. Per job posting, Per resume, Per student"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 4 }}>
                Credit Cost *
              </label>
              <input
                type="number"
                min="0"
                value={credits}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCredits(val);
                  setPriceInr(val * creditValueInr);
                }}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 4 }}>
                Equivalent INR Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={priceInr}
                onChange={(e) => setPriceInr(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#091e42', marginBottom: 4 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="serviceActiveCheck"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="serviceActiveCheck" style={{ fontSize: 13, fontWeight: 600, color: '#091e42', cursor: 'pointer' }}>
              Service is active and billable
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply to Staged Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Publish LIVE Confirmation
// ---------------------------------------------------------------------------
interface PublishModalProps {
  category: AccountCategoryTab;
  publishing: boolean;
  reason: string;
  onReasonChange: (r: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  category,
  publishing,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            <i className="fas fa-paper-plane" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
              Publish Pricing Changes LIVE
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              Category: <strong style={{ textTransform: 'capitalize' }}>{category}</strong>
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
          Publishing commits all staged changes directly to the persistent MongoDB database. The updated
          pricing will immediately be fetched and applied by customer-facing wallets, checkout orders,
          and credit deduction endpoints. Past transaction history and current user wallet balances remain
          completely intact.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#091e42', marginBottom: 6 }}>
            Mandatory Business Reason *
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            required
            rows={3}
            placeholder="e.g., Q4 seasonal pricing update / Adjusted campus placement packages"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={publishing}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={publishing || !reason.trim()}
            style={{
              background: '#16a34a',
              borderColor: '#16a34a',
            }}
          >
            {publishing ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-circle-notch fa-spin" /> Publishing...
              </span>
            ) : (
              'Confirm & Publish LIVE'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Audit Trail History
// ---------------------------------------------------------------------------
interface AuditTrailModalProps {
  auditLog: PricingAuditEntry[];
  onClose: () => void;
}

const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ auditLog, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 780,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#eff6ff',
                color: '#0052cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              <i className="fas fa-history" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
                Pricing Audit History Log
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Traceable administrative record of every published pricing change.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          {auditLog.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
              <i className="fas fa-clipboard-check" style={{ fontSize: 28, color: '#cbd5e1', marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: 14 }}>No changes logged yet. Running on authoritative baseline rules.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Timestamp</th>
                  <th style={{ padding: '8px 10px' }}>Administrator</th>
                  <th style={{ padding: '8px 10px' }}>Item Changed</th>
                  <th style={{ padding: '8px 10px' }}>Old → New</th>
                  <th style={{ padding: '8px 10px' }}>Business Reason</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice().reverse().map((entry, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: '#091e42' }}>
                      {entry.adminName}
                      <div style={{ fontSize: 10, color: '#64748b' }}>{entry.adminRole}</div>
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: '#0052cc' }}>
                      {entry.itemName || entry.itemKey}
                    </td>
                    <td style={{ padding: '10px 10px', color: '#334155' }}>
                      <span style={{ color: '#ef4444' }}>{String(entry.previousValue)}</span> →{' '}
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>{String(entry.newValue)}</span>
                    </td>
                    <td style={{ padding: '10px 10px', color: '#475569' }}>
                      {entry.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Reset Defaults Confirm
// ---------------------------------------------------------------------------
interface ResetConfirmModalProps {
  categoryTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ categoryTitle, onClose, onConfirm }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          padding: '24px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <i className="fas fa-exclamation-triangle" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#091e42' }}>
              Reset to Defaults?
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              {categoryTitle}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 20 }}>
          This will reset all plans, prices, and service charges for <strong>{categoryTitle}</strong> back
          to the authoritative LetGetIn baseline rules (1 Credit = ₹10).
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
          >
            Yes, Reset Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SUB-MODAL: Global Payments & Credits Kill Switch Confirm
// ---------------------------------------------------------------------------
interface TogglePaymentsModalProps {
  currentEnabled: boolean;
  reason: string;
  setReason: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const TogglePaymentsModal: React.FC<TogglePaymentsModalProps> = ({
  currentEnabled,
  reason,
  setReason,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(9, 30, 66, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          padding: '24px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: currentEnabled ? '#fef2f2' : '#ecfdf5',
              color: currentEnabled ? '#ef4444' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            <i className={currentEnabled ? 'fas fa-power-off' : 'fas fa-check-circle'} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#091e42' }}>
              {currentEnabled ? 'Disable payments and credits platform-wide?' : 'Enable payments and credits platform-wide?'}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
              Centralized Super Admin Kill Switch Control
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.55, marginBottom: 16 }}>
          {currentEnabled
            ? 'New purchases, credit top-ups, paid subscriptions, and new paid premium operations will be temporarily unavailable for all account categories. Existing balances and transaction records will remain unchanged.'
            : 'Restore all payment checkout sessions, credit purchases, paid subscriptions, and premium credit-consuming operations for all account categories across the platform.'}
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
            Reason for this change (recorded in Audit Trail):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              currentEnabled
                ? 'e.g. Scheduled platform maintenance, payment gateway audit, or temporary pause'
                : 'e.g. Platform maintenance completed, resuming standard operations'
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={currentEnabled ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={isSubmitting}
            style={
              !currentEnabled
                ? {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderColor: '#059669',
                    fontWeight: 700,
                  }
                : {
                    background: '#dc2626',
                    borderColor: '#dc2626',
                    fontWeight: 700,
                  }
            }
          >
            {isSubmitting ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-circle-notch fa-spin" /> Processing...
              </span>
            ) : currentEnabled ? (
              'Confirm Disable'
            ) : (
              'Confirm Enable'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreditPlansPricingView;
