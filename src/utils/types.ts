// Sort type definitions


export type SortField =
  | "name"
  | "state"
  | "created_at"
  | 'product_name'
  | "category"
  | "item"
  | "company_name";


export type InventorySortField =
  | "created_at"
  | 'stock_item_name'
  | 'last_restock_date'
  | "current_stock";

export type SummarySortField =
  | "created_at"
  | 'stock_item_name'
  | 'hsn_code'
  | "current_stock";


export type ProductSortField =
  | "stock_item_name"
  | "category"
  | "created_at"
  | "updated_at"
  | 'unit'
  | "hsn_code";

export type CategorySortField =
  | "category_name"
  | 'description'
  | 'created_at'
  | "updated_at";

export type GroupSortField =
  | "inventory_group_name"
  | 'description'
  | 'created_at'
  | 'parent'
  | "updated_at";

export type CustomerSortField =
  | "name"
  | 'company_name'
  | 'country'
  | 'state'
  | 'type'
  | "created_at";

export type InvoicesSortField =
  | "date"
  | 'voucher_type'
  | 'party_name'
  | 'voucher_number'
  | "created_at";


export type SortOrder = "asc" | "desc";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  queryType: string;
  employees: string;
  message: string;
  marketingConsent: boolean;
  time: string;
}

export interface Units {
  id: string;
  unit_name: string;
  value: string;
  symbol: string;
  si_representation: 'decimal' | 'integer';
}

export interface UserSignUp {
  name: {
    first: string,
    last: string,
  }
  email: string,
  phone: PhoneNumber,
  password: string,
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  unique: string[];
  purchase_value?: number;
  sale_value?: number;
  positive_stock?: number;
  low_stock?: number;
}

export interface UploadData {
  filename: string;
  format: string;
  height: number;
  public_id: string;
  url: string;
  width: number;
}

export interface PhoneNumber {
  code: string;
  number: string;
}


export interface GetGroup {
  _id: string,
  name: string,
  user_id: string,
  company_id: string,
  description: string,
  image: string | File | null,
  is_deleted: boolean,
  parent?: string,
  primary_group: string,
  is_revenue: boolean,
  is_deemedpositive: boolean,
  is_reserved: boolean,
  affects_gross_profit: boolean,
  sort_position: number,
  created_at: string,
  updated_at: string,
}


export interface CreateBasicUser {
  name: {
    first: string,
    last: string
  },
  email: string,
  phone: PhoneNumber
  password: string;
}

export interface GetUserLedgers {
  _id: string,
  ledger_name: string,
  user_id: string,
  company_id: string,
  phone?: PhoneNumber,
  qr_image: string,
  email?: string,
  parent: string,
  parent_id: string,
  mailing_name: string,
  mailing_pincode: string,
  mailing_country?: string,
  opening_balance: number,
  total_amount: number,
  is_positive: boolean,
  image?: string | File | null,
  mailing_state: string,
  is_revenue: boolean,
  mailing_address?: string,
  alias?: string,
  bank_name?: string;
  account_number?: string;
  bank_ifsc?: string;
  bank_branch?: string;
  account_holder?: string;
  tin?: string;
  created_at: string,
  updated_at: string,
  is_deleted: boolean
}

export interface GetCustomerInvoices {
  amount: number,
  vouchar_id: string,
  date: string,
  voucher_number: string,
  voucher_type: string,
  narration: string,
  reference_date: string,
  reference_number: string,
  place_of_supply: string,
  customer: string
}

export interface GetCustomerProfile {
  _id: string,
  ledger_name: string,
  parent: string,
  phone: PhoneNumber,
  email: string,
  tin: string,
  opening_balance: number,
  total_amount: number,
  total_debit: number,
  total_credit: number,
}

export interface CustomersList {
  _id: string,
  ledger_name: string,
  parent: string,
  alias: string,
}

export interface GetAllUserGroups {
  _id: string,
  name: string,
  user_id: string,
  company_id: string,
  description: string,
  parent: string,
}

export interface CreateInvoiceData {
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,

  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  // total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    unit: string;
    quantity: number;
    rate: number;
    amount: number;
    discount_amount: number;
    total_amount: number;
    order_index: number;
  }>
}

export interface UpdateInvoice {
  vouchar_id: string,
  user_id: string,
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number;
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string,
    item: string,
    item_id: string,
    quantity: number,
    rate: number,
    amount: number,
    discount_amount: number,
    total_amount: number,
    godown: string,
    godown_id: string,
    order_index: number;
  }>
}


export interface UpdateTAXInvoice {
  vouchar_id: string,
  user_id: string,
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,

  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number;
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    hsn_code: string;
    rate: number;
    amount: number;
    discount_amount: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
    godown: string;
    godown_id: string;
    order_index: number;
  }>
}

export interface CreateInvoiceWithTAXData {
  company_id: string,
  date: string,
  voucher_type: string,
  voucher_type_id: string,
  voucher_number: string,
  party_name: string,
  party_name_id: string,
  narration: string,
  reference_number: string,
  reference_date: string,
  place_of_supply: string,

  vehicle_number: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,

  paid_amount: number,
  total: number,
  discount: number,
  total_amount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,


  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number,
    order_index: number;
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    hsn_code: string;
    rate: number;
    amount: number;
    discount_amount: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
    godown: string;
    godown_id: string;
    order_index: number;
  }>
}


export interface GetUser {
  _id: string;
  name: {
    first: string,
    last?: string,
  },
  email: string;
  user_type: string;
  phone: {
    code: string,
    number: string,
  },
  image: File | string | null;
  created_at: string;
  company?: [{
    company_id: string;
    company_name: string;
    image: string;
    address_1: string;
    address_2: string;
    pinCode: string;
    state: string;
    country: string;
    is_selected: boolean,
    phone: PhoneNumber;
    email: string;
    financial_year_start: string;
    books_begin_from: string;
  }]
}


export interface GetCompany {
  _id: string,
  name: string,
  user_id: string,
  mailing_name: string,
  address_1: string,
  address_2: string,
  pinCode: string,
  state: string,
  country: string,
  phone: PhoneNumber,
  email: string,
  financial_year_start: string,
  books_begin_from: string,
  image: string,
  tin: string,
  is_selected: boolean,
  website: string,
  created_at: string,
  updated_at: string,
  bank_name?: string,
  bank_ifsc?: string,
  bank_branch?: string,
  account_holder?: string,
  account_number?: string,
  qr_code_url?: string
}

export interface SetCompany {
  user_id: string,
  name: string,
  mailing_name?: string,
  address_1?: string,
  address_2?: string,
  pinCode?: string,
  state: string,
  country: string,
  financial_year_start: string, // Use string for date format
  books_begin_from: string, // Use string for date format
  is_deleted: boolean,
  number?: string;
  code?: string;
  email?: string,
  image?: File | string | null,
  tin?: string,
  website?: string,
  account_number?: string,
  account_holder?: string,
  bank_ifsc?: string,
  bank_name?: string,
  bank_branch?: string,
  qr_code_url?: File | string | null,
}


export interface ProductCreate {
  // Required fields
  product_name: string
  selling_price: number
  user_id: string
  is_deleted: boolean;

  // Optional fields
  unit?: string;
  hsn_code?: string;
  purchase_price?: number;
  category?: string;
  image?: string;
  description?: string;
  opening_quantity?: number;
  opening_purchase_price?: number;
  opening_stock_value?: number;

  // Additonal Optional fields
  low_stock_alert?: number;
  show_active_stock?: boolean;
}

export interface FormCreateProduct {
  stock_item_name: string;
  company_id: string;
  unit: string;
  unit_id: string;
  is_deleted: boolean;
  alias_name?: string;
  category?: string;
  category_id?: string;
  group?: string;
  group_id?: string;
  image?: File | string;
  description?: string;

  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  hsn_code: string;
  taxability: string;
  tax_rate: number;

  low_stock_alert: number;
}

export interface ProductUpdate {
  _id: string;
  stock_item_name: string;
  company_id: string;
  user_id: string;
  unit: string;
  unit_id: string;
  is_deleted: boolean;
  alias_name?: string;
  category?: string;
  category_id?: string;
  group?: string;
  group_id?: string;
  image?: File | string | null;
  description?: string;

  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  hsn_code?: string;
  taxability?: string;
  tax_rate: number;
  low_stock_alert?: number;
}

export interface GetInvoiceData {
  _id: string,
  voucher_type_id: string,
  voucher_type: string,
  voucher_number: string,
  vehicle_number: string,
  user_id: string,

  company_id: string,
  date: string,
  narration: string,
  party_name: string,
  party_name_id: string,
  reference_date: string,
  reference_number: string,
  place_of_supply: string,
  mode_of_transport: string,
  payment_mode: string,
  due_date: string,
  paid_amount: number,
  total: number,
  total_amount: number,
  discount: number,
  total_tax: number,
  additional_charge: number,
  roundoff: number,
  grand_total: number,
  created_at: string,
  updated_at: string,
  party_details: {
    account_holder: string,
    account_number: string,
    alias: string,
    bank_name: string,
    bank_branch: string,
    bank_ifsc: string,
    company_id: string,
    created_at: string,
    updated_at: string,
    email: string,
    phone: PhoneNumber,
    tax_registration_type: string,
    tin: string,
    image: string | File | null,
    is_deleted: boolean,
    is_revenue: boolean,
    ledger_name: string,
    mailing_address: string,
    mailing_name: string,
    mailing_pincode: string,
    mailing_state: string,
    mailing_country: string,
    parent: string,
    qr_image: string,
    user_id: string,
    parent_id: string,
    opening_balance: number,
    _id: string,
  },
  inventory: [
    {
      _id: string,
      vouchar_id: string,
      item: string,
      item_id: string,
      quantity: number,
      unit?: string,
      hsn_code?: string,
      rate: number,
      amount: number,
      discount_amount: number,
      tax_rate?: number,
      tax_amount?: number,
      total_amount: number,
      godown: string,
      godown_id: string,
      created_at: string,
      updated_at: string,
      order_index: number
    }
  ],
  accounting_entries: [
    {
      _id: string,
      vouchar_id: string,
      ledger: string,
      ledger_id: string,
      amount: number,
      created_at: string,
      updated_at: string,
      order_index: number
    },
  ]
};

export interface GetProduct {
  _id: string;
  stock_item_name: string;
  user_id: string;
  company_id: string
  unit: string;
  alias_name: string
  image?: string;
  description?: string;
  hsn_code?: string;
  low_stock_alert?: number;
  category?: string;
  group?: string;

  current_stock: number;
  avg_purchase_rate: number;
  purchase_qty: number;
  purchase_value: number;
  sales_qty: number;
  sales_value: number;
  // Optional fields
  opening_balance?: number;
  opening_rate?: number;
  opening_value?: number;
  nature_of_goods?: string;
  taxability?: string;
  created_at?: string;
  updated_at?: string;

  // Additonal Optional fields
  // selling_price: number
  // show_active_stock?: boolean;
}

export interface GetStockItem {
  _id: string,
  stock_item_name: string,
  company_id: string,
  user_id: string,
  unit: string,
  alias_name: string | null,
  category: string | null,
  group: string | null
  image: string | null,
  description: string | null,
  hsn_code: string | null,
  opening_balance: number,
  opening_rate: number,
  opening_value: number,
  purchase_value: number,
  purchase_qty: number,
  low_stock_alert: number | null,
  created_at: string,
  updated_at: string,
  current_stock: number,
}

export interface GetItem {
  _id: string;
  stock_item_name: string;
  company_id: string;
  user_id: string;
  unit: string;
  unit_id: string;
  alias_name: string;
  category: string;
  category_id: string;
  group: string;
  group_id: string;
  image: File | string | null;
  description: string;
  nature_of_goods: string;
  hsn_code: string;
  taxability: string;
  low_stock_alert: number;
  created_at: string;
  updated_at: string;
  current_stock: number;
  avg_purchase_rate: number;
  purchase_qty: number;
  purchase_value: number;
  sales_qty: number;
  sales_value: number;
  opening_balance: number;
  opening_rate: number;
  opening_value: number;
}

export interface GetInventoryGroups {
  _id: string;
  inventory_group_name: string;
  user_id: string;
  company_id: string;
  image: string;
  description: string;
  is_deleted: boolean;
  parent: string;
  nature_of_goods: string;
  hsn_code: string;
  taxability: string;
  created_at: string;
  updated_at: string;
}


export interface UpdateInventoryGroup {
  _id: string;
  user_id: string;
  inventory_group_name: string;
  parent: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}


export interface GetAllVouchars {
  _id: string;
  date: string;
  voucher_number: string;
  voucher_type: string;
  narration: string;
  party_name: string;
  created_at: string;
  amount: number,
}

export interface GetAllAccountingGroups {
  _id: string;
  accounting_group_name: string;
  user_id: string;
  company_id: string;
  description: string;
  image: string;
  is_deleted: false,
  parent: string;
  // is_revenue: false,
  // is_deemedpositive: false,
  // is_reserved: true,
  // affects_gross_profit: false,
  // sort_position: null,
  created_at: string;
  updated_at: string;
}

export interface DefaultAccountingGroup {
  _id: string;
  accounting_group_name: string;
  description: string;
  parent: string;
}

export interface UpdateAccountingGroup {
  _id: string;
  user_id: string;
  accounting_group_name: string;
  parent: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetAllInvoiceGroups {
  _id: string;
  name: string;
  user_id: string | null,
  company_id: string | null;
  parent: string;
  numbering_method: string;
}

export interface CategoryCreate {
  name: string;
  user_id: string;
  image?: File | string;
  description?: string;
  is_deleted: boolean;
}

export interface CategoryLists {
  _id: string;
  under: string;
  description: string;
  category_name: string;
}

export interface InventoryGroupList {
  _id: string;
  parent: string;
  description: string;
  inventory_group_name: string;
}

export interface GetCategory {
  _id: string;
  user_id: string;
  category_name: string;
  description: string;
  image: string;
  under: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  stock_items_count: number;
  stock_items: Array<{
    _id: string;
    stock_item_name: string;
    company_id: string;
    user_id: string;
    unit: string;
    unit_id: string;
    alias_name: string;
    image: File | string | null;
    description: string;
    nature_of_goods: string;
    hsn_code: string;
    axability: string;
    low_stock_alert: number;
    created_at: string;
    updated_at: string;
    current_stock: number;
    avg_purchase_rate: number;
    purchase_qty: number;
    purchase_value: number;
    sales_qty: number;
    sales_value: number;
    opening_balance: number;
    opening_rate: number;
    opening_value: number;
  }>;
}

export interface UpdateCategory {
  _id: string;
  user_id: string;
  category_name: string;
  under: string;
  description: string;
  image?: File | string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}


export interface StockMovement {
  _id: string,
  item_id: string,
  item: string,
  unit: string,
  inwards_qty: number,
  inwards_val: number,
  outwards_qty: number,
  outwards_val: number,
  opening_qty: number,
  opening_val: number,
  closing_qty: number,
  closing_val: number,
  opening_rate: number,
  inwards_rate: number,
  outwards_rate: number,
  closing_rate: number,
  gross_profit: number,
  profit_percent: number
}

export interface HSNInvoice {
  date: string,
  party_name: string,
  party_tin: string | null,
  voucher_id: string,
  voucher_type: string,
  voucher_number: string,
  quantity: number,
  total_amount: number,
  taxable_value: number,
  total_tax: number
}

export interface HSNSummary {
  invoices: Array<HSNInvoice>,
  hsn_code: string,
  item: string,
  item_id: string,
  unit: string | null,
  quantity: number,
  total_value: number,
  taxable_value: number,
  tax_amount: number,
  tax_rate: number,
}

export interface PartyInvoice {
  date: string,
  voucher_id: string,
  voucher_type: string,
  voucher_number: string,
  items: number,
  quantity: number,
  total_amount: number,
  taxable_value: number,
  total_tax: number,
}

export interface PartySummary {
  invoices: Array<PartyInvoice>,
  quantity: number,
  total_value: number,
  taxable_value: number,
  tax_amount: number,
  party_name: string,
  party_tin: string | null,
}


export interface BillSummary {
  _id: string,
  voucher_number: string,
  voucher_type: string,
  date: string,
  party_name: string,
  party_tin: string | null,
  voucher_type_id: string,
  party_name_id: string,
  created_at: string,
  total_value: number,
  tax_amount: number,
  taxable_value: number,
}

export interface InventoryItem {
  _id: string,
  company_id: string,
  current_stock: number;
  updated_at: string;
  avg_purchase_rate?: number;
  avg_sale_rate?: number;
  purchase_qty?: number;
  sales_qty?: number;
  purchase_value?: number;
  sales_value?: number;
  stock_item_name: string;
  image?: string | File | null;
  category?: string;
  group?: string;
  unit: string;
  alias_name?: string;
  hsn_code?: string;
  description?: string;
  low_stock_alert: number;
  last_restock_date: string;
  stock_status: string;
}

export interface MonthlyData {
  sales: number,
  purchase: number,
  profit: number,
  year: number,
  data: Array<{
    id: string | 'sales' | 'purchase' | 'profit',
    label: string,
    data: Array<number>
  }>
}

export interface DailyData {
  sales: number,
  purchase: number,
  profit: number,
  year: number,
  month: number,
  data: Array<{
    id: string | 'sales' | 'purchase' | 'profit',
    label: string,
    data: Array<number>
  }>
}

export interface StatsData {
  opening: number,
  purchase: number,
  sales: number,
  current: number,
  profit: number,
  profit_percent: number,
}

export interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  requiredRole?: 'admin' | 'user';
}

export interface UsersList {
  _id: string,
  name: {
    first: string,
    last: string
  },
  email: string,
  phone: {
    code: string,
    number: string
  },
  image: string | null,
  user_type: string,
  is_verified: boolean,
  created_at: string,
  latest_invoice_date: string,
  total_invoices_created: number,
  latest_invoice_created_at: string,
  user_settings: {
    _id: string,
    user_id: string,
    current_company_id: string,
    current_company_name: string,
    last_login: string,
    last_login_ip: string,
    last_login_device: string
  },
  companies: Array<
    {
      _id: string,
      pinCode: string | null,
      state: string,
      phone: string | null,
      email: string | null,
      created_at: string,
      company_name: string,
      country: string,
      last_invoice_date: string,
      last_invoice_created_at: string,
      total_invoices: number,
      bank_details: {
        account_holder: string | null,
        account_number: string | null,
        bank_ifsc: string | null,
        bank_name: string | null,
        bank_branch: string | null,
        qr_code_url: string | null
      }
    }>
}