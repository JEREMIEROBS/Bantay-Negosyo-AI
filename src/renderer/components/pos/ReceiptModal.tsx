import React from 'react';
import { Modal } from '@/renderer/components/ui/Modal';
import { Button } from '@/renderer/components/ui/Button';
import { formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Sale } from '@/shared/types';
import { Printer, ArrowRight, CheckCircle2, Store } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  cashTenderedPesos?: string;
  isOpen: boolean;
  onClose: () => void;
  onNextTransaction: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  cashTenderedPesos = '',
  isOpen,
  onClose,
  onNextTransaction,
}) => {
  const { business, language } = useNegosyoStore();
  const t = translations[language];

  if (!sale || !isOpen) return null;

  const parsedCashCentavos = Math.round((parseFloat(cashTenderedPesos) || 0) * 100);
  const tenderCentavos = parsedCashCentavos >= sale.totalCentavos ? parsedCashCentavos : sale.totalCentavos;
  const changeDueCentavos = tenderCentavos - sale.totalCentavos;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'en' ? 'Official Counter Receipt' : 'Opisyal na Resibo ng Benta'}
      subtitle={language === 'en' ? 'Review transaction summary or print receipt for customer' : 'Suriin ang resibo o i-print para sa mamimili'}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="secondary"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            {language === 'en' ? 'Print Receipt' : 'I-print ang Resibo'}
          </Button>

          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onNextTransaction}
          >
            {t.pos.newTransaction}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Success Banner */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.pos.saleSuccessMsg}</span>
        </div>

        {/* Printable Thermal Receipt Paper Style */}
        <div
          id="printable-receipt"
          className="p-6 bg-white border border-cloud-400 rounded-lg shadow-inner font-mono text-xs text-ink space-y-4 max-w-sm mx-auto"
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-cloud-400">
            <h3 className="font-bold text-sm uppercase tracking-tight text-ink">
              {business?.name || "Aling Nena's Sari-Sari Store"}
            </h3>
            <p className="text-[10px] text-ink-500">
              {business?.barangay || 'Brgy. San Roque'}, {business?.city || 'Pasig City'}
            </p>
            <p className="text-[10px] text-ink-500">NON-VAT REG TIN: 123-456-789-00000</p>
            <p className="text-[10px] font-bold text-forest pt-1">
              OFFICIAL RECEIPT #{sale.id}
            </p>
            <p className="text-[10px] text-ink-400">
              {new Date(sale.soldAt).toLocaleString()}
            </p>
          </div>

          {/* Line items */}
          <div className="space-y-2 pb-3 border-b border-dashed border-cloud-400">
            <div className="flex justify-between text-[11px] font-bold text-ink-600 border-b border-cloud-200 pb-1">
              <span>ITEM / QTY</span>
              <span>TOTAL</span>
            </div>
            {sale.items.map((item) => (
              <div key={item.id} className="text-[11px] leading-tight space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-medium truncate max-w-[190px]">
                    {item.productName || item.productId}
                  </span>
                  <span className="font-bold">
                    {formatPHP(item.unitPriceCentavos * item.qty)}
                  </span>
                </div>
                <div className="text-[10px] text-ink-400">
                  {item.qty} × {formatPHP(item.unitPriceCentavos)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Tender */}
          <div className="space-y-1.5 text-xs pb-3 border-b border-dashed border-cloud-400">
            <div className="flex justify-between font-bold text-sm text-ink pt-1">
              <span>TOTAL AMOUNT DUE:</span>
              <span className="text-forest text-base">{formatPHP(sale.totalCentavos)}</span>
            </div>
            <div className="flex justify-between text-ink-600 text-[11px]">
              <span>CASH TENDERED:</span>
              <span>{formatPHP(tenderCentavos)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs text-emerald-800">
              <span>CHANGE DUE (SUKLI):</span>
              <span>{formatPHP(changeDueCentavos)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-ink-500 space-y-1 pt-1">
            <p className="font-medium">Salamat sa inyong pagbili!</p>
            <p>Bantay Negosyo AI — Offline Counter System</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
