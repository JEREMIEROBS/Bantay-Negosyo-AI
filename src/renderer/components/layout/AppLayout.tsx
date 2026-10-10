import React, { useState } from 'react';
import { Sidebar, NavRoute } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardPage } from '@/renderer/pages/DashboardPage';
import { SalesPage } from '@/renderer/pages/SalesPage';
import { InventoryPage } from '@/renderer/pages/InventoryPage';
import { ExpensesPage } from '@/renderer/pages/ExpensesPage';
import { AdvisorPage } from '@/renderer/pages/AdvisorPage';
import { SettingsPage } from '@/renderer/pages/SettingsPage';
import { NewProductModal } from '@/renderer/components/modals/NewProductModal';
import { AdjustStockModal } from '@/renderer/components/modals/AdjustStockModal';
import { NewExpenseModal } from '@/renderer/components/modals/NewExpenseModal';
import { AuthPage } from '@/renderer/pages/AuthPage';
import { SuperadminPage } from '@/renderer/pages/SuperadminPage';
import { PendingApprovalCard } from '@/renderer/components/auth/PendingApprovalCard';
import { ToastContainer } from '@/renderer/components/ui/ToastContainer';
import { useNegosyoStore } from '@/renderer/store/useNegosyoStore';
import { Product } from '@/shared/types';

export const AppLayout: React.FC = () => {
  const { activeSalesTab, setActiveSalesTab, currentUser } = useNegosyoStore();
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal visibility states
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  // Route 1: Not logged in
  if (!currentUser) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  // Route 2: Superadmin portal
  if (currentUser.role === 'superadmin') {
    return (
      <>
        <SuperadminPage />
        <ToastContainer />
      </>
    );
  }

  // Route 3: Store owner pending qualification
  if (currentUser.role === 'store_owner' && currentUser.status !== 'approved') {
    return (
      <>
        <PendingApprovalCard />
        <ToastContainer />
      </>
    );
  }

  const handleSelectProductForStock = (prod: Product) => {
    setProductToAdjust(prod);
  };

  const handleOpenPos = () => {
    setActiveSalesTab('pos');
    setCurrentRoute('sales');
  };

  const handleExitPos = () => {
    setActiveSalesTab('ledger');
    setCurrentRoute('dashboard');
  };

  // When in POS Register mode, hide sidebar and standard topbar for true counter fullscreen
  const isPosCounterMode = currentRoute === 'sales' && activeSalesTab === 'pos';

  return (
    <div className="flex h-screen overflow-hidden bg-cloud font-sans text-ink">
      {/* Sidebar with Mobile Drawer support - Hidden in POS Counter Mode */}
      {!isPosCounterMode && (
        <Sidebar
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Header - Hidden in POS Counter Mode */}
        {!isPosCounterMode && (
          <TopBar
            currentRoute={currentRoute}
            onOpenAdvisor={() => setCurrentRoute('advisor')}
            onOpenPos={handleOpenPos}
            onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        )}

        {/* Dynamic Page Container */}
        <main className={`flex-1 ${isPosCounterMode ? 'p-0 pb-0' : 'pb-16'}`}>
          {currentRoute === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentRoute}
              onOpenPos={handleOpenPos}
              onSelectProductForStock={handleSelectProductForStock}
            />
          )}

          {currentRoute === 'sales' && (
            <SalesPage onExitPos={handleExitPos} />
          )}

          {currentRoute === 'inventory' && (
            <InventoryPage
              onOpenNewProduct={() => setIsNewProductOpen(true)}
              onOpenAdjustStock={(prod) => setProductToAdjust(prod)}
            />
          )}

          {currentRoute === 'expenses' && (
            <ExpensesPage onOpenNewExpense={() => setIsNewExpenseOpen(true)} />
          )}

          {currentRoute === 'advisor' && <AdvisorPage />}

          {currentRoute === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Product & Expense Modals */}
      <NewProductModal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
      />

      <AdjustStockModal
        product={productToAdjust}
        isOpen={!!productToAdjust}
        onClose={() => setProductToAdjust(null)}
      />

      <NewExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
      />

      {/* Real-Time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
