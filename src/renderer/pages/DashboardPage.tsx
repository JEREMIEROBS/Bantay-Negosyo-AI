import React from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { KpiCard } from '@/renderer/components/kpi/KpiCard';
import { Card, CardHeader } from '@/renderer/components/ui/Card';
import { Button } from '@/renderer/components/ui/Button';
import { Badge } from '@/renderer/components/ui/Badge';
import { formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { Product } from '@/shared/types';
import {
  TrendingUp,
  Boxes,
  CircleDollarSign,
  Receipt,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Bot,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (route: any) => void;
  onOpenPos: () => void;
  onSelectProductForStock: (prod: Product) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenPos,
  onSelectProductForStock,
}) => {
  const { kpis, dailyTrend, topProducts, products, askAdvisor, language } = useNegosyoStore();
  const t = translations[language];

  if (!kpis) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest" />
      </div>
    );
  }

  const lowStockItems = products.filter((p) => p.active && p.stockQty <= p.reorderLevel);

  // Transform trend data for chart
  const chartData = dailyTrend.map((d) => ({
    name: d.formattedDate,
    Revenue: Math.round(d.revenueCentavos / 100),
    Profit: Math.round(d.grossProfitCentavos / 100),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-card bg-forest text-white shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg">{t.dashboard.welcome}</span>
            <Badge variant="demo" className="text-[10px]">
              {t.common.demoBadge}
            </Badge>
          </div>
          <p className="text-xs text-forest-100 max-w-xl leading-relaxed">
            {t.dashboard.welcomeSub}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="accent"
            size="sm"
            icon={<Bot className="w-4 h-4" />}
            onClick={() => onNavigate('advisor')}
          >
            {t.dashboard.analyzeAi}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ShoppingBag className="w-4 h-4" />}
            onClick={onOpenPos}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            {t.dashboard.recordSale}
          </Button>
        </div>
      </div>

      {/* 5 Core Financial KPIs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-ink uppercase tracking-wider">
            {t.dashboard.financialKpis}
          </h2>
          <span className="text-xs text-ink-500 font-medium">{t.dashboard.last30Days}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 items-stretch">
          {/* 1. Revenue */}
          <KpiCard
            title={t.dashboard.revenue}
            subtitle={t.dashboard.revenueSub}
            amountCentavos={kpis.revenueCentavos}
            deltaPercent={8.4}
            deltaLabel={language === 'en' ? 'vs last month' : 'vs nakaraang buwan'}
            icon={<CircleDollarSign className="w-5 h-5 text-forest" />}
            variant="primary"
          />

          {/* 2. COGS */}
          <KpiCard
            title={t.dashboard.cogs}
            subtitle={t.dashboard.cogsSub}
            amountCentavos={kpis.cogsCentavos}
            icon={<ShoppingBag className="w-5 h-5 text-ink-600" />}
            variant="neutral"
          />

          {/* 3. Gross Profit */}
          <KpiCard
            title={t.dashboard.grossProfit}
            subtitle={t.dashboard.grossProfitSub}
            amountCentavos={kpis.grossProfitCentavos}
            deltaPercent={12.1}
            deltaLabel={language === 'en' ? 'healthy margin' : 'magandang margin'}
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            variant="accent"
          />

          {/* 4. Operating Expenses */}
          <KpiCard
            title={t.dashboard.expenses}
            subtitle={t.dashboard.expensesSub}
            amountCentavos={kpis.operatingExpensesCentavos}
            icon={<Wallet className="w-5 h-5 text-amber-700" />}
            variant="warning"
          />

          {/* 5. Estimated Operating Result */}
          <KpiCard
            title={t.dashboard.operatingResult}
            subtitle={t.dashboard.operatingResultSub}
            amountCentavos={kpis.estimatedOperatingResultCentavos}
            icon={<Receipt className="w-5 h-5 text-forest" />}
            variant="primary"
            omissionNotice={t.dashboard.omissionNotice}
          />
        </div>
      </section>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-cloud-400 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-ink-500">{t.dashboard.completedSales}</span>
            <p className="text-xl font-bold text-ink mt-0.5">
              {kpis.completedSalesCount} {language === 'en' ? 'orders' : 'benta'}
            </p>
          </div>
          <Receipt className="w-6 h-6 text-ink-400" />
        </div>

        <div className="p-4 rounded-xl bg-white border border-cloud-400 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-ink-500">{t.dashboard.avgOrderValue}</span>
            <p className="text-xl font-bold text-ink mt-0.5">
              {formatPHP(kpis.averageOrderValueCentavos)}
            </p>
          </div>
          <CircleDollarSign className="w-6 h-6 text-forest" />
        </div>

        <div
          onClick={() => onNavigate('inventory')}
          className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 flex items-center justify-between shadow-2xs cursor-pointer hover:bg-amber-100/50 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-amber-900">{t.dashboard.lowStockAlerts}</span>
            <p className="text-xl font-bold text-amber-950 mt-0.5">
              {kpis.lowStockCount} {language === 'en' ? 'products' : 'produkto'}
            </p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Main Grid: Sales Trend + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title={t.dashboard.salesTrend}
                subtitle={t.dashboard.salesTrendSub}
                action={
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-forest">
                      <span className="w-3 h-3 rounded bg-forest" /> {language === 'en' ? 'Revenue' : 'Benta'}
                    </span>
                    <span className="flex items-center gap-1.5 text-gold-600">
                      <span className="w-3 h-3 rounded bg-gold" /> {language === 'en' ? 'Profit' : 'Tubo'}
                    </span>
                  </div>
                }
              />

              <div className="h-60 sm:h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#116149" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#116149" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E9B44C" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#E9B44C" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECEFEA" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#678B85"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#ECEFEA' }}
                    />
                    <YAxis
                      stroke="#678B85"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₱${val}`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₱${val.toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D2D9CD',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(23, 43, 40, 0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#116149"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Profit"
                      stroke="#E9B44C"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-cloud-300 mt-4 flex items-center justify-between text-xs text-ink-500">
              <span>{language === 'en' ? 'Consistent weekend sales peaks observed.' : 'Konsistent na benta tuwing Biyernes at Sabado.'}</span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('sales')}>
                {t.dashboard.viewAllSales} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Top 5 Bestselling Products by Profit (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title={t.dashboard.topProducts}
                subtitle={t.dashboard.topProductsSub}
                action={
                  <Badge variant="default" className="text-[10px]">
                    Top 5
                  </Badge>
                }
              />

              <div className="space-y-3 mt-2">
                {topProducts.map((p, index) => (
                  <div
                    key={p.productId}
                    className="p-3 rounded-lg border border-cloud-400 bg-cloud-100/50 hover:bg-cloud-200 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-forest text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{p.name}</p>
                        <p className="text-[11px] text-ink-500 font-mono">
                          {p.sku} • {p.qtySold} {language === 'en' ? 'sold' : 'nabenta'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <p className="font-bold text-forest text-sm">
                        {formatPHP(p.grossProfitCentavos)}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        {p.marginPercent}% {t.common.margin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-cloud-300 mt-4 flex items-center justify-between text-xs text-ink-500">
              <span>{language === 'en' ? 'Ranked from 30 days of sales.' : 'Base sa 30-araw na naitalang resibo.'}</span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('inventory')}>
                {t.dashboard.goToInventory} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Low-Stock Alerts & Quick AI Advisor Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Panel (6 cols) */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title={`${t.dashboard.lowStockPanel} (${lowStockItems.length})`}
              subtitle={t.dashboard.lowStockPanelSub}
              action={
                <Button variant="secondary" size="sm" onClick={() => onNavigate('inventory')}>
                  {t.dashboard.manageAll}
                </Button>
              }
            />

            {lowStockItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-500">
                {t.dashboard.allStockSufficient}
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg border border-amber-300 bg-amber-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-[11px] text-amber-900 mt-0.5">
                        {language === 'en' ? 'Remaining: ' : 'Natitira: '}
                        <strong>{p.stockQty} {p.unit}</strong>{' '}
                        ({language === 'en' ? 'Reorder threshold: ' : 'Reorder alert: '}{p.reorderLevel})
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectProductForStock(p)}
                      className="border-amber-300 hover:bg-amber-100 text-amber-900 text-xs py-1 px-2.5"
                    >
                      {t.dashboard.restock}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Ask AI Advisor Quick Launch (6 cols) */}
        <div className="lg:col-span-6">
          <Card className="border-forest/30 bg-gradient-to-br from-white to-forest-50/30">
            <CardHeader
              title={t.dashboard.askAiTitle}
              subtitle={t.dashboard.askAiSub}
              action={
                <Badge variant="default" className="text-[10px]">
                  {t.common.offlineBadge}
                </Badge>
              }
            />

            <div className="space-y-2.5">
              <p className="text-xs text-ink-600">{t.dashboard.pickQuestion}</p>

              <button
                onClick={async () => {
                  await askAdvisor(
                    language === 'en'
                      ? 'What are my top 3 products by gross profit this month?'
                      : 'Ano ang top 3 produkto ko base sa gross profit ngayong buwan?'
                  );
                  onNavigate('advisor');
                }}
                className="w-full text-left p-2.5 rounded-lg border border-cloud-400 bg-white hover:border-forest hover:bg-forest-50/30 transition-all text-xs font-medium text-ink flex items-center justify-between group cursor-pointer"
              >
                <span>
                  💡 "{language === 'en' ? 'What are my top 3 products by gross profit?' : 'Ano ang top 3 produkto ko base sa gross profit ngayong buwan?'}"
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-400 group-hover:text-forest transition-colors" />
              </button>

              <button
                onClick={async () => {
                  await askAdvisor(
                    language === 'en'
                      ? 'Why is estimated operating result lower than gross profit?'
                      : 'Bakit mas mababa ang estimated operating result kaysa gross profit?'
                  );
                  onNavigate('advisor');
                }}
                className="w-full text-left p-2.5 rounded-lg border border-cloud-400 bg-white hover:border-forest hover:bg-forest-50/30 transition-all text-xs font-medium text-ink flex items-center justify-between group cursor-pointer"
              >
                <span>
                  🔍 "{language === 'en' ? 'Why is operating result lower than gross profit?' : 'Bakit mas mababa ang estimated operating result kaysa gross profit?'}"
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-400 group-hover:text-forest transition-colors" />
              </button>

              <button
                onClick={async () => {
                  await askAdvisor(
                    language === 'en'
                      ? 'Which products need urgent restocking due to low inventory?'
                      : 'Aling mga produkto ang kailangang i-reorder agad dahil paubos na?'
                  );
                  onNavigate('advisor');
                }}
                className="w-full text-left p-2.5 rounded-lg border border-cloud-400 bg-white hover:border-forest hover:bg-forest-50/30 transition-all text-xs font-medium text-ink flex items-center justify-between group cursor-pointer"
              >
                <span>
                  ⚠️ "{language === 'en' ? 'Which products need urgent restocking?' : 'Aling mga produkto ang kailangang i-reorder agad dahil paubos na?'}"
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-400 group-hover:text-forest transition-colors" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
