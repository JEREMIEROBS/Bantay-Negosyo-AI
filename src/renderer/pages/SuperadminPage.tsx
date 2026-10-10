import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations } from '@/renderer/lib/i18n';
import { Button } from '@/renderer/components/ui/Button';
import { Card } from '@/renderer/components/ui/Card';
import { Badge } from '@/renderer/components/ui/Badge';
import { StoreApplication } from '@/shared/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  User,
  Phone,
  MapPin,
  FileText,
  Search,
  ExternalLink,
  LogOut,
  Sparkles,
  Building2,
  AlertCircle,
  Filter,
  CreditCard,
  DollarSign,
  Calendar,
  Lock,
  Unlock,
  PlusCircle,
  TrendingUp,
  Receipt,
  RotateCcw,
  Zap,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const SuperadminPage: React.FC = () => {
  const {
    storeApplications,
    subscriptionPayments,
    approveStoreApplication,
    rejectStoreApplication,
    recordSubscriptionPayment,
    extendTrial,
    toggleStoreLock,
    switchDemoRole,
    logout,
    language,
    currentUser,
  } = useNegosyoStore();

  const [activeTab, setActiveTab] = useState<'subscriptions' | 'applications' | 'payments' | 'settings'>('subscriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'trial_active' | 'active_paid' | 'trial_expired' | 'suspended'>('all');

  // Modals & form state
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Incomplete barangay business permit documents');
  const [paymentModalStore, setPaymentModalStore] = useState<StoreApplication | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('499');
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'Bank Transfer' | 'Cash'>('GCash');
  const [paymentRefNo, setPaymentRefNo] = useState(`GC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentMonths, setPaymentMonths] = useState(1);

  // Calculations
  const pendingApps = storeApplications.filter((a) => a.status === 'pending');
  const approvedApps = storeApplications.filter((a) => a.status === 'approved');
  const activePaidStores = storeApplications.filter((a) => a.subscriptionStatus === 'active_paid');
  const trialActiveStores = storeApplications.filter((a) => a.subscriptionStatus === 'trial_active');
  const trialExpiredStores = storeApplications.filter((a) => a.subscriptionStatus === 'trial_expired');

  // MRR: monthly fee of active paid stores (₱499 each)
  const mrrCentavos = activePaidStores.length * 49900;
  const totalCollectedCentavos = subscriptionPayments.reduce((acc, p) => acc + p.amountCentavos, 0);

  const calculateDaysRemaining = (endDateStr?: string) => {
    if (!endDateStr) return 0;
    const diff = new Date(endDateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleConfirmReject = (appId: string) => {
    rejectStoreApplication(appId, rejectReason);
    setRejectingAppId(null);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalStore) return;
    const amountInCentavos = Math.round(parseFloat(paymentAmount || '499') * 100);
    recordSubscriptionPayment(
      paymentModalStore.id,
      amountInCentavos,
      paymentMethod,
      paymentRefNo.trim() || `REF-${Date.now().toString().slice(-6)}`,
      paymentMonths
    );
    setPaymentModalStore(null);
  };

  const filteredStores = storeApplications.filter((app) => {
    if (statusFilter !== 'all' && app.subscriptionStatus !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.storeName.toLowerCase().includes(q) ||
      app.ownerName.toLowerCase().includes(q) ||
      app.contactNumber.includes(q) ||
      app.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-cloud flex flex-col font-sans text-ink">
      {/* Superadmin Top Navbar */}
      <header className="h-16 bg-forest-900 bg-[#0F281E] text-white px-4 sm:px-6 flex items-center justify-between shadow-md shrink-0 border-b border-forest-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/30 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight">
                Bantay Negosyo AI™ — Superadmin SaaS Portal
              </h1>
              <span className="text-[10px] font-bold bg-gold text-ink px-2 py-0.5 rounded uppercase tracking-wider">
                Fleet & Rental Manager
              </span>
            </div>
            <p className="text-[11px] text-forest-200">
              Multi-Store Rental Subscription Engine • 30-Day Trial Monitoring & Qualification
            </p>
          </div>
        </div>

        {/* Persona quick switch buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 bg-black/25 p-1 rounded-lg border border-white/10 text-xs text-white">
            <span className="text-[10px] text-forest-200 px-2 font-bold uppercase">View As:</span>
            <button
              onClick={() => switchDemoRole('approved_owner')}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold cursor-pointer"
              title="Aling Nena (Active Paid Rent)"
            >
              Aling Nena (Paid)
            </button>
            <button
              onClick={() => switchDemoRole('trial_active_owner')}
              className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 transition-colors text-xs font-semibold cursor-pointer"
              title="Nanay Cora (30-Day Trial Active)"
            >
              Nanay Cora (Trial)
            </button>
            <button
              onClick={() => switchDemoRole('trial_expired_owner')}
              className="px-2.5 py-1 rounded bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors text-xs font-semibold cursor-pointer"
              title="Aling Marites (Trial Expired, Rent Due)"
            >
              Marites (Rent Due)
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-xs text-white/80 hover:text-white hover:bg-white/10"
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            {language === 'en' ? 'Log Out' : 'Lumabas'}
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Summary Cards: Subscription & Rental Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Monthly Recurring Rent Revenue */}
          <div className="p-4 rounded-xl bg-white border border-cloud-400 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Monthly Software Rent (MRR)</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-forest mt-1.5">
              ₱{(mrrCentavos / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-500">
              <span className="font-bold text-emerald-700">{activePaidStores.length} stores paying</span>
              <span>@ ₱499/month rent</span>
            </div>
          </div>

          {/* Card 2: Active 30-Day Free Trials */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-cyan-900 font-semibold">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Active 30-Day Trials</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-cyan-950 mt-1.5">
              {trialActiveStores.length} Stores in Trial
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-cyan-800">
              <span>Evaluating full offline POS & AI</span>
            </div>
          </div>

          {/* Card 3: Expired Trials / Rent Due */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-300 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Rent Due / Expired Trials</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-950 mt-1.5">
              {trialExpiredStores.length} Stores Pending Rent
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-800 font-medium">
              <span>30 days completed • Collect ₱499 rent</span>
            </div>
          </div>

          {/* Card 4: Total Collected Rental Revenue */}
          <div className="p-4 rounded-xl bg-white border border-cloud-400 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Total Rent Collected</span>
              <div className="w-7 h-7 rounded-lg bg-forest/10 text-forest flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-ink mt-1.5">
              ₱{(totalCollectedCentavos / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-500">
              <span className="font-bold text-forest">{subscriptionPayments.length} rental receipts</span>
              <span>via GCash/Maya</span>
            </div>
          </div>
        </div>

        {/* Superadmin Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-cloud-300 bg-white p-2 rounded-xl shadow-2xs">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-600 hover:text-ink hover:bg-cloud-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Fleet & Rent Management</span>
            <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {storeApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'applications'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-600 hover:text-ink hover:bg-cloud-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Qualification & Onboarding Queue</span>
            {pendingApps.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
                {pendingApps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-600 hover:text-ink hover:bg-cloud-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Rental Collections Ledger</span>
            <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-cloud-300 text-ink-700 font-mono">
              {subscriptionPayments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-forest text-white shadow-xs'
                : 'text-ink-600 hover:text-ink hover:bg-cloud-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>SaaS Rental Pricing (₱499/mo)</span>
          </button>
        </div>

        {/* TAB 1: STORE SUBSCRIPTIONS & RENT FLEET */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-cloud-300">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs text-ink-500 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'all' ? 'bg-forest text-white' : 'bg-cloud-100 text-ink-600 hover:bg-cloud-200'
                  }`}
                >
                  All ({storeApplications.length})
                </button>
                <button
                  onClick={() => setStatusFilter('trial_active')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'trial_active' ? 'bg-cyan-700 text-white' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  30-Day Trials ({trialActiveStores.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active_paid')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'active_paid' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Paid Rent ({activePaidStores.length})
                </button>
                <button
                  onClick={() => setStatusFilter('trial_expired')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'trial_expired' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-800 hover:bg-red-100'
                  }`}
                >
                  Rent Due ({trialExpiredStores.length})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search store name, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-cloud-400 text-xs text-ink outline-none focus:border-forest"
                />
              </div>
            </div>

            {/* Subscriptions Table */}
            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cloud-200 text-ink-700 font-bold border-b border-cloud-300">
                    <tr>
                      <th className="p-3.5">Store & Merchant</th>
                      <th className="p-3.5">Rental Plan</th>
                      <th className="p-3.5">Subscription Status</th>
                      <th className="p-3.5">Trial / Renewal Timeline</th>
                      <th className="p-3.5">Total Rent Paid</th>
                      <th className="p-3.5 text-right">Superadmin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cloud-200">
                    {filteredStores.map((store) => {
                      const daysLeft = calculateDaysRemaining(store.trialEndDate);
                      return (
                        <tr key={store.id} className="hover:bg-cloud-100 transition-colors">
                          {/* Store & Merchant */}
                          <td className="p-3.5">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                <Store className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-ink text-xs">{store.storeName}</p>
                                <p className="text-[11px] text-ink-500">{store.ownerName} • {store.contactNumber}</p>
                                <span className="text-[10px] text-ink-400 font-mono">{store.barangay}, {store.city}</span>
                              </div>
                            </div>
                          </td>

                          {/* Rental Plan */}
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <span className="font-bold text-ink">
                                {store.subscriptionStatus === 'trial_active' ? '30-Day Free Trial' : 'Monthly System Rent'}
                              </span>
                              <p className="text-[10px] text-ink-500">
                                Rate: <strong>₱499.00 / month</strong>
                              </p>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3.5">
                            {store.subscriptionStatus === 'active_paid' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                Rent Paid & Active
                              </span>
                            )}
                            {store.subscriptionStatus === 'trial_active' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-[11px] font-bold border border-cyan-300">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                                30-Day Trial Active
                              </span>
                            )}
                            {store.subscriptionStatus === 'trial_expired' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-900 text-[11px] font-bold border border-red-300 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                                Trial Ended • ₱499 Rent Due
                              </span>
                            )}
                            {store.subscriptionStatus === 'suspended' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 text-[11px] font-bold border border-gray-400">
                                <Lock className="w-3.5 h-3.5 text-gray-600" />
                                Store Locked
                              </span>
                            )}
                          </td>

                          {/* Trial / Timeline */}
                          <td className="p-3.5">
                            {store.subscriptionStatus === 'trial_active' ? (
                              <div className="space-y-1 w-36">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-cyan-800">{daysLeft} days remaining</span>
                                  <span className="text-ink-400 font-mono">Day {30 - daysLeft}/30</span>
                                </div>
                                <div className="w-full bg-cloud-300 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-cyan-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(5, ((30 - daysLeft) / 30) * 100))}%` }}
                                  />
                                </div>
                              </div>
                            ) : store.subscriptionStatus === 'active_paid' ? (
                              <div className="text-[11px] text-ink-600">
                                <span className="text-emerald-800 font-bold block">Renews Next Month</span>
                                <span className="text-[10px] text-ink-400">
                                  Valid until {new Date(store.subscriptionExpiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            ) : store.subscriptionStatus === 'trial_expired' ? (
                              <div className="text-[11px] text-red-700 font-semibold">
                                <span>Grace period ended. System rent needed.</span>
                              </div>
                            ) : (
                              <span className="text-ink-400 text-[10px]">Access suspended</span>
                            )}
                          </td>

                          {/* Total Rent Paid */}
                          <td className="p-3.5">
                            <span className="font-bold text-ink font-mono text-xs">
                              ₱{((store.totalPaidCentavos || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right space-x-1">
                            {/* Record Payment Button */}
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setPaymentModalStore(store);
                                setPaymentAmount('499');
                                setPaymentMonths(1);
                                setPaymentRefNo(`GC-${Math.floor(100000 + Math.random() * 900000)}`);
                              }}
                              className="text-[11px] py-1 bg-emerald-700 hover:bg-emerald-800"
                              icon={<CreditCard className="w-3.5 h-3.5 text-gold" />}
                            >
                              Record ₱499 Rent
                            </Button>

                            {/* Extend Trial (+30 Days) */}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => extendTrial(store.id, 30)}
                              className="text-[11px] py-1 text-cyan-800 hover:bg-cyan-50 border-cyan-300"
                              title="Extend 30 Days Trial"
                              icon={<Sparkles className="w-3.5 h-3.5 text-cyan-600" />}
                            >
                              +30d Trial
                            </Button>

                            {/* Lock / Unlock */}
                            <button
                              onClick={() => toggleStoreLock(store.id)}
                              className="p-1.5 rounded border border-cloud-400 text-ink-500 hover:text-ink hover:bg-cloud-200 transition-colors cursor-pointer inline-flex items-center"
                              title={store.subscriptionStatus === 'suspended' ? 'Unlock Store' : 'Lock Store'}
                            >
                              {store.subscriptionStatus === 'suspended' ? (
                                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-ink-400" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: STORE QUALIFICATION & ONBOARDING QUEUE */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-ink">
                  {language === 'en' ? 'Store Application Verification Queue' : 'Pila ng mga Aplikasyon ng Tindahan'}
                </h2>
                <p className="text-xs text-ink-500">
                  Verify business permit compliance. Approved stores automatically receive 30-Day Free Trial access.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                {pendingApps.length} Awaiting Superadmin Decision
              </span>
            </div>

            {pendingApps.length === 0 ? (
              <div className="p-10 bg-white border border-dashed border-cloud-400 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-ink">
                  All store registrations have been reviewed!
                </h3>
                <p className="text-xs text-ink-500 max-w-md mx-auto">
                  There are no pending applications waiting in the qualification queue. You can test registering a new store from the login/register portal.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-forest text-gold flex items-center justify-center font-bold text-sm shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-ink">{app.storeName}</h3>
                          <p className="text-xs text-ink-500 font-medium">
                            {app.storeType} • Application ID: {app.id}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Pending Approval
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-ink-600 bg-cloud-100 p-3 rounded-lg border border-cloud-300">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-ink-400 block">Owner Contact</span>
                        <p className="font-semibold text-ink flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-forest" />
                          {app.ownerName}
                        </p>
                        <p className="text-ink-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-forest" />
                          {app.contactNumber}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-ink-400 block">Location & Permit</span>
                        <p className="font-semibold text-ink flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-forest" />
                          {app.barangay}, {app.city}
                        </p>
                        <p className="text-ink-500 flex items-center gap-1.5 font-mono text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-forest" />
                          {app.permitNumber || 'Barangay Permit on File'}
                        </p>
                      </div>
                    </div>

                    {/* 30-Day Trial Automatic Provision Note */}
                    <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-200 text-[11px] text-cyan-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-700 shrink-0" />
                      <span>
                        Upon approval, this store will receive an automatic <strong>30-Day Free Trial</strong>.
                      </span>
                    </div>

                    {/* Reject reason input prompt if open */}
                    {rejectingAppId === app.id ? (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                        <label className="text-xs font-bold text-red-900 block">
                          Reason for Returning Application:
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full p-2 text-xs rounded border border-red-300 bg-white outline-none"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setRejectingAppId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleConfirmReject(app.id)}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Approval Action Buttons */
                      <div className="flex items-center justify-between pt-2 border-t border-cloud-200">
                        <span className="text-[10px] text-ink-400">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setRejectingAppId(app.id)}
                            className="text-xs text-red-700 hover:bg-red-50"
                          >
                            Decline
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => approveStoreApplication(app.id)}
                            icon={<CheckCircle2 className="w-4 h-4 text-gold" />}
                            className="text-xs"
                          >
                            Approve & Grant 30d Trial
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RENTAL COLLECTIONS LEDGER */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-ink">
                  Rental Collections & Payment History
                </h2>
                <p className="text-xs text-ink-500">
                  Audit log of all ₱499 monthly system rental fees collected via GCash, Maya, and cash payments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                  Total Collected: ₱{(totalCollectedCentavos / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cloud-200 text-ink-700 font-bold border-b border-cloud-300">
                    <tr>
                      <th className="p-3.5">Payment ID</th>
                      <th className="p-3.5">Store Name</th>
                      <th className="p-3.5">Amount Paid</th>
                      <th className="p-3.5">Payment Channel</th>
                      <th className="p-3.5">Reference No.</th>
                      <th className="p-3.5">Coverage</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Collector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cloud-200">
                    {subscriptionPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-ink-500">
                          No subscription rent payments recorded yet. Click "Record ₱499 Rent" on any store to record a payment.
                        </td>
                      </tr>
                    ) : (
                      subscriptionPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-cloud-100 transition-colors">
                          <td className="p-3.5 font-mono text-[11px] text-ink-500">{pay.id}</td>
                          <td className="p-3.5 font-bold text-ink">{pay.storeName}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-700 text-xs">
                            ₱{(pay.amountCentavos / 100).toFixed(2)}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cloud-200 font-semibold text-ink-700 text-[10px]">
                              {pay.paymentMethod}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-ink-600">{pay.referenceNo}</td>
                          <td className="p-3.5 text-ink-600">{pay.monthsCount} Month(s) System Rent</td>
                          <td className="p-3.5 text-ink-500">
                            {new Date(pay.paidAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3.5 text-ink-600">{pay.receivedBy}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: SAAS PRICING & RENTAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-ink">
                SaaS Subscription & Software Rental Model Configuration
              </h2>
              <p className="text-xs text-ink-500">
                Transparent software leasing rules for sari-sari store and retail merchants.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: 30-Day Free Trial Tier */}
              <div className="p-5 rounded-2xl bg-white border border-cyan-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complimentary Tier</span>
                </div>
                <h3 className="text-lg font-bold text-ink">30-Day Free Trial</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-cyan-900">₱0</span>
                  <span className="text-xs text-ink-400">/ first 30 days</span>
                </div>
                <ul className="text-xs space-y-2 text-ink-600 pt-2 border-t border-cloud-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Auto-granted upon Superadmin approval</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Full Offline POS & Thermal Receipt print</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Local AI Advisor & Sales Forecaster</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Unlimited transactions & barcode scan</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Monthly Software Rent */}
              <div className="p-5 rounded-2xl bg-white border-2 border-forest shadow-md space-y-3 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest text-gold text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Standard Store Lease</span>
                </div>
                <h3 className="text-lg font-bold text-ink">Monthly System Rent</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-forest">₱499</span>
                  <span className="text-xs text-ink-400">/ month / store</span>
                </div>
                <ul className="text-xs space-y-2 text-ink-600 pt-2 border-t border-cloud-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                    <span>Continuous offline engine updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                    <span>Local SQLite backup & audit guard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                    <span>GCash & Maya QR integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                    <span>Multi-device synchronization ready</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Payment Channels */}
              <div className="p-5 rounded-2xl bg-white border border-cloud-300 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cloud-200 text-ink-700 text-[11px] font-bold">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment Channels</span>
                </div>
                <h3 className="text-lg font-bold text-ink">Rental Collection Methods</h3>
                <div className="text-xs text-ink-600 space-y-2 pt-2 border-t border-cloud-200">
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <strong className="block text-blue-900 font-bold">GCash Merchant Account</strong>
                    <span className="text-[11px] font-mono text-blue-800">0917-555-8888 (Bantay Negosyo AI)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <strong className="block text-emerald-900 font-bold">Maya Business QR</strong>
                    <span className="text-[11px] font-mono text-emerald-800">0918-777-9999 / Scan QR</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cloud-100 border border-cloud-300">
                    <strong className="block text-ink-800 font-bold">Over-the-counter Cash</strong>
                    <span className="text-[11px] text-ink-600">Authorized Barangay Coordinator Collection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Record ₱499 Rent Payment */}
      {paymentModalStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-cloud-300 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-forest text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/30">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Record Monthly Rent Payment</h3>
                  <p className="text-[11px] text-forest-200">{paymentModalStore.storeName}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalStore(null)}
                className="text-forest-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase">Monthly Rent Fee</span>
                  <span className="text-lg font-black text-emerald-950">₱499.00 / month</span>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                  Standard Rate
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['GCash', 'Maya', 'Bank Transfer', 'Cash'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-forest text-white border-forest shadow-xs'
                          : 'bg-white text-ink-600 border-cloud-300 hover:bg-cloud-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Months Paid</label>
                  <select
                    value={paymentMonths}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10);
                      setPaymentMonths(m);
                      setPaymentAmount((499 * m).toString());
                    }}
                    className="w-full p-2 text-xs rounded-lg border border-cloud-400 bg-white"
                  >
                    <option value={1}>1 Month (₱499)</option>
                    <option value={2}>2 Months (₱998)</option>
                    <option value={3}>3 Months (₱1,497)</option>
                    <option value={6}>6 Months (₱2,994)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Amount (₱)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-cloud-400 bg-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Payment Reference / Receipt No.
                </label>
                <input
                  type="text"
                  value={paymentRefNo}
                  onChange={(e) => setPaymentRefNo(e.target.value)}
                  placeholder="e.g. GC-893144 or OR-2026-001"
                  className="w-full p-2 text-xs rounded-lg border border-cloud-400 bg-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cloud-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setPaymentModalStore(null)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 className="w-4 h-4 text-gold" />}
                >
                  Confirm & Extend Rent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
