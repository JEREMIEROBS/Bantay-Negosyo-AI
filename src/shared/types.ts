/**
 * Bantay Negosyo AI — Shared Type Definitions & Service Contracts
 * 
 * Strict integer monetary storage (centavos) to avoid floating-point inaccuracies.
 * All backend and frontend communication conforms to these typed interfaces.
 */

export type CurrencyCode = 'PHP';

/** Monetary amounts stored in integer centavos (1 PHP = 100 centavos) */
export type Centavos = number;

export interface Business {
  id: string;
  name: string;
  currency: CurrencyCode;
  ownerName?: string;
  barangay?: string;
  city?: string;
  createdAt: string;
}

export type ProductUnit = 'piraso' | 'kilo' | 'balot' | 'bote' | 'lata' | 'pakete' | 'sachet' | 'litro';

export interface Product {
  id: string;
  businessId: string;
  sku: string;
  name: string;
  unit: ProductUnit;
  category: string;
  priceCentavos: Centavos; // Selling price in centavos
  costCentavos: Centavos;  // Cost/wholesale price in centavos
  stockQty: number;
  reorderLevel: number;
  active: boolean;
  imageUrl?: string;       // Packshot photo path or remote URL
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  qty: number;
  unitPriceCentavos: Centavos; // Sale-time snapshot
  unitCostCentavos: Centavos;  // Sale-time snapshot
  productName?: string;
  productSku?: string;
  unit?: ProductUnit;
}

export type SaleStatus = 'completed' | 'void';

export interface Sale {
  id: string;
  businessId: string;
  soldAt: string;
  status: SaleStatus;
  notes?: string;
  items: SaleItem[];
  totalCentavos: Centavos;
  totalCostCentavos: Centavos;
  grossProfitCentavos: Centavos;
  createdAt: string;
  voidReason?: string;
}

export type ExpenseCategory =
  | 'Inventory/Supplies'
  | 'Utilities & Power'
  | 'Rent'
  | 'Transportation & Fuel'
  | 'Packaging'
  | 'Labor & Wages'
  | 'Repairs & Maintenance'
  | 'Permits & Fees'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  businessId: string;
  spentAt: string;
  category: ExpenseCategory;
  amountCentavos: Centavos;
  description: string;
  createdAt: string;
}

export type MovementType = 'sale' | 'restock' | 'adjustment' | 'void_reversal';

export interface InventoryMovement {
  id: string;
  productId: string;
  movementType: MovementType;
  quantityDelta: number;
  referenceType: 'sale' | 'manual' | 'import';
  referenceId?: string;
  reason: string;
  createdAt: string;
}

export interface DashboardKPIs {
  revenueCentavos: Centavos;
  cogsCentavos: Centavos;
  grossProfitCentavos: Centavos;
  operatingExpensesCentavos: Centavos;
  estimatedOperatingResultCentavos: Centavos;
  lowStockCount: number;
  completedSalesCount: number;
  averageOrderValueCentavos: Centavos;
  dateRangeLabel: string;
  omissionNote: string;
}

export interface DailySalesDataPoint {
  date: string;
  formattedDate: string;
  revenueCentavos: Centavos;
  grossProfitCentavos: Centavos;
  salesCount: number;
}

export interface ProductProfitRank {
  productId: string;
  sku: string;
  name: string;
  qtySold: number;
  revenueCentavos: Centavos;
  cogsCentavos: Centavos;
  grossProfitCentavos: Centavos;
  marginPercent: number;
}

export type AIIntent =
  | 'SUMMARIZE_PERFORMANCE'
  | 'EXPLAIN_SALES_CHANGE'
  | 'TOP_PRODUCTS_BY_PROFIT'
  | 'LOW_STOCK_REVIEW'
  | 'EXPENSE_BREAKDOWN'
  | 'GENERAL_BUSINESS_GUIDANCE';

export interface AdvisorEvidence {
  intent: AIIntent;
  query: string;
  dateRange: { start: string; end: string };
  metrics: Record<string, any>;
  tableData?: Array<Record<string, any>>;
  calculatedAt: string;
  dataSource: 'sqlite_local' | 'mock_fixtures';
}

export interface AIResponsePayload {
  summary: string;
  observations: string[];
  recommendations: string[];
  caveats: string[];
  modelInfo?: {
    model: string;
    temperature: number;
    latencyMs: number;
    isLocalhost: boolean;
  };
}

export interface ModelDiagnostics {
  ollamaEndpoint: string;
  modelName: string;
  isServiceReachable: boolean;
  isModelLoaded: boolean;
  isOfflineCapable: boolean;
  responseLatencyMs: number;
  ramUsageMb: number;
  lastChecked: string;
}

export interface CreateSaleInput {
  items: Array<{
    productId: string;
    qty: number;
  }>;
  notes?: string;
  soldAt?: string;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  unit: ProductUnit;
  category: string;
  priceCentavos: Centavos;
  costCentavos: Centavos;
  stockQty: number;
  reorderLevel: number;
  imageUrl?: string;
}

export type StoreApplicationStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'store_owner' | 'superadmin';

export type StoreSubscriptionStatus =
  | 'trial_active'   // In 30-day free trial
  | 'trial_expired'  // 30-day trial ended, payment needed to rent system
  | 'active_paid'    // Actively subscribed and paid
  | 'past_due'       // Monthly renewal overdue
  | 'suspended';     // Suspended by Superadmin

export interface SubscriptionPaymentRecord {
  id: string;
  storeId: string;
  storeName: string;
  amountCentavos: Centavos;
  paymentMethod: 'GCash' | 'Maya' | 'Bank Transfer' | 'Cash';
  referenceNo: string;
  monthsCount: number;
  paidAt: string;
  receivedBy: string;
}

export interface StoreApplication {
  id: string;
  storeName: string;
  ownerName: string;
  contactNumber: string;
  email?: string;
  barangay: string;
  city: string;
  storeType: string;
  permitNumber?: string;
  status: StoreApplicationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;

  // 30-Day Free Trial & Subscription Rental Model
  subscriptionStatus: StoreSubscriptionStatus;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionExpiresAt: string;
  monthlyFeeCentavos: Centavos; // ₱499.00 default monthly software rent
  totalPaidCentavos: Centavos;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  emailOrPhone: string;
  storeName?: string;
  applicationId?: string;
  status?: StoreApplicationStatus;
  subscriptionStatus?: StoreSubscriptionStatus;
}

export interface StockAdjustmentInput {
  productId: string;
  quantityDelta: number;
  reason: string;
}

export interface CreateExpenseInput {
  spentAt: string;
  category: ExpenseCategory;
  amountCentavos: Centavos;
  description: string;
}

/**
 * Strict Typed Contract for Bantay Negosyo Service / IPC Bridge
 */
export interface BantayApi {
  getBusiness(): Promise<Business>;
  getDashboardKPIs(): Promise<DashboardKPIs>;
  getDailySalesTrend(days?: number): Promise<DailySalesDataPoint[]>;
  getTopProductsByProfit(limit?: number): Promise<ProductProfitRank[]>;
  
  getSales(): Promise<Sale[]>;
  createSale(input: CreateSaleInput): Promise<Sale>;
  voidSale(saleId: string, reason?: string): Promise<Sale>;
  
  getProducts(): Promise<Product[]>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product>;
  adjustStock(input: StockAdjustmentInput): Promise<InventoryMovement>;
  getMovements(productId?: string): Promise<InventoryMovement[]>;
  
  getExpenses(): Promise<Expense[]>;
  createExpense(input: CreateExpenseInput): Promise<Expense>;
  
  askAdvisor(query: string, intent?: AIIntent): Promise<{ evidence: AdvisorEvidence; response: AIResponsePayload }>;
  getDiagnostics(): Promise<ModelDiagnostics>;
  
  resetDemoData(): Promise<void>;
}

declare global {
  interface Window {
    bantayApi?: BantayApi;
  }
}
