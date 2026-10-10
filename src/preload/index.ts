import { contextBridge, ipcRenderer } from 'electron';
import {
  BantayApi,
  CreateSaleInput,
  CreateProductInput,
  StockAdjustmentInput,
  CreateExpenseInput,
  AIIntent,
} from '../shared/types';

/**
 * Safe Preload ContextBridge exposing strictly typed IPC methods to Renderer.
 * Never exposes database handles, file systems, or arbitrary shell execution.
 */
const bantayApi: BantayApi = {
  getBusiness: () => ipcRenderer.invoke('bantay:getBusiness'),
  getDashboardKPIs: () => ipcRenderer.invoke('bantay:getDashboardKPIs'),
  getDailySalesTrend: (days?: number) => ipcRenderer.invoke('bantay:getDailySalesTrend', days),
  getTopProductsByProfit: (limit?: number) => ipcRenderer.invoke('bantay:getTopProductsByProfit', limit),
  
  getSales: () => ipcRenderer.invoke('bantay:getSales'),
  createSale: (input: CreateSaleInput) => ipcRenderer.invoke('bantay:createSale', input),
  voidSale: (saleId: string, reason?: string) => ipcRenderer.invoke('bantay:voidSale', saleId, reason),
  
  getProducts: () => ipcRenderer.invoke('bantay:getProducts'),
  createProduct: (input: CreateProductInput) => ipcRenderer.invoke('bantay:createProduct', input),
  updateProduct: (id: string, input: Partial<CreateProductInput>) => ipcRenderer.invoke('bantay:updateProduct', id, input),
  adjustStock: (input: StockAdjustmentInput) => ipcRenderer.invoke('bantay:adjustStock', input),
  getMovements: (productId?: string) => ipcRenderer.invoke('bantay:getMovements', productId),
  
  getExpenses: () => ipcRenderer.invoke('bantay:getExpenses'),
  createExpense: (input: CreateExpenseInput) => ipcRenderer.invoke('bantay:createExpense', input),
  
  askAdvisor: (query: string, intent?: AIIntent) => ipcRenderer.invoke('bantay:askAdvisor', query, intent),
  getDiagnostics: () => ipcRenderer.invoke('bantay:getDiagnostics'),
  
  resetDemoData: () => ipcRenderer.invoke('bantay:resetDemoData'),
};

try {
  contextBridge.exposeInMainWorld('bantayApi', bantayApi);
} catch (error) {
  // Running in standard browser dev mode without Electron
  console.info('[Bantay Negosyo] Running in browser mode with typed mock service fallback.');
}
