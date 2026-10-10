import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Card } from '@/renderer/components/ui/Card';
import { Button } from '@/renderer/components/ui/Button';
import { Badge } from '@/renderer/components/ui/Badge';
import { formatPHP, calculateMarginPercent } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { Product } from '@/shared/types';
import {
  Boxes,
  PlusCircle,
  Search,
  AlertTriangle,
  History,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';

interface InventoryPageProps {
  onOpenNewProduct: () => void;
  onOpenAdjustStock: (product: Product) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  onOpenNewProduct,
  onOpenAdjustStock,
}) => {
  const { products, movements, language } = useNegosyoStore();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'movements'>('products');

  // Categories list
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (lowStockOnly && p.stockQty > p.reorderLevel) {
      return false;
    }
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesSku = p.sku.toLowerCase().includes(q);
      return matchesName || matchesSku;
    }
    return true;
  });

  // Calculate inventory valuation
  let totalCostValuationCentavos = 0;
  let totalRetailValuationCentavos = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    if (p.active) {
      totalCostValuationCentavos += p.stockQty * p.costCentavos;
      totalRetailValuationCentavos += p.stockQty * p.priceCentavos;
      if (p.stockQty === 0) {
        outOfStockCount++;
      } else if (p.stockQty <= p.reorderLevel) {
        lowStockCount++;
      }
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Inventory Valuation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-cloud-400 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>{t.inventory.totalProducts}</span>
            <Boxes className="w-4 h-4 text-forest" />
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{products.length} SKU</p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {language === 'en' ? 'Active catalog items' : 'Lahat aktibo at nakatala'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-cloud-400 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>{t.inventory.inventoryAtCost}</span>
            <CircleDollarSign className="w-4 h-4 text-ink-600" />
          </div>
          <p className="text-2xl font-bold text-ink mt-1">
            {formatPHP(totalCostValuationCentavos)}
          </p>
          <span className="text-[11px] text-ink-500 mt-1 block">
            {t.inventory.inventoryAtCostSub}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-cloud-400 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>{t.inventory.inventoryAtRetail}</span>
            <TrendingUp className="w-4 h-4 text-forest" />
          </div>
          <p className="text-2xl font-bold text-forest mt-1">
            {formatPHP(totalRetailValuationCentavos)}
          </p>
          <span className="text-[11px] text-forest-700 font-semibold mt-1 block">
            +{formatPHP(totalRetailValuationCentavos - totalCostValuationCentavos)} {t.inventory.potentialProfit}
          </span>
        </div>

        <div
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`p-4 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            lowStockOnly
              ? 'bg-amber-100 border-amber-400'
              : 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-900">
            <span>{t.inventory.reorderAlert}</span>
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-amber-950 mt-1">
            {lowStockCount + outOfStockCount} {language === 'en' ? 'items' : 'produkto'}
          </p>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            {lowStockOnly
              ? (language === 'en' ? 'Filtered: Click to clear' : 'Naka-filter: I-click para alisin')
              : (language === 'en' ? 'Click to filter low stock' : 'I-click para i-filter')}
          </span>
        </div>
      </div>

      {/* Tabs: Products Table vs Movement Log */}
      <div className="flex items-center justify-between border-b border-cloud-300 gap-2 overflow-x-auto">
        <div className="flex gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-forest text-forest'
                : 'border-transparent text-ink-500 hover:text-ink'
            }`}
          >
            <Boxes className="w-4 h-4" />
            {t.inventory.productsTab} ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'movements'
                ? 'border-forest text-forest'
                : 'border-transparent text-ink-500 hover:text-ink'
            }`}
          >
            <History className="w-4 h-4" />
            {t.inventory.movementsTab} ({movements.length})
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenNewProduct}
          className="shrink-0"
        >
          {t.inventory.addProduct}
        </Button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                className="input-fintech text-xs w-44"
              >
                <option value="all">{t.common.all}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-cloud-200 px-3 py-2 rounded-lg border border-cloud-400">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                  className="rounded text-forest focus:ring-forest"
                />
                <span>{t.inventory.filterLowStock}</span>
              </label>
            </div>
          </div>

          {/* Product Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cloud-100 border-b border-cloud-300 text-ink-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">{t.common.sku}</th>
                    <th className="py-3 px-4">{t.common.product}</th>
                    <th className="py-3 px-4">{t.common.category}</th>
                    <th className="py-3 px-4 text-right">{t.common.cost}</th>
                    <th className="py-3 px-4 text-right">{t.common.price}</th>
                    <th className="py-3 px-4 text-right">{t.common.profit} / {t.common.margin}</th>
                    <th className="py-3 px-4 text-center">{t.inventory.currentStock}</th>
                    <th className="py-3 px-4 text-center">{t.inventory.reorderLevel}</th>
                    <th className="py-3 px-4 text-center">{t.common.status}</th>
                    <th className="py-3 px-4 text-center">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cloud-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-ink-400">
                        {t.inventory.noProductsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const marginPct = calculateMarginPercent(p.priceCentavos, p.costCentavos);
                      const isLowStock = p.stockQty <= p.reorderLevel;
                      const isOutOfStock = p.stockQty === 0;

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-cloud-100/60 transition-colors ${
                            isOutOfStock
                              ? 'bg-red-50/20'
                              : isLowStock
                              ? 'bg-amber-50/30'
                              : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-ink-600">
                            {p.sku}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-ink text-sm block">{p.name}</span>
                            <span className="text-[10px] text-ink-400">{t.common.unit}: {p.unit}</span>
                          </td>
                          <td className="py-3.5 px-4 text-ink-600">{p.category}</td>
                          <td className="py-3.5 px-4 text-right text-ink-500 font-medium">
                            {formatPHP(p.costCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-ink text-sm">
                            {formatPHP(p.priceCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="font-bold text-forest block">
                              +{formatPHP(p.priceCentavos - p.costCentavos)}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              {marginPct}% {t.common.margin}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1 font-bold text-sm">
                              <span
                                className={
                                  isOutOfStock
                                    ? 'text-red-700'
                                    : isLowStock
                                    ? 'text-amber-800'
                                    : 'text-ink'
                                }
                              >
                                {p.stockQty}
                              </span>
                              <span className="text-[11px] font-normal text-ink-400">
                                {p.unit}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-ink-500">
                            {p.reorderLevel} {p.unit}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isOutOfStock ? (
                              <Badge variant="danger">{t.inventory.statusOutOfStock}</Badge>
                            ) : isLowStock ? (
                              <Badge variant="warning">{t.inventory.statusLowStock}</Badge>
                            ) : (
                              <Badge variant="success">{t.inventory.statusInStock}</Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onOpenAdjustStock(p)}
                              className="text-xs py-1 px-2.5"
                            >
                              {t.inventory.adjustStock}
                            </Button>
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
      ) : (
        /* Movements Log Tab */
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cloud-100 border-b border-cloud-300 text-ink-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">{t.common.date}</th>
                  <th className="py-3 px-4">{t.common.product}</th>
                  <th className="py-3 px-4 text-center">{t.inventory.movementType}</th>
                  <th className="py-3 px-4 text-center">{t.inventory.quantityDelta}</th>
                  <th className="py-3 px-4">{t.inventory.reason}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cloud-200">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-ink-400">
                      {t.inventory.noMovementsFound}
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => {
                    const prod = products.find((p) => p.id === m.productId);
                    const isPositive = m.quantityDelta > 0;
                    const dateFormatted = new Date(m.createdAt).toLocaleString();

                    return (
                      <tr key={m.id} className="hover:bg-cloud-100/60 transition-colors">
                        <td className="py-3 px-4 text-ink-500">{dateFormatted}</td>
                        <td className="py-3 px-4 font-semibold text-ink">
                          {prod?.name || m.productId}
                          <span className="block text-[10px] font-mono text-ink-400">
                            {prod?.sku}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-cloud-200 text-ink-700">
                            {m.movementType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span
                            className={
                              isPositive
                                ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                                : 'text-red-700 bg-red-50 px-2 py-0.5 rounded'
                            }
                          >
                            {isPositive ? `+${m.quantityDelta}` : m.quantityDelta}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-ink-600">{m.reason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
