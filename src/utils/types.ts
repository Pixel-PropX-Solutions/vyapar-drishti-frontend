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

export type ProductSortField =
  | "product_name"
  | 'selling_price'
  | 'purchase_price'
  | "category"
  | "created_at"
  | "updated_at"
  | "opening_quantity"
  | "opening_purchase_price"
  | "show_active_stock"
  | "barcode"
  | 'unit'
  | "hsn_code";

export type CategorySortField =
  | "category_name"
  | 'description'
  | 'created_at'
  | "updated_at";

export type CreditorSortField =
  | "name"
  | 'company_name'
  // | 'credit_limit'
  // | 'balance_type'
  | 'city'
  | 'state'
  | "created_at";


export enum OrderStatus {
  PENDING = "Pending",
  SHIPPED = "Shipped",
  CANCELLED = "Cancelled"
}
export type SortOrder = "asc" | "desc";

export interface Units {
  label: string;
  value: string;
}

export interface UserSignUp {
  name: {
    first: string,
    last: string,
  }
  email: string,
  phone: PhoneNumber
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

export interface GetBilling {
  _id: string,
  user_id?: string,
  // company_id: string,
  is_deleted?: boolean,
  address_1: string,
  address_2?: string,
  pinCode?: string,
  city?: string,
  state: string,
  country?: string,
  created_at?: string,
  updated_at?: string,
}

export interface GetAllBilling {
  _id: string,
  user_id: string,
  is_deleted: boolean,
  address_1: string,
  address_2?: string,
  pinCode?: string,
  city?: string,
  state: string,
  country?: string,
}

export interface ShippingAddress {
  _id?: string,
  user_id?: string,
  // company_id: string,
  is_deleted?: boolean,
  title?: string,
  address_1: string,
  address_2?: string,
  pinCode?: string,
  city?: string,
  state: string,
  country?: string,
  notes?: string,
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

export interface GetCreditors {
  _id: string,
  name: string,
  user_id: string,
  phone?: PhoneNumber,
  email?: string,
  gstin?: string,
  company_name?: string,
  billing: GetBilling,
  shipping?: ShippingAddress,
  // opening_balance?: number,
  // balance_type?: string,
  image?: string | File | null,
  pan_number?: string,
  // credit_limit?: number,
  tags?: string,
  // due_date?: number,
  created_at: string,
  updated_at: string,
  is_deleted: boolean
}


export interface UserData {
  _id: string;
  name: Name;
  phone_number: PhoneNumber;
  shop_name?: string;
  company_name?: string;
  address: Address;
  licence_number?: string;
}

export interface ChemistData {
  _id: string;
  name: Name;
  phone_number: PhoneNumber;
  shop_name: string;
  address: Address;
  licence_number: string;
}

export interface StockistData {
  name: Name;
  phone_number: PhoneNumber;
  company_name: string;
  address: Address;
}

export interface Stockist {
  _id: string;
  email: string;
  role: string;
  StockistData: StockistData;
}

export interface Chemist {
  _id: string;
  email: string;
  role: string;
  ChemistData: ChemistData;
}

export interface CreateChemist {
  _id: string;
  email: string;
  role: string;
  ChemistData: {
    name: Name;
    phone_number: PhoneNumber;
    shop_name: string;
    address: Address;
    licence_number: string;
  }
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
}

export interface CreateUser {
  email: string;
  role: string;
}

export interface GetCompany {
  _id: string,
  user_id: string,
  brand_name: string,
  company_name: string,
  phone?: PhoneNumber,
  email?: string,
  image?: File | string | null,
  gstin?: string,
  pan_number?: string,
  business_type?: string,
  website?: string,
  alter_phone?: PhoneNumber,
  billing?: GetBilling,
  shipping?: ShippingAddress,
  created_at?: string,
  updated_at?: string,
}

export interface SetCompany {
  user_id: string,
  brand_name: string,
  company_name: string,
  number?: string;
  code?: string;
  alter_number?: string;
  alter_code?: string;
  email?: string,
  image?: File | string | null,
  gstin?: string,
  pan_number?: string,
  business_type?: string,
  website?: string,
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
  product_name: string;
  selling_price: number;
  unit?: string;
  is_deleted?: boolean;
  hsn_code?: string;
  purchase_price?: number;
  barcode?: string;
  category?: string;
  description?: string;
  opening_quantity?: number;
  opening_purchase_price?: number;
  opening_stock_value?: number;
  low_stock_alert?: number;
  show_active_stock?: boolean;
  image?: File | string;
}


export interface GetProduct {
  // Required fields
  _id: string
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
  category_desc?: string;
  image?: string;
  description?: string;
  opening_quantity?: number;
  opening_purchase_price?: number;
  opening_stock_value?: number;

  // Additonal Optional fields
  low_stock_alert?: number;
  show_active_stock?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  category_name: string;
  user_id: string;
  image?: File | string;
  description?: string;
  is_deleted: boolean;
}

export interface CategoryLists {
  _id: string;
  category_name: string;
}

export interface GetCategory {
  category_name: string;
  created_at: string;
  description: string;
  image: string;
  is_deleted: boolean;
  updated_at: string;
  user_id: string;
  _id: string;
}

export interface UpdateCategory {
  _id: string;
  user_id: string;
  is_deleted: boolean;
  category_name: string;
  description: string;
  image?: File | string;
}

export interface Product {
  _id: string;
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

export interface Inventory {
  _id: "";
  chemist_id: "";
  product_id: "";
  quantity: 76;
  last_restock_date: "";
  product: Product;
  Chemist: {
    _id: "";
    user_id: "";
    name: Name;
    phone_number: PhoneNumber;
    shop_name: "";
    address: Address;
  };
}

export interface Pharmacy {
  id: string;
  name: string;
  totalSales: number;
  stockPurchased: number;
  stockRemaining: number;
  pendingReturns: number;
}

export interface SalesData {
  date: string;
  amount: number;
  pharmacyId?: string;
}

export interface BubbleData {
  pharmacy: string;
  returns: number;
  sales: number;
  stockRemaining: number;
}

export interface OrderCreate {
  stockist_id: string,
  order_date: string,
  total_amount: number,
}

export interface StockOutState {
  product_id: string,
  quantity: number,
  unit_price: number,
  unit: string // added for unit selection
}

export interface OrderDetailsCreate {
  order_id: string,
  product_details: Array<StockOutState>
}

export interface Order {
  _id: string,
  order_date: string,
  status: OrderStatus,
  total_amount: number,
  Stockist: {
    _id: string,
    name: Name,
    company_name: string,
    address: Address,
    phone_number: PhoneNumber
  }
}

export interface OrderDetails {
  stockist: {
    name: Name,
    company_name: string,
    address: Address,
    phone_number: PhoneNumber
  },
  order_details: {
    status: OrderStatus,
    order_date: string,
    total_amount: number,
    _id: string,
    chemist_id: string,
    stockist_id: string,
    created_at: string,
    updated_at: string
  },
  orders: [
    {
      _id: string,
      order_id: string,
      product_details: StockOutState,
      ProductDetails: {
        _id: string;
        product_name: string;
        category: string;
        state: string;
        measure_of_unit: string;
        no_of_tablets_per_pack: number;
        price: number;
        expiry_date: string;
      }
    }
  ]
}

export interface StockistShops {
  _id: string,
  company_name: string,
}

export interface ProductListing {
  _id: string
  product_name: string,
  measure_of_unit: string,
  price: number,
}

export interface ProductForOrder {
  product_name: string,
  product_id: string,
  quantity: number,
  unit_price: number
}

export interface SaleProduct {
  product_name: string;
  category: string;
  state: string;
  measure_of_unit: string;
  no_of_tablets_per_pack: number;
  storage_requirement: string;
  description: string;
  expiry_date: string;
}

export interface StockMovement {
  _id: string,
  product_id: string,
  quantity: number,
  movement_type: string,
  unit_price: number,
  created_at: string,
  productDetails: SaleProduct
}

export interface WareHouseProduct {
  _id: string,
  product_id: string,
  available_quantity: number;
  updated_at: string;
  purchase_price?: number;
  sell_price?: number;
  productDetails: SaleProduct
}

export interface Item {
  product_name?: string,
  pack?: string,
  batch?: string,
  HSN?: string,
  expiry?: string,
  quantity?: string,
  MRP?: string,
  rate?: string,
  GST_percent?: string,
  amount?: string,
}


export interface InvoiceData {
  invoice_no: string,
  date: string,
  stockist: {
    name?: string,
    address?: {
      street_address_1?: string;
      street_address_2?: string;
      city?: string;
      state?: string;
      zip_code?: string;
    };
    phone?: string,
    GSTIN?: string,
    DL_No?: string,
  },
  chemist: {
    name?: string,
    address?: {
      street_address_1?: string;
      street_address_2?: string;
      city?: string;
      state?: string;
      zip_code?: string;
    };
    GSTIN?: string,
    DL_No?: string,
  },
  items: Item[];
  totals: {
    subtotal?: number;
    discount?: number;
    SGST?: number;
    CGST?: number;
    GST_total?: number;
    grand_total?: number;
    outstanding_amount?: number;
  }
}

export interface ItemToSent {
  product_id: string;
  product_name: string;
  pack: string;
  expiry: string;
  quantity: string;
  rate: string;
}

export interface InvoiceDataToSent {
  invoice_no: string;
  date: string;
  stockist_id: string;
  chemist_id: string;
  items: ItemToSent[];
  total: string;
}

export interface BillItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export type StockLevelType = "Low" | "Normal" | "Overstock";


export interface StockLevel {
  stock_level: StockLevelType,
  count: number
}

export interface CategoryPercent {
  label: string,
  total_amount: number,
  value: number
}

export interface TopMonthSale {
  id: string,
  name: string,
  totalSales: number,
  stockPurchased: number
}

export interface Top5Categories {
  id: string,
  label: string,
  data: Array<number>
}

export interface UserAnalyticsData {
  total_sales: number,
  total_purchased: number,
  remaining_stock: number,
  pending_returns: number,
  dead_stocks: number,
  sales_trends_yearly: {
    month: number,
    labels: Array<string>
    year: number,
    data: Array<number>
  },
  sales_trends_monthly: {
    month: number,
    labels: Array<string>
    year: number,
    data: Array<number>
  },
  top_month_sales: Array<TopMonthSale>,
  category_wise_percent: Array<CategoryPercent>,
  stock_level: Array<StockLevel>,
  top_5_categories_all_time: {
    year: number,
    total_sales: number,
    data: Array<Top5Categories>,
  }
}

export interface ChemistTotalSales {
  chemistId: string,
  totalSales: number,
  stockPurchased: number,
  name: string,
  shop_name: string,
  pendingStockAmount: number,
  remainingStock: number,
  data: {
    month: number,
    year: number,
    labels: Array<string>
    data: Array<number>
  }
}

export interface AdminAnalyticsData {
  total_sales: 5318986.86,
  total_purchase: 5318986.86,
  remaining_stock: 2722045,
  pending_stock: 10570,
  dead_stock: 7650,
  sales_trends: {
    month: 2,
    year: 2025,

    data: Array<number>
  },
  sales_trends_month_wise: Array<TopMonthSale>,
  category_wise: Array<CategoryPercent>,
  stock_level: Array<StockLevel>,
  chemist_wise_total_sales: Array<ChemistTotalSales>,
  top_5_categories_all_time: {
    year: number,
    total_sales: number,
    data: Array<Top5Categories>,
  }
}