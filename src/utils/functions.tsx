import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-pro";
import ProductIcon from "@mui/icons-material/LocalPharmacyOutlined";
import QuantityIcon from "@mui/icons-material/LocalOffer";
import ExpiryIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { OrderStatus, ProductSortField, SortOrder } from "./types";
import { LocalShipping, Cancel, CheckCircle, ReceiptLong } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import userApi from "@/api/api";

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
        <CurrencyRupeeIcon sx={{ fontSize: "1.2rem" }} />
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
  return date.toLocaleDateString("en-IN", {
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

// Status chip color mapping
export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'warning';
    case OrderStatus.SHIPPED:
      return 'success';
    case OrderStatus.CANCELLED:
      return 'error';
    default:
      return 'default';
  }
};

// Status icon mapping
export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <ReceiptLong />;
    case OrderStatus.SHIPPED:
      return <LocalShipping />;
    case OrderStatus.CANCELLED:
      return <Cancel />;
    default:
      return <CheckCircle />;
  }
};
