import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Card } from '@/renderer/components/ui/Card';
import { Button } from '@/renderer/components/ui/Button';
import { Badge } from '@/renderer/components/ui/Badge';
import { Modal } from '@/renderer/components/ui/Modal';
import { formatPHP } from '@/renderer/lib/currency';
import { translations } from '@/renderer/lib/i18n';
import { PosRegister } from '@/renderer/components/pos/PosRegister';
import { Sale } from '@/shared/types';
import {
  ReceiptText,
  Search,
  Filter,
  Ban,
  Eye,
  PlusCircle,
  Clock,
  ArrowDownCircle,
  FileText,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
  History,
} from 'lucide-react';

interface SalesPageProps {
  onExitPos?: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onExitPos }) => {
  const { sales, voidSale, activeSalesTab, setActiveSalesTab, language } = useNegosyoStore();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'void'>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  // Void modal state
  const [saleToVoid, setSaleToVoid] = useState<Sale | null>(null);
  const [voidReason, setVoidReason] = useState('Customer returned goods or cashier error');
  const [isVoiding, setIsVoiding] = useState(false);

  // Filter sales
  const filteredSales = sales.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = s.id.toLowerCase().includes(q);
      const matchesNotes = s.notes ? s.notes.toLowerCase().includes(q) : false;
      const matchesItems = s.items.some((i) =>
        i.productName ? i.productName.toLowerCase().includes(q) : false
      );
      return matchesId || matchesNotes || matchesItems;
    }
    return true;
  });

  const handleConfirmVoid = async () => {
    if (!saleToVoid) return;
    setIsVoiding(true);
    try {
      await voidSale(saleToVoid.id, voidReason);
      setSaleToVoid(null);
      if (selectedSale?.id === saleToVoid.id) {
        setSelectedSale(null);
      }
    } finally {
      setIsVoiding(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-150">
      {/* Tab Switcher Header (Shown only in Ledger mode) */}
      {activeSalesTab === 'ledger' && (
        <div className="bg-white border-b border-cloud-400 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-cloud-200 p-1 rounded-xl border border-cloud-300">
            <button
              type="button"
              onClick={() => setActiveSalesTab('pos')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-ink-600 hover:text-ink"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.common.posRegister}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSalesTab('ledger')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer bg-forest text-white shadow-xs"
            >
              <History className="w-4 h-4" />
              <span>{t.common.ledger} ({sales.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-ink-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.sales.subtitle}</span>
          </div>
        </div>
      )}

      {/* RENDER POS REGISTER OR LEDGER */}
      {activeSalesTab === 'pos' ? (
        <PosRegister onExitPos={onExitPos} />
      ) : (
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Filter Bar */}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="input-fintech text-xs w-40"
              >
                <option value="all">{t.common.all}</option>
                <option value="completed">{t.sales.statusCompleted}</option>
                <option value="void">{t.sales.statusVoid}</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={<ShoppingBag className="w-4 h-4" />}
              onClick={() => setActiveSalesTab('pos')}
            >
              + {t.common.posRegister}
            </Button>
          </div>

          {/* Sales Summary Counter */}
          <div className="flex items-center justify-between text-xs text-ink-500 px-1">
            <span>
              {t.sales.showingTransactions}: <strong>{filteredSales.length}</strong>
            </span>
            <span>Immutable sale-time cost snapshots verified.</span>
          </div>

          {/* Ledger Table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cloud-100 border-b border-cloud-300 text-ink-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">{t.sales.receiptId}</th>
                    <th className="py-3 px-4">{t.sales.dateTime}</th>
                    <th className="py-3 px-4">{t.sales.itemsCount}</th>
                    <th className="py-3 px-4 text-right">{t.common.total}</th>
                    <th className="py-3 px-4 text-right">{t.common.cost}</th>
                    <th className="py-3 px-4 text-right">{t.common.profit}</th>
                    <th className="py-3 px-4 text-center">{t.common.status}</th>
                    <th className="py-3 px-4 text-center">{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cloud-200">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-400">
                        {t.sales.noSalesFound}
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => {
                      const dateObj = new Date(sale.soldAt);
                      const formattedDate = dateObj.toLocaleDateString(
                        language === 'en' ? 'en-US' : 'en-PH',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      );
                      const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      const isVoid = sale.status === 'void';

                      return (
                        <tr
                          key={sale.id}
                          className={`hover:bg-cloud-100/60 transition-colors ${
                            isVoid ? 'bg-red-50/20 text-ink-400' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-ink">
                            {sale.id}
                            {sale.notes && (
                              <span
                                className="block text-[10px] text-ink-400 truncate max-w-[140px]"
                                title={sale.notes}
                              >
                                {sale.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-ink">{formattedDate}</div>
                            <div className="text-[10px] text-ink-400">{formattedTime}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-ink">
                              {sale.items.reduce((acc, i) => acc + i.qty, 0)} {t.common.unit}
                            </span>
                            <span className="text-[10px] text-ink-400 block">
                              ({sale.items.length} lines)
                            </span>
                          </td>
                          <td
                            className={`py-3.5 px-4 text-right font-bold text-sm ${
                              isVoid ? 'line-through text-ink-400' : 'text-ink-950'
                            }`}
                          >
                            {formatPHP(sale.totalCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-ink-600">
                            {formatPHP(sale.totalCostCentavos)}
                          </td>
                          <td
                            className={`py-3.5 px-4 text-right font-semibold ${
                              isVoid ? 'line-through text-ink-400' : 'text-forest'
                            }`}
                          >
                            +{formatPHP(sale.grossProfitCentavos)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isVoid ? (
                              <Badge variant="danger">{t.sales.statusVoid}</Badge>
                            ) : (
                              <Badge variant="success">{t.sales.statusCompleted}</Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedSale(sale)}
                                className="p-1.5 text-ink-600 hover:text-forest hover:bg-cloud-200 rounded-md transition-colors cursor-pointer"
                                title={t.sales.viewDetails}
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {!isVoid && (
                                <button
                                  onClick={() => setSaleToVoid(sale)}
                                  className="p-1.5 text-ink-400 hover:text-status-danger hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  title={t.sales.voidSale}
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                            </div>
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
      )}

      {/* Sale Detail Modal */}
      {selectedSale && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSale(null)}
          title={`${t.pos.viewReceipt}: ${selectedSale.id}`}
          subtitle={`Date: ${new Date(selectedSale.soldAt).toLocaleString()}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                {selectedSale.status === 'completed' ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Ban className="w-4 h-4" />}
                    onClick={() => setSaleToVoid(selectedSale)}
                  >
                    {t.sales.voidSale}
                  </Button>
                ) : (
                  <Badge variant="danger">{t.sales.statusVoid}: {selectedSale.voidReason}</Badge>
                )}
              </div>
              <Button variant="secondary" onClick={() => setSelectedSale(null)}>
                {t.common.close}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-cloud-200 border border-cloud-400 flex items-center justify-between text-xs">
              <div>
                <span className="text-ink-500">{t.common.status}:</span>
                <span className="ml-2 font-bold uppercase">{selectedSale.status}</span>
              </div>
              <div>
                <span className="text-ink-500">{t.common.profit}:</span>
                <span className="ml-2 font-bold text-forest">
                  {formatPHP(selectedSale.grossProfitCentavos)}
                </span>
              </div>
            </div>

            <div>
              <div className="border border-cloud-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cloud-100 border-b border-cloud-300 text-ink-600 font-semibold text-[11px]">
                    <tr>
                      <th className="p-2.5">{t.common.product}</th>
                      <th className="p-2.5 text-center">{t.common.quantity}</th>
                      <th className="p-2.5 text-right">{t.common.price}</th>
                      <th className="p-2.5 text-right">{t.common.cost}</th>
                      <th className="p-2.5 text-right">{t.common.total}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cloud-200">
                    {selectedSale.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5">
                          <p className="font-semibold text-ink">{item.productName || item.productId}</p>
                          <p className="text-[10px] font-mono text-ink-400">{item.productSku || item.productId}</p>
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          {item.qty} {item.unit || 'pc'}
                        </td>
                        <td className="p-2.5 text-right">{formatPHP(item.unitPriceCentavos)}</td>
                        <td className="p-2.5 text-right text-ink-500">{formatPHP(item.unitCostCentavos)}</td>
                        <td className="p-2.5 text-right font-bold text-ink">
                          {formatPHP(item.unitPriceCentavos * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-cloud-50 border-t border-cloud-300 font-bold">
                    <tr>
                      <td colSpan={4} className="p-2.5 text-right">{t.common.total}:</td>
                      <td className="p-2.5 text-right text-sm text-forest">
                        {formatPHP(selectedSale.totalCentavos)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedSale.notes && (
              <div className="p-3 rounded-lg bg-cloud-100 border border-cloud-300 text-xs">
                <span className="font-semibold text-ink">{t.common.notes}: </span>
                <span className="text-ink-600">{selectedSale.notes}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Void Confirmation Modal */}
      {saleToVoid && (
        <Modal
          isOpen={true}
          onClose={() => setSaleToVoid(null)}
          title={`${t.sales.voidConfirmTitle} (${saleToVoid.id})`}
          subtitle={t.sales.voidConfirmSub}
          maxWidth="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSaleToVoid(null)} disabled={isVoiding}>
                {t.common.cancel}
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmVoid}
                disabled={isVoiding}
                icon={<Ban className="w-4 h-4" />}
              >
                {isVoiding ? t.common.loading : t.sales.confirmVoidBtn}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Cancellation Warning:</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Revenue of <strong>{formatPHP(saleToVoid.totalCentavos)}</strong> will be deducted
                  and {saleToVoid.items.length} items will be restored to active stock.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.sales.voidReason} *
              </label>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="input-fintech text-xs"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
