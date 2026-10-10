import { Business, Product, Sale, SaleItem, Expense, InventoryMovement, Centavos } from '@/shared/types';

export const DEMO_BUSINESS: Business = {
  id: 'biz_01',
  name: "Aling Nena's Sari-Sari & General Store",
  currency: 'PHP',
  ownerName: 'Nenita "Aling Nena" Santos',
  barangay: 'Brgy. San Roque',
  city: 'Pasig City, Metro Manila',
  createdAt: '2026-01-15T08:00:00Z',
};

// 24 realistic Sari-Sari store items with authentic Philippine retail prices & wholesale costs in centavos
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd_01',
    businessId: 'biz_01',
    sku: 'RIC-SIN-001',
    name: 'Sinandomeng Special Rice (1kg pack)',
    unit: 'kilo',
    category: 'Grains & Staple',
    priceCentavos: 5200, // ₱52.00
    costCentavos: 4400,  // ₱44.00 (wholesale sack repacked)
    stockQty: 48,
    reorderLevel: 20,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_02',
    businessId: 'biz_01',
    sku: 'RIC-DIN-002',
    name: 'Dinorado Fragrant Rice (1kg pack)',
    unit: 'kilo',
    category: 'Grains & Staple',
    priceCentavos: 5800, // ₱58.00
    costCentavos: 4900,  // ₱49.00
    stockQty: 18,        // Low stock warning (threshold is 20)
    reorderLevel: 20,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_03',
    businessId: 'biz_01',
    sku: 'CAN-CAL-003',
    name: 'Lucky Me! Pancit Canton Calamansi 60g',
    unit: 'pakete',
    category: 'Instant Noodles',
    priceCentavos: 1600, // ₱16.00
    costCentavos: 1250,  // ₱12.50
    stockQty: 84,
    reorderLevel: 30,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_04',
    businessId: 'biz_01',
    sku: 'CAN-ORI-004',
    name: 'Lucky Me! Pancit Canton Original 60g',
    unit: 'pakete',
    category: 'Instant Noodles',
    priceCentavos: 1600, // ₱16.00
    costCentavos: 1250,  // ₱12.50
    stockQty: 12,        // Low stock warning (threshold 25)
    reorderLevel: 25,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_05',
    businessId: 'biz_01',
    sku: 'CAN-CHL-005',
    name: 'Lucky Me! Pancit Canton Chilimansi 60g',
    unit: 'pakete',
    category: 'Instant Noodles',
    priceCentavos: 1600, // ₱16.00
    costCentavos: 1250,  // ₱12.50
    stockQty: 52,
    reorderLevel: 25,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_06',
    businessId: 'biz_01',
    sku: 'COF-KOP-006',
    name: 'Kopiko Blanca 3-in-1 Coffee 30g Sachet',
    unit: 'sachet',
    category: 'Beverages',
    priceCentavos: 1400, // ₱14.00
    costCentavos: 1050,  // ₱10.50
    stockQty: 110,
    reorderLevel: 40,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_07',
    businessId: 'biz_01',
    sku: 'COF-NES-007',
    name: 'Nescafe Classic 50g Glass Jar',
    unit: 'piraso',
    category: 'Beverages',
    priceCentavos: 5500, // ₱55.00
    costCentavos: 4400,  // ₱44.00
    stockQty: 6,         // CRITICAL low stock (threshold 10)
    reorderLevel: 10,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_08',
    businessId: 'biz_01',
    sku: 'BEV-MIL-008',
    name: 'Milo Chocolate Malt Drink 24g Sachet',
    unit: 'sachet',
    category: 'Beverages',
    priceCentavos: 1300, // ₱13.00
    costCentavos: 980,   // ₱9.80
    stockQty: 95,
    reorderLevel: 30,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_09',
    businessId: 'biz_01',
    sku: 'MLK-BEA-009',
    name: 'Bear Brand Fortified Milk Powder 33g Sachet',
    unit: 'sachet',
    category: 'Beverages',
    priceCentavos: 1500, // ₱15.00
    costCentavos: 1180,  // ₱11.80
    stockQty: 80,
    reorderLevel: 30,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_10',
    businessId: 'biz_01',
    sku: 'CND-ARG-010',
    name: 'Argentina Corned Beef 175g Easy Open Can',
    unit: 'lata',
    category: 'Canned Goods',
    priceCentavos: 4200, // ₱42.00
    costCentavos: 3350,  // ₱33.50
    stockQty: 24,
    reorderLevel: 15,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_11',
    businessId: 'biz_01',
    sku: 'CND-SAR-011',
    name: '555 Sardines in Tomato Sauce 155g',
    unit: 'lata',
    category: 'Canned Goods',
    priceCentavos: 2500, // ₱25.00
    costCentavos: 1950,  // ₱19.50
    stockQty: 32,
    reorderLevel: 15,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_12',
    businessId: 'biz_01',
    sku: 'CND-CDO-012',
    name: 'CDO Karne Norte Guisado 150g',
    unit: 'lata',
    category: 'Canned Goods',
    priceCentavos: 3400, // ₱34.00
    costCentavos: 2700,  // ₱27.00
    stockQty: 19,
    reorderLevel: 12,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_13',
    businessId: 'biz_01',
    sku: 'BEV-COK-013',
    name: 'Coca-Cola 1.5L PET Bottle',
    unit: 'bote',
    category: 'Beverages',
    priceCentavos: 7500, // ₱75.00
    costCentavos: 6100,  // ₱61.00
    stockQty: 14,
    reorderLevel: 10,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_14',
    businessId: 'biz_01',
    sku: 'BEV-ROY-014',
    name: 'Royal Tru-Orange 1.5L PET Bottle',
    unit: 'bote',
    category: 'Beverages',
    priceCentavos: 7500, // ₱75.00
    costCentavos: 6100,  // ₱61.00
    stockQty: 5,         // Low stock
    reorderLevel: 8,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_15',
    businessId: 'biz_01',
    sku: 'ALC-SAN-015',
    name: 'San Miguel Pale Pilsen 330ml Glass Bottle',
    unit: 'bote',
    category: 'Liquor & Beer',
    priceCentavos: 5000, // ₱50.00
    costCentavos: 4000,  // ₱40.00
    stockQty: 42,
    reorderLevel: 24,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_16',
    businessId: 'biz_01',
    sku: 'SNK-PIA-016',
    name: 'Jack n Jill Piattos Cheese 85g',
    unit: 'balot',
    category: 'Snacks',
    priceCentavos: 3800, // ₱38.00
    costCentavos: 3000,  // ₱30.00
    stockQty: 28,
    reorderLevel: 12,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_17',
    businessId: 'biz_01',
    sku: 'SNK-MNG-017',
    name: 'Mang Juan Shing-a-ling Sukang Paombong 90g',
    unit: 'balot',
    category: 'Snacks',
    priceCentavos: 2400, // ₱24.00
    costCentavos: 1850,  // ₱18.50
    stockQty: 30,
    reorderLevel: 12,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_18',
    businessId: 'biz_01',
    sku: 'SNK-SKY-018',
    name: 'SkyFlakes Crackers Tub 250g',
    unit: 'balot',
    category: 'Snacks',
    priceCentavos: 6200, // ₱62.00
    costCentavos: 5000,  // ₱50.00
    stockQty: 15,
    reorderLevel: 8,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_19',
    businessId: 'biz_01',
    sku: 'BAK-GAR-019',
    name: 'Gardenia Classic White Bread 600g Loaf',
    unit: 'balot',
    category: 'Bakery',
    priceCentavos: 8600, // ₱86.00
    costCentavos: 7300,  // ₱73.00
    stockQty: 8,
    reorderLevel: 6,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_20',
    businessId: 'biz_01',
    sku: 'CND-DAT-020',
    name: 'Datu Puti Toyo & Suka Value Bundle (2x 385ml)',
    unit: 'balot',
    category: 'Condiments',
    priceCentavos: 4800, // ₱48.00
    costCentavos: 3850,  // ₱38.50
    stockQty: 22,
    reorderLevel: 10,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_21',
    businessId: 'biz_01',
    sku: 'CND-MAG-021',
    name: 'Magic Sarap All-in-One Seasoning 8g Sachet',
    unit: 'sachet',
    category: 'Condiments',
    priceCentavos: 600,  // ₱6.00
    costCentavos: 420,   // ₱4.20
    stockQty: 180,
    reorderLevel: 50,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_22',
    businessId: 'biz_01',
    sku: 'NON-SAF-022',
    name: 'Safeguard Pure White Soap Bar 130g',
    unit: 'piraso',
    category: 'Personal Care',
    priceCentavos: 4800, // ₱48.00
    costCentavos: 3900,  // ₱39.00
    stockQty: 26,
    reorderLevel: 10,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_23',
    businessId: 'biz_01',
    sku: 'NON-SRF-023',
    name: 'Surf Powder Detergent Cherry Blossom 55g',
    unit: 'sachet',
    category: 'Household & Laundry',
    priceCentavos: 1200, // ₱12.00
    costCentavos: 900,   // ₱9.00
    stockQty: 140,
    reorderLevel: 40,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prd_24',
    businessId: 'biz_01',
    sku: 'NON-PAL-024',
    name: 'Palmolive Naturals Shampoo Sachet 15ml',
    unit: 'sachet',
    category: 'Personal Care',
    priceCentavos: 800,  // ₱8.00
    costCentavos: 580,   // ₱5.80
    stockQty: 160,
    reorderLevel: 50,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
];

// Helper to generate 30 days of consistent fictional sales
export function generateDemoSales(products: Product[]): Sale[] {
  const sales: Sale[] = [];
  const pMap = new Map(products.map((p) => [p.id, p]));
  
  // Baseline anchors: generate around 120 sales across 30 days
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  // Common basket combinations seen in Philippine sari-sari stores
  const baskets = [
    // Morning breakfast basket
    [
      { id: 'prd_19', qty: 1 }, // Gardenia bread
      { id: 'prd_06', qty: 2 }, // Kopiko Blanca
    ],
    // Lunch cooking basket
    [
      { id: 'prd_01', qty: 2 }, // 2kg Rice
      { id: 'prd_10', qty: 1 }, // Argentina Corned beef
      { id: 'prd_21', qty: 2 }, // Magic Sarap
    ],
    // Meryenda / afternoon snack basket
    [
      { id: 'prd_03', qty: 2 }, // Pancit Canton Calamansi
      { id: 'prd_13', qty: 1 }, // Coke 1.5L
    ],
    // Evening quick grocery
    [
      { id: 'prd_11', qty: 2 }, // 555 Sardines
      { id: 'prd_01', qty: 1 }, // 1kg Rice
      { id: 'prd_23', qty: 3 }, // Surf powder
    ],
    // Friday night barkada
    [
      { id: 'prd_15', qty: 4 }, // San Miguel Beer
      { id: 'prd_17', qty: 2 }, // Mang Juan
    ],
    // Student snacks
    [
      { id: 'prd_16', qty: 1 }, // Piattos
      { id: 'prd_08', qty: 1 }, // Milo
    ],
    // Quick personal care
    [
      { id: 'prd_22', qty: 1 }, // Safeguard
      { id: 'prd_24', qty: 3 }, // Palmolive shampoo
    ],
  ];

  let saleCounter = 1001;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const saleDate = new Date(baseDate);
    saleDate.setDate(saleDate.getDate() - dayOffset);
    
    // 3 to 6 sales per day
    const salesInDay = 3 + ((dayOffset * 3) % 4);
    
    for (let s = 0; s < salesInDay; s++) {
      const hour = 7 + Math.floor((s * 13) / salesInDay);
      const minute = (s * 17) % 60;
      saleDate.setHours(hour, minute, 0, 0);

      const basketPattern = baskets[(saleCounter + dayOffset) % baskets.length];
      const items: SaleItem[] = [];
      let totalCentavos: Centavos = 0;
      let totalCostCentavos: Centavos = 0;

      for (const bItem of basketPattern) {
        const prod = pMap.get(bItem.id);
        if (prod) {
          const itemTotal = prod.priceCentavos * bItem.qty;
          const itemCost = prod.costCentavos * bItem.qty;
          totalCentavos += itemTotal;
          totalCostCentavos += itemCost;

          items.push({
            id: `item_${saleCounter}_${bItem.id}`,
            saleId: `sale_${saleCounter}`,
            productId: prod.id,
            productName: prod.name,
            productSku: prod.sku,
            unit: prod.unit,
            qty: bItem.qty,
            unitPriceCentavos: prod.priceCentavos,
            unitCostCentavos: prod.costCentavos,
          });
        }
      }

      // Mark 1 or 2 old sales as void to verify cancellation status
      const isVoid = dayOffset === 14 && s === 0;

      sales.push({
        id: `sale_${saleCounter}`,
        businessId: 'biz_01',
        soldAt: saleDate.toISOString(),
        status: isVoid ? 'void' : 'completed',
        notes: isVoid ? '[DEMO] Customer changed mind on item count' : (s === 1 ? 'Cash paid with exact amount' : undefined),
        items,
        totalCentavos,
        totalCostCentavos,
        grossProfitCentavos: totalCentavos - totalCostCentavos,
        createdAt: saleDate.toISOString(),
        voidReason: isVoid ? 'Customer cancellation requested at counter' : undefined,
      });

      saleCounter++;
    }
  }

  // Sort descending by date
  return sales.sort((a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime());
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    category: 'Utilities & Power',
    amountCentavos: 385000, // ₱3,850.00
    description: '[DEMO] Meralco electric bill (sari-sari store refrigerator & chiller)',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'exp_02',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    category: 'Packaging',
    amountCentavos: 45000, // ₱450.00
    description: '[DEMO] 5 bundles sando bags (small & medium) and ice wrappers from Pasig Mega Market',
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
  {
    id: 'exp_03',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    category: 'Transportation & Fuel',
    amountCentavos: 60000, // ₱600.00
    description: '[DEMO] Tricycle & jeepney fare transporting wholesale stock from Divisoria & Mega Market',
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: 'exp_04',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    category: 'Rent',
    amountCentavos: 400000, // ₱4,000.00
    description: '[DEMO] Monthly streetfront stall space rental share',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'exp_05',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    category: 'Labor & Wages',
    amountCentavos: 250000, // ₱2,500.00
    description: '[DEMO] Part-time store helper weekly allowance (repacking & weekend cover)',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'exp_06',
    businessId: 'biz_01',
    spentAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    category: 'Repairs & Maintenance',
    amountCentavos: 85000, // ₱850.00
    description: '[DEMO] Beverage chiller door gasket replacement & cleaning',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov_01',
    productId: 'prd_01',
    movementType: 'restock',
    quantityDelta: 50,
    referenceType: 'manual',
    reason: '[DEMO] Restocked 2x 25kg sacks from Pasig Mega Market grain wholesaler',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'mov_02',
    productId: 'prd_03',
    movementType: 'restock',
    quantityDelta: 72,
    referenceType: 'manual',
    reason: '[DEMO] Direct delivery from Monde Nissin local distributor',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'mov_03',
    productId: 'prd_07',
    movementType: 'adjustment',
    quantityDelta: -2,
    referenceType: 'manual',
    reason: '[DEMO] Damaged / cracked jar during shelf replenishment',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];
