import React, { useState } from 'react';
import { Modal } from '@/renderer/components/ui/Modal';
import { Button } from '@/renderer/components/ui/Button';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { formatPHP } from '@/renderer/lib/currency';
import { Plus, Trash2, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { Centavos } from '@/shared/types';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  productId: string;
  qty: number;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose }) => {
  const { products, recordSale } = useNegosyoStore();
  const [items, setItems] = useState<CartItem[]>([
    { productId: products[0]?.id || '', qty: 1 },
  ]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available active products
  const activeProducts = products.filter((p) => p.active);

  const handleAddItem = () => {
    // Pick first product not already in cart if possible
    const unusedProduct = activeProducts.find(
      (p) => !items.some((item) => item.productId === p.id)
    );
    setItems([
      ...items,
      { productId: unusedProduct?.id || activeProducts[0]?.id || '', qty: 1 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const updated = [...items];
    updated[index].productId = productId;
    setItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].qty = Math.max(1, qty);
    setItems(updated);
  };

  // Compute live totals
  let totalCentavos: Centavos = 0;
  let totalCostCentavos: Centavos = 0;
  let hasStockError = false;
  let stockErrorMessage = '';

  items.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      totalCentavos += prod.priceCentavos * item.qty;
      totalCostCentavos += prod.costCentavos * item.qty;
      if (item.qty > prod.stockQty) {
        hasStockError = true;
        stockErrorMessage = `Kulang ang stock para sa "${prod.name}" (Kasalukuyang stock: ${prod.stockQty}, Hiniling: ${item.qty})`;
      }
    }
  });

  const estimatedProfitCentavos = totalCentavos - totalCostCentavos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Pumili ng kahit isang aytem.');
      return;
    }
    if (hasStockError) {
      setErrorMsg(stockErrorMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await recordSale({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        notes: notes.trim() || undefined,
        soldAt: new Date().toISOString(),
      });

      // Reset and close
      setItems([{ productId: products[0]?.id || '', qty: 1 }]);
      setNotes('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Nagka-aberya sa pag-record ng benta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mag-record ng Bagong Benta (New Sale)"
      subtitle="Bawat transaksyon ay kagyat na magbabawas sa stock at magko-compute ng tubo."
      maxWidth="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Kanselahin
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || hasStockError || items.length === 0}
            icon={<Check className="w-4 h-4" />}
          >
            {isSubmitting ? 'Inirerecord...' : `Kumpirmahin Benta (${formatPHP(totalCentavos)})`}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Line Items Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              Mga Aytem sa Resibo / Counter ({items.length})
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddItem}
            >
              Magdagdag ng Aytem
            </Button>
          </div>

          <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
            {items.map((item, index) => {
              const selectedProd = products.find((p) => p.id === item.productId);
              const isItemOverStock = selectedProd && item.qty > selectedProd.stockQty;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl border transition-all ${
                    isItemOverStock
                      ? 'border-red-300 bg-red-50/30'
                      : 'border-cloud-400 bg-cloud-50 hover:border-cloud-500'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Product Selector */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-[11px] font-medium text-ink-500 mb-1">
                        Pumili ng Produkto
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        className="input-fintech text-xs"
                      >
                        {activeProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatPHP(p.priceCentavos)} (Stock: {p.stockQty} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Spinner */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-[11px] font-medium text-ink-500 mb-1">
                        Dami (Qty)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(index, parseInt(e.target.value, 10) || 1)}
                          className="input-fintech text-xs text-center font-semibold"
                        />
                        <span className="text-xs text-ink-500 shrink-0">
                          {selectedProd?.unit || 'pc'}
                        </span>
                      </div>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="col-span-6 sm:col-span-3 flex items-center justify-between pt-4 sm:pt-0">
                      <div className="text-right flex-1 sm:mr-2">
                        <span className="block text-[11px] text-ink-400">Halaga</span>
                        <span className="text-sm font-bold text-ink">
                          {selectedProd
                            ? formatPHP(selectedProd.priceCentavos * item.qty)
                            : '₱0.00'}
                        </span>
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-ink-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          title="Alisin ang aytem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stock warning row */}
                  {isItemOverStock && (
                    <p className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Kulang ang stock! {selectedProd.stockQty} na lang ang natitira sa estante.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes input */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Tala / Customer Notes (Opsyonal)
          </label>
          <input
            type="text"
            placeholder="Hal. Binayaran ng buo, Sukli ₱20, o suking kapitbahay"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-fintech text-xs"
          />
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-600">
            <span>Kabuuang Puhunan (COGS):</span>
            <span className="font-medium text-ink">{formatPHP(totalCostCentavos)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
            <span>Tinatayang Tubo (Gross Profit):</span>
            <span>+{formatPHP(estimatedProfitCentavos)}</span>
          </div>
          <div className="pt-2 border-t border-forest-200/80 flex items-center justify-between text-base font-extrabold text-forest-950">
            <span>Kabuuang Bayarin (Total Due):</span>
            <span className="text-lg text-forest font-bold">{formatPHP(totalCentavos)}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
