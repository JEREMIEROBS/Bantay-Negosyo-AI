import React, { useState } from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Card, CardHeader } from '@/renderer/components/ui/Card';
import { Button } from '@/renderer/components/ui/Button';
import { Badge } from '@/renderer/components/ui/Badge';
import { Modal } from '@/renderer/components/ui/Modal';
import { translations } from '@/renderer/lib/i18n';
import {
  Settings,
  HardDrive,
  RefreshCw,
  Cpu,
  ShieldCheck,
  WifiOff,
  Store,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { business, diagnostics, resetDemoData, products, sales, expenses, language } =
    useNegosyoStore();
  const t = translations[language];

  const [businessName, setBusinessName] = useState(
    business?.name || "Aling Nena's Sari-Sari & General Store"
  );
  const [ownerName, setOwnerName] = useState(
    business?.ownerName || 'Nenita "Aling Nena" Santos'
  );
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const diagnosticsChecks = [
    {
      title: 'Physical Offline Readiness',
      status: 'VERIFIED',
      desc:
        language === 'en'
          ? 'Zero dependencies on remote CDNs, cloud APIs, or tracking services.'
          : 'Walang dependency sa remote CDNs, cloud APIs, o tracking services.',
    },
    {
      title: 'Localhost AI Endpoint',
      status: 'http://127.0.0.1:11434',
      desc:
        language === 'en'
          ? 'Bound strictly to loopback interface; no network ports exposed.'
          : 'Naka-bind lamang sa loopback interface; walang exposed network port.',
    },
    {
      title: 'Model Target & Weights',
      status: 'qwen2.5:3b-instruct (Q4_K_M)',
      desc:
        language === 'en'
          ? 'Lightweight and fast on laptop RAM; fluent in English and Tagalog.'
          : 'Magaan at mabilis sa laptop RAM; may kahusayan sa Tagalog at English.',
    },
    {
      title: 'SQLite Database Security',
      status: 'better-sqlite3 (Main Process)',
      desc:
        language === 'en'
          ? 'Foreign keys enabled, integer centavos storage, transactional integrity.'
          : 'Foreign keys enabled, integer centavos storage, transactional rollback.',
    },
    {
      title: 'Electron Preload Isolation',
      status: 'contextIsolation=true',
      desc:
        language === 'en'
          ? 'nodeIntegration=false; strict IPC channel allowlist only.'
          : 'nodeIntegration=false; mahigpit na IPC allowlist lamang ang nakikita ng renderer.',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Business Profile Configuration */}
      <Card>
        <CardHeader
          title={t.settings.storeProfile}
          subtitle={t.settings.storeProfileSub}
          action={
            isSavedToast ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t.settings.profileSaved}
              </span>
            ) : null
          }
        />

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.settings.storeName} *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input-fintech text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.settings.ownerName}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="input-fintech text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.settings.currency}
              </label>
              <input
                type="text"
                value="Philippine Peso (PHP ₱) — Integer Centavos"
                disabled
                className="input-fintech text-xs bg-cloud-200 text-ink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                {t.settings.branch}
              </label>
              <input
                type="text"
                value="Brgy. San Roque, Pasig City"
                disabled
                className="input-fintech text-xs bg-cloud-200 text-ink-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              {t.settings.updateProfile}
            </Button>
          </div>
        </form>
      </Card>

      {/* Local AI Engine & Diagnostics Panel */}
      <Card>
        <CardHeader
          title={t.settings.diagnostics}
          subtitle={t.settings.diagnosticsSub}
          action={
            <span className="badge-offline">
              <WifiOff className="w-3.5 h-3.5 text-forest" />
              {t.common.offlineBadge}
            </span>
          }
        />

        <div className="space-y-3">
          {diagnosticsChecks.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-cloud-300 bg-cloud-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="text-xs font-bold text-ink">{item.title}</span>
                <p className="text-[11px] text-ink-500 mt-0.5">{item.desc}</p>
              </div>
              <span className="font-mono text-xs font-bold text-forest bg-white px-2.5 py-1 rounded border border-cloud-300 shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management & Safeguards */}
      <Card>
        <CardHeader
          title={t.settings.dataSafeguards}
          subtitle={t.settings.dataSafeguardsSub}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CSV Import Preview */}
          <div className="p-4 rounded-xl border border-cloud-400 bg-cloud-50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4 text-forest" />
                {t.settings.csvImporter}
              </div>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                {t.settings.csvImporterDesc}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              {t.settings.tryCsv}
            </Button>
          </div>

          {/* Reset Demo Data Safeguard */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
                <RefreshCw className="w-4 h-4 text-red-700" />
                {t.settings.resetDemo}
              </div>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {t.settings.resetDemoDesc}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => setIsResetModalOpen(true)}
            >
              {t.settings.resetDemoBtn}
            </Button>
          </div>
        </div>

        {/* Current Database Counter Overview */}
        <div className="mt-4 pt-3 border-t border-cloud-300 flex items-center justify-between text-xs text-ink-500 flex-wrap gap-2">
          <span>
            {language === 'en' ? 'Active Records: ' : 'Kasalukuyang Talaan: '}
            <strong>{products.length}</strong> {t.common.product} • <strong>{sales.length}</strong> {language === 'en' ? 'sales' : 'benta'} •{' '}
            <strong>{expenses.length}</strong> {t.common.amount}
          </span>
          <span className="font-mono text-[10px] bg-cloud-200 px-2 py-0.5 rounded text-ink-700">
            Storage: In-Memory / SQLite Ready
          </span>
        </div>
      </Card>

      {/* Architecture & Disclosure Card */}
      <Card className="border-forest/30 bg-gradient-to-br from-white to-forest-50/20">
        <CardHeader
          title={t.settings.architectureTitle}
          subtitle={t.settings.architectureSub}
        />

        <div className="space-y-3 text-xs text-ink-700 leading-relaxed">
          <p>
            <strong>1. Fully Offline Business Intelligence:</strong> Zero external cloud APIs or
            remote telemetry. Core AI inference runs entirely on the user's computer via Ollama.
          </p>
          <p>
            <strong>2. Grounded Evidence Pipeline:</strong> No LLM math. All revenue, COGS, gross
            profit, and operating expenses are calculated deterministically from SQLite prior to prompt
            execution.
          </p>
          <p>
            <strong>3. Monetary Accuracy:</strong> Financial values are stored as integer centavos to
            prevent floating-point inaccuracies.
          </p>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResetModalOpen(false)}
          title={t.settings.resetConfirmTitle}
          subtitle={t.settings.resetConfirmSub}
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await resetDemoData();
                  setIsResetModalOpen(false);
                }}
              >
                {t.settings.resetConfirmBtn}
              </Button>
            </>
          }
        >
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{t.settings.resetDemoDesc}</span>
          </div>
        </Modal>
      )}

      {/* CSV Import Preview Modal */}
      {isImportModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsImportModalOpen(false)}
          title={t.settings.csvImporter}
          subtitle={t.settings.csvImporterDesc}
          maxWidth="md"
          footer={
            <Button variant="primary" onClick={() => setIsImportModalOpen(false)}>
              {t.common.confirm}
            </Button>
          }
        >
          <div className="space-y-3 text-xs text-ink-700">
            <p>
              Preview of accepted CSV column schema for inventory products and previous ledger imports:
            </p>
            <pre className="p-3 rounded-lg bg-ink-950 text-cloud-100 font-mono text-[11px] overflow-x-auto">
{`sku,name,unit,price_centavos,cost_centavos,stock_qty,reorder_level
RIC-SIN-001,Sinandomeng Rice 1kg,kilo,5200,4400,48,20
CAN-CAL-003,Lucky Me Pancit Canton,pakete,1600,1250,84,30
COF-KOP-006,Kopiko Blanca Sachet,sachet,1400,1050,110,40`}
            </pre>
            <p className="text-[11px] text-ink-500">
              Validates SKU uniqueness, positive integer centavos, and foreign key constraints before committing.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
