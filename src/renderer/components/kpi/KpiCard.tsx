import React from 'react';
import { Card } from '@/renderer/components/ui/Card';
import { formatPHP } from '@/renderer/lib/currency';
import { Centavos } from '@/shared/types';
import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';

interface KpiCardProps {
  title: string;
  subtitle?: string;
  amountCentavos: Centavos;
  deltaPercent?: number | null;
  deltaLabel?: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'neutral' | 'accent' | 'warning' | 'danger';
  omissionNotice?: string;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  subtitle,
  amountCentavos,
  deltaPercent,
  deltaLabel = 'vs last month',
  icon,
  variant = 'neutral',
  omissionNotice,
  badge,
}) => {
  const isNegative = amountCentavos < 0;

  const borderVariant = {
    primary: 'border-forest/30 bg-gradient-to-b from-white to-forest-50/20',
    neutral: 'border-cloud-400 bg-white',
    accent: 'border-gold/40 bg-gradient-to-b from-white to-gold-50/20',
    warning: 'border-amber-300 bg-amber-50/20',
    danger: 'border-red-300 bg-red-50/20',
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all flex flex-col justify-between min-w-0 p-4 sm:p-5 h-full ${borderVariant[variant]}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-ink-600 tracking-wider uppercase truncate">
                {title}
              </span>
              {badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cloud-300 text-ink-700 shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-ink-500 mt-0.5 truncate" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="p-2 rounded-xl bg-cloud-200 text-forest shrink-0">
            {icon}
          </div>
        </div>

        {/* Primary Value Display */}
        <div className="mt-3.5">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight font-sans whitespace-nowrap overflow-hidden text-ellipsis ${
                isNegative ? 'text-red-700' : 'text-ink-950'
              }`}
            >
              {formatPHP(amountCentavos)}
            </span>
          </div>

          {/* Delta pill if provided */}
          {deltaPercent !== undefined && deltaPercent !== null ? (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              {deltaPercent >= 0 ? (
                <span className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-200">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{deltaPercent}%
                </span>
              ) : (
                <span className="inline-flex items-center font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded text-[10px] border border-red-200">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {deltaPercent}%
                </span>
              )}
              <span className="text-ink-500 text-[10px] truncate">{deltaLabel}</span>
            </div>
          ) : (
            <div className="h-5" /> /* Spacer to align cards */
          )}
        </div>
      </div>

      {/* Omission Caveat */}
      {omissionNotice ? (
        <div
          className="mt-3 pt-2 border-t border-cloud-300/80 flex items-start gap-1 text-[10px] text-amber-900 bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/60 leading-tight"
          title={omissionNotice}
        >
          <Info className="w-3 h-3 text-amber-700 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{omissionNotice}</span>
        </div>
      ) : (
        <div className="mt-2" />
      )}
    </Card>
  );
};
