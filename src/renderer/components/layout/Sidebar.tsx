import React from 'react';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations } from '@/renderer/lib/i18n';
import {
  LayoutDashboard,
  ReceiptText,
  Boxes,
  WalletCards,
  Bot,
  Settings,
  ShieldCheck,
  Store,
  WifiOff,
  X,
  ShoppingBag,
} from 'lucide-react';

export type NavRoute = 'dashboard' | 'sales' | 'inventory' | 'expenses' | 'advisor' | 'settings';

interface SidebarProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const { business, kpis, language } = useNegosyoStore();
  const t = translations[language];

  const lowStockCount = kpis?.lowStockCount || 0;

  const navItems = [
    {
      route: 'dashboard' as NavRoute,
      label: t.nav.dashboard,
      sublabel: t.nav.dashboardSub,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      route: 'sales' as NavRoute,
      label: t.nav.sales,
      sublabel: t.nav.salesSub,
      icon: <ReceiptText className="w-5 h-5" />,
      highlight: true,
    },
    {
      route: 'inventory' as NavRoute,
      label: t.nav.inventory,
      sublabel: t.nav.inventorySub,
      icon: <Boxes className="w-5 h-5" />,
      badge: lowStockCount > 0 ? `${lowStockCount} ${t.nav.lowStockBadge}` : undefined,
    },
    {
      route: 'expenses' as NavRoute,
      label: t.nav.expenses,
      sublabel: t.nav.expensesSub,
      icon: <WalletCards className="w-5 h-5" />,
    },
    {
      route: 'advisor' as NavRoute,
      label: t.nav.advisor,
      sublabel: t.nav.advisorSub,
      icon: <Bot className="w-5 h-5" />,
    },
    {
      route: 'settings' as NavRoute,
      label: t.nav.settings,
      sublabel: t.nav.settingsSub,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (route: NavRoute) => {
    onRouteChange(route);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 bg-ink-950/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 w-72 bg-white border-r border-cloud-400 flex flex-col justify-between select-none h-screen transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-cloud-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-sm shrink-0">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-ink tracking-tight">
                      {t.common.appName}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-forest/10 text-forest border border-forest/20">
                      AI™
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-500 font-medium leading-none mt-1">
                    {t.common.tagline}
                  </p>
                </div>
              </div>

              {/* Close button on mobile */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-md text-ink-400 hover:text-ink hover:bg-cloud-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Business Info Card */}
            <div className="mt-4 p-2.5 rounded-lg bg-cloud-200 border border-cloud-400 flex items-center gap-2.5">
              <Store className="w-4 h-4 text-forest shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink truncate">
                  {business?.name || "Aling Nena's Sari-Sari Store"}
                </p>
                <p className="text-[10px] text-ink-500 truncate">
                  {business?.barangay || 'Brgy. San Roque'}, {business?.city || 'Pasig City'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-forest text-white shadow-sm'
                      : 'text-ink-700 hover:bg-cloud-200 hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-forest font-semibold'
                          : 'text-ink-500 group-hover:text-forest'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="truncate">
                      <div className="leading-tight flex items-center gap-1.5">
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={`text-[11px] block mt-0.5 font-normal ${
                          isActive ? 'text-forest-100' : 'text-ink-400'
                        }`}
                      >
                        {item.sublabel}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-gold text-ink-950'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Offline Status Footer */}
        <div className="p-4 border-t border-cloud-300 bg-cloud-100/60">
          <div className="p-3 rounded-xl bg-white border border-cloud-300 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t.common.offlineBadge}
              </span>
              <WifiOff className="w-3.5 h-3.5 text-ink-400" />
            </div>
            <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
              {t.common.offlineDesc}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400 px-1">
            <span>v0.1.0 • Phase 1</span>
            <span className="font-mono text-[10px] bg-cloud-300 px-1.5 py-0.5 rounded text-ink-600">
              DEMO
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
