// Sort type definitions


export type SortField =
  | "name"
  | "shop_name"
  | "city"
  | "state"
  | "created_at"
  | 'product_name'
  | "category"
  | "available_quantity"
  | "available_product_price"
  | "company_name";


export type InventorySortField =
  | "created_at"
  | 'stock_item_name'
  | 'last_restock_date'
  | "current_stock";


export type ProductSortField =
  | "stock_item_name"
  | 'selling_price'
  | 'purchase_price'
  | "category"
  | "created_at"
  | "updated_at"
  | "opening_quantity"
  | "opening_purchase_price"
  | "show_active_stock"
  | "gst_hsn_code"
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


export type SortOrder = "asc" | "desc";

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

export interface Name {
  first_name: string;
  middle_name: string;
  last_name: string;
}

export interface PhoneNumber {
  code: string;
  number: string;
}

export interface Address {
  street_address: string;
  street_address_line_2: string;
  city: string;
  state: string;
  zip_code: string;
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
  is_deemed_positive: boolean,
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
  gstin?: string;
  created_at: string,
  updated_at: string,
  is_deleted: boolean
}

export interface GetCustomerInvoices {
  amount: number,
  is_deemed_positive: boolean,
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
  status: string,
  due_date: string,

  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    rate: number;
    amount: number;
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
  status: string,
  due_date: string,


  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string,
    item: string,
    item_id: string,
    quantity: number,
    rate: number,
    amount: number,
    additional_amount: number,
    discount_amount: number,
    godown: string,
    godown_id: string,
    order_number: string,
    order_due_date: string
  }>
}


export interface UpdateGSTInvoice {
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
  status: string,
  due_date: string,

  accounting: Array<{
    entry_id: string,
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
  }>,
  items: Array<{
    entry_id: string,
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    rate: number;
    amount: number;
    additional_amount: number;
    discount_amount: number;
    godown: string;
    godown_id: string;
    order_number: string;
    order_due_date: string;
    hsn_code: string;
    gst_rate: string;
    gst_amount: number;
  }>
}

export interface CreateInvoiceWithGSTData {
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
  status: string,
  due_date: string,


  accounting: Array<{
    vouchar_id: string,
    ledger: string,
    ledger_id: string,
    amount: number
  }>,
  items: Array<{
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    rate: number;
    amount: number;
    additional_amount: number;
    discount_amount: number;
    godown: string;
    godown_id: string;
    order_number: string;
    order_due_date: string;
    hsn_code: string;
    gst_rate: string;
    gst_amount: number;
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
  gstin: string,
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
  gstin?: string,
  website?: string,
  account_number?: string,
  account_holder?: string,
  bank_ifsc?: string,
  bank_name?: string,
  bank_branch?: string,
  qr_code_url?: File | string | null,
}


export interface SingleProduct {
  product_name: string;
  category: string;
  state: string;
  measure_of_unit: string;
  no_of_tablets_per_pack: number;
  price: number;
  storage_requirement: string;
  description: string;
  expiry_date: string;
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
  barcode?: string;
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
  gst_nature_of_goods?: string;
  gst_hsn_code: string;
  gst_taxability: string;
  gst_percentage: string;

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
  gst_nature_of_goods?: string;
  gst_hsn_code?: string;
  gst_taxability?: string;
  gst_percentage: string;
  low_stock_alert?: number;
}

export interface GetInvoiceData {
  _id: string,
  company_id: string,
  user_id: string,
  date: string,
  voucher_number: string,
  voucher_type: string,
  voucher_type_id: string,
  narration: string,
  party_name: string,
  party_name_id: string,
  reference_date: string,
  reference_number: string,
  place_of_supply: string,
  mode_of_transport: string,
  vehicle_number: string,
  status: string,
  due_date: string,
  is_invoice: number,
  is_accounting_voucher: number,
  is_inventory_voucher: number,
  is_order_voucher: number,
  created_at: string,
  updated_at: string,
  inventory: [
    {
      _id: string,
      vouchar_id: string,
      item: string,
      item_id: string,
      quantity: number,
      rate: number,
      amount: number,
      additional_amount: number,
      discount_amount: number,
      godown: string,
      godown_id: string,
      order_number: string | null,
      order_due_date: string | null,
      gst?: string,
      gst_amount?: string,
      created_at: string,
      updated_at: string
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
      updated_at: string
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
  gst_hsn_code?: string;
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
  gst_nature_of_goods?: string;
  gst_taxability?: string;
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
  gst_hsn_code: string | null,
  opening_balance: number,
  opening_rate: number,
  opening_value: number,
  avg_purchase_rate: number,
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
  gst_nature_of_goods: string;
  gst_hsn_code: string;
  gst_taxability: string;
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
  gst_nature_of_goods: string;
  gst_hsn_code: string;
  gst_taxability: string;
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
  is_deemed_positive: boolean
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
  // is_deemedpositive: boolean;
  // affects_stock: boolean;
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
    gst_nature_of_goods: string;
    gst_hsn_code: string;
    gst_taxability: string;
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



export interface ProductListing {
  _id: string
  product_name: string,
  measure_of_unit: string,
  price: number,
}



export interface StockMovement {
  _id: string,
  user_id: string,
  company_id: string,
  vouchar_id: string,
  voucher_number: string,
  voucher_type: string,
  item: string,
  item_id: string,
  quantity: number,
  rate: number,
  amount: number,
  additional_amount: number,
  discount_amount: number,
  godown: string,
  godown_id: string,
  order_number: string,
  order_due_date: string,
  date: string,
  narration: string,
  party_name: string,
  place_of_supply: string,
  created_at: string,
  updated_at: string,
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
  gst_hsn_code?: string;
  description?: string;
  low_stock_alert: number;
  last_restock_date: string;
}
