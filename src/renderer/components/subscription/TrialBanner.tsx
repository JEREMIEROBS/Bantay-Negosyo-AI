import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Sparkles, ArrowRight, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/renderer/components/ui/Button';

export const TrialBanner: React.FC = () => {
  const { currentUser, storeApplications, recordSubscriptionPayment, language } = useNegosyoStore();
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'GCash' | 'Maya'>('GCash');

  if (!currentUser || currentUser.role !== 'store_owner' || currentUser.subscriptionStatus !== 'trial_active') {
    return null;
  }

  const app = storeApplications.find((a) => a.id === currentUser.applicationId);
  const trialEnd = app?.trialEndDate || new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString();
  const diff = new Date(trialEnd).getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  const handlePayRentNow = (method: 'GCash' | 'Maya') => {
    if (!currentUser.applicationId) return;
    recordSubscriptionPayment(
      currentUser.applicationId,
      49900,
      method,
      `${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      1
    );
    setIsPayOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-900 via-forest to-emerald-950 text-white px-4 py-2 border-b border-gold/30 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 border border-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-gold">30-Day Free Trial Active:</span>{' '}
            <span className="text-forest-100">
              {daysRemaining} days remaining. Full offline POS, barcode scanner, and AI advisor unlocked.
            </span>
            <span className="hidden sm:inline text-forest-200 ml-1">
              (System rent: ₱499/mo thereafter)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPayOpen(true)}
            className="px-2.5 py-1 rounded bg-gold text-forest text-[11px] font-bold hover:bg-gold-light transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <CreditCard className="w-3 h-3" />
            <span>Pay Rent (₱499)</span>
          </button>
        </div>
      </div>

      {/* Quick Pay Modal */}
      {isPayOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-cloud-300 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-forest text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gold" />
                <h3 className="text-xs font-bold">Pay Store Monthly Rent</h3>
              </div>
              <button
                onClick={() => setIsPayOpen(false)}
                className="text-forest-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] text-ink-400 uppercase font-bold tracking-wider">
                  Bantay Negosyo AI™ Monthly Rent
                </span>
                <p className="text-3xl font-black text-forest">₱499.00</p>
                <p className="text-xs text-ink-500">1 Month Unlimited Store Lease</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('GCash')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'GCash'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-cloud-300 text-ink-600'
                  }`}
                >
                  <p className="text-xs">GCash</p>
                  <span className="text-[10px] text-ink-400">0917-555-8888</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('Maya')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    payMethod === 'Maya'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-cloud-300 text-ink-600'
                  }`}
                >
                  <p className="text-xs">Maya</p>
                  <span className="text-[10px] text-ink-400">Scan QR</span>
                </button>
              </div>

              <Button
                variant="primary"
                onClick={() => handlePayRentNow(payMethod)}
                className="w-full justify-center text-xs py-2.5"
                icon={<CheckCircle2 className="w-4 h-4 text-gold" />}
              >
                Confirm Demo ₱499 Payment ({payMethod})
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
