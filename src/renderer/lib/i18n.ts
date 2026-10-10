export type Language = 'en' | 'tl';

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    offlineBadge: string;
    offlineDesc: string;
    demoBadge: string;
    save: string;
    cancel: string;
    confirm: string;
    close: string;
    delete: string;
    search: string;
    filter: string;
    all: string;
    loading: string;
    retry: string;
    back: string;
    actions: string;
    status: string;
    date: string;
    amount: string;
    notes: string;
    quantity: string;
    price: string;
    cost: string;
    total: string;
    profit: string;
    margin: string;
    unit: string;
    sku: string;
    product: string;
    category: string;
    stock: string;
    newSale: string;
    askAi: string;
    posRegister: string;
    ledger: string;
  };
  nav: {
    dashboard: string;
    dashboardSub: string;
    sales: string;
    salesSub: string;
    inventory: string;
    inventorySub: string;
    expenses: string;
    expensesSub: string;
    advisor: string;
    advisorSub: string;
    settings: string;
    settingsSub: string;
    lowStockBadge: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    welcome: string;
    welcomeSub: string;
    analyzeAi: string;
    recordSale: string;
    financialKpis: string;
    last30Days: string;
    revenue: string;
    revenueSub: string;
    cogs: string;
    cogsSub: string;
    grossProfit: string;
    grossProfitSub: string;
    expenses: string;
    expensesSub: string;
    operatingResult: string;
    operatingResultSub: string;
    omissionNotice: string;
    completedSales: string;
    avgOrderValue: string;
    lowStockAlerts: string;
    salesTrend: string;
    salesTrendSub: string;
    topProducts: string;
    topProductsSub: string;
    lowStockPanel: string;
    lowStockPanelSub: string;
    restock: string;
    manageAll: string;
    askAiTitle: string;
    askAiSub: string;
    pickQuestion: string;
    viewAllSales: string;
    goToInventory: string;
    allStockSufficient: string;
  };
  pos: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: string;
    cartTitle: string;
    emptyCart: string;
    emptyCartSub: string;
    itemCount: string;
    itemsTotal: string;
    totalCost: string;
    grossProfit: string;
    cashTendered: string;
    changeDue: string;
    exactAmount: string;
    completeSale: string;
    completing: string;
    clearCart: string;
    stockRemaining: string;
    outOfStock: string;
    customerNotes: string;
    notesPlaceholder: string;
    quickCash: string;
    saleSuccessTitle: string;
    saleSuccessMsg: string;
    viewReceipt: string;
    newTransaction: string;
  };
  sales: {
    title: string;
    subtitle: string;
    receiptId: string;
    dateTime: string;
    itemsCount: string;
    statusCompleted: string;
    statusVoid: string;
    viewDetails: string;
    voidSale: string;
    voidConfirmTitle: string;
    voidConfirmSub: string;
    voidReason: string;
    confirmVoidBtn: string;
    noSalesFound: string;
    showingTransactions: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    totalProducts: string;
    inventoryAtCost: string;
    inventoryAtCostSub: string;
    inventoryAtRetail: string;
    inventoryAtRetailSub: string;
    potentialProfit: string;
    reorderAlert: string;
    filterLowStock: string;
    productsTab: string;
    movementsTab: string;
    addProduct: string;
    adjustStock: string;
    currentStock: string;
    reorderLevel: string;
    statusInStock: string;
    statusLowStock: string;
    statusOutOfStock: string;
    movementType: string;
    quantityDelta: string;
    reason: string;
    noProductsFound: string;
    noMovementsFound: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    totalExpenses: string;
    totalExpensesSub: string;
    dailyAverage: string;
    dailyAverageSub: string;
    impactOnResult: string;
    impactOnResultSub: string;
    categoryBreakdown: string;
    categoryBreakdownSub: string;
    recordExpense: string;
    description: string;
    noExpensesFound: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    offlineHeader: string;
    offlineHeaderSub: string;
    engineTarget: string;
    inputPlaceholder: string;
    askButton: string;
    analyzing: string;
    approvedIntents: string;
    safetyToggle: string;
    safetyTitle: string;
    safetyDesc: string;
    safetyExampleTitle: string;
    safetyExample: string;
    evidenceTitle: string;
    evidenceRange: string;
    userQuery: string;
    intentLabel: string;
    summaryTitle: string;
    observationsTitle: string;
    recommendationsTitle: string;
    caveatsTitle: string;
    emptyStateTitle: string;
    emptyStateSub: string;
  };
  settings: {
    title: string;
    subtitle: string;
    storeProfile: string;
    storeProfileSub: string;
    storeName: string;
    ownerName: string;
    currency: string;
    branch: string;
    updateProfile: string;
    profileSaved: string;
    diagnostics: string;
    diagnosticsSub: string;
    dataSafeguards: string;
    dataSafeguardsSub: string;
    csvImporter: string;
    csvImporterDesc: string;
    tryCsv: string;
    resetDemo: string;
    resetDemoDesc: string;
    resetDemoBtn: string;
    resetConfirmTitle: string;
    resetConfirmSub: string;
    resetConfirmBtn: string;
    architectureTitle: string;
    architectureSub: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      appName: 'Bantay Negosyo',
      tagline: 'Smart Business, Even Without Internet',
      offlineBadge: '100% Offline / Local',
      offlineDesc: 'Zero cloud telemetry. Pure SQLite & local AI on your PC.',
      demoBadge: 'DEMO • Phase 1',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      delete: 'Delete',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      loading: 'Loading...',
      retry: 'Retry',
      back: 'Back',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      amount: 'Amount',
      notes: 'Notes',
      quantity: 'Qty',
      price: 'Price',
      cost: 'Cost',
      total: 'Total',
      profit: 'Gross Profit',
      margin: 'Margin',
      unit: 'Unit',
      sku: 'SKU',
      product: 'Product',
      category: 'Category',
      stock: 'Stock',
      newSale: '+ New Sale',
      askAi: 'Ask Bantay AI',
      posRegister: 'POS Register',
      ledger: 'Sales Ledger',
    },
    nav: {
      dashboard: 'Dashboard',
      dashboardSub: 'Overview & Analytics',
      sales: 'Sales & POS',
      salesSub: 'Counter Register & History',
      inventory: 'Inventory',
      inventorySub: 'Stocks & Pricing',
      expenses: 'Expenses',
      expensesSub: 'Operating Costs',
      advisor: 'AI Advisor',
      advisorSub: 'Local Business Intelligence',
      settings: 'Settings',
      settingsSub: 'Diagnostics & Data',
      lowStockBadge: 'low stock',
    },
    dashboard: {
      title: 'Business Overview Dashboard',
      subtitle: 'Key financial metrics, sales trends, and inventory alerts',
      welcome: 'Welcome, Store Manager!',
      welcomeSub: 'All business records are safely stored on your local computer. No internet connection is ever needed.',
      analyzeAi: 'Analyze with AI',
      recordSale: '+ Open POS',
      financialKpis: 'Core Financial Metrics (Financial KPIs)',
      last30Days: 'Last 30 Days Activity',
      revenue: 'Gross Revenue',
      revenueSub: 'Total Counter Sales',
      cogs: 'Cost of Goods Sold',
      cogsSub: 'Wholesale Cost (COGS)',
      grossProfit: 'Gross Profit',
      grossProfitSub: 'Revenue - Wholesale Cost',
      expenses: 'Operating Expenses',
      expensesSub: 'Power, Rent, Transport, Bags',
      operatingResult: 'Estimated Operating Result',
      operatingResultSub: 'Gross Profit - Operating Expenses',
      omissionNotice: 'Note: Estimated Operating Result reflects recorded expenses only. Unrecorded taxes (BIR), stall debts, or owner wages are excluded.',
      completedSales: 'Completed Sales',
      avgOrderValue: 'Avg Order Value',
      lowStockAlerts: 'Low Stock Alerts',
      salesTrend: '14-Day Sales & Profit Trend',
      salesTrendSub: 'Daily counter revenue and gross profit (PHP)',
      topProducts: 'Top Products by Gross Profit',
      topProductsSub: 'Ranked strictly by profit contribution, not volume',
      lowStockPanel: 'Low-Stock Products',
      lowStockPanelSub: 'At or below configured reorder threshold',
      restock: 'Restock',
      manageAll: 'Manage Inventory',
      askAiTitle: 'Ask Bantay Negosyo AI',
      askAiSub: 'Local AI assistant providing advice backed by verified sales data',
      pickQuestion: 'Click any suggested query to calculate evidence and receive grounded advice:',
      viewAllSales: 'View All Sales',
      goToInventory: 'Go to Inventory',
      allStockSufficient: 'All products currently have sufficient stock levels.',
    },
    pos: {
      title: 'Point of Sale (POS) Register',
      subtitle: 'Fast counter checkout with real-time stock deduction and change calculation',
      searchPlaceholder: 'Search product name or SKU...',
      categories: 'Categories',
      cartTitle: 'Current Ticket / Order',
      emptyCart: 'Cart is empty',
      emptyCartSub: 'Click products on the left or search to add items to this sale ticket.',
      itemCount: 'Items',
      itemsTotal: 'Subtotal',
      totalCost: 'Wholesale COGS',
      grossProfit: 'Estimated Profit',
      cashTendered: 'Cash Tendered',
      changeDue: 'Change Due (Sukli)',
      exactAmount: 'Exact Cash',
      completeSale: 'Complete Sale',
      completing: 'Recording Sale...',
      clearCart: 'Clear Ticket',
      stockRemaining: 'in stock',
      outOfStock: 'Out of Stock',
      customerNotes: 'Customer / Counter Notes (Optional)',
      notesPlaceholder: 'e.g. Regular customer, discount applied, split bill',
      quickCash: 'Quick Cash',
      saleSuccessTitle: 'Sale Completed Successfully!',
      saleSuccessMsg: 'Transaction recorded, inventory deducted, and dashboard KPIs updated.',
      viewReceipt: 'View Receipt',
      newTransaction: 'Start Next Transaction',
    },
    sales: {
      title: 'Sales & Transactions Ledger',
      subtitle: 'Complete counter transaction audit log with line-item cost snapshots',
      receiptId: 'Receipt ID',
      dateTime: 'Date & Time',
      itemsCount: 'Items Sold',
      statusCompleted: 'COMPLETED',
      statusVoid: 'VOIDED',
      viewDetails: 'View Details',
      voidSale: 'Void Sale',
      voidConfirmTitle: 'Confirm Void Sale',
      voidConfirmSub: 'Voiding this transaction will automatically restore line item quantities to inventory.',
      voidReason: 'Reason for Cancellation',
      confirmVoidBtn: 'Confirm & Restore Stock',
      noSalesFound: 'No sales transactions match the selected filter.',
      showingTransactions: 'Showing transactions',
    },
    inventory: {
      title: 'Inventory & Stock Management',
      subtitle: 'Monitor catalog, wholesale costs, retail pricing, margins, and reorder levels',
      totalProducts: 'Total Catalog',
      inventoryAtCost: 'Valuation (At Cost)',
      inventoryAtCostSub: 'Capital invested in inventory',
      inventoryAtRetail: 'Valuation (At Retail)',
      inventoryAtRetailSub: 'Total expected sales value',
      potentialProfit: 'potential profit',
      reorderAlert: 'Reorder Alerts',
      filterLowStock: 'Show Low-Stock Items Only',
      productsTab: 'Product Catalog',
      movementsTab: 'Stock Movements & Audit Log',
      addProduct: '+ Add Product',
      adjustStock: 'Adjust Stock',
      currentStock: 'Current Stock',
      reorderLevel: 'Reorder Level',
      statusInStock: 'IN STOCK',
      statusLowStock: 'LOW STOCK',
      statusOutOfStock: 'OUT OF STOCK',
      movementType: 'Movement Type',
      quantityDelta: 'Delta (+/-)',
      reason: 'Reason / Ref',
      noProductsFound: 'No products match the selected filters.',
      noMovementsFound: 'No stock movement records found.',
    },
    expenses: {
      title: 'Operating Expenses Ledger',
      subtitle: 'Record store overhead: electric bills, rent, packaging, delivery fuel, and wages',
      totalExpenses: 'Total Operating Expenses',
      totalExpensesSub: 'Recorded store overhead (last 30 days)',
      dailyAverage: 'Daily Expense Average',
      dailyAverageSub: 'Across 30-day operation period',
      impactOnResult: 'Impact on Operating Result',
      impactOnResultSub: 'Gross profit minus overhead expenses',
      categoryBreakdown: 'Expense Breakdown by Category',
      categoryBreakdownSub: 'Identify where business capital is being spent',
      recordExpense: '+ Record Expense',
      description: 'Description & Voucher',
      noExpensesFound: 'No expenses recorded matching the selected filter.',
    },
    advisor: {
      title: 'Bantay Negosyo AI — Local Advisor',
      subtitle: 'Private on-device intelligence grounded in your verified financial records',
      offlineHeader: 'Local On-Device AI Runtime',
      offlineHeaderSub: 'Runs 100% locally on your computer via Ollama (127.0.0.1:11434). All numbers are calculated deterministically before prompting the model. Zero LLM math.',
      engineTarget: 'TARGET MODEL',
      inputPlaceholder: 'Ask a business question in English or Tagalog... (e.g. "What are my top 3 products by gross profit?")',
      askButton: 'Ask Bantay',
      analyzing: 'Analyzing...',
      approvedIntents: 'Approved Analytical Questions:',
      safetyToggle: 'Safety & Uncertainty Check: How does Bantay respond without sufficient data?',
      safetyTitle: 'Prompt Safety & Data Grounding Demo',
      safetyDesc: 'If a user asks an unsupported question (e.g. "How much tax do I owe BIR?" or "Predict Christmas sales"), Bantay will NOT invent numbers. It explicitly states what evidence is missing.',
      safetyExampleTitle: 'Example Grounded Response:',
      safetyExample: '"I cannot provide tax advice or future sales predictions because our local database only contains recorded transactions, wholesale costs, and operating expenses."',
      evidenceTitle: 'Structured Database Evidence (Deterministic Calculation)',
      evidenceRange: 'Date Range:',
      userQuery: 'User Query:',
      intentLabel: 'Routed Intent:',
      summaryTitle: 'Executive Summary',
      observationsTitle: 'Key Observations',
      recommendationsTitle: 'Actionable Recommendations',
      caveatsTitle: 'Caveats & Limitations',
      emptyStateTitle: 'Bantay is Ready to Assist',
      emptyStateSub: 'Choose one of the approved questions above or type your own question to get instant, private business insights.',
    },
    settings: {
      title: 'Settings & System Diagnostics',
      subtitle: 'Verify on-device AI runtime, store profile, offline security, and data safeguards',
      storeProfile: 'Store Profile',
      storeProfileSub: 'Business name and branch details used for headers and receipts',
      storeName: 'Store Name',
      ownerName: 'Owner / Manager Name',
      currency: 'Operating Currency',
      branch: 'Location / Barangay',
      updateProfile: 'Update Profile',
      profileSaved: 'Profile Saved!',
      diagnostics: 'On-Device AI Engine & Diagnostics',
      diagnosticsSub: 'Verify local model connectivity, port binding, and database security',
      dataSafeguards: 'Data Management & Safeguards',
      dataSafeguardsSub: 'Manage demonstration fixtures, backup files, or restore default state',
      csvImporter: 'CSV Fixture Importer',
      csvImporterDesc: 'Preview and validate CSV files for catalog products and sales ledger import.',
      tryCsv: 'Preview CSV Import',
      resetDemo: 'Reset to Default Demo Data',
      resetDemoDesc: 'Restore the original 24 sari-sari store products and 30-day realistic transactions.',
      resetDemoBtn: 'Reset Demo Data',
      resetConfirmTitle: 'Confirm Reset to Default Fixtures',
      resetConfirmSub: 'Any sales, products, or expenses created in this session will be reset.',
      resetConfirmBtn: 'Yes, Reset Data',
      architectureTitle: 'Bantay Negosyo AI — Architectural Guarantees',
      architectureSub: 'Hackathon Acceptance Criteria & Zero-Cloud Principles',
    },
  },
  tl: {
    common: {
      appName: 'Bantay Negosyo',
      tagline: 'Smart na Negosyo, Kahit Walang Internet',
      offlineBadge: '100% Offline / Lokal',
      offlineDesc: 'Walang cloud telemetry. SQLite at local AI lamang sa iyong PC.',
      demoBadge: 'DEMO • Phase 1',
      save: 'I-save',
      cancel: 'Kanselahin',
      confirm: 'Kumpirmahin',
      close: 'Isara',
      delete: 'Burahin',
      search: 'Maghanap...',
      filter: 'Filter',
      all: 'Lahat',
      loading: 'Naglo-load...',
      retry: 'Subukang Muli',
      back: 'Bumalik',
      actions: 'Aksyon',
      status: 'Katayuan',
      date: 'Petsa',
      amount: 'Halaga',
      notes: 'Tala',
      quantity: 'Dami',
      price: 'Presyo',
      cost: 'Puhunan',
      total: 'Kabuuan',
      profit: 'Tubo (Profit)',
      margin: 'Margin',
      unit: 'Yunit',
      sku: 'SKU',
      product: 'Produkto',
      category: 'Kategorya',
      stock: 'Stock',
      newSale: '+ Bagong Benta',
      askAi: 'Magtanong sa AI',
      posRegister: 'POS Counter',
      ledger: 'Talaan ng Benta',
    },
    nav: {
      dashboard: 'Dashboard',
      dashboardSub: 'Pangkalahatang Katayuan',
      sales: 'Mga Benta & POS',
      salesSub: 'Counter Register & Resibo',
      inventory: 'Imbentaryo',
      inventorySub: 'Stocks & Presyo',
      expenses: 'Mga Gastos',
      expensesSub: 'Operating Expenses',
      advisor: 'AI Advisor',
      advisorSub: 'Lokal na Tagapayo',
      settings: 'Settings',
      settingsSub: 'Diagnostics & Datos',
      lowStockBadge: 'paubos na',
    },
    dashboard: {
      title: 'Pangkalahatang Dashboard',
      subtitle: 'Mga pangunahing KPI, takbo ng benta, at paalala sa imbentaryo',
      welcome: 'Mabuhay, Tindera / May-ari!',
      welcomeSub: 'Naka-save ang lahat ng transaksyon sa iyong sariling device. Walang internet na kailangan upang masubaybayan ang negosyo.',
      analyzeAi: 'I-analyze kay Bantay AI',
      recordSale: '+ Buksan ang POS',
      financialKpis: 'Pangunahing Kalagayan sa Pananalapi (Financial KPIs)',
      last30Days: 'Huling 30 Araw na Aktibidad',
      revenue: 'Kabuuang Benta',
      revenueSub: 'Gross Revenue mula sa Counter',
      cogs: 'Puhunan sa Paninda',
      cogsSub: 'Cost of Goods Sold (COGS)',
      grossProfit: 'Kabuuang Tubo',
      grossProfitSub: 'Benta - Puhunan (Gross Profit)',
      expenses: 'Gastos sa Operasyon',
      expensesSub: 'Kuryente, Upa, Pamasahe, Bag',
      operatingResult: 'Estimated Operating Result',
      operatingResultSub: 'Tubo - Gastos sa Operasyon',
      omissionNotice: 'Paunawa: Ang Estimated Operating Result ay base lamang sa mga naitalang gastos. Maaaring hindi pa kasama ang buwis (BIR), pwesto kung may utang, o sariling sahod ng may-ari.',
      completedSales: 'Natapos na Resibo',
      avgOrderValue: 'Average Order Value',
      lowStockAlerts: 'Babala sa Paubos na Stock',
      salesTrend: 'Takbo ng Benta at Tubo (14-Day Sales Trend)',
      salesTrendSub: 'Araw-araw na kita mula sa counter (halaga sa Peso)',
      topProducts: 'Top Produkto Base sa Tubo (Gross Profit)',
      topProductsSub: 'Niraranggo ayon sa tunay na kita, hindi lang dami',
      lowStockPanel: 'Mga Produktong Paubos na',
      lowStockPanelSub: 'Nasa o mas mababa sa itinakdang reorder threshold',
      restock: 'Mag-restock',
      manageAll: 'Pamahalaan Lahat',
      askAiTitle: 'Tanungin si Bantay Negosyo AI',
      askAiSub: 'Lokal na AI na nagbibigay ng payo base sa tunay mong benta',
      pickQuestion: 'Pumili ng tanong upang kagyat na kalkulahin ang ebidensya at pakinggan ang payo:',
      viewAllSales: 'Tingnan Lahat ng Benta',
      goToInventory: 'Pumunta sa Imbentaryo',
      allStockSufficient: 'Lahat ng produkto ay may sapat na stock sa kasalukuyan.',
    },
    pos: {
      title: 'Counter Point of Sale (POS)',
      subtitle: 'Mabilis na pag-resibo, agarang bawas sa imbentaryo, at kalkulasyon ng sukli',
      searchPlaceholder: 'Maghanap ng produkto o SKU...',
      categories: 'Mga Kategorya',
      cartTitle: 'Kasalukuyang Resibo / Order',
      emptyCart: 'Walang laman ang counter ticket',
      emptyCartSub: 'Pindutin ang mga produkto sa kaliwa para idagdag sa bibilhin ng mamimili.',
      itemCount: 'Mga Aytem',
      itemsTotal: 'Kabuuang Halaga',
      totalCost: 'Puhunan (COGS)',
      grossProfit: 'Tinatayang Tubo',
      cashTendered: 'Bayad ng Mamimili (Cash)',
      changeDue: 'Sukli (Change Due)',
      exactAmount: 'Sakto ang Bayad',
      completeSale: 'Kumpirmahin ang Benta',
      completing: 'Inirerecord ang Benta...',
      clearCart: 'Alisin Lahat',
      stockRemaining: 'natitira sa estante',
      outOfStock: 'Ubos na ang Stock',
      customerNotes: 'Tala / Customer Notes (Opsyonal)',
      notesPlaceholder: 'Hal. Suking kapitbahay, may barya, discount',
      quickCash: 'Mabilisang Cash',
      saleSuccessTitle: 'Matagumpay na Naitala ang Benta!',
      saleSuccessMsg: 'Nawas ang stock sa imbentaryo at na-update ang KPIs sa dashboard.',
      viewReceipt: 'Tingnan ang Resibo',
      newTransaction: 'Susunod na Mamimili',
    },
    sales: {
      title: 'Talaan ng mga Benta (Sales Ledger)',
      subtitle: 'Kumpletong talaan ng transaksyon kasama ang mga aytem at halaga ng kita',
      receiptId: 'Resibo ID',
      dateTime: 'Petsa at Oras',
      itemsCount: 'Bilang ng Aytem',
      statusCompleted: 'COMPLETED',
      statusVoid: 'VOIDED',
      viewDetails: 'Tingnan Detalye',
      voidSale: 'I-void Benta',
      voidConfirmTitle: 'Kumpirmahin ang Pag-void ng Resibo',
      voidConfirmSub: 'Ang pag-void ay awtomatikong magbabalik ng dami ng mga aytem sa imbentaryo.',
      voidReason: 'Dahilan ng Pag-void',
      confirmVoidBtn: 'Kumpirmahin at Ibalik ang Stock',
      noSalesFound: 'Walang natagpuang transaksyon sa filter na ito.',
      showingTransactions: 'Ipinapakita ang transaksyon',
    },
    inventory: {
      title: 'Pamamahala ng Imbentaryo',
      subtitle: 'Subaybayan ang catalog, puhunan, presyo sa tindahan, margin, at reorder level',
      totalProducts: 'Kabuuang Paninda',
      inventoryAtCost: 'Halaga ng Puhunan (At Cost)',
      inventoryAtCostSub: 'Nakalubog na puhunan sa estante',
      inventoryAtRetail: 'Halaga sa Tindahan (At Retail)',
      inventoryAtRetailSub: 'Kabuuang inaasahang benta',
      potentialProfit: 'potensyal na tubo',
      reorderAlert: 'Paubos / Reorder Alert',
      filterLowStock: 'Ipakita Lamang ang Paubos na Stock',
      productsTab: 'Talaan ng mga Produkto',
      movementsTab: 'Kasaysayan ng Stock & Audit Log',
      addProduct: '+ Bagong Produkto',
      adjustStock: 'Ayusin Stock',
      currentStock: 'Kasalukuyang Stock',
      reorderLevel: 'Reorder Level',
      statusInStock: 'SAPAT',
      statusLowStock: 'PAUBOS NA',
      statusOutOfStock: 'UBOS NA',
      movementType: 'Uri ng Galaw',
      quantityDelta: 'Dami (+/-)',
      reason: 'Dahilan / Reference',
      noProductsFound: 'Walang natagpuang produkto na tumutugma sa filter.',
      noMovementsFound: 'Walang naitalang paggalaw ng stock.',
    },
    expenses: {
      title: 'Mga Gastos sa Operasyon',
      subtitle: 'Kuryente, upa, pamasahe sa palengke, plastic sando bag, at sahod ng helper',
      totalExpenses: 'Kabuuang Operating Expenses',
      totalExpensesSub: 'Naitalang gastos sa nakaraang 30 araw',
      dailyAverage: 'Araw-araw na Average na Gastos',
      dailyAverageSub: 'Base sa 30-araw na panahon ng negosyo',
      impactOnResult: 'Epekto sa Estimated Operating Result',
      impactOnResultSub: 'Gross Profit bawas ang mga operating expenses',
      categoryBreakdown: 'Pagkakahati ng Gastos ayon sa Kategorya',
      categoryBreakdownSub: 'Tukuyin kung saan napupunta ang pera ng tindahan',
      recordExpense: '+ Magtala ng Gastos',
      description: 'Deskripsyon & Patunay',
      noExpensesFound: 'Walang naitalang gastos sa napiling filter.',
    },
    advisor: {
      title: 'Bantay Negosyo AI — Lokal na Tagapayo',
      subtitle: 'Matalinong pagsusuri gamit ang on-device AI na may ebidensya at walang cloud',
      offlineHeader: 'Lokal na AI Runtime sa Device',
      offlineHeaderSub: 'Tumatakbo nang 100% sa iyong PC via Ollama (127.0.0.1:11434). Lahat ng numero ay kinakalkula muna mula sa SQLite bago ipaliwanag ng modelo. Walang LLM math.',
      engineTarget: 'TARGET MODEL',
      inputPlaceholder: 'Magtanong sa English o Tagalog... (Hal: "Ano ang top 3 produkto ko base sa gross profit?")',
      askButton: 'Tanungin si Bantay',
      analyzing: 'Sinusuri...',
      approvedIntents: 'Mga Inaprubahang Tanong:',
      safetyToggle: 'Pagsusuri sa Kaligtasan ng AI: Paano tumutugon si Bantay kapag walang sapat na datos?',
      safetyTitle: 'Demo ng Kaligtasan ng Prompt at Data Grounding',
      safetyDesc: 'Kung magtanong ng hindi sinusuportahang bagay (hal. "Magkano ang tax ko sa BIR?" o "Hulaan ang benta sa Pasko"), HINDI mag-iimbento si Bantay ng numero. Sasabihin nito kung ano ang kulang na ebidensya.',
      safetyExampleTitle: 'Halimbawa ng Grounded na Tugon:',
      safetyExample: '"Hindi ako maaaring magbigay ng payo sa buwis o hula sa hinaharap sapagkat ang database lamang ng mga benta, puhunan, at operating expenses ang mayroon tayo."',
      evidenceTitle: 'Strukturang Ebidensya mula sa Database',
      evidenceRange: 'Saklaw ng Petsa:',
      userQuery: 'Tanong ng User:',
      intentLabel: 'Routed Intent:',
      summaryTitle: 'Pangunahing Buod (Executive Summary)',
      observationsTitle: 'Mga Mahahalagang Obserbasyon',
      recommendationsTitle: 'Mga Rekomendasyon para sa Tindahan',
      caveatsTitle: 'Mga Limitasyon at Paalala',
      emptyStateTitle: 'Handa nang Sumagot si Bantay',
      emptyStateSub: 'Pumili ng tanong sa itaas o mag-type ng sariling katanungan upang makakuha ng agarang payo nang offline.',
    },
    settings: {
      title: 'Mga Setting at Diagnostics',
      subtitle: 'Pagsusuri sa local AI engine, datos ng tindahan, at seguridad ng offline mode',
      storeProfile: 'Profile ng Negosyo',
      storeProfileSub: 'Pangalan ng tindahan at detalye ng sangay para sa resibo at ulat',
      storeName: 'Pangalan ng Tindahan',
      ownerName: 'Pangalan ng May-ari / Tindera',
      currency: 'Lokal na Salapi',
      branch: 'Lokasyon / Barangay',
      updateProfile: 'I-update ang Profile',
      profileSaved: 'Na-save ang Profile!',
      diagnostics: 'Status ng On-Device AI Engine & Diagnostics',
      diagnosticsSub: 'Pagsusuri sa koneksyon ng lokal na modelo at seguridad ng data',
      dataSafeguards: 'Pamamahala ng Datos at Pag-reset',
      dataSafeguardsSub: 'Pangasiwaan ang demonstrasyong datos, backup, o ibalik sa simula',
      csvImporter: 'CSV Fixture Importer',
      csvImporterDesc: 'Mag-load ng panibagong set ng mga produkto o nakaraang benta gamit ang CSV.',
      tryCsv: 'Subukan ang CSV Import',
      resetDemo: 'Ibalik sa Orihinal na Demo Data',
      resetDemoDesc: 'Muling ibabalik ang 24 na sari-sari store products at 30-araw na sample na transaksyon.',
      resetDemoBtn: 'I-reset ang Datos (Demo)',
      resetConfirmTitle: 'Kumpirmahin ang Pag-reset ng Demo Data',
      resetConfirmSub: 'Mawawala ang anumang bagong benta o produktong inilagay sa session na ito.',
      resetConfirmBtn: 'Oo, I-reset ang Datos',
      architectureTitle: 'Bantay Negosyo AI — Arkitektura at Disclosures',
      architectureSub: 'Pagsunod sa Hackathon Acceptance Criteria at Zero-Cloud Guarantee',
    },
  },
};
