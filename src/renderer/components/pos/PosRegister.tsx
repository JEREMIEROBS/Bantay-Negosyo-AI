import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { getProductThumbnail } from '@/renderer/lib/productImages';
import { ReceiptModal } from '@/renderer/components/pos/ReceiptModal';
import { Product, Centavos, Sale } from '@/shared/types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Banknote,
  Receipt,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Store,
  WifiOff,
} from 'lucide-react';

interface PosRegisterProps {
  onExitPos?: () => void;
}

export const PosRegister: React.FC<PosRegisterProps> = ({ onExitPos }) => {
  const {
    products,
    posCart,
    addToPosCart,
    removeFromPosCart,
    updatePosCartQty,
    clearPosCart,
    recordSale,
    language,
    business,
  } = useNegosyoStore();

  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Available categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products for the POS catalog
  const filteredProducts = products.filter((p) => {
    if (!p.active) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate live cart totals
  let totalCentavos: Centavos = 0;
  let totalCostCentavos: Centavos = 0;
  let totalItemsCount = 0;

  const cartDetails = posCart.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const linePrice = prod ? prod.priceCentavos * item.qty : 0;
    const lineCost = prod ? prod.costCentavos * item.qty : 0;

    totalCentavos += linePrice;
    totalCostCentavos += lineCost;
    totalItemsCount += item.qty;

    return {
      ...item,
      product: prod,
      linePrice,
      lineCost,
    };
  });

  const estimatedProfitCentavos = totalCentavos - totalCostCentavos;

  // Tender calculations
  const parsedCashCentavos = Math.round((parseFloat(cashTendered) || 0) * 100);
  const changeDueCentavos = parsedCashCentavos > totalCentavos ? parsedCashCentavos - totalCentavos : 0;

  const handleQuickCash = (amountPesos: number) => {
    setCashTendered(amountPesos.toString());
  };

  const handleSetExact = () => {
    setCashTendered((totalCentavos / 100).toFixed(2));
  };

  const handleCheckout = async () => {
    if (cartDetails.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const sale = await recordSale({
        items: posCart.map((i) => ({ productId: i.productId, qty: i.qty })),
        notes: notes.trim() || undefined,
        soldAt: new Date().toISOString(),
      });

      setCompletedSale(sale);
      setIsReceiptOpen(true);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTransaction = () => {
    setIsReceiptOpen(false);
    setCompletedSale(null);
    setCashTendered('');
    clearPosCart();
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-cloud">
      {/* Top Counter Bar in Fullscreen Mode */}
      <div className="h-14 bg-forest text-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          {onExitPos && (
            <button
              type="button"
              onClick={onExitPos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Exit POS' : 'Bumalik sa Dashboard'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-gold" />
            <span className="font-bold text-sm tracking-tight">
              {business?.name || "Aling Nena's Sari-Sari Store"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/15 text-gold border border-white/10">
              Counter POS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200">
            <WifiOff className="w-3.5 h-3.5" />
            <span>100% Offline Active</span>
          </span>
          <span className="font-mono text-xs text-forest-100">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Product Catalog Grid */}
        <div className="flex-1 p-4 lg:p-6 flex flex-col space-y-4 overflow-y-auto">
          {/* Search & Categories */}
          <div className="space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.pos.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-cloud-400 bg-white pl-11 pr-4 py-3 text-sm text-ink placeholder-ink-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
              />
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-white text-ink-600 border border-cloud-400 hover:bg-cloud-200 hover:text-ink'
                    }`}
                  >
                    {cat === 'all' ? t.common.all : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid with Visual Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 flex-1">
            {filteredProducts.map((p) => {
              const itemInCart = posCart.find((item) => item.productId === p.id);
              const isOutOfStock = p.stockQty === 0;
              const isLowStock = p.stockQty <= p.reorderLevel;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!isOutOfStock) addToPosCart(p.id, 1);
                  }}
                  className={`relative group p-3 rounded-card bg-white border transition-all flex flex-col justify-between ${
                    isOutOfStock
                      ? 'opacity-50 cursor-not-allowed border-cloud-300'
                      : 'cursor-pointer hover:border-forest hover:shadow-card-hover border-cloud-400 active:scale-[0.98]'
                  } ${itemInCart ? 'ring-2 ring-forest border-forest bg-forest-50/20' : ''}`}
                >
                  {/* Cart Item Badge Counter */}
                  {itemInCart && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center shadow-md z-10">
                      {itemInCart.qty}
                    </span>
                  )}

                  <div>
                    {/* Visual Product Thumbnail */}
                    <div className="mb-2.5">
                      {getProductThumbnail(p.sku, p.category, p.imageUrl, p.name)}
                    </div>

                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-ink-400 uppercase truncate">
                        {p.sku}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          isOutOfStock
                            ? 'bg-red-100 text-red-800'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {p.stockQty} {p.unit}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-ink line-clamp-2 leading-snug">
                      {p.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-cloud-200 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-forest">
                      {formatPHP(p.priceCentavos)}
                    </span>
                    <span className="text-[10px] text-ink-400 font-medium">/{p.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active Order Ticket & Checkout Panel */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-cloud-400 flex flex-col justify-between shadow-card shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-cloud-300 flex items-center justify-between bg-cloud-100/60">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-forest" />
              <div>
                <h3 className="text-sm font-bold text-ink">{t.pos.cartTitle}</h3>
                <p className="text-[11px] text-ink-500 font-medium">
                  {totalItemsCount} {t.pos.itemCount} ({posCart.length} lines)
                </p>
              </div>
            </div>

            {posCart.length > 0 && (
              <button
                onClick={clearPosCart}
                className="text-xs text-ink-500 hover:text-red-700 flex items-center gap-1 font-semibold p-1 rounded hover:bg-cloud-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.pos.clearCart}
              </button>
            )}
          </div>

          {/* Cart items list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 max-h-[40vh] lg:max-h-none">
            {posCart.length === 0 ? (
              <div className="h-44 lg:h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-ink-400 border border-dashed border-cloud-400 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-ink-300" />
                <p className="text-xs font-semibold text-ink-600">{t.pos.emptyCart}</p>
                <p className="text-[11px] text-ink-400 max-w-xs">{t.pos.emptyCartSub}</p>
              </div>
            ) : (
              cartDetails.map((item) => {
                const prod = item.product;
                if (!prod) return null;

                return (
                  <div
                    key={item.productId}
                    className="p-3 rounded-xl border border-cloud-300 bg-cloud-50/60 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-semibold text-ink truncate">{prod.name}</h5>
                      <p className="text-[11px] text-ink-500 font-medium">
                        {formatPHP(prod.priceCentavos)} × {item.qty} {prod.unit}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1 bg-white border border-cloud-400 rounded-lg p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updatePosCartQty(item.productId, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-ink-600 hover:bg-cloud-200 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-ink">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updatePosCartQty(item.productId, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-ink-600 hover:bg-cloud-200 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line total & remove */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      <span className="text-xs font-bold text-ink block">
                        {formatPHP(item.linePrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromPosCart(item.productId)}
                        className="text-[10px] text-ink-400 hover:text-red-600 font-semibold transition-colors cursor-pointer"
                      >
                        {t.common.delete}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout & Cash Calculations */}
          <div className="p-4 border-t border-cloud-300 bg-cloud-50/80 space-y-3.5">
            <div>
              <input
                type="text"
                placeholder={t.pos.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-fintech text-xs bg-white"
              />
            </div>

            {/* Subtotal, COGS & Estimated Profit */}
            <div className="p-3 rounded-xl bg-white border border-cloud-300 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-ink-600">
                <span>{t.pos.totalCost}:</span>
                <span className="font-medium text-ink">{formatPHP(totalCostCentavos)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold" />
                  {t.pos.grossProfit}:
                </span>
                <span>+{formatPHP(estimatedProfitCentavos)}</span>
              </div>
              <div className="pt-2 border-t border-cloud-200 flex items-baseline justify-between text-base font-extrabold text-ink">
                <span>{t.common.total}:</span>
                <span className="text-xl text-forest font-bold">{formatPHP(totalCentavos)}</span>
              </div>
            </div>

            {/* Cash Tender & Change Due */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-forest" />
                  {t.pos.cashTendered}
                </span>
                <button
                  type="button"
                  onClick={handleSetExact}
                  className="text-[11px] font-bold text-forest hover:underline cursor-pointer"
                >
                  {t.pos.exactAmount}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickCash(amt)}
                    className="py-1.5 px-2 rounded-lg bg-white border border-cloud-400 text-xs font-semibold text-ink hover:bg-cloud-200 transition-colors cursor-pointer"
                  >
                    ₱{amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-400">
                  ₱
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="input-fintech pl-7 text-sm font-bold text-ink"
                />
              </div>

              {parsedCashCentavos > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>{t.pos.changeDue}:</span>
                  <span className="text-base text-emerald-800">{formatPHP(changeDueCentavos)}</span>
                </div>
              )}
            </div>

            {/* Big Complete Sale button */}
            <button
              type="button"
              disabled={posCart.length === 0 || isSubmitting}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-800 active:bg-forest-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Check className="w-5 h-5" />
              {isSubmitting
                ? t.pos.completing
                : `${t.pos.completeSale} • ${formatPHP(totalCentavos)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal
        sale={completedSale}
        cashTenderedPesos={cashTendered}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onNextTransaction={handleNextTransaction}
      />
    </div>
  );
};
