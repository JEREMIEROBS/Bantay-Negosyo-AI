import React, { useState } from 'react';
import { Modal } from '@/renderer/components/ui/Modal';
import { Button } from '@/renderer/components/ui/Button';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations } from '@/renderer/lib/i18n';
import { Product } from '@/shared/types';
import { AlertCircle, Check } from 'lucide-react';

interface AdjustStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { adjustStock, language } = useNegosyoStore();
  const t = translations[language];

  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [amount, setAmount] = useState('12');
  const [reason, setReason] = useState('Wholesale supplier delivery restock');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!product) return null;

  const parsedAmount = parseInt(amount, 10) || 0;
  const delta = adjustmentType === 'add' ? parsedAmount : -parsedAmount;
  const newStock = product.stockQty + delta;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) {
      setErrorMsg(language === 'en' ? 'Enter a valid stock quantity.' : 'Ilagay ang wastong bilang ng stock.');
      return;
    }
    if (newStock < 0) {
      setErrorMsg(language === 'en' ? 'Stock cannot fall below zero.' : 'Bawal maging negatibo ang stock ng tindahan.');
      return;
    }

    const finalReason = customReason.trim() ? `${reason}: ${customReason.trim()}` : reason;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await adjustStock({
        productId: product.id,
        quantityDelta: delta,
        reason: finalReason,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || (language === 'en' ? 'Stock adjustment failed.' : 'Nagka-aberya sa pag-adjust ng stock.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t.inventory.adjustStock}: ${product.name}`}
      subtitle={`${t.inventory.currentStock}: ${product.stockQty} ${product.unit}`}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t.common.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || newStock < 0 || parsedAmount <= 0}
            icon={<Check className="w-4 h-4" />}
          >
            {isSubmitting ? t.common.loading : `${t.common.save} (${newStock} ${product.unit})`}
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

        {/* Adjustment Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-cloud-200 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setAdjustmentType('add');
              setReason(language === 'en' ? 'Wholesale supplier delivery restock' : 'Bagong delivery mula sa wholesale supplier');
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              adjustmentType === 'add'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-600 hover:text-ink'
            }`}
          >
            + {language === 'en' ? 'Restock / Delivery' : 'Magdagdag (Restock)'}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdjustmentType('subtract');
              setReason(language === 'en' ? 'Damaged / broken merchandise' : 'Sira / Basag / Damaged goods sa lagayan');
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              adjustmentType === 'subtract'
                ? 'bg-status-danger text-white shadow-xs'
                : 'text-ink-600 hover:text-ink'
            }`}
          >
            - {language === 'en' ? 'Damage / Shrinkage' : 'Magbawas (Sira/Bawas)'}
          </button>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            {adjustmentType === 'add' ? (language === 'en' ? 'Quantity to Add' : 'Bilang ng Idaragdag') : (language === 'en' ? 'Quantity to Deduct' : 'Bilang ng Ibabawas')} ({product.unit})
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-fintech text-sm font-bold text-center"
            required
          />
        </div>

        {/* Projected Stock Preview */}
        <div className="p-3 rounded-lg bg-cloud-200 border border-cloud-400 flex items-center justify-between text-xs">
          <span>{language === 'en' ? 'Current: ' : 'Kasalukuyan: '}<strong>{product.stockQty}</strong></span>
          <span>{language === 'en' ? 'Delta: ' : 'Pagbabago: '}<strong className={delta >= 0 ? 'text-forest font-bold' : 'text-red-700 font-bold'}>{delta > 0 ? `+${delta}` : delta}</strong></span>
          <span>{language === 'en' ? 'New Total: ' : 'Magiging Stock: '}<strong className={`text-sm ${newStock <= product.reorderLevel ? 'text-amber-700' : 'text-forest'}`}>{newStock} {product.unit}</strong></span>
        </div>

        {/* Reason Selector */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            {t.inventory.reason}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input-fintech text-xs"
          >
            {adjustmentType === 'add' ? (
              <>
                <option value="Wholesale supplier delivery restock">
                  Wholesale supplier delivery restock
                </option>
                <option value="Physical count audit (surplus found)">
                  Physical count audit (surplus found)
                </option>
                <option value="Customer product return in good condition">
                  Customer product return in good condition
                </option>
              </>
            ) : (
              <>
                <option value="Damaged / broken merchandise">
                  Damaged / broken merchandise
                </option>
                <option value="Expired / spoiled goods removed">
                  Expired / spoiled goods removed
                </option>
                <option value="Physical count audit (shortage / discrepancy)">
                  Physical count audit (shortage / discrepancy)
                </option>
                <option value="Personal / family consumption">
                  Personal / family consumption
                </option>
              </>
            )}
          </select>
        </div>

        {/* Custom notes */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            {t.common.notes} ({language === 'en' ? 'Optional' : 'Opsyonal'})
          </label>
          <input
            type="text"
            placeholder={language === 'en' ? 'e.g. Delivery voucher #1049' : 'Hal. Resibo ref #1049'}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="input-fintech text-xs"
          />
        </div>
      </form>
    </Modal>
  );
};
