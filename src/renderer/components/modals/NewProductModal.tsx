import React, { useState, useEffect } from 'react';
import { Modal } from '@/renderer/components/ui/Modal';
import { Button } from '@/renderer/components/ui/Button';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { parsePesosToCentavos, calculateMarginPercent, formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { ProductUnit } from '@/shared/types';
import {
  searchProductCatalog,
  CatalogProductItem,
} from '@/renderer/lib/openProductCatalog';
import {
  Check,
  AlertCircle,
  Search,
  Sparkles,
  Barcode,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, language } = useNegosyoStore();
  const t = translations[language];

  // Auto-lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CatalogProductItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Form fields
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [unit, setUnit] = useState<ProductUnit>('piraso');
  const [sellingPrice, setSellingPrice] = useState('20.00');
  const [costPrice, setCostPrice] = useState('15.00');
  const [stockQty, setStockQty] = useState('24');
  const [reorderLevel, setReorderLevel] = useState('10');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const priceCents = parsePesosToCentavos(sellingPrice);
  const costCents = parsePesosToCentavos(costPrice);
  const marginPct = calculateMarginPercent(priceCents, costCents);

  // Live query debounce
  useEffect(() => {
    if (!lookupQuery.trim() || lookupQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProductCatalog(lookupQuery);
        setSuggestions(results);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [lookupQuery]);

  const handleApplySuggestion = (item: CatalogProductItem) => {
    setSku(item.sku);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.unit);
    setSellingPrice((item.suggestedPriceCentavos / 100).toFixed(2));
    setCostPrice((item.suggestedCostCentavos / 100).toFixed(2));
    setStockQty(String(item.defaultStockQty));
    setReorderLevel(String(item.reorderLevel));
    setImageUrl(item.imageUrl);
    setSelectedSource(
      item.source === 'ph_master_catalog'
        ? 'Philippine FMCG Catalog'
        : 'Open Food Facts Public API'
    );
    setLookupQuery('');
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) {
      setErrorMsg(
        language === 'en'
          ? 'SKU and Product Name are required.'
          : 'Punan ang SKU at Pangalan ng Produkto.'
      );
      return;
    }
    if (priceCents < 0 || costCents < 0) {
      setErrorMsg(
        language === 'en'
          ? 'Price and wholesale cost cannot be negative.'
          : 'Bawal maging negatibo ang presyo o puhunan.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await addProduct({
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        category: category.trim(),
        unit,
        priceCentavos: priceCents,
        costCentavos: costCents,
        stockQty: parseInt(stockQty, 10) || 0,
        reorderLevel: parseInt(reorderLevel, 10) || 0,
        imageUrl: imageUrl.trim() || undefined,
      });

      // Reset
      setLookupQuery('');
      setSku('');
      setName('');
      setImageUrl('');
      setSelectedSource(null);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          (language === 'en'
            ? 'Error adding product.'
            : 'Nagka-aberya sa pagdagdag ng produkto.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        language === 'en'
          ? 'Add Product with Auto-Supplement'
          : 'Magdagdag ng Paninda (May Auto-Fill)'
      }
      subtitle={
        language === 'en'
          ? 'Search by name or scan barcode to automatically fill packaging, unit, price, and real packshot image.'
          : 'Mag-type ng pangalan o mag-scan ng barcode para kusang mapunan ang detalye at totoong litrato.'
      }
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t.common.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            icon={<Check className="w-4 h-4" />}
          >
            {isSubmitting
              ? t.common.loading
              : language === 'en'
              ? 'Save to Inventory'
              : 'I-save sa Inventory'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TOP: Auto-Lookup & Auto-Supplement Bar */}
        <div className="p-3.5 bg-forest-50/70 border border-forest-200 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-forest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>
                {language === 'en'
                  ? 'Smart Auto-Lookup (Public Barcode & FMCG API)'
                  : 'Mabilisang Auto-Lookup (Barcode / FMCG Catalog)'}
              </span>
            </label>
            <span className="text-[10px] font-semibold text-forest-700 bg-white/80 px-2 py-0.5 rounded-full border border-forest-200">
              {language === 'en' ? 'Offline + Public API Ready' : '100% Offline + Online API'}
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-forest-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'en'
                  ? 'Type barcode (e.g. 4807770...) or name (e.g. Lucky Me, Milo, Kopiko, 555)...'
                  : 'Mag-type ng barcode o pangalan (hal. Lucky Me, Milo, Kopiko, 555)...'
              }
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="input-fintech text-xs pl-9 pr-8 bg-white border-forest-300 focus:border-forest"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-400 font-medium animate-pulse">
                ...
              </span>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-cloud-400 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-cloud-200">
              {suggestions.map((item) => (
                <div
                  key={item.barcode + item.sku}
                  onClick={() => handleApplySuggestion(item)}
                  className="p-2.5 hover:bg-forest-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded bg-white border border-cloud-300 shrink-0 p-0.5"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-cloud-200 flex items-center justify-center shrink-0">
                        <Barcode className="w-5 h-5 text-ink-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-500 truncate">
                        {item.brand} • {item.category} • SKU: {item.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-forest">
                      {formatPHP(item.suggestedPriceCentavos)}
                    </span>
                    <span className="block text-[9px] text-emerald-700 font-semibold flex items-center gap-0.5 justify-end">
                      <Zap className="w-2.5 h-2.5" /> Auto-fill
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSource && (
            <div className="text-[11px] text-forest-800 font-medium flex items-center gap-1.5 pt-1">
              <Check className="w-3.5 h-3.5 text-forest" />
              <span>
                {language === 'en'
                  ? `Details and packshot auto-supplemented from ${selectedSource}.`
                  : `Kusang napunan ang detalye mula sa ${selectedSource}.`}
              </span>
            </div>
          )}
        </div>

        {/* Live Image & Basic Info Row */}
        <div className="grid grid-cols-12 gap-3.5">
          {/* Left: Packshot Preview */}
          <div className="col-span-12 sm:col-span-4">
            <label className="block text-xs font-semibold text-ink mb-1">
              {language === 'en' ? 'Product Packshot' : 'Litrato ng Produkto'}
            </label>
            <div className="h-32 rounded-xl border border-cloud-300 bg-white flex flex-col items-center justify-center p-2 relative overflow-hidden group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || 'Product'}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-ink-300 text-center">
                  <ImageIcon className="w-8 h-8 mb-1 text-ink-300" />
                  <span className="text-[10px]">No image yet</span>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="/products/... or https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-fintech text-[10px] mt-1.5 truncate"
            />
          </div>

          {/* Right: SKU & Product Name */}
          <div className="col-span-12 sm:col-span-8 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.common.sku} / Barcode *
              </label>
              <input
                type="text"
                placeholder="e.g. CAN-ORI-004 or 480777..."
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="input-fintech text-xs uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.common.product} {language === 'en' ? 'Name' : 'Pangalan'} *
              </label>
              <input
                type="text"
                placeholder="e.g. Lucky Me! Pancit Canton Sweet & Spicy 60g"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-fintech text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Category & Unit */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6 sm:col-span-6">
            <label className="block text-xs font-semibold text-ink mb-1">{t.common.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-fintech text-xs"
            >
              <option value="Beverages">Beverages</option>
              <option value="Instant Noodles">Instant Noodles</option>
              <option value="Canned Goods">Canned Goods</option>
              <option value="Snacks">Snacks & Biscuits</option>
              <option value="Grains & Staple">Grains & Staple</option>
              <option value="Condiments">Condiments</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Household & Laundry">Household & Laundry</option>
              <option value="Bakery">Bakery & Bread</option>
              <option value="Liquor & Beer">Liquor & Beer</option>
            </select>
          </div>

          <div className="col-span-6 sm:col-span-6">
            <label className="block text-xs font-semibold text-ink mb-1">{t.common.unit}</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as ProductUnit)}
              className="input-fintech text-xs"
            >
              <option value="pakete">pakete (pack)</option>
              <option value="sachet">sachet</option>
              <option value="lata">lata (can)</option>
              <option value="bote">bote (bottle)</option>
              <option value="piraso">piraso (piece)</option>
              <option value="kilo">kilo (kg)</option>
              <option value="balot">balot (bag)</option>
              <option value="litro">litro (liter)</option>
            </select>
          </div>
        </div>

        {/* Pricing & Profit Margin Preview */}
        <div className="grid grid-cols-12 gap-3 p-3 bg-cloud-100 rounded-xl border border-cloud-300">
          <div className="col-span-6 sm:col-span-4">
            <label className="block text-xs font-semibold text-ink mb-1">
              {language === 'en' ? 'Wholesale Cost (₱)' : 'Puhunan (₱)'} *
            </label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="input-fintech text-xs"
              required
            />
          </div>

          <div className="col-span-6 sm:col-span-4">
            <label className="block text-xs font-semibold text-ink mb-1">
              {language === 'en' ? 'Retail Price (₱)' : 'Presyo ng Benta (₱)'} *
            </label>
            <input
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="input-fintech text-xs font-bold text-forest"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-4 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-cloud-300 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-[10px] text-ink-500 font-medium">
              {language === 'en' ? 'Estimated Profit Margin' : 'Tantiya ng Tubo'}:
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-sm font-extrabold ${
                  marginPct >= 20
                    ? 'text-forest'
                    : marginPct > 0
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}
              >
                {marginPct.toFixed(1)}%
              </span>
              <span className="text-xs text-ink-600 font-semibold">
                (+{formatPHP(Math.max(0, priceCents - costCents))})
              </span>
            </div>
          </div>
        </div>

        {/* Initial Stock & Reorder Level */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6">
            <label className="block text-xs font-semibold text-ink mb-1">
              {language === 'en' ? 'Initial Stock Quantity' : 'Paunang Bilang ng Stock'}
            </label>
            <input
              type="number"
              min="0"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              className="input-fintech text-xs"
            />
          </div>

          <div className="col-span-6">
            <label className="block text-xs font-semibold text-ink mb-1">
              {language === 'en' ? 'Low Stock Reorder Alert' : 'Reorder Alert Threshold'}
            </label>
            <input
              type="number"
              min="1"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              className="input-fintech text-xs"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
