import { ProductUnit, Centavos } from '@/shared/types';

export interface CatalogProductItem {
  barcode: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  unit: ProductUnit;
  suggestedPriceCentavos: Centavos;
  suggestedCostCentavos: Centavos;
  defaultStockQty: number;
  reorderLevel: number;
  imageUrl: string;
  source: 'ph_master_catalog' | 'open_food_facts';
}

/**
 * Pre-bundled authentic Philippine FMCG Master Catalog.
 * Provides 100% offline auto-supplementation for sari-sari stores even with zero internet.
 */
export const PH_MASTER_CATALOG: CatalogProductItem[] = [
  {
    barcode: '4807770273759',
    sku: 'CAN-CAL-003',
    name: 'Lucky Me! Pancit Canton Calamansi 60g',
    brand: 'Monde Nissin',
    category: 'Instant Noodles',
    unit: 'pakete',
    suggestedPriceCentavos: 1600,
    suggestedCostCentavos: 1250,
    defaultStockQty: 48,
    reorderLevel: 24,
    imageUrl: '/products/CAN-CAL-003.webp',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4807770273704',
    sku: 'CAN-ORI-004',
    name: 'Lucky Me! Pancit Canton Original 60g',
    brand: 'Monde Nissin',
    category: 'Instant Noodles',
    unit: 'pakete',
    suggestedPriceCentavos: 1600,
    suggestedCostCentavos: 1250,
    defaultStockQty: 48,
    reorderLevel: 24,
    imageUrl: '/products/CAN-ORI-004.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4807770273711',
    sku: 'CAN-CHL-005',
    name: 'Lucky Me! Pancit Canton Chilimansi 60g',
    brand: 'Monde Nissin',
    category: 'Instant Noodles',
    unit: 'pakete',
    suggestedPriceCentavos: 1600,
    suggestedCostCentavos: 1250,
    defaultStockQty: 48,
    reorderLevel: 24,
    imageUrl: '/products/CAN-CHL-005.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '8998666001726',
    sku: 'COF-KOP-006',
    name: 'Kopiko Blanca 3-in-1 Coffee 30g Sachet',
    brand: 'Kopiko / Mayora',
    category: 'Beverages',
    unit: 'sachet',
    suggestedPriceCentavos: 1400,
    suggestedCostCentavos: 1050,
    defaultStockQty: 60,
    reorderLevel: 30,
    imageUrl: '/products/COF-KOP-006.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '6111018903161',
    sku: 'COF-NES-007',
    name: 'Nescafe Classic 50g Glass Jar',
    brand: 'Nestle',
    category: 'Beverages',
    unit: 'piraso',
    suggestedPriceCentavos: 5500,
    suggestedCostCentavos: 4400,
    defaultStockQty: 12,
    reorderLevel: 6,
    imageUrl: '/products/COF-NES-007.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '6151100034823',
    sku: 'BEV-MIL-008',
    name: 'Milo Active-Go Chocolate Malt Drink 24g Sachet',
    brand: 'Nestle',
    category: 'Beverages',
    unit: 'sachet',
    suggestedPriceCentavos: 1300,
    suggestedCostCentavos: 980,
    defaultStockQty: 72,
    reorderLevel: 24,
    imageUrl: '/products/BEV-MIL-008.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800361410892',
    sku: 'MLK-BEA-009',
    name: 'Bear Brand Fortified Milk Powder 33g Sachet',
    brand: 'Nestle',
    category: 'Beverages',
    unit: 'sachet',
    suggestedPriceCentavos: 1500,
    suggestedCostCentavos: 1180,
    defaultStockQty: 60,
    reorderLevel: 20,
    imageUrl: '/products/MLK-BEA-009.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '0748485800011',
    sku: 'CND-ARG-010',
    name: 'Argentina Corned Beef 175g Easy Open Can',
    brand: 'Century Pacific',
    category: 'Canned Goods',
    unit: 'lata',
    suggestedPriceCentavos: 4200,
    suggestedCostCentavos: 3350,
    defaultStockQty: 24,
    reorderLevel: 12,
    imageUrl: '/products/CND-ARG-010.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800016052028',
    sku: 'CND-SAR-011',
    name: '555 Sardines in Tomato Sauce 155g',
    brand: 'Century Pacific',
    category: 'Canned Goods',
    unit: 'lata',
    suggestedPriceCentavos: 2500,
    suggestedCostCentavos: 1950,
    defaultStockQty: 36,
    reorderLevel: 15,
    imageUrl: '/products/CND-SAR-011.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800168340110',
    sku: 'CND-CDO-012',
    name: 'CDO Karne Norte Guisado 150g',
    brand: 'CDO Foodsphere',
    category: 'Canned Goods',
    unit: 'lata',
    suggestedPriceCentavos: 3400,
    suggestedCostCentavos: 2700,
    defaultStockQty: 24,
    reorderLevel: 10,
    imageUrl: '/products/CND-CDO-012.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '5449000000484',
    sku: 'BEV-COK-013',
    name: 'Coca-Cola 1.5L PET Bottle',
    brand: 'Coca-Cola',
    category: 'Beverages',
    unit: 'bote',
    suggestedPriceCentavos: 7500,
    suggestedCostCentavos: 6100,
    defaultStockQty: 18,
    reorderLevel: 8,
    imageUrl: '/products/BEV-COK-013.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800049015014',
    sku: 'BEV-ROY-014',
    name: 'Royal Tru-Orange 1.5L PET Bottle',
    brand: 'Coca-Cola',
    category: 'Beverages',
    unit: 'bote',
    suggestedPriceCentavos: 7500,
    suggestedCostCentavos: 6100,
    defaultStockQty: 12,
    reorderLevel: 6,
    imageUrl: '/products/BEV-ROY-014.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800011110013',
    sku: 'ALC-SAN-015',
    name: 'San Miguel Pale Pilsen 330ml Glass Bottle',
    brand: 'San Miguel Brewery',
    category: 'Liquor & Beer',
    unit: 'bote',
    suggestedPriceCentavos: 5000,
    suggestedCostCentavos: 4000,
    defaultStockQty: 48,
    reorderLevel: 24,
    imageUrl: '/products/ALC-SAN-015.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800016641215',
    sku: 'SNK-PIA-016',
    name: 'Jack n Jill Piattos Cheese 85g',
    brand: 'Universal Robina (URC)',
    category: 'Snacks',
    unit: 'balot',
    suggestedPriceCentavos: 3800,
    suggestedCostCentavos: 3000,
    defaultStockQty: 24,
    reorderLevel: 12,
    imageUrl: '/products/SNK-PIA-016.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800016629916',
    sku: 'SNK-MNG-017',
    name: 'Mang Juan Shing-a-ling Sukang Paombong 90g',
    brand: 'Universal Robina (URC)',
    category: 'Snacks',
    unit: 'balot',
    suggestedPriceCentavos: 2400,
    suggestedCostCentavos: 1850,
    defaultStockQty: 24,
    reorderLevel: 10,
    imageUrl: '/products/SNK-MNG-017.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '0750515018402',
    sku: 'SNK-SKY-018',
    name: 'SkyFlakes Crackers Tub 250g',
    brand: 'M.Y. San',
    category: 'Snacks',
    unit: 'balot',
    suggestedPriceCentavos: 6200,
    suggestedCostCentavos: 5000,
    defaultStockQty: 16,
    reorderLevel: 8,
    imageUrl: '/products/SNK-SKY-018.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800110091114',
    sku: 'BAK-GAR-019',
    name: 'Gardenia Classic White Bread 600g Loaf',
    brand: 'Gardenia',
    category: 'Bakery',
    unit: 'balot',
    suggestedPriceCentavos: 8600,
    suggestedCostCentavos: 7300,
    defaultStockQty: 10,
    reorderLevel: 5,
    imageUrl: '/products/BAK-GAR-019.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4801668602034',
    sku: 'CND-DAT-020',
    name: 'Datu Puti Toyo & Suka Value Bundle (2x 385ml)',
    brand: 'NutriAsia',
    category: 'Condiments',
    unit: 'balot',
    suggestedPriceCentavos: 4800,
    suggestedCostCentavos: 3850,
    defaultStockQty: 20,
    reorderLevel: 10,
    imageUrl: '/products/CND-DAT-020.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800361250108',
    sku: 'CND-MAG-021',
    name: 'Magic Sarap All-in-One Seasoning 8g Sachet',
    brand: 'Maggi / Nestle',
    category: 'Condiments',
    unit: 'sachet',
    suggestedPriceCentavos: 600,
    suggestedCostCentavos: 420,
    defaultStockQty: 120,
    reorderLevel: 40,
    imageUrl: '/products/CND-MAG-021.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4902430331012',
    sku: 'NON-SAF-022',
    name: 'Safeguard Pure White Soap Bar 130g',
    brand: 'Procter & Gamble',
    category: 'Personal Care',
    unit: 'piraso',
    suggestedPriceCentavos: 4800,
    suggestedCostCentavos: 3900,
    defaultStockQty: 24,
    reorderLevel: 10,
    imageUrl: '/products/NON-SAF-022.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800888190970',
    sku: 'NON-SRF-023',
    name: 'Surf Powder Detergent Cherry Blossom 55g',
    brand: 'Unilever',
    category: 'Household & Laundry',
    unit: 'sachet',
    suggestedPriceCentavos: 1200,
    suggestedCostCentavos: 900,
    defaultStockQty: 80,
    reorderLevel: 30,
    imageUrl: '/products/NON-SRF-023.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: '4800115201204',
    sku: 'NON-PAL-024',
    name: 'Palmolive Naturals Shampoo Intensive Moisture 15ml Sachet',
    brand: 'Colgate-Palmolive',
    category: 'Personal Care',
    unit: 'sachet',
    suggestedPriceCentavos: 800,
    suggestedCostCentavos: 600,
    defaultStockQty: 96,
    reorderLevel: 36,
    imageUrl: '/products/NON-PAL-024.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: 'PH-RICE-SIN-01',
    sku: 'RIC-SIN-001',
    name: 'Sinandomeng Special Rice (1kg pack)',
    brand: 'Local Milling',
    category: 'Grains & Staple',
    unit: 'kilo',
    suggestedPriceCentavos: 5200,
    suggestedCostCentavos: 4400,
    defaultStockQty: 50,
    reorderLevel: 20,
    imageUrl: '/products/RIC-SIN-001.jpg',
    source: 'ph_master_catalog',
  },
  {
    barcode: 'PH-RICE-DIN-02',
    sku: 'RIC-DIN-002',
    name: 'Dinorado Fragrant Rice (1kg pack)',
    brand: 'Local Milling',
    category: 'Grains & Staple',
    unit: 'kilo',
    suggestedPriceCentavos: 5800,
    suggestedCostCentavos: 4900,
    defaultStockQty: 30,
    reorderLevel: 15,
    imageUrl: '/products/RIC-DIN-002.jpg',
    source: 'ph_master_catalog',
  },
];

/**
 * Searches the local Philippine FMCG Catalog first (instant, 100% offline).
 * If online and query looks like a barcode or unknown term, optionally falls back
 * to Open Food Facts Public API (https://world.openfoodfacts.org).
 */
export async function searchProductCatalog(
  query: string
): Promise<CatalogProductItem[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  // 1. Search local master catalog (offline-first)
  const localMatches = PH_MASTER_CATALOG.filter((p) => {
    return (
      p.barcode.toLowerCase().includes(cleanQ) ||
      p.sku.toLowerCase().includes(cleanQ) ||
      p.name.toLowerCase().includes(cleanQ) ||
      p.brand.toLowerCase().includes(cleanQ) ||
      p.category.toLowerCase().includes(cleanQ)
    );
  });

  if (localMatches.length > 0) {
    return localMatches.slice(0, 8);
  }

  // 2. If online and no local match, query Open Food Facts Public API
  if (typeof window !== 'undefined' && navigator.onLine) {
    try {
      const isBarcode = /^\d{8,14}$/.test(cleanQ);
      if (isBarcode) {
        // Query by exact barcode
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${cleanQ}?fields=product_name,brands,categories,quantity,image_url,image_front_url`,
          { headers: { 'User-Agent': 'BantayNegosyo/1.0' } }
        );
        if (res.ok) {
          const json = await res.json();
          if (json.status === 1 && json.product) {
            const p = json.product;
            const name = p.product_name || 'Imported FMCG Product';
            const brand = p.brands || 'Commercial Brand';
            const imageUrl = p.image_front_url || p.image_url || '';
            const item: CatalogProductItem = {
              barcode: cleanQ,
              sku: `BAR-${cleanQ.slice(-6)}`,
              name: brand ? `${brand} ${name}` : name,
              brand,
              category: mapCategory(p.categories || ''),
              unit: mapUnit(p.quantity || name),
              suggestedPriceCentavos: 2500,
              suggestedCostCentavos: 2000,
              defaultStockQty: 24,
              reorderLevel: 10,
              imageUrl,
              source: 'open_food_facts',
            };
            return [item];
          }
        }
      } else {
        // Search by name
        const res = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
            cleanQ
          )}&search_simple=1&action=process&json=1&page_size=5`,
          { headers: { 'User-Agent': 'BantayNegosyo/1.0' } }
        );
        if (res.ok) {
          const json = await res.json();
          if (json.products && Array.isArray(json.products)) {
            const items: CatalogProductItem[] = json.products
              .filter((p: any) => p.product_name)
              .map((p: any, idx: number) => ({
                barcode: p.code || `OFF-${Date.now()}-${idx}`,
                sku: `IMP-${(p.code || '0000').slice(-6)}`,
                name: p.product_name,
                brand: p.brands || 'General',
                category: mapCategory(p.categories || ''),
                unit: mapUnit(p.quantity || p.product_name),
                suggestedPriceCentavos: 3000,
                suggestedCostCentavos: 2400,
                defaultStockQty: 20,
                reorderLevel: 8,
                imageUrl: p.image_front_url || p.image_url || '',
                source: 'open_food_facts',
              }));
            return items.slice(0, 6);
          }
        }
      }
    } catch {
      // Graceful offline fallback
    }
  }

  return [];
}

function mapCategory(categoriesStr: string): string {
  const c = categoriesStr.toLowerCase();
  if (c.includes('beverage') || c.includes('drink') || c.includes('coffee') || c.includes('tea')) return 'Beverages';
  if (c.includes('noodle') || c.includes('pasta') || c.includes('ramen')) return 'Instant Noodles';
  if (c.includes('canned') || c.includes('fish') || c.includes('meat') || c.includes('sardine')) return 'Canned Goods';
  if (c.includes('snack') || c.includes('biscuit') || c.includes('chip') || c.includes('cracker')) return 'Snacks';
  if (c.includes('bread') || c.includes('bakery')) return 'Bakery';
  if (c.includes('rice') || c.includes('grain')) return 'Grains & Staple';
  if (c.includes('sauce') || c.includes('condiment') || c.includes('spice')) return 'Condiments';
  if (c.includes('soap') || c.includes('shampoo') || c.includes('hygiene')) return 'Personal Care';
  if (c.includes('detergent') || c.includes('cleaner')) return 'Household & Laundry';
  return 'Groceries';
}

function mapUnit(qtyStr: string): ProductUnit {
  const q = qtyStr.toLowerCase();
  if (q.includes('sachet')) return 'sachet';
  if (q.includes('can') || q.includes('lata')) return 'lata';
  if (q.includes('bottle') || q.includes('bote')) return 'bote';
  if (q.includes('kg') || q.includes('kilo')) return 'kilo';
  if (q.includes('pack') || q.includes('pakete')) return 'pakete';
  if (q.includes('bag') || q.includes('balot')) return 'balot';
  return 'piraso';
}
