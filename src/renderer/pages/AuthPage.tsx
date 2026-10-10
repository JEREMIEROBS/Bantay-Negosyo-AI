import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations } from '@/renderer/lib/i18n';
import { Button } from '@/renderer/components/ui/Button';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Phone,
  MapPin,
  FileText,
  Lock,
  Sparkles,
  WifiOff,
  UserCheck,
  Building,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const {
    login,
    registerStore,
    switchDemoRole,
    language,
    setLanguage,
  } = useNegosyoStore();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('0917-555-1234');
  const [loginPin, setLoginPin] = useState('1234');
  const [loginRole, setLoginRole] = useState<'store_owner' | 'superadmin'>('store_owner');

  // Registration form state
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [barangay, setBarangay] = useState('Brgy. San Roque');
  const [city, setCity] = useState('Pasig City');
  const [storeType, setStoreType] = useState('Sari-Sari Store');
  const [permitNumber, setPermitNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginRole);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim() || !contactNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await registerStore({
        storeName: storeName.trim(),
        ownerName: ownerName.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim() || undefined,
        barangay: barangay.trim(),
        city: city.trim(),
        storeType,
        permitNumber: permitNumber.trim() || undefined,
      });
      if (onLoginSuccess) onLoginSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud flex flex-col justify-between">
      {/* Top Bar */}
      <header className="h-16 border-b border-cloud-300 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-gold shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-forest tracking-tight">
              Bantay Negosyo AI™
            </h1>
            <p className="text-[10px] text-ink-500 font-medium">
              Smart na Negosyo, Kahit Walang Internet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>100% Offline Capable</span>
          </div>

          <div className="inline-flex rounded-lg border border-cloud-400 p-0.5 bg-cloud-100 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-bold transition-colors cursor-pointer ${
                language === 'en' ? 'bg-white text-forest shadow-xs' : 'text-ink-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tl')}
              className={`px-2 py-1 rounded font-bold transition-colors cursor-pointer ${
                language === 'tl' ? 'bg-white text-forest shadow-xs' : 'text-ink-500'
              }`}
            >
              TL
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl border border-cloud-300 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: Hero & Value Proposition */}
          <div className="lg:col-span-5 bg-forest text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gold/10 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-bold border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Store Portal & Onboarding</span>
              </span>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {language === 'en'
                    ? 'Empowering Filipino Sari-Sari Stores with Local AI'
                    : 'Mas Matalinong Tindahan, Kahit Walang Internet'}
                </h2>
                <p className="text-xs text-forest-100 leading-relaxed">
                  {language === 'en'
                    ? 'Register your store today. Starts with 30-Day Free Trial. Verified by Superadmin for qualification and multi-store management.'
                    : 'Irehistro ang iyong tindahan. May 30-Araw na Libreng Subok. Sinusuri ng Superadmin upang masigurong kwalipikado ang negosyo.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-forest-100">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Fast POS Counter:</strong> Offline barcode scanner & thermal receipt printing.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs text-forest-100">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Local AI Advisor:</strong> Grounded profit insights without cloud dependencies.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs text-forest-100">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>30-Day Free Trial:</strong> Full features unlocked; manageable monthly rent (₱499/mo).
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Demo Switcher Shortcuts */}
            <div className="mt-8 pt-6 border-t border-white/15 space-y-2 relative z-10">
              <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                ⚡ Quick Demo Persona Switcher:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('approved_owner');
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-300" />
                    <span>Active Store (Aling Nena - Paid ₱499)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    PAID
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('trial_active_owner');
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Trial Store (Nanay Cora - 18 Days Left)</span>
                  </span>
                  <span className="text-[10px] bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    TRIAL
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('trial_expired_owner');
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-300" />
                    <span>Expired Trial Owner (Aling Marites - Rent Due)</span>
                  </span>
                  <span className="text-[10px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    RENT DUE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('pending_owner');
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>Pending Store Owner (Mang Jose)</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    PENDING
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchDemoRole('superadmin');
                    if (onLoginSuccess) onLoginSuccess();
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors flex items-center justify-between cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>Superadmin SaaS & Rent Dashboard</span>
                  </span>
                  <span className="text-[10px] bg-gold/30 text-gold px-1.5 py-0.5 rounded font-mono font-bold">
                    ADMIN
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            {/* Tab Header */}
            <div>
              <div className="flex items-center border-b border-cloud-300 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer flex-1 text-center ${
                    activeTab === 'login'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-ink-500 hover:text-ink'
                  }`}
                >
                  {language === 'en' ? 'Store Login' : 'Mag-Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`pb-3 text-sm font-bold transition-colors border-b-2 cursor-pointer flex-1 text-center ${
                    activeTab === 'register'
                      ? 'border-forest text-forest'
                      : 'border-transparent text-ink-500 hover:text-ink'
                  }`}
                >
                  {language === 'en' ? 'Register New Store' : 'Magrehistro ng Tindahan'}
                </button>
              </div>

              {/* LOGIN TAB */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      {language === 'en' ? 'Login Role' : 'Papel sa Negosyo'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole('store_owner');
                          setLoginIdentifier('0917-555-1234');
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          loginRole === 'store_owner'
                            ? 'bg-forest-50 border-forest text-forest'
                            : 'bg-white border-cloud-300 text-ink-600 hover:bg-cloud-100'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>Store Owner</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole('superadmin');
                          setLoginIdentifier('admin@bantaynegosyo.ai');
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          loginRole === 'superadmin'
                            ? 'bg-forest-50 border-forest text-forest'
                            : 'bg-white border-cloud-300 text-ink-600 hover:bg-cloud-100'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Superadmin</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      {loginRole === 'superadmin'
                        ? 'Admin Email / Username'
                        : language === 'en'
                        ? 'Contact Number or Store Email'
                        : 'Numero ng Telepono o Email ng Tindahan'}
                    </label>
                    {/* Clean flex input group with non-overlapping icon */}
                    <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                      <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 0917-555-1234 or email"
                        className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      {language === 'en' ? 'Security PIN / Password' : 'PIN o Password'}
                    </label>
                    {/* Clean flex input group with non-overlapping icon */}
                    <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                      <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="••••"
                        className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center text-sm py-2.5"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {loginRole === 'superadmin'
                        ? 'Access Superadmin Dashboard'
                        : language === 'en'
                        ? 'Sign In to Store'
                        : 'Pumasok sa Tindahan'}
                    </Button>
                  </div>

                  <p className="text-[11px] text-ink-400 text-center pt-2">
                    {language === 'en'
                      ? 'Local offline session stored securely in SQLite.'
                      : 'Ligtas at lokal na nakatala ang sesyon sa SQLite.'}
                  </p>
                </form>
              ) : (
                /* REGISTRATION TAB */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Store Name' : 'Pangalan ng Tindahan'} *
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <Store className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Nanay Cora's Sari-Sari"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Owner Full Name' : 'Pangalan ng May-ari'} *
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Corazon Dela Cruz"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Mobile / Contact' : 'Numero ng Cellphone'} *
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <Phone className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. 0919-888-7766"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Store Type' : 'Uri ng Tindahan'}
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <Store className="w-4 h-4" />
                        </span>
                        <select
                          value={storeType}
                          onChange={(e) => setStoreType(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="Sari-Sari Store">Sari-Sari Store</option>
                          <option value="Mini Grocery / Grocery">Mini Grocery / Grocery</option>
                          <option value="Bakery & Merienda">Bakery & Merienda</option>
                          <option value="Water Refilling / Ice">Water Refilling & Ice</option>
                          <option value="Rice & Agrivet Retail">Rice & Grain Supply</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Barangay' : 'Barangay'}
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Brgy. San Roque"
                          value={barangay}
                          onChange={(e) => setBarangay(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'City / Municipality' : 'Lungsod / Bayan'}
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <Building className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Pasig City, Metro Manila"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Barangay Permit / DTI No.' : 'Permit / DTI Reg No.'}
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <FileText className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. BP-2026-9041"
                          value={permitNumber}
                          onChange={(e) => setPermitNumber(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        {language === 'en' ? 'Create PIN (4 Digits)' : 'Gumawa ng PIN'}
                      </label>
                      <div className="flex items-center rounded-lg border border-cloud-400 bg-white focus-within:border-forest focus-within:ring-1 focus-within:ring-forest overflow-hidden transition-all shadow-2xs">
                        <span className="pl-3 pr-2 text-ink-400 shrink-0 select-none">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          placeholder="1234"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full py-2 pr-3 text-xs text-ink placeholder:text-ink-400 bg-transparent border-none outline-none focus:ring-0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 30-Day Free Trial Notice */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">
                        {language === 'en' ? 'Includes 30-Day Free Trial upon Approval' : 'Kasama ang 30-Araw na Libreng Subok Pagka-apruba'}
                      </strong>
                      <span>
                        {language === 'en'
                          ? 'Experience full offline POS, AI sales prediction, and inventory tracking free for 30 days. Software rent is ₱499/mo thereafter.'
                          : 'Gamitin ang buong offline POS at AI advisor nang libre sa unang 30 araw. Pagkatapos ng 30 araw, ₱499/buwan ang bayad sa paupa sa system.'}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full justify-center text-sm py-2.5 mt-2"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isSubmitting
                      ? t.common.loading
                      : language === 'en'
                      ? 'Submit Store Registration'
                      : 'Ipasa ang Rehistrasyon ng Tindahan'}
                  </Button>
                </form>
              )}
            </div>

            {/* Footer Notice */}
            <div className="pt-4 text-center">
              <span className="text-[10px] text-ink-400">
                Bantay Negosyo AI™ • Multi-Store Subscription & Offline Neural POS Platform
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
