import { Chip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-pro";
import ProductIcon from "@mui/icons-material/LocalPharmacyOutlined";
import QuantityIcon from "@mui/icons-material/LocalOffer";
import ExpiryIcon from "@mui/icons-material/CalendarToday";
import { MenuItem, ProductSortField, SortOrder } from "./types";
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DashboardIcon from '@mui/icons-material/Dashboard';
// import ChemistIcon from '@mui/icons-material/Store';
// import StockistIcon from '@mui/icons-material/Warehouse';
// import UploadBillIcon from '@mui/icons-material/UploadFile';
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { ROLE_ENUM } from '@/utils/enums';
import { Assessment, PaymentsOutlined, People, Person2, ReceiptOutlined, WalletOutlined } from '@mui/icons-material';

type ProductSortState = {
  search: string;
  category: string;
  qtyFilter: string;
  state: string;
  page_no: number;
  limit: number;
  sortField: "" | ProductSortField;
  sortOrder: "" | SortOrder;
};

export const handleProductSort = (
  field: ProductSortField,
  sortOrder: SortOrder,
  sortField: ProductSortField,
  setData: React.Dispatch<React.SetStateAction<ProductSortState>>
) => {
  const isAsc = sortField === field && sortOrder === "asc";
  setData((prevState) => ({
    ...prevState,
    sortOrder: isAsc ? "desc" : "asc",
    sortField: field,
  }));
};

const renderAvailability = (
  status: "In Stock" | "Out of Stock" | "Low Stock"
) => {
  const colors: Record<string, "success" | "warning" | "error"> = {
    "In Stock": "success",
    "Low Stock": "warning",
    "Out of Stock": "error",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
};

export const inventoryProductColumn: GridColDef[] = [
  {
    field: "name",
    headerName: "Name of Product",
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ProductIcon sx={{ marginRight: 1, fontSize: "1.2rem" }} />
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "buying_price",
    headerName: "Buying Price",
    flex: 0.5,
    minWidth: 50,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: "1.2rem", marginRight: 0.5 }}>
          &#8377;
        </Typography>
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "quantity",
    headerName: "Quantity",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <QuantityIcon sx={{ marginRight: 1, fontSize: "1.2rem" }} />
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "last_restock_date",
    headerName: "Last restock",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "expiry_date",
    headerName: "Expiry Date",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ExpiryIcon sx={{ marginRight: 1, fontSize: "1.2rem" }} />
        <span>{params.value}</span>
      </div>
    ),
  },

  {
    field: "availability",
    headerName: "Availability",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderAvailability(params.value as any),
  },
];

// Format the date to a readable format
export const formatDatewithTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
};

// Format the date to a readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getFileTypeIcon = (file: File) => {
  const fileType = file.type;
  if (fileType.startsWith("image/")) return <ImageIcon sx={{ margin: "0 10px" }} />;
  if (fileType === "application/pdf") return <PictureAsPdfIcon sx={{ margin: "0 10px" }} />;
  if (fileType.startsWith("text/")) return <TextSnippetIcon sx={{ margin: "0 10px" }} />;
  if (fileType.startsWith("video/")) return <VideoFileIcon sx={{ margin: "0 10px" }} />;
  return <AttachFileIcon sx={{ margin: "0 10px" }} />;
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  const safeName = name || '';
  const index = safeName.length % colors.length;
  return colors[index];
};

export function capitalizeInput(value: string, mode: 'off' | 'sentences' | 'words' | 'characters'): string {
  if (mode === 'off') return value;
  if (mode === 'characters') return value.toUpperCase();
  if (mode === 'words') return value.replace(/\b\w/g, c => c.toUpperCase());
  if (mode === 'sentences') return value.replace(/(^|[.!?]\s+)([a-z])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  return value;
};

export const formatLocalDate = (date: string): string => {
  const parsedDate = new Date(date);
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return (
    parsedDate.getFullYear() +
    '-' +
    pad(parsedDate.getMonth() + 1) +
    '-' +
    pad(parsedDate.getDate()) +
    'T' +
    pad(parsedDate.getHours()) +
    ':' +
    pad(parsedDate.getMinutes()) +
    ':' +
    pad(parsedDate.getSeconds()) +
    '.000Z'
  );
};

export const getFYyear = (fy: string): string => {
  return `FY: ${fy.slice(0, 4)} - ${parseInt(fy.slice(0, 4), 10) + 1}`;
}

/**
 * Converts a month number (1–12) to the full month name.
 * @param month - number (1 = January, 12 = December)
 * @returns Month name string (e.g., "January") or "" if invalid
 */
export function getMonthName(month: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (month < 1 || month > 12) return "";
  return months[month - 1];
}

/**
 * Round off the number to n number of digits.
 * @param num = number (e.g., 433.4343343)
 * @returns digits number (e.g., 2, 3) or 2 if not provided
 */
export function roundToDigits({ num, digits = 2 }: { num: number, digits?: number }): number {
  if (digits === undefined || digits === null || isNaN(Number(digits))) {
    digits = 2;
  }
  // Rounds a number to a specified number of decimal places.
  const res = Number(num.toFixed(digits));
  return res;
}

type VoucherType = "Sales" | "Purchase" | "Payment" | "Receipt";

interface AccountingEntry {
  vouchar_id: string;
  ledger: string;
  ledger_id: string;
  amount: number;
  order_index: number;
}

interface GenerateAccountingParams {
  type: VoucherType;
  party: { name: string; id: string };      // Customer or Supplier
  counter: { name: string; id: string };    // Sales/Purchases/Cash/Bank
  amount: number;                           // Grand total
}

export function generateAccounting({
  type,
  party,
  counter,
  amount,
}: GenerateAccountingParams): AccountingEntry[] {
  let partyAmount = 0;
  let counterAmount = 0;

  switch (type) {
    case "Payment":
      partyAmount = +amount;
      counterAmount = -amount;
      break;

    case "Receipt":
      partyAmount = -amount;
      counterAmount = +amount;
      break;

    case 'Sales':
      partyAmount = +amount;
      counterAmount = -amount;
      break;

    case 'Purchase':
      partyAmount = -amount;
      counterAmount = +amount;
      break;
  }

  return [
    {
      vouchar_id: "",
      ledger: party.name,
      ledger_id: party.id,
      amount: partyAmount,
      order_index: 0,
    },
    {
      vouchar_id: "",
      ledger: counter.name,
      ledger_id: counter.id,
      amount: counterAmount,
      order_index: 1,
    },
  ];
}

export const createMainListItems = (role: string, tax_enable: boolean): MenuItem[] => {
  const adminItems: MenuItem[] = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'admin' },
    // { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'admin' },
    // { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'admin' },
    // { text: "Stockists", path: "/stockists", icon: <StockistIcon />, requiredRole: 'admin' },
    // { text: "Chemists", path: "/chemists", icon: <ChemistIcon />, requiredRole: 'admin' },
  ];


  const userItems: MenuItem[] = tax_enable ? [
    { text: "WareHouse", path: "/warehouses", icon: <InventoryIcon />, requiredRole: 'user' },
    { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'user' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'user' },
    { text: "Customers", path: "/customers", icon: <People />, requiredRole: 'user' },
    { text: "Accounts", path: "/accounts", icon: <People />, requiredRole: 'user' },
    { text: "Invoices", path: "/invoices", icon: <ReceiptOutlined />, requiredRole: 'user' },
    { text: "Expenses", path: "/expenses", icon: <WalletOutlined />, requiredRole: 'user' },
    { text: "Transactions", path: "/transactions", icon: <PaymentsOutlined />, requiredRole: 'user' },
    { text: "Reports", path: "/reports", icon: <Assessment />, requiredRole: 'user' },
    { text: "Summary", path: "/summary", icon: <Assessment />, requiredRole: 'user' }
  ] :
    [{ text: "WareHouse", path: "/warehouses", icon: <InventoryIcon />, requiredRole: 'user' },
    { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'user' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'user' },
    { text: "Customers", path: "/customers", icon: <People />, requiredRole: 'user' },
    { text: "Accounts", path: "/accounts", icon: <People />, requiredRole: 'user' },
    { text: "Invoices", path: "/invoices", icon: <ReceiptOutlined />, requiredRole: 'user' },
    { text: "Expenses", path: "/expenses", icon: <WalletOutlined />, requiredRole: 'user' },
    { text: "Transactions", path: "/transactions", icon: <PaymentsOutlined />, requiredRole: 'user' },
    { text: "Reports", path: "/reports", icon: <Assessment />, requiredRole: 'user' }];

  if (role === ROLE_ENUM.USER)
    return userItems;
  else if (role === ROLE_ENUM.ADMIN)
    return adminItems;
  else {
    return [];
  }
};

export const secondaryListItems: MenuItem[] = [
  // { text: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
  { text: "Profile", path: "/profile", icon: <Person2 /> },
  { text: "About", path: "/about", icon: <InfoRoundedIcon /> },
];