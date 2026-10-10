/**
 * Strict allowlisted IPC channel names for Bantay Negosyo AI.
 * Renderer may only invoke these explicitly routed endpoints.
 */
export const IPC_CHANNELS = {
  GET_BUSINESS: 'bantay:getBusiness',
  GET_DASHBOARD_KPIS: 'bantay:getDashboardKPIs',
  GET_DAILY_SALES_TREND: 'bantay:getDailySalesTrend',
  GET_TOP_PRODUCTS_BY_PROFIT: 'bantay:getTopProductsByProfit',
  
  GET_SALES: 'bantay:getSales',
  CREATE_SALE: 'bantay:createSale',
  VOID_SALE: 'bantay:voidSale',
  
  GET_PRODUCTS: 'bantay:getProducts',
  CREATE_PRODUCT: 'bantay:createProduct',
  UPDATE_PRODUCT: 'bantay:updateProduct',
  ADJUST_STOCK: 'bantay:adjustStock',
  GET_MOVEMENTS: 'bantay:getMovements',
  
  GET_EXPENSES: 'bantay:getExpenses',
  CREATE_EXPENSE: 'bantay:createExpense',
  
  ASK_ADVISOR: 'bantay:askAdvisor',
  GET_DIAGNOSTICS: 'bantay:getDiagnostics',
  RESET_DEMO_DATA: 'bantay:resetDemoData',
} as const;
