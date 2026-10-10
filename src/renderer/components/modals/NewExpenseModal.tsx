import React, { useState } from 'react';
import { Modal } from '@/renderer/components/ui/Modal';
import { Button } from '@/renderer/components/ui/Button';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { parsePesosToCentavos, formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { ExpenseCategory } from '@/shared/types';
import { Check, AlertCircle } from 'lucide-react';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { recordExpense, language } = useNegosyoStore();
  const t = translations[language];

  const [category, setCategory] = useState<ExpenseCategory>('Utilities & Power');
  const [amount, setAmount] = useState('500.00');
  const [spentAt, setSpentAt] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const amountCentavos = parsePesosToCentavos(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountCentavos <= 0) {
      setErrorMsg(language === 'en' ? 'Enter a valid expense amount.' : 'Ilagay ang wastong halaga ng gastos.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg(language === 'en' ? 'Enter a brief description (e.g. electric bill or sando bags).' : 'Maglagay ng maikling paglalarawan (hal. Meralco bill o sando bag).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await recordExpense({
        category,
        amountCentavos,
        spentAt: new Date(spentAt).toISOString(),
        description: description.trim(),
      });

      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || (language === 'en' ? 'Failed to record expense.' : 'Nagka-aberya sa pagtala ng gastos.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.expenses.recordExpense}
      subtitle={language === 'en' ? 'Operating expenses are automatically subtracted from Gross Profit to compute Estimated Operating Result.' : 'Bawat naitalang gastos ay awtomatikong ibabawas sa Gross Profit para makuha ang Estimated Operating Result.'}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t.common.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || amountCentavos <= 0}
            icon={<Check className="w-4 h-4" />}
          >
            {isSubmitting ? t.common.loading : `${t.common.save} (${formatPHP(amountCentavos)})`}
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

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">{t.common.category} *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="input-fintech text-xs"
          >
            <option value="Utilities & Power">Utilities & Power</option>
            <option value="Rent">Rent</option>
            <option value="Transportation & Fuel">Transportation & Fuel</option>
            <option value="Packaging">Packaging</option>
            <option value="Labor & Wages">Labor & Wages</option>
            <option value="Repairs & Maintenance">Repairs & Maintenance</option>
            <option value="Permits & Fees">Permits & Fees</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">{t.common.amount} (PHP) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-fintech text-sm font-bold text-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">{t.common.date} *</label>
            <input
              type="date"
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              className="input-fintech text-xs"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            {t.expenses.description} *
          </label>
          <textarea
            rows={2}
            placeholder={language === 'en' ? 'e.g. Electric power bill for store chillers or market sando bags' : 'Hal. Binayarang kuryente sa Meralco para sa ref o sando bag'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-fintech text-xs"
            required
          />
        </div>

        {/* Informative Caveat Banner */}
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <strong>Notice:</strong> {language === 'en' ? 'Unrecorded expenses (e.g. home rent or unrecorded wages) mean the calculated operating result remains estimated.' : 'Ang naitalang gastos dito ay ibabawas sa iyong Gross Profit. Ang mga hindi naitalang gastusin ay hindi masasalamin sa resulta.'}
        </div>
      </form>
    </Modal>
  );
};
