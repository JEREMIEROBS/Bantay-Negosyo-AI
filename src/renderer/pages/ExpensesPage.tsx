import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Card, CardHeader } from '@/renderer/components/ui/Card';
import { Button } from '@/renderer/components/ui/Button';
import { formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { ExpenseCategory } from '@/shared/types';
import {
  WalletCards,
  PlusCircle,
  Search,
  Calendar,
  AlertCircle,
  Zap,
  Home,
  Truck,
  Package,
  Users,
  Wrench,
  FileCheck,
  HelpCircle,
} from 'lucide-react';

interface ExpensesPageProps {
  onOpenNewExpense: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onOpenNewExpense }) => {
  const { expenses, kpis, language } = useNegosyoStore();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesDesc = e.description.toLowerCase().includes(q);
      const matchesCat = e.category.toLowerCase().includes(q);
      return matchesDesc || matchesCat;
    }
    return true;
  });

  // Calculate totals and category breakdown
  let totalExpensesCentavos = 0;
  const categoryTotals = new Map<string, number>();

  expenses.forEach((e) => {
    totalExpensesCentavos += e.amountCentavos;
    const current = categoryTotals.get(e.category) || 0;
    categoryTotals.set(e.category, current + e.amountCentavos);
  });

  // Category Icon Map
  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'Utilities & Power':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Rent':
        return <Home className="w-4 h-4 text-forest" />;
      case 'Transportation & Fuel':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Packaging':
        return <Package className="w-4 h-4 text-indigo-600" />;
      case 'Labor & Wages':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'Repairs & Maintenance':
        return <Wrench className="w-4 h-4 text-ink-600" />;
      case 'Permits & Fees':
        return <FileCheck className="w-4 h-4 text-teal-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-ink-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Expense KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-cloud-400 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-ink-500 font-semibold">
            <span>{t.expenses.totalExpenses}</span>
            <WalletCards className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-ink mt-2">
            {formatPHP(totalExpensesCentavos)}
          </p>
          <span className="text-[11px] text-ink-500 mt-1 block">
            {t.expenses.totalExpensesSub}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white border border-cloud-400 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-ink-500 font-semibold">
            <span>{t.expenses.dailyAverage}</span>
            <Calendar className="w-5 h-5 text-forest" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-forest mt-2">
            {formatPHP(Math.round(totalExpensesCentavos / 30))}
          </p>
          <span className="text-[11px] text-ink-500 mt-1 block">
            {t.expenses.dailyAverageSub}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span>{t.expenses.impactOnResult}</span>
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-2xl lg:text-3xl font-extrabold text-amber-950 mt-2">
            {formatPHP(kpis?.estimatedOperatingResultCentavos || 0)}
          </p>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            {t.expenses.impactOnResultSub}
          </span>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      <Card>
        <CardHeader
          title={t.expenses.categoryBreakdown}
          subtitle={t.expenses.categoryBreakdownSub}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from(categoryTotals.entries()).map(([cat, amount]) => {
            const pct =
              totalExpensesCentavos > 0
                ? Math.round((amount / totalExpensesCentavos) * 100)
                : 0;

            return (
              <div
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'border-forest bg-forest-50/50 shadow-2xs'
                    : 'border-cloud-400 bg-cloud-100/50 hover:bg-cloud-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {getCategoryIcon(cat as ExpenseCategory)}
                  <span className="text-xs font-semibold text-ink truncate">{cat}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-ink">{formatPHP(amount)}</span>
                  <span className="text-xs font-semibold text-ink-500">{pct}%</span>
                </div>
                <div className="w-full bg-cloud-300 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-forest h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Expense Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.common.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-fintech text-xs pl-9"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-fintech text-xs w-48"
          >
            <option value="all">{t.common.all}</option>
            <option value="Utilities & Power">Utilities & Power</option>
            <option value="Rent">Rent</option>
            <option value="Transportation & Fuel">Transportation & Fuel</option>
            <option value="Packaging">Packaging</option>
            <option value="Labor & Wages">Labor & Wages</option>
            <option value="Repairs & Maintenance">Repairs & Maintenance</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenNewExpense}
        >
          {t.expenses.recordExpense}
        </Button>
      </div>

      {/* Expenses Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cloud-100 border-b border-cloud-300 text-ink-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t.common.date}</th>
                <th className="py-3 px-4">{t.common.category}</th>
                <th className="py-3 px-4">{t.expenses.description}</th>
                <th className="py-3 px-4 text-right">{t.common.amount} (PHP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloud-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-ink-400">
                    {t.expenses.noExpensesFound}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const dateObj = new Date(exp.spentAt);
                  const formatted = dateObj.toLocaleDateString(
                    language === 'en' ? 'en-US' : 'en-PH',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  );

                  return (
                    <tr key={exp.id} className="hover:bg-cloud-100/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-ink-600 whitespace-nowrap">
                        {formatted}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cloud-200 text-ink-800 border border-cloud-300">
                          {getCategoryIcon(exp.category)}
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-ink max-w-md">
                        {exp.description}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-sm text-ink-950">
                        {formatPHP(exp.amountCentavos)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
