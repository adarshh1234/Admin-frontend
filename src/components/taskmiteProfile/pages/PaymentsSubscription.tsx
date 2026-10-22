'use client'

import React from 'react'
import { PageHeader, Card, CardRow } from '../components/common/Card'
import { Loader } from '../components/common/Loader'
import { userService } from '../services/userService'
import { useFetchData } from '../hooks/useFetchData'
import { useToast } from '../hooks/useToast'
import {
  CreditCardIcon,
  ShoppingBagIcon,
  FilmIcon,
} from '../components/common/Icons'
import type { AccountType } from '../types/user.types'

interface PaymentsSubscriptionProps {
  onNavigateTab?: (tab: string) => void
  explicitAccountType?: string | null
}

export default function PaymentsSubscription({ onNavigateTab, explicitAccountType }: PaymentsSubscriptionProps) {
  const { showToast } = useToast()
  const accountType = userService.getAccountType(explicitAccountType)
  const { data: subscriptions, isLoading } = useFetchData(() =>
    userService.getSubscriptions(accountType)
  )

  if (isLoading) {
    return <Loader text={`Loading ${accountType} subscriptions and billing...`} />
  }

  return (
    <>
      <PageHeader
        title="Payments & subscriptions"
        subtitle={`Your ${accountType} payment info, transactions, active subscription plans, and purchases`}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <Card
          title="Payment methods"
          description="Save payment methods for secure checkout across LetGetIn subscriptions, credits, and services"
          graphic={<CreditCardIcon />}
          footer={
            <button
              type="button"
              className="link-btn"
              onClick={() => showToast('Payment methods manager opened', 'info')}
            >
              Manage payment methods
            </button>
          }
        >
          <CardRow
            icon={<CreditCardIcon />}
            label="Corporate / Personal Card"
            value="Default payment gateway active"
            chevron={false}
          />
        </Card>

        <Card
          title={`${accountType} Subscriptions`}
          description={`Authoritative subscription packages and plans for ${accountType} accounts`}
          graphic={<FilmIcon />}
          footer={
            <button
              type="button"
              className="link-btn"
              onClick={() => showToast('Subscription upgrade catalog opened', 'info')}
            >
              Explore plans & upgrades
            </button>
          }
        >
          {subscriptions?.map((sub) => (
            <CardRow
              key={sub.id}
              icon={<FilmIcon />}
              label={sub.title}
              value={`${sub.cost} (${sub.status})`}
              onClick={() => showToast(`Managing subscription: ${sub.title}`, 'info')}
            />
          ))}
        </Card>

        <Card
          title="Recent Purchases & Billing Invoices"
          description="Your orders, invoices, credit top-ups, and transaction statements"
          graphic={<ShoppingBagIcon />}
          footer={
            <button
              type="button"
              className="link-btn"
              onClick={() => showToast('Invoices downloaded to your device', 'success')}
            >
              View billing history & invoices
            </button>
          }
        >
          <CardRow
            icon={<ShoppingBagIcon />}
            label="Initial Promotional Credits Package"
            value="Complimentary Welcome Grant"
            chevron={false}
          />
        </Card>
      </div>
    </>
  )
}
