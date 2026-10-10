import { describe, it, expect, beforeEach } from 'vitest';
import { MockNegosyoService } from '@/renderer/store/mockService';

describe('Bantay Negosyo Financial & Inventory Calculation Engine', () => {
  let service: MockNegosyoService;

  beforeEach(() => {
    service = new MockNegosyoService();
  });

  it('calculates dashboard KPIs with exact mathematical consistency (Revenue, COGS, Gross Profit, Operating Expenses, Estimated Result)', async () => {
    const kpis = await service.getDashboardKPIs();

    // Verify equation: Gross Profit = Revenue - COGS
    expect(kpis.grossProfitCentavos).toBe(kpis.revenueCentavos - kpis.cogsCentavos);

    // Verify equation: Estimated Operating Result = Gross Profit - Operating Expenses
    expect(kpis.estimatedOperatingResultCentavos).toBe(
      kpis.grossProfitCentavos - kpis.operatingExpensesCentavos
    );

    // Check that monetary values are integers (no floating point centavos)
    expect(Number.isInteger(kpis.revenueCentavos)).toBe(true);
    expect(Number.isInteger(kpis.cogsCentavos)).toBe(true);
    expect(Number.isInteger(kpis.grossProfitCentavos)).toBe(true);
    expect(Number.isInteger(kpis.operatingExpensesCentavos)).toBe(true);
    expect(Number.isInteger(kpis.estimatedOperatingResultCentavos)).toBe(true);
  });

  it('strictly excludes void sales from revenue, COGS, and gross profit totals', async () => {
    const initialKpis = await service.getDashboardKPIs();
    const products = await service.getProducts();
    const testProd = products[0];

    // Create a sale of 2 units
    const sale = await service.createSale({
      items: [{ productId: testProd.id, qty: 2 }],
      notes: 'Test sale for void verification',
    });

    const kpisAfterSale = await service.getDashboardKPIs();
    expect(kpisAfterSale.revenueCentavos).toBe(
      initialKpis.revenueCentavos + (testProd.priceCentavos * 2)
    );

    // Void the sale
    await service.voidSale(sale.id, 'Test cancellation');
    const kpisAfterVoid = await service.getDashboardKPIs();

    // Revenue and profit must revert exactly back to initial values
    expect(kpisAfterVoid.revenueCentavos).toBe(initialKpis.revenueCentavos);
    expect(kpisAfterVoid.grossProfitCentavos).toBe(initialKpis.grossProfitCentavos);
    expect(kpisAfterVoid.cogsCentavos).toBe(initialKpis.cogsCentavos);
  });

  it('rejects sales when requested quantity exceeds available stock (negative stock prevention)', async () => {
    const products = await service.getProducts();
    const testProd = products[0];

    // Attempt to sell more than available
    const excessiveQty = testProd.stockQty + 50;

    await expect(
      service.createSale({
        items: [{ productId: testProd.id, qty: excessiveQty }],
      })
    ).rejects.toThrow(/Kulang ang stock/);
  });

  it('decrements stock on sale and restores stock on void exactly once', async () => {
    const products = await service.getProducts();
    const testProd = products[0];
    const initialStock = testProd.stockQty;

    // Create sale of 3 units
    const sale = await service.createSale({
      items: [{ productId: testProd.id, qty: 3 }],
    });

    const productsAfterSale = await service.getProducts();
    const prodAfterSale = productsAfterSale.find((p) => p.id === testProd.id)!;
    expect(prodAfterSale.stockQty).toBe(initialStock - 3);

    // Void sale
    await service.voidSale(sale.id, 'Customer cancellation');
    const productsAfterVoid = await service.getProducts();
    const prodAfterVoid = productsAfterVoid.find((p) => p.id === testProd.id)!;
    expect(prodAfterVoid.stockQty).toBe(initialStock);

    // Attempting to void the same sale again must throw an error
    await expect(service.voidSale(sale.id)).rejects.toThrow(/Naka-void na/);
  });

  it('accurately identifies low stock when stockQty <= reorderLevel', async () => {
    const products = await service.getProducts();
    
    // Find a product with stock > reorderLevel
    const prod = products.find((p) => p.stockQty > p.reorderLevel)!;
    
    // Adjust stock down to equal reorderLevel
    const delta = -(prod.stockQty - prod.reorderLevel);
    await service.adjustStock({
      productId: prod.id,
      quantityDelta: delta,
      reason: 'Test adjustment to reorder boundary',
    });

    const kpis = await service.getDashboardKPIs();
    const updatedProducts = await service.getProducts();
    const expectedLowCount = updatedProducts.filter(
      (p) => p.active && p.stockQty <= p.reorderLevel
    ).length;

    expect(kpis.lowStockCount).toBe(expectedLowCount);
  });

  it('ranks top products by exact gross profit descending (not by volume alone)', async () => {
    const top = await service.getTopProductsByProfit(5);
    expect(top.length).toBeLessThanOrEqual(5);

    for (let i = 0; i < top.length - 1; i++) {
      expect(top[i].grossProfitCentavos).toBeGreaterThanOrEqual(top[i + 1].grossProfitCentavos);
    }
  });

  it('adds expenses and accurately updates Estimated Operating Result', async () => {
    const initialKpis = await service.getDashboardKPIs();
    
    await service.createExpense({
      category: 'Utilities & Power',
      amountCentavos: 150000, // ₱1,500.00
      spentAt: new Date().toISOString(),
      description: 'Additional power meter bill',
    });

    const updatedKpis = await service.getDashboardKPIs();
    expect(updatedKpis.operatingExpensesCentavos).toBe(
      initialKpis.operatingExpensesCentavos + 150000
    );
    expect(updatedKpis.estimatedOperatingResultCentavos).toBe(
      initialKpis.estimatedOperatingResultCentavos - 150000
    );
  });
});
