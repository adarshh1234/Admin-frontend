import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
}

const VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
};

const SIZE_CLASS_MAP: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    type = 'button',
    disabled,
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    onClick,
    children,
    className = '',
    ...rest
  },
  ref,
) {
  const variantClass = variant ? VARIANT_CLASS_MAP[variant] || '' : '';
  const sizeClass = size ? SIZE_CLASS_MAP[size] || '' : '';
  const combinedClass = [variantClass, sizeClass, className].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={combinedClass || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <i className="fas fa-circle-notch fa-spin" style={{ marginRight: loadingText || children ? 8 : 0 }} />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span style={{ marginRight: children ? 6 : 0 }}>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span style={{ marginLeft: children ? 6 : 0 }}>{icon}</span>}
        </>
      )}
    </button>
  );
});

export default Button;
