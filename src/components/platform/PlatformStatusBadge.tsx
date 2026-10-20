import type { AccountStatus, VerificationStatus } from '../../types/platformUsers';

interface AccountStatusBadgeProps {
  status: AccountStatus;
  size?: 'sm' | 'md';
}

export function AccountStatusBadge({ status, size = 'sm' }: AccountStatusBadgeProps) {
  const styles: Record<AccountStatus, { bg: string; color: string; icon: string; border: string }> = {
    Active: {
      bg: '#dcfce7',
      color: '#15803d',
      icon: 'fa-check-circle',
      border: '#bbf7d0',
    },
    Inactive: {
      bg: '#f1f5f9',
      color: '#64748b',
      icon: 'fa-pause-circle',
      border: '#e2e8f0',
    },
    Suspended: {
      bg: '#fee2e2',
      color: '#b91c1c',
      icon: 'fa-ban',
      border: '#fecaca',
    },
  };

  const current = styles[status] || styles.Inactive;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: size === 'sm' ? '3px 10px' : '5px 12px',
        borderRadius: 20,
        fontSize: size === 'sm' ? 11.5 : 13,
        fontWeight: 600,
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <i className={`fas ${current.icon}`} style={{ fontSize: size === 'sm' ? 10 : 12 }} />
      {status}
    </span>
  );
}

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export function VerificationBadge({ status, size = 'sm' }: VerificationBadgeProps) {
  const styles: Record<VerificationStatus, { bg: string; color: string; icon: string; border: string }> = {
    Verified: {
      bg: '#eff6ff',
      color: '#1d4ed8',
      icon: 'fa-shield-check',
      border: '#bfdbfe',
    },
    Pending: {
      bg: '#fef3c7',
      color: '#b45309',
      icon: 'fa-clock',
      border: '#fde68a',
    },
    Rejected: {
      bg: '#fee2e2',
      color: '#b91c1c',
      icon: 'fa-times-circle',
      border: '#fecaca',
    },
  };

  const current = styles[status] || styles.Pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: size === 'sm' ? '3px 10px' : '5px 12px',
        borderRadius: 20,
        fontSize: size === 'sm' ? 11.5 : 13,
        fontWeight: 600,
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <i className={`fas ${current.icon}`} style={{ fontSize: size === 'sm' ? 10 : 12 }} />
      {status}
    </span>
  );
}
