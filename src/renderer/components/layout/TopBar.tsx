import React from 'react';
import { Button } from '@/renderer/components/ui/Button';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { translations, Language } from '@/renderer/lib/i18n';
import { ShoppingBag, Bot, WifiOff, Globe, Menu, LogOut } from 'lucide-react';
import { NavRoute } from './Sidebar';

interface TopBarProps {
  currentRoute: NavRoute;
  onOpenAdvisor: () => void;
  onOpenPos: () => void;
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onOpenAdvisor,
  onOpenPos,
  onToggleSidebar,
}) => {
  const { language, setLanguage, currentUser, logout, switchDemoRole } = useNegosyoStore();
  const t = translations[language];

  const getScreenDetails = () => {
    switch (currentRoute) {
      case 'dashboard':
        return { title: t.dashboard.title, subtitle: t.dashboard.subtitle };
      case 'sales':
        return { title: t.sales.title, subtitle: t.sales.subtitle };
      case 'inventory':
        return { title: t.inventory.title, subtitle: t.inventory.subtitle };
      case 'expenses':
        return { title: t.expenses.title, subtitle: t.expenses.subtitle };
      case 'advisor':
        return { title: t.advisor.title, subtitle: t.advisor.subtitle };
      case 'settings':
        return { title: t.settings.title, subtitle: t.settings.subtitle };
    }
  };

  const { title, subtitle } = getScreenDetails();

  return (
    <header className="h-16 lg:h-18 bg-white border-b border-cloud-400 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-ink-600 hover:bg-cloud-200 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-ink tracking-tight flex items-center gap-2 truncate">
            {title}
          </h1>
          <p className="text-[11px] sm:text-xs text-ink-500 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector (English / Tagalog) */}
        <div className="flex items-center bg-cloud-200 p-0.5 rounded-lg border border-cloud-300">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              language === 'en'
                ? 'bg-forest text-white shadow-2xs'
                : 'text-ink-600 hover:text-ink'
            }`}
          >
            <span>EN</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('tl')}
            className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              language === 'tl'
                ? 'bg-forest text-white shadow-2xs'
                : 'text-ink-600 hover:text-ink'
            }`}
          >
            <span>TL</span>
          </button>
        </div>

        {/* Offline Security Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cloud-200 border border-cloud-400 text-xs font-medium text-ink-700">
          <WifiOff className="w-3.5 h-3.5 text-forest" />
          <span>{t.common.offlineBadge}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Phase 1 Demo Badge */}
        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
          {t.common.demoBadge}
        </span>

        {/* User Account / Role Badge */}
        {currentUser && (
          <div className="flex items-center gap-1.5 pl-1">
            <button
              onClick={() => switchDemoRole('superadmin')}
              title={language === 'en' ? 'Click to open Superadmin Portal' : 'Pumunta sa Superadmin'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cloud-200 hover:bg-cloud-300 border border-cloud-400 text-xs font-semibold text-ink cursor-pointer transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-forest font-bold uppercase">
                {currentUser.role === 'superadmin' ? 'Admin' : 'Owner'}
              </span>
            </button>
            <button
              onClick={logout}
              title={language === 'en' ? 'Sign out' : 'Lumabas'}
              className="p-1.5 rounded-lg text-ink-500 hover:text-red-700 hover:bg-cloud-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Advisor Trigger */}
        <Button
          variant="secondary"
          size="sm"
          icon={<Bot className="w-4 h-4 text-forest" />}
          onClick={onOpenAdvisor}
          className="hidden sm:inline-flex"
        >
          {t.common.askAi}
        </Button>

        {/* Modern POS Format Trigger */}
        <Button
          variant="primary"
          size="sm"
          icon={<ShoppingBag className="w-4 h-4" />}
          onClick={onOpenPos}
        >
          <span className="hidden sm:inline">+</span> {t.common.posRegister}
        </Button>
      </div>
    </header>
  );
};
