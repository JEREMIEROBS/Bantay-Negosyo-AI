import { create } from 'zustand';
import {
  Business,
  DashboardKPIs,
  DailySalesDataPoint,
  ProductProfitRank,
  Sale,
  Product,
  Expense,
  InventoryMovement,
  ModelDiagnostics,
  CreateSaleInput,
  CreateProductInput,
  StockAdjustmentInput,
  CreateExpenseInput,
  AdvisorEvidence,
  AIResponsePayload,
  AIIntent,
  BantayApi,
  AuthUser,
  StoreApplication,
  StoreApplicationStatus,
  StoreSubscriptionStatus,
  SubscriptionPaymentRecord,
  UserRole,
} from '@/shared/types';
import { MockNegosyoService } from './mockService';
import { Language } from '@/renderer/lib/i18n';

const mockServiceInstance = new MockNegosyoService();

function getApi(): BantayApi {
  if (typeof window !== 'undefined' && window.bantayApi) {
    return window.bantayApi;
  }
  return mockServiceInstance;
}

export interface ToastInfo {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

export interface PosCartItem {
  productId: string;
  qty: number;
}

interface NegosyoState {
  // Locale & UI Preferences
  language: Language;
  setLanguage: (lang: Language) => void;

  business: Business | null;
  kpis: DashboardKPIs | null;
  dailyTrend: DailySalesDataPoint[];
  topProducts: ProductProfitRank[];
  sales: Sale[];
  products: Product[];
  expenses: Expense[];
  movements: InventoryMovement[];
  diagnostics: ModelDiagnostics | null;
  
  // Modern POS Register State
  activeSalesTab: 'pos' | 'ledger';
  setActiveSalesTab: (tab: 'pos' | 'ledger') => void;
  posCart: PosCartItem[];
  addToPosCart: (productId: string, qty?: number) => void;
  removeFromPosCart: (productId: string) => void;
  updatePosCartQty: (productId: string, qty: number) => void;
  clearPosCart: () => void;

  // Advisor state
  advisorHistory: Array<{
    query: string;
    evidence: AdvisorEvidence;
    response: AIResponsePayload;
    timestamp: string;
  }>;
  isAdvisorLoading: boolean;

  // General loading & feedback
  isLoading: boolean;
  error: string | null;
  toasts: ToastInfo[];

  // Auth & Store Application State
  currentUser: AuthUser | null;
  storeApplications: StoreApplication[];
  subscriptionPayments: SubscriptionPaymentRecord[];
  login: (emailOrPhone: string, role?: UserRole) => boolean;
  logout: () => void;
  registerStore: (
    data: Omit<
      StoreApplication,
      | 'id'
      | 'status'
      | 'submittedAt'
      | 'subscriptionStatus'
      | 'trialStartDate'
      | 'trialEndDate'
      | 'subscriptionExpiresAt'
      | 'monthlyFeeCentavos'
      | 'totalPaidCentavos'
    >
  ) => Promise<StoreApplication>;
  approveStoreApplication: (applicationId: string) => void;
  rejectStoreApplication: (applicationId: string, reason: string) => void;
  recordSubscriptionPayment: (
    storeId: string,
    amountCentavos: number,
    paymentMethod: 'GCash' | 'Maya' | 'Bank Transfer' | 'Cash',
    referenceNo: string,
    months?: number
  ) => void;
  extendTrial: (storeId: string, days?: number) => void;
  toggleStoreLock: (storeId: string) => void;
  switchDemoRole: (
    role:
      | 'approved_owner'
      | 'trial_active_owner'
      | 'pending_owner'
      | 'trial_expired_owner'
      | 'superadmin'
  ) => void;

  // Actions
  loadInitialData: () => Promise<void>;
  recordSale: (input: CreateSaleInput) => Promise<Sale>;
  voidSale: (saleId: string, reason?: string) => Promise<Sale>;
  addProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (id: string, input: Partial<CreateProductInput>) => Promise<Product>;
  adjustStock: (input: StockAdjustmentInput) => Promise<InventoryMovement>;
  recordExpense: (input: CreateExpenseInput) => Promise<Expense>;
  askAdvisor: (query: string, intentOverride?: AIIntent) => Promise<void>;
  resetDemoData: () => Promise<void>;
  addToast: (toast: Omit<ToastInfo, 'id'>) => void;
  removeToast: (id: string) => void;
}

const INITIAL_STORE_APPLICATIONS: StoreApplication[] = [
  {
    id: 'app_01',
    storeName: "Aling Nena's Sari-Sari & General Store",
    ownerName: 'Nenita "Aling Nena" Santos',
    contactNumber: '0917-555-1234',
    email: 'alingnena@gmail.com',
    barangay: 'Brgy. San Roque',
    city: 'Pasig City, Metro Manila',
    storeType: 'Sari-Sari Store',
    permitNumber: 'BP-2026-0819-PSG',
    status: 'approved',
    subscriptionStatus: 'active_paid',
    trialStartDate: '2026-01-15T08:00:00Z',
    trialEndDate: '2026-02-14T08:00:00Z',
    subscriptionExpiresAt: '2026-04-15T08:00:00Z',
    monthlyFeeCentavos: 49900,
    totalPaidCentavos: 99800,
    submittedAt: '2026-01-15T08:00:00Z',
    reviewedAt: '2026-01-15T09:30:00Z',
    reviewedBy: 'Superadmin',
  },
  {
    id: 'app_02',
    storeName: "Mang Jose's Tindahan & Sari-Sari",
    ownerName: 'Jose "Mang Jose" Cruz',
    contactNumber: '0918-777-9876',
    email: 'mangjose@gmail.com',
    barangay: 'Brgy. San Antonio',
    city: 'Pasig City, Metro Manila',
    storeType: 'Sari-Sari Store & Cold Drinks',
    permitNumber: 'BP-2026-1402-PSG',
    status: 'pending',
    subscriptionStatus: 'trial_active',
    trialStartDate: '2026-03-09T08:15:00Z',
    trialEndDate: '2026-04-08T08:15:00Z',
    subscriptionExpiresAt: '2026-04-08T08:15:00Z',
    monthlyFeeCentavos: 49900,
    totalPaidCentavos: 0,
    submittedAt: '2026-03-09T08:15:00Z',
  },
  {
    id: 'app_03',
    storeName: 'Kusina at Sari-Sari ni Aling Marites',
    ownerName: 'Marites Dimagiba',
    contactNumber: '0922-888-4321',
    email: 'marites@gmail.com',
    barangay: 'Brgy. Kapasigan',
    city: 'Pasig City, Metro Manila',
    storeType: 'Sari-Sari & Eatery',
    permitNumber: 'BP-2026-0994-PSG',
    status: 'approved',
    subscriptionStatus: 'trial_expired', // 30-day trial ended! Requires ₱499 rent payment demo!
    trialStartDate: '2026-02-01T08:00:00Z',
    trialEndDate: '2026-03-03T08:00:00Z',
    subscriptionExpiresAt: '2026-03-03T08:00:00Z',
    monthlyFeeCentavos: 49900,
    totalPaidCentavos: 0,
    submittedAt: '2026-02-01T08:00:00Z',
    reviewedAt: '2026-02-01T10:00:00Z',
    reviewedBy: 'Superadmin',
  },
  {
    id: 'app_04',
    storeName: 'Nanay Cora Mini-Mart',
    ownerName: 'Corazon Dela Cruz',
    contactNumber: '0919-333-2211',
    email: 'nanaycora@gmail.com',
    barangay: 'Brgy. Maybunga',
    city: 'Pasig City, Metro Manila',
    storeType: 'Mini Grocery',
    permitNumber: 'BP-2026-1188-PSG',
    status: 'approved',
    subscriptionStatus: 'trial_active', // 18 days left in 30-day trial
    trialStartDate: '2026-02-28T08:00:00Z',
    trialEndDate: '2026-03-30T08:00:00Z',
    subscriptionExpiresAt: '2026-03-30T08:00:00Z',
    monthlyFeeCentavos: 49900,
    totalPaidCentavos: 0,
    submittedAt: '2026-02-28T08:00:00Z',
    reviewedAt: '2026-02-28T09:00:00Z',
    reviewedBy: 'Superadmin',
  },
];

const INITIAL_SUBSCRIPTION_PAYMENTS: SubscriptionPaymentRecord[] = [
  {
    id: 'pay_sub_01',
    storeId: 'app_01',
    storeName: "Aling Nena's Sari-Sari & General Store",
    amountCentavos: 49900,
    paymentMethod: 'GCash',
    referenceNo: 'GCASH-9824-7128',
    monthsCount: 1,
    paidAt: '2026-02-15T11:20:00Z',
    receivedBy: 'Superadmin',
  },
  {
    id: 'pay_sub_02',
    storeId: 'app_01',
    storeName: "Aling Nena's Sari-Sari & General Store",
    amountCentavos: 49900,
    paymentMethod: 'Maya',
    referenceNo: 'MAYA-1104-5590',
    monthsCount: 1,
    paidAt: '2026-03-15T10:05:00Z',
    receivedBy: 'Superadmin',
  },
];

const DEFAULT_APPROVED_USER: AuthUser = {
  id: 'usr_owner_01',
  role: 'store_owner',
  name: 'Nenita "Aling Nena" Santos',
  emailOrPhone: '0917-555-1234',
  storeName: "Aling Nena's Sari-Sari & General Store",
  applicationId: 'app_01',
  status: 'approved',
  subscriptionStatus: 'active_paid',
};

export const useNegosyoStore = create<NegosyoState>((set, get) => ({
  language: 'en', // Default to English as requested
  setLanguage: (language: Language) => set({ language }),

  // Auth & Store Application State
  currentUser: DEFAULT_APPROVED_USER,
  storeApplications: INITIAL_STORE_APPLICATIONS,
  subscriptionPayments: INITIAL_SUBSCRIPTION_PAYMENTS,

  login: (emailOrPhone: string, role?: UserRole) => {
    const { storeApplications, language, addToast } = get();
    const clean = emailOrPhone.trim().toLowerCase();

    if (role === 'superadmin' || clean.includes('admin')) {
      const adminUser: AuthUser = {
        id: 'usr_admin_01',
        role: 'superadmin',
        name: 'Bantay Negosyo Superadmin',
        emailOrPhone: 'admin@bantaynegosyo.ai',
      };
      set({ currentUser: adminUser });
      addToast({
        type: 'info',
        title: language === 'en' ? 'Superadmin Authenticated' : 'Naka-login bilang Superadmin',
        message:
          language === 'en'
            ? 'Superadmin approval & management portal active.'
            : 'Bukas na ang portal para sa pamamahala ng mga tindahan.',
      });
      return true;
    }

    const match = storeApplications.find(
      (app) =>
        app.contactNumber.includes(clean) ||
        (app.email && app.email.toLowerCase().includes(clean)) ||
        app.ownerName.toLowerCase().includes(clean) ||
        app.storeName.toLowerCase().includes(clean)
    );

    if (match) {
      const ownerUser: AuthUser = {
        id: `usr_${match.id}`,
        role: 'store_owner',
        name: match.ownerName,
        emailOrPhone: match.contactNumber,
        storeName: match.storeName,
        applicationId: match.id,
        status: match.status,
      };
      set({ currentUser: ownerUser });
      addToast({
        type: match.status === 'approved' ? 'success' : 'warning',
        title: language === 'en' ? 'Welcome Back' : 'Maligayang Pagbabalik',
        message: `${match.storeName} (${match.status.toUpperCase()})`,
      });
      return true;
    }

    const defaultUser: AuthUser = {
      id: `usr_${Date.now()}`,
      role: 'store_owner',
      name: emailOrPhone.split('@')[0] || 'Store Owner',
      emailOrPhone,
      storeName: `${emailOrPhone.split('@')[0]}'s Store`,
      status: 'approved',
    };
    set({ currentUser: defaultUser });
    return true;
  },

  logout: () => {
    set({ currentUser: null });
  },

  registerStore: async (data) => {
    const newApp: StoreApplication = {
      id: `app_${Date.now()}`,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    set((state) => ({
      storeApplications: [newApp, ...state.storeApplications],
      currentUser: {
        id: `usr_${newApp.id}`,
        role: 'store_owner',
        name: newApp.ownerName,
        emailOrPhone: newApp.contactNumber,
        storeName: newApp.storeName,
        applicationId: newApp.id,
        status: 'pending',
      },
    }));

    get().addToast({
      type: 'warning',
      title: get().language === 'en' ? 'Application Submitted' : 'Naipasa ang Aplikasyon',
      message:
        get().language === 'en'
          ? `Store registration for "${newApp.storeName}" is now pending Superadmin qualification.`
          : `Ang rehistrasyon para sa "${newApp.storeName}" ay naghihintay ng pagsusuri ng Superadmin.`,
    });

    return newApp;
  },

  approveStoreApplication: (applicationId: string) => {
    const now = new Date().toISOString();
    set((state) => {
      const updated = state.storeApplications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'approved' as StoreApplicationStatus,
              reviewedAt: now,
              reviewedBy: state.currentUser?.name || 'Superadmin',
            }
          : app
      );

      const current = state.currentUser;
      const updatedUser =
        current && current.applicationId === applicationId
          ? { ...current, status: 'approved' as StoreApplicationStatus }
          : current;

      return {
        storeApplications: updated,
        currentUser: updatedUser,
      };
    });

    get().addToast({
      type: 'success',
      title: get().language === 'en' ? 'Store Approved!' : 'Na-aprubahan ang Tindahan!',
      message:
        get().language === 'en'
          ? `Application #${applicationId} verified. Store owner can now use full POS and AI.`
          : `Na-verify ang aplikasyon #${applicationId}. Maaari na nilang gamitin ang buong POS at AI.`,
    });
  },

  rejectStoreApplication: (applicationId: string, reason: string) => {
    const now = new Date().toISOString();
    set((state) => {
      const updated = state.storeApplications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'rejected' as StoreApplicationStatus,
              rejectionReason: reason,
              reviewedAt: now,
              reviewedBy: state.currentUser?.name || 'Superadmin',
            }
          : app
      );

      const current = state.currentUser;
      const updatedUser =
        current && current.applicationId === applicationId
          ? { ...current, status: 'rejected' as StoreApplicationStatus }
          : current;

      return {
        storeApplications: updated,
        currentUser: updatedUser,
      };
    });

    get().addToast({
      type: 'danger',
      title: get().language === 'en' ? 'Application Declined' : 'Tinanggihan ang Aplikasyon',
      message: reason || 'Application did not meet qualification requirements.',
    });
  },

  recordSubscriptionPayment: (
    storeId: string,
    amountCentavos: number,
    paymentMethod: 'GCash' | 'Maya' | 'Bank Transfer' | 'Cash',
    referenceNo: string,
    months: number = 1
  ) => {
    const now = new Date();
    const targetStore = get().storeApplications.find((a) => a.id === storeId);
    const newRecord: SubscriptionPaymentRecord = {
      id: `pay_${Date.now()}`,
      storeId,
      storeName: targetStore?.storeName || 'Store',
      amountCentavos,
      paymentMethod,
      referenceNo,
      monthsCount: months,
      paidAt: now.toISOString(),
      receivedBy: 'Superadmin Desk',
    };

    set((state) => {
      const updatedApps = state.storeApplications.map((app) => {
        if (app.id !== storeId) return app;
        const currentExp = new Date(app.subscriptionExpiresAt);
        const baseDate = currentExp > now ? currentExp : now;
        const newExp = new Date(baseDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);

        return {
          ...app,
          subscriptionStatus: 'active_paid' as StoreSubscriptionStatus,
          subscriptionExpiresAt: newExp.toISOString(),
          totalPaidCentavos: app.totalPaidCentavos + amountCentavos,
        };
      });

      const updatedUser =
        state.currentUser && state.currentUser.applicationId === storeId
          ? {
              ...state.currentUser,
              subscriptionStatus: 'active_paid' as StoreSubscriptionStatus,
            }
          : state.currentUser;

      return {
        subscriptionPayments: [newRecord, ...state.subscriptionPayments],
        storeApplications: updatedApps,
        currentUser: updatedUser,
      };
    });

    get().addToast({
      type: 'success',
      title: get().language === 'en' ? 'Rent Payment Recorded!' : 'Nai-record ang Bayad sa Paupa!',
      message:
        get().language === 'en'
          ? `Collected ₱${(amountCentavos / 100).toFixed(2)} via ${paymentMethod} (${months} month rent).`
          : `Natanggap ang ₱${(amountCentavos / 100).toFixed(2)} gamit ang ${paymentMethod} para sa ${months} buwang paupa.`,
    });
  },

  extendTrial: (storeId: string, days: number = 30) => {
    set((state) => {
      const updatedApps = state.storeApplications.map((app) => {
        if (app.id !== storeId) return app;
        const newEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        return {
          ...app,
          subscriptionStatus: 'trial_active' as StoreSubscriptionStatus,
          trialEndDate: newEnd,
          subscriptionExpiresAt: newEnd,
        };
      });

      const updatedUser =
        state.currentUser && state.currentUser.applicationId === storeId
          ? {
              ...state.currentUser,
              subscriptionStatus: 'trial_active' as StoreSubscriptionStatus,
            }
          : state.currentUser;

      return {
        storeApplications: updatedApps,
        currentUser: updatedUser,
      };
    });

    get().addToast({
      type: 'info',
      title: get().language === 'en' ? 'Trial Extended' : 'Pinalawig ang Libreng Subok',
      message:
        get().language === 'en'
          ? `Added +${days} days free trial to store.`
          : `Dinagdagan ng +${days} araw ang libreng subok ng tindahan.`,
    });
  },

  toggleStoreLock: (storeId: string) => {
    set((state) => {
      const updatedApps = state.storeApplications.map((app) => {
        if (app.id !== storeId) return app;
        const newStatus =
          app.subscriptionStatus === 'suspended' ? 'active_paid' : 'suspended';
        return {
          ...app,
          subscriptionStatus: newStatus as StoreSubscriptionStatus,
        };
      });

      return {
        storeApplications: updatedApps,
      };
    });
  },

  switchDemoRole: (
    role:
      | 'approved_owner'
      | 'trial_active_owner'
      | 'pending_owner'
      | 'trial_expired_owner'
      | 'superadmin'
  ) => {
    if (role === 'superadmin') {
      set({
        currentUser: {
          id: 'usr_admin_01',
          role: 'superadmin',
          name: 'Antigravity Superadmin',
          emailOrPhone: 'admin@bantaynegosyo.ai',
        },
      });
    } else if (role === 'pending_owner') {
      const pendingApp =
        get().storeApplications.find((a) => a.status === 'pending') ||
        get().storeApplications[1];
      set({
        currentUser: {
          id: `usr_${pendingApp.id}`,
          role: 'store_owner',
          name: pendingApp.ownerName,
          emailOrPhone: pendingApp.contactNumber,
          storeName: pendingApp.storeName,
          applicationId: pendingApp.id,
          status: 'pending',
          subscriptionStatus: 'trial_active',
        },
      });
    } else if (role === 'trial_active_owner') {
      const trialApp =
        get().storeApplications.find(
          (a) => a.subscriptionStatus === 'trial_active' && a.status === 'approved'
        ) || get().storeApplications[3] || get().storeApplications[0];
      set({
        currentUser: {
          id: `usr_${trialApp.id}`,
          role: 'store_owner',
          name: trialApp.ownerName,
          emailOrPhone: trialApp.contactNumber,
          storeName: trialApp.storeName,
          applicationId: trialApp.id,
          status: 'approved',
          subscriptionStatus: 'trial_active',
        },
      });
    } else if (role === 'trial_expired_owner') {
      const expiredApp =
        get().storeApplications.find((a) => a.subscriptionStatus === 'trial_expired') ||
        get().storeApplications[2];
      set({
        currentUser: {
          id: `usr_${expiredApp.id}`,
          role: 'store_owner',
          name: expiredApp.ownerName,
          emailOrPhone: expiredApp.contactNumber,
          storeName: expiredApp.storeName,
          applicationId: expiredApp.id,
          status: 'approved',
          subscriptionStatus: 'trial_expired',
        },
      });
    } else {
      const approvedApp =
        get().storeApplications.find((a) => a.subscriptionStatus === 'active_paid') ||
        get().storeApplications[0];
      set({
        currentUser: {
          id: `usr_${approvedApp.id}`,
          role: 'store_owner',
          name: approvedApp.ownerName,
          emailOrPhone: approvedApp.contactNumber,
          storeName: approvedApp.storeName,
          applicationId: approvedApp.id,
          status: 'approved',
          subscriptionStatus: approvedApp.subscriptionStatus,
        },
      });
    }
  },

  business: null,
  kpis: null,
  dailyTrend: [],
  topProducts: [],
  sales: [],
  products: [],
  expenses: [],
  movements: [],
  diagnostics: null,

  activeSalesTab: 'pos', // Default to modern POS format!
  setActiveSalesTab: (activeSalesTab) => set({ activeSalesTab }),
  posCart: [],

  addToPosCart: (productId: string, qty = 1) => {
    const { posCart, products, addToast, language } = get();
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existingIndex = posCart.findIndex((item) => item.productId === productId);
    const currentQtyInCart = existingIndex >= 0 ? posCart[existingIndex].qty : 0;
    const requestedTotal = currentQtyInCart + qty;

    if (requestedTotal > prod.stockQty) {
      addToast({
        type: 'warning',
        title: language === 'en' ? 'Insufficient Stock' : 'Kulang ang Stock',
        message:
          language === 'en'
            ? `Only ${prod.stockQty} ${prod.unit} of "${prod.name}" available in stock.`
            : `${prod.stockQty} ${prod.unit} na lang ang natitira para sa "${prod.name}".`,
      });
      return;
    }

    if (existingIndex >= 0) {
      const updated = [...posCart];
      updated[existingIndex].qty = requestedTotal;
      set({ posCart: updated });
    } else {
      set({ posCart: [...posCart, { productId, qty }] });
    }
  },

  removeFromPosCart: (productId: string) => {
    set((state) => ({
      posCart: state.posCart.filter((item) => item.productId !== productId),
    }));
  },

  updatePosCartQty: (productId: string, qty: number) => {
    const { products, addToast, language } = get();
    const prod = products.find((p) => p.id === productId);

    if (qty <= 0) {
      get().removeFromPosCart(productId);
      return;
    }

    if (prod && qty > prod.stockQty) {
      addToast({
        type: 'warning',
        title: language === 'en' ? 'Stock Limit Reached' : 'Limitasyon sa Stock',
        message:
          language === 'en'
            ? `Cannot add more than ${prod.stockQty} ${prod.unit}.`
            : `Hanggang ${prod.stockQty} ${prod.unit} lamang ang nasa estante.`,
      });
      return;
    }

    set((state) => ({
      posCart: state.posCart.map((item) =>
        item.productId === productId ? { ...item, qty } : item
      ),
    }));
  },

  clearPosCart: () => set({ posCart: [] }),

  advisorHistory: [],
  isAdvisorLoading: false,
  isLoading: false,
  error: null,
  toasts: [],

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  loadInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const api = getApi();
      const [
        business,
        kpis,
        dailyTrend,
        topProducts,
        sales,
        products,
        expenses,
        movements,
        diagnostics,
      ] = await Promise.all([
        api.getBusiness(),
        api.getDashboardKPIs(),
        api.getDailySalesTrend(14),
        api.getTopProductsByProfit(5),
        api.getSales(),
        api.getProducts(),
        api.getExpenses(),
        api.getMovements(),
        api.getDiagnostics(),
      ]);

      set({
        business,
        kpis,
        dailyTrend,
        topProducts,
        sales,
        products,
        expenses,
        movements,
        diagnostics,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load business data', isLoading: false });
    }
  },

  recordSale: async (input: CreateSaleInput) => {
    const api = getApi();
    const { language } = get();
    const sale = await api.createSale(input);
    
    // Refresh dependent data
    const [kpis, dailyTrend, topProducts, sales, products, movements] = await Promise.all([
      api.getDashboardKPIs(),
      api.getDailySalesTrend(14),
      api.getTopProductsByProfit(5),
      api.getSales(),
      api.getProducts(),
      api.getMovements(),
    ]);

    set({
      kpis,
      dailyTrend,
      topProducts,
      sales,
      products,
      movements,
      posCart: [], // Clear POS cart upon successful transaction
    });

    get().addToast({
      type: 'success',
      title: language === 'en' ? 'Sale Completed!' : 'Benta Naitala!',
      message:
        language === 'en'
          ? `Receipt #${sale.id} recorded (${sale.items.length} items). Stock & KPIs updated!`
          : `Matagumpay na naitala ang resibo #${sale.id} (${sale.items.length} aytem). Na-update agad ang stock!`,
    });

    return sale;
  },

  voidSale: async (saleId: string, reason?: string) => {
    const api = getApi();
    const { language } = get();
    const voided = await api.voidSale(saleId, reason);

    const [kpis, dailyTrend, topProducts, sales, products, movements] = await Promise.all([
      api.getDashboardKPIs(),
      api.getDailySalesTrend(14),
      api.getTopProductsByProfit(5),
      api.getSales(),
      api.getProducts(),
      api.getMovements(),
    ]);

    set({
      kpis,
      dailyTrend,
      topProducts,
      sales,
      products,
      movements,
    });

    get().addToast({
      type: 'warning',
      title: language === 'en' ? 'Sale Voided' : 'Transaksyon Na-Void',
      message:
        language === 'en'
          ? `Receipt #${saleId} voided. Quantities restored to inventory.`
          : `Ang resibo #${saleId} ay na-void at naibalik ang stock sa inventory.`,
    });

    return voided;
  },

  addProduct: async (input: CreateProductInput) => {
    const api = getApi();
    const { language } = get();
    const prod = await api.createProduct(input);
    const [products, kpis, movements] = await Promise.all([
      api.getProducts(),
      api.getDashboardKPIs(),
      api.getMovements(),
    ]);

    set({ products, kpis, movements });

    get().addToast({
      type: 'success',
      title: language === 'en' ? 'Product Listed' : 'Bagong Produkto Naidagdag',
      message:
        language === 'en'
          ? `"${prod.name}" (${prod.sku}) added to catalog.`
          : `Matagumpay na nailista si "${prod.name}" (${prod.sku}).`,
    });

    return prod;
  },

  updateProduct: async (id: string, input: Partial<CreateProductInput>) => {
    const api = getApi();
    const { language } = get();
    const prod = await api.updateProduct(id, input);
    const [products, kpis] = await Promise.all([
      api.getProducts(),
      api.getDashboardKPIs(),
    ]);

    set({ products, kpis });

    get().addToast({
      type: 'info',
      title: language === 'en' ? 'Product Updated' : 'Produkto Na-update',
      message:
        language === 'en'
          ? `Details for "${prod.name}" updated.`
          : `Na-update ang mga detalye ng "${prod.name}".`,
    });

    return prod;
  },

  adjustStock: async (input: StockAdjustmentInput) => {
    const api = getApi();
    const { language } = get();
    const mov = await api.adjustStock(input);
    const [products, kpis, movements] = await Promise.all([
      api.getProducts(),
      api.getDashboardKPIs(),
      api.getMovements(),
    ]);

    set({ products, kpis, movements });

    get().addToast({
      type: input.quantityDelta >= 0 ? 'success' : 'warning',
      title: language === 'en' ? 'Stock Adjusted' : 'Stock Na-adjust',
      message:
        language === 'en'
          ? `Stock change: ${input.quantityDelta > 0 ? '+' : ''}${input.quantityDelta}. Reason: ${input.reason}`
          : `Pagbabago ng stock: ${input.quantityDelta > 0 ? '+' : ''}${input.quantityDelta}. Dahilan: ${input.reason}`,
    });

    return mov;
  },

  recordExpense: async (input: CreateExpenseInput) => {
    const api = getApi();
    const { language } = get();
    const exp = await api.createExpense(input);
    const [expenses, kpis] = await Promise.all([
      api.getExpenses(),
      api.getDashboardKPIs(),
    ]);

    set({ expenses, kpis });

    get().addToast({
      type: 'info',
      title: language === 'en' ? 'Expense Recorded' : 'Gastos Naitala',
      message:
        language === 'en'
          ? `Operating expense recorded for "${exp.category}". Operating Result updated!`
          : `Naitala ang gastos para sa "${exp.category}". Na-update ang Estimated Operating Result!`,
    });

    return exp;
  },

  askAdvisor: async (query: string, intentOverride?: AIIntent) => {
    set({ isAdvisorLoading: true, error: null });
    const { language } = get();
    try {
      const api = getApi();
      const result = await api.askAdvisor(query, intentOverride);

      set((state) => ({
        advisorHistory: [
          {
            query,
            evidence: result.evidence,
            response: result.response,
            timestamp: new Date().toISOString(),
          },
          ...state.advisorHistory,
        ],
        isAdvisorLoading: false,
      }));
    } catch (err: any) {
      set({
        isAdvisorLoading: false,
        error: err?.message || 'Advisor unavailable',
      });
      get().addToast({
        type: 'danger',
        title: language === 'en' ? 'Advisor Notice' : 'Abiso mula kay Bantay',
        message: err?.message || 'Could not process query at this time.',
      });
    }
  },

  resetDemoData: async () => {
    const api = getApi();
    const { language } = get();
    await api.resetDemoData();
    await get().loadInitialData();
    set({ advisorHistory: [], posCart: [] });

    get().addToast({
      type: 'info',
      title: language === 'en' ? 'Demo Data Reset' : 'Demo Data Na-reset',
      message:
        language === 'en'
          ? 'Reset to original 24 products and 30 days of consistent transactions.'
          : 'Naibalik sa orihinal na 24 na produkto at 30-araw na sample na transaksyon.',
    });
  },
}));
