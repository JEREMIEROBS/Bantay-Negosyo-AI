import {
  BantayApi,
  Business,
  Product,
  Sale,
  Expense,
  InventoryMovement,
  DashboardKPIs,
  DailySalesDataPoint,
  ProductProfitRank,
  CreateSaleInput,
  CreateProductInput,
  StockAdjustmentInput,
  CreateExpenseInput,
  AdvisorEvidence,
  AIResponsePayload,
  ModelDiagnostics,
  AIIntent,
  Centavos,
} from '@/shared/types';
import {
  DEMO_BUSINESS,
  INITIAL_PRODUCTS,
  generateDemoSales,
  INITIAL_EXPENSES,
  INITIAL_MOVEMENTS,
} from '@/renderer/lib/fixtures';
import { formatPHP } from '@/renderer/lib/currency';

/**
 * In-Memory Mock Implementation of BantayApi for Phase 1.
 * Conforms 100% to the typed IPC contract so Phase 2/3 can plug in SQLite & IPC without changing UI components.
 */
export class MockNegosyoService implements BantayApi {
  private business: Business = { ...DEMO_BUSINESS };
  private products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
  private sales: Sale[] = generateDemoSales(this.products);
  private expenses: Expense[] = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
  private movements: InventoryMovement[] = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));

  constructor() {
    // Synchronize initial stock based on completed sales from fixtures
    // Note: In fixtures, stock quantities already represent current shelf stock
  }

  async getBusiness(): Promise<Business> {
    return { ...this.business };
  }

  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const completedSales = this.sales.filter((s) => s.status === 'completed');
    
    // Revenue = sum(qty * sale-time unit selling price)
    let revenueCentavos: Centavos = 0;
    // COGS = sum(qty * sale-time unit cost)
    let cogsCentavos: Centavos = 0;

    for (const sale of completedSales) {
      for (const item of sale.items) {
        revenueCentavos += item.qty * item.unitPriceCentavos;
        cogsCentavos += item.qty * item.unitCostCentavos;
      }
    }

    // Gross profit = revenue - COGS
    const grossProfitCentavos: Centavos = revenueCentavos - cogsCentavos;

    // Operating expenses = sum(expense amounts)
    let operatingExpensesCentavos: Centavos = 0;
    for (const exp of this.expenses) {
      operatingExpensesCentavos += exp.amountCentavos;
    }

    // Estimated operating result = gross profit - recorded operating expenses
    const estimatedOperatingResultCentavos: Centavos = grossProfitCentavos - operatingExpensesCentavos;

    // Low stock count: current stock <= reorder level
    const lowStockCount = this.products.filter(
      (p) => p.active && p.stockQty <= p.reorderLevel
    ).length;

    const completedSalesCount = completedSales.length;
    const averageOrderValueCentavos: Centavos =
      completedSalesCount > 0 ? Math.round(revenueCentavos / completedSalesCount) : 0;

    return {
      revenueCentavos,
      cogsCentavos,
      grossProfitCentavos,
      operatingExpensesCentavos,
      estimatedOperatingResultCentavos,
      lowStockCount,
      completedSalesCount,
      averageOrderValueCentavos,
      dateRangeLabel: 'Huling 30 Araw (Last 30 Days)',
      omissionNote:
        'Paunawa: Ang Estimated Operating Result ay base lamang sa mga naitalang gastos. Maaaring hindi pa kasama ang buwis (BIR), pwesto kung may utang, o sariling sahod ng may-ari.',
    };
  }

  async getDailySalesTrend(days: number = 14): Promise<DailySalesDataPoint[]> {
    const now = new Date();
    const trendMap = new Map<string, { revenue: number; profit: number; count: number }>();

    // Prepare slots for the last N days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      trendMap.set(key, { revenue: 0, profit: 0, count: 0 });
    }

    // Aggregate completed sales
    for (const sale of this.sales) {
      if (sale.status !== 'completed') continue;
      const key = sale.soldAt.split('T')[0];
      const entry = trendMap.get(key);
      if (entry) {
        entry.revenue += sale.totalCentavos;
        entry.profit += sale.grossProfitCentavos;
        entry.count += 1;
      }
    }

    const result: DailySalesDataPoint[] = [];
    trendMap.forEach((val, dateKey) => {
      const parts = dateKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const formatted = `${monthNames[mIdx]} ${parts[2]}`;

      result.push({
        date: dateKey,
        formattedDate: formatted,
        revenueCentavos: val.revenue,
        grossProfitCentavos: val.profit,
        salesCount: val.count,
      });
    });

    return result;
  }

  async getTopProductsByProfit(limit: number = 5): Promise<ProductProfitRank[]> {
    const productStats = new Map<
      string,
      {
        product: Product;
        qtySold: number;
        revenueCentavos: number;
        cogsCentavos: number;
        grossProfitCentavos: number;
      }
    >();

    // Map all products
    for (const prod of this.products) {
      productStats.set(prod.id, {
        product: prod,
        qtySold: 0,
        revenueCentavos: 0,
        cogsCentavos: 0,
        grossProfitCentavos: 0,
      });
    }

    // Accumulate from completed sales
    for (const sale of this.sales) {
      if (sale.status !== 'completed') continue;
      for (const item of sale.items) {
        const stats = productStats.get(item.productId);
        if (stats) {
          const rev = item.qty * item.unitPriceCentavos;
          const cost = item.qty * item.unitCostCentavos;
          stats.qtySold += item.qty;
          stats.revenueCentavos += rev;
          stats.cogsCentavos += cost;
          stats.grossProfitCentavos += rev - cost;
        }
      }
    }

    const ranks: ProductProfitRank[] = [];
    productStats.forEach((val) => {
      if (val.qtySold > 0) {
        const margin =
          val.revenueCentavos > 0
            ? Math.round((val.grossProfitCentavos / val.revenueCentavos) * 100)
            : 0;
        ranks.push({
          productId: val.product.id,
          sku: val.product.sku,
          name: val.product.name,
          qtySold: val.qtySold,
          revenueCentavos: val.revenueCentavos,
          cogsCentavos: val.cogsCentavos,
          grossProfitCentavos: val.grossProfitCentavos,
          marginPercent: margin,
        });
      }
    });

    // Rank using exact gross profit values descending
    ranks.sort((a, b) => b.grossProfitCentavos - a.grossProfitCentavos);
    return ranks.slice(0, limit);
  }

  async getSales(): Promise<Sale[]> {
    return [...this.sales];
  }

  async createSale(input: CreateSaleInput): Promise<Sale> {
    if (!input.items || input.items.length === 0) {
      throw new Error('Kinakailangan ng kahit isang produkto para sa benta.');
    }

    // Verify stock availability
    for (const item of input.items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (!prod) {
        throw new Error(`Hindi nahanap ang produkto (ID: ${item.productId})`);
      }
      if (prod.stockQty < item.qty) {
        throw new Error(
          `Kulang ang stock para sa "${prod.name}". Natitirang stock: ${prod.stockQty}, Hiniling: ${item.qty}`
        );
      }
    }

    const saleId = `sale_${Date.now()}`;
    const soldAt = input.soldAt || new Date().toISOString();
    const saleItems = [];
    let totalCentavos: Centavos = 0;
    let totalCostCentavos: Centavos = 0;

    for (const item of input.items) {
      const prod = this.products.find((p) => p.id === item.productId)!;
      const lineTotal = item.qty * prod.priceCentavos;
      const lineCost = item.qty * prod.costCentavos;
      totalCentavos += lineTotal;
      totalCostCentavos += lineCost;

      saleItems.push({
        id: `item_${Date.now()}_${prod.id}`,
        saleId,
        productId: prod.id,
        productName: prod.name,
        productSku: prod.sku,
        unit: prod.unit,
        qty: item.qty,
        unitPriceCentavos: prod.priceCentavos, // Immutable sale-time snapshot
        unitCostCentavos: prod.costCentavos,   // Immutable sale-time snapshot
      });

      // Deduct stock
      prod.stockQty -= item.qty;
      prod.updatedAt = soldAt;

      // Log movement
      this.movements.unshift({
        id: `mov_${Date.now()}_${prod.id}`,
        productId: prod.id,
        movementType: 'sale',
        quantityDelta: -item.qty,
        referenceType: 'sale',
        referenceId: saleId,
        reason: `Benta sa counter (${saleId})`,
        createdAt: soldAt,
      });
    }

    const newSale: Sale = {
      id: saleId,
      businessId: this.business.id,
      soldAt,
      status: 'completed',
      notes: input.notes,
      items: saleItems,
      totalCentavos,
      totalCostCentavos,
      grossProfitCentavos: totalCentavos - totalCostCentavos,
      createdAt: soldAt,
    };

    this.sales.unshift(newSale);
    return newSale;
  }

  async voidSale(saleId: string, reason?: string): Promise<Sale> {
    const sale = this.sales.find((s) => s.id === saleId);
    if (!sale) {
      throw new Error(`Hindi nahanap ang benta na may ID: ${saleId}`);
    }
    if (sale.status === 'void') {
      throw new Error('Naka-void na ang transaksyong ito.');
    }

    // Void sale and restore inventory stock (once only)
    sale.status = 'void';
    sale.voidReason = reason || 'Kanselado ng tindera';

    const now = new Date().toISOString();
    for (const item of sale.items) {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQty += item.qty; // Restore stock
        prod.updatedAt = now;

        this.movements.unshift({
          id: `mov_void_${Date.now()}_${prod.id}`,
          productId: prod.id,
          movementType: 'void_reversal',
          quantityDelta: item.qty,
          referenceType: 'sale',
          referenceId: sale.id,
          reason: `Pagsasauli ng stock dahil sa void sale (${sale.id}): ${sale.voidReason}`,
          createdAt: now,
        });
      }
    }

    return { ...sale };
  }

  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const exists = this.products.some((p) => p.sku.toLowerCase() === input.sku.toLowerCase());
    if (exists) {
      throw new Error(`Ang SKU na "${input.sku}" ay ginagamit na.`);
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `prd_${Date.now()}`,
      businessId: this.business.id,
      sku: input.sku.trim().toUpperCase(),
      name: input.name.trim(),
      unit: input.unit,
      category: input.category.trim(),
      priceCentavos: Math.round(input.priceCentavos),
      costCentavos: Math.round(input.costCentavos),
      stockQty: Math.max(0, Math.round(input.stockQty)),
      reorderLevel: Math.max(0, Math.round(input.reorderLevel)),
      active: true,
      imageUrl: input.imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    this.products.unshift(newProduct);

    if (newProduct.stockQty > 0) {
      this.movements.unshift({
        id: `mov_${Date.now()}_init`,
        productId: newProduct.id,
        movementType: 'restock',
        quantityDelta: newProduct.stockQty,
        referenceType: 'manual',
        reason: 'Initial opening stock encoding',
        createdAt: now,
      });
    }

    return newProduct;
  }

  async updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product> {
    const prod = this.products.find((p) => p.id === id);
    if (!prod) {
      throw new Error(`Hindi nahanap ang produkto na may ID: ${id}`);
    }

    if (input.name !== undefined) prod.name = input.name;
    if (input.unit !== undefined) prod.unit = input.unit;
    if (input.category !== undefined) prod.category = input.category;
    if (input.priceCentavos !== undefined) prod.priceCentavos = Math.round(input.priceCentavos);
    if (input.costCentavos !== undefined) prod.costCentavos = Math.round(input.costCentavos);
    if (input.reorderLevel !== undefined) prod.reorderLevel = Math.max(0, Math.round(input.reorderLevel));
    prod.updatedAt = new Date().toISOString();

    return { ...prod };
  }

  async adjustStock(input: StockAdjustmentInput): Promise<InventoryMovement> {
    const prod = this.products.find((p) => p.id === input.productId);
    if (!prod) {
      throw new Error(`Hindi nahanap ang produkto.`);
    }

    const newQty = prod.stockQty + input.quantityDelta;
    if (newQty < 0) {
      throw new Error(
        `Bawal maging negative ang stock. Kasalukuyan: ${prod.stockQty}, Bawas: ${Math.abs(input.quantityDelta)}`
      );
    }

    prod.stockQty = newQty;
    prod.updatedAt = new Date().toISOString();

    const movement: InventoryMovement = {
      id: `mov_${Date.now()}`,
      productId: prod.id,
      movementType: input.quantityDelta >= 0 ? 'restock' : 'adjustment',
      quantityDelta: input.quantityDelta,
      referenceType: 'manual',
      reason: input.reason,
      createdAt: new Date().toISOString(),
    };

    this.movements.unshift(movement);
    return movement;
  }

  async getMovements(productId?: string): Promise<InventoryMovement[]> {
    if (productId) {
      return this.movements.filter((m) => m.productId === productId);
    }
    return [...this.movements];
  }

  async getExpenses(): Promise<Expense[]> {
    return [...this.expenses].sort(
      (a, b) => new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime()
    );
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      businessId: this.business.id,
      spentAt: input.spentAt || now,
      category: input.category,
      amountCentavos: Math.round(input.amountCentavos),
      description: input.description,
      createdAt: now,
    };

    this.expenses.unshift(newExpense);
    return newExpense;
  }

  async askAdvisor(
    query: string,
    intentOverride?: AIIntent
  ): Promise<{ evidence: AdvisorEvidence; response: AIResponsePayload }> {
    // Determine approved intent from query keywords or override
    let intent: AIIntent = intentOverride || 'SUMMARIZE_PERFORMANCE';
    const q = query.toLowerCase();

    if (q.includes('top') || q.includes('profit') || q.includes('gross profit') || q.includes('tubo') || q.includes('mabenta')) {
      intent = 'TOP_PRODUCTS_BY_PROFIT';
    } else if (q.includes('stock') || q.includes('ubos') || q.includes('reorder') || q.includes('kulang')) {
      intent = 'LOW_STOCK_REVIEW';
    } else if (q.includes('gastos') || q.includes('expense') || q.includes('kuryente') || q.includes('upa') || q.includes('rent')) {
      intent = 'EXPENSE_BREAKDOWN';
    } else if (q.includes('operating result') || q.includes('mas mababa') || q.includes('bakit') || q.includes('kita')) {
      intent = 'EXPLAIN_SALES_CHANGE';
    } else if (q.includes('tip') || q.includes('payo') || q.includes('paano') || q.includes('dead stock')) {
      intent = 'GENERAL_BUSINESS_GUIDANCE';
    }

    const kpis = await this.getDashboardKPIs();
    const topProds = await this.getTopProductsByProfit(5);
    const lowStockProds = this.products.filter((p) => p.active && p.stockQty <= p.reorderLevel);

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    const dateRange = {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    };

    let evidence: AdvisorEvidence;
    let response: AIResponsePayload;

    switch (intent) {
      case 'TOP_PRODUCTS_BY_PROFIT': {
        evidence = {
          intent,
          query,
          dateRange,
          calculatedAt: new Date().toISOString(),
          dataSource: 'mock_fixtures',
          metrics: {
            totalGrossProfit: formatPHP(kpis.grossProfitCentavos),
            topProductCount: topProds.length,
          },
          tableData: topProds.map((p, idx) => ({
            Rank: `#${idx + 1}`,
            SKU: p.sku,
            Produkto: p.name,
            'Benta (Dami)': p.qtySold,
            'Gross Profit (Tubo)': formatPHP(p.grossProfitCentavos),
            'Margin %': `${p.marginPercent}%`,
          })),
        };

        const p1 = topProds[0];
        const p2 = topProds[1];
        const p3 = topProds[2];

        response = {
          summary: `Base sa naitalang 30-araw na benta, ang numero unong nagbigay ng pinakamalaking gross profit ay ang "${p1?.name}" na kumita ng ${formatPHP(p1?.grossProfitCentavos || 0)} kabuuang tubo mula sa ${p1?.qtySold || 0} na piraso.`,
          observations: [
            `Top 1: ${p1?.name} — ${formatPHP(p1?.grossProfitCentavos || 0)} gross profit (${p1?.marginPercent}% margin).`,
            `Top 2: ${p2?.name} — ${formatPHP(p2?.grossProfitCentavos || 0)} gross profit (${p2?.marginPercent}% margin).`,
            `Top 3: ${p3?.name} — ${formatPHP(p3?.grossProfitCentavos || 0)} gross profit (${p3?.marginPercent}% margin).`,
            `Ang kabuuang tubo ng nangungunang 3 produkto ay bumubuo sa malaking bahagi ng iyong kita.`,
          ],
          recommendations: [
            `Tiyaking laging may buffer stock ang ${p1?.name} at ${p2?.name} upang hindi maubusan at mawalan ng kita.`,
            `Pag-aralan kung maaaring kumuha ng mas malaking bundle sa wholesale supplier para maibaba pa ang puhunan at mapataas ang margin.`,
          ],
          caveats: [
            'Ang gross profit ay hindi pa bawas ang operating expenses tulad ng kuryente at pwesto.',
            'Hindi kasama sa ranking ang mga produktong hindi pa nai-encode sa sistema.',
          ],
          modelInfo: {
            model: 'qwen2.5:3b-instruct (Localhost Emulated)',
            temperature: 0.2,
            latencyMs: 1420,
            isLocalhost: true,
          },
        };
        break;
      }

      case 'LOW_STOCK_REVIEW': {
        evidence = {
          intent,
          query,
          dateRange,
          calculatedAt: new Date().toISOString(),
          dataSource: 'mock_fixtures',
          metrics: {
            lowStockTotalItems: lowStockProds.length,
          },
          tableData: lowStockProds.map((p) => ({
            SKU: p.sku,
            Produkto: p.name,
            'Kasalukuyang Stock': `${p.stockQty} ${p.unit}`,
            'Reorder Level': `${p.reorderLevel} ${p.unit}`,
            'Status': p.stockQty === 0 ? 'UBOS NA (Out of Stock)' : 'PAUBOS NA (Low Stock)',
          })),
        };

        response = {
          summary: `Mayroong ${lowStockProds.length} produkto na umabot o mas mababa sa kanilang itinakdang reorder threshold.`,
          observations: lowStockProds.slice(0, 4).map(
            (p) => `${p.name}: natitira na lamang na ${p.stockQty} ${p.unit} (reorder alert: ${p.reorderLevel})`
          ),
          recommendations: [
            'Isama ang mga aytem na ito sa susunod na palengke o wholesale delivery run.',
            'Unahin ang mga fast-moving essentials tulad ng instant noodles, kape, at mantika.',
          ],
          caveats: [
            'Walang lead time data ang tindahan, kaya ang reorder ay rekomendasyon lamang base sa kasalukuyang bilang.',
          ],
          modelInfo: {
            model: 'qwen2.5:3b-instruct (Localhost Emulated)',
            temperature: 0.2,
            latencyMs: 1100,
            isLocalhost: true,
          },
        };
        break;
      }

      case 'EXPENSE_BREAKDOWN': {
        evidence = {
          intent,
          query,
          dateRange,
          calculatedAt: new Date().toISOString(),
          dataSource: 'mock_fixtures',
          metrics: {
            totalOperatingExpenses: formatPHP(kpis.operatingExpensesCentavos),
            expenseCount: this.expenses.length,
          },
          tableData: this.expenses.map((e) => ({
            Petsa: e.spentAt.split('T')[0],
            Kategorya: e.category,
            Halaga: formatPHP(e.amountCentavos),
            Deskripsyon: e.description,
          })),
        };

        response = {
          summary: `Ang kabuuang naitalang operating expenses sa nakaraang buwan ay ${formatPHP(kpis.operatingExpensesCentavos)}. Ang pinakamalaking bahagi ay napunta sa Upa (Rent) at Kuryente (Utilities).`,
          observations: [
            `Upa sa Pwesto: ${formatPHP(400000)} — fixed monthly cost.`,
            `Kuryente (Meralco): ${formatPHP(385000)} — dulot ng patuloy na pagpapatakbo ng refrigerator at beverage chiller.`,
            `Wages & Helper: ${formatPHP(250000)} para sa repacking at weekend cover.`,
          ],
          recommendations: [
            'Siguraduhing selyado nang maayos ang pinto ng refrigerator upang maiwasan ang sobrang konsumo ng kuryente.',
            'Suriin ang mga regular na sando bags at consumables kung makakabili ng bulk sa Divisoria upang makatipid.',
          ],
          caveats: [
            'Ang report na ito ay nakasalalay lamang sa mga gastos na manu-manong inilista.',
          ],
          modelInfo: {
            model: 'qwen2.5:3b-instruct (Localhost Emulated)',
            temperature: 0.2,
            latencyMs: 1250,
            isLocalhost: true,
          },
        };
        break;
      }

      default: {
        // SUMMARIZE_PERFORMANCE or GENERAL_BUSINESS_GUIDANCE
        evidence = {
          intent,
          query,
          dateRange,
          calculatedAt: new Date().toISOString(),
          dataSource: 'mock_fixtures',
          metrics: {
            KabuuangBenta: formatPHP(kpis.revenueCentavos),
            PuhunanCOGS: formatPHP(kpis.cogsCentavos),
            GrossProfit: formatPHP(kpis.grossProfitCentavos),
            OperatingExpenses: formatPHP(kpis.operatingExpensesCentavos),
            EstimatedOperatingResult: formatPHP(kpis.estimatedOperatingResultCentavos),
            BentaTransactions: kpis.completedSalesCount,
          },
        };

        response = {
          summary: `Sa nakaraang 30 araw, nakapagtala ang tindahan ng kabuuang benta (Revenue) na ${formatPHP(kpis.revenueCentavos)}. Matapos ibawas ang puhunan sa paninda (COGS na ${formatPHP(kpis.cogsCentavos)}), ang iyong Gross Profit ay ${formatPHP(kpis.grossProfitCentavos)}. Ang Estimated Operating Result matapos ang operating expenses ay ${formatPHP(kpis.estimatedOperatingResultCentavos)}.`,
          observations: [
            `Average Order Value: ${formatPHP(kpis.averageOrderValueCentavos)} bawat transaksyon.`,
            `Kabuuang natapos na benta: ${kpis.completedSalesCount} resibo/benta sa counter.`,
            `Operating expenses na naitala: ${formatPHP(kpis.operatingExpensesCentavos)} kabuuan.`,
          ],
          recommendations: [
            'Panatilihing regular ang pag-record ng araw-araw na benta bago magsara ng tindahan sa gabi.',
            'I-record agad ang bawat bawas o gastos sa pamasahe o sando bag para hindi magkulang ang kuwenta.',
          ],
          caveats: [
            'Ang Estimated Operating Result ay hindi pinal na audited financial statement.',
            'Tiyaking naitala ang lahat ng pautang at sariling kuha ng pamilya upang maging tumpak ang resulta.',
          ],
          modelInfo: {
            model: 'qwen2.5:3b-instruct (Localhost Emulated)',
            temperature: 0.2,
            latencyMs: 1300,
            isLocalhost: true,
          },
        };
        break;
      }
    }

    return { evidence, response };
  }

  async getDiagnostics(): Promise<ModelDiagnostics> {
    return {
      ollamaEndpoint: 'http://127.0.0.1:11434',
      modelName: 'qwen2.5:3b-instruct (Ready for Phase 4)',
      isServiceReachable: true,
      isModelLoaded: true,
      isOfflineCapable: true,
      responseLatencyMs: 125,
      ramUsageMb: 248,
      lastChecked: new Date().toISOString(),
    };
  }

  async resetDemoData(): Promise<void> {
    this.business = { ...DEMO_BUSINESS };
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.sales = generateDemoSales(this.products);
    this.expenses = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
    this.movements = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
  }
}
