import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs font-medium rounded-md gap-1.5',
    md: 'px-3.5 py-2 text-sm font-medium rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold rounded-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-forest text-white hover:bg-forest-800 active:bg-forest-900 shadow-sm focus:ring-forest/20',
    secondary:
      'border border-cloud-500 bg-white text-ink hover:bg-cloud-100 active:bg-cloud-200 shadow-sm focus:ring-forest/20',
    accent:
      'bg-gold text-ink-900 hover:bg-gold-500 active:bg-gold-600 shadow-sm focus:ring-gold/30 font-semibold',
    danger:
      'bg-status-danger text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus:ring-red-500/20',
    ghost:
      'text-ink-700 hover:bg-cloud-300 hover:text-ink active:bg-cloud-400 focus:ring-forest/10',
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
