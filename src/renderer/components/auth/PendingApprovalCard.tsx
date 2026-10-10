import React from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations } from '@/renderer/lib/i18n';
import { Button } from '@/renderer/components/ui/Button';
import {
  Clock,
  Store,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  LogOut,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

export const PendingApprovalCard: React.FC = () => {
  const {
    currentUser,
    storeApplications,
    approveStoreApplication,
    switchDemoRole,
    logout,
    language,
  } = useNegosyoStore();

  const currentApp = storeApplications.find(
    (app) => app.id === currentUser?.applicationId
  ) || storeApplications.find((app) => app.status === 'pending');

  const isRejected = currentUser?.status === 'rejected' || currentApp?.status === 'rejected';

  return (
    <div className="min-h-screen bg-cloud flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-cloud-300 shadow-xl overflow-hidden">
        {/* Banner */}
        <div
          className={`p-6 text-white text-center ${
            isRejected ? 'bg-red-800' : 'bg-amber-600'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isRejected ? (
              <AlertTriangle className="w-8 h-8 text-white" />
            ) : (
              <Clock className="w-8 h-8 text-white animate-pulse" />
            )}
          </div>

          <h2 className="text-lg font-extrabold tracking-tight">
            {isRejected
              ? (language === 'en' ? 'Application Needs Revision' : 'Kailangang Ayusin ang Aplikasyon')
              : (language === 'en' ? 'Registration Under Review' : 'Kasalukuyang Sinusuri ang Rehistrasyon')}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {currentApp?.storeName || currentUser?.storeName || 'Sari-Sari Store Application'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-ink-600">
          <div className="bg-cloud-100 p-3.5 rounded-xl border border-cloud-300 space-y-1.5">
            <div className="flex justify-between items-center text-ink-500">
              <span>Application ID:</span>
              <span className="font-mono font-bold text-ink">
                {currentApp?.id || 'APP-2026-002'}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-500">
              <span>Owner:</span>
              <span className="font-bold text-ink">{currentApp?.ownerName || currentUser?.name}</span>
            </div>
            <div className="flex justify-between items-center text-ink-500">
              <span>Barangay & City:</span>
              <span className="font-medium text-ink">
                {currentApp?.barangay || 'Brgy. San Antonio'}, {currentApp?.city || 'Pasig City'}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-500">
              <span>Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  isRejected
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {currentApp?.status?.toUpperCase() || 'PENDING SUPERADMIN QUALIFICATION'}
              </span>
            </div>
          </div>

          <p className="text-ink-600 leading-relaxed">
            {isRejected
              ? (currentApp?.rejectionReason || 'Please verify your business documents with the Superadmin.')
              : (language === 'en'
                ? 'Your store registration has been safely stored locally. The Superadmin will qualify your business permits before full POS and AI analytics are unlocked.'
                : 'Ligtas na naitala ang iyong rehistrasyon. Sinusuri ng Superadmin ang inyong impormasyon upang masigurong kwalipikado bago mabuksan ang POS at AI.')}
          </p>

          {/* Quick Demo Helper */}
          {!isRejected && currentApp && (
            <div className="p-3 bg-forest-50 border border-forest-200 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-forest uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Superadmin Demo Instant Approval:</span>
              </span>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => approveStoreApplication(currentApp.id)}
                icon={<CheckCircle2 className="w-4 h-4 text-gold" />}
              >
                {language === 'en'
                  ? 'Approve Application Now (Demo)'
                  : 'Aprubahan Ngayon (Demo Testing)'}
              </Button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-cloud-300">
            <button
              onClick={() => switchDemoRole('superadmin')}
              className="text-xs text-forest font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>{language === 'en' ? 'Open Superadmin Desk' : 'Pumunta sa Superadmin'}</span>
            </button>

            <button
              onClick={logout}
              className="text-xs text-red-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Log Out' : 'Lumabas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
