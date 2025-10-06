import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { StockMovement, InventoryItem, HSNSummary, PartySummary, BillSummary } from "@/utils/types";
import { getInventoryItems, getInventoryStats, getStockMovement, getHSNSummary, getPartySummary, getSummaryStats, getBillSummary } from "@/services/inventory";

interface TimeLinePageMeta {
  page: number,
  limit: number,
  total: number,
  opening_val: number,
  inwards_val: number,
  outwards_val: number,
  closing_val: number,
  gross_profit: number,
  profit_percent: number
}

interface InventoryState {
  authState: AuthStates;
  stockMovement: Array<StockMovement> | null;
  hsnSummaryData: Array<HSNSummary> | null;
  partySummaryData: Array<PartySummary> | null;
  invoiceSummaryData: Array<BillSummary> | null;
  timelinePageMeta: TimeLinePageMeta;
  InventoryItems: Array<InventoryItem> | null;
  inventoryPageMeta: {
    page: number;
    limit: number;
    total: number;
    unique_categories: string[];
    unique_groups: string[];
  };
  hsnPageMeta: {
    page: number;
    limit: number;
    total: number;
    total_value: number;
    taxable_value: number;
    tax_amount: number;
  };
  partyPageMeta: {
    page: number;
    limit: number;
    total: number;
    total_value: number;
    taxable_value: number;
    tax_amount: number;
  };
  invoicePageMeta: {
    page: number;
    limit: number;
    total: number;
    total_value: number;
    taxable_value: number;
    tax_amount: number;
  };
  statsData: {
    sale_value: number;
    purchase_value: number;
    positive_stock: number;
    negative_stock: number;
    zero_stock: number;
    low_stock: number;
  };
  summaryStats: {
    total_hsn: number;
    total_party: number;
    total_invoices: number;
    total_revenue: number;
    total_tax: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  authState: AuthStates.INITIALIZING,
  stockMovement: [],
  InventoryItems: [],
  hsnSummaryData: [],
  partySummaryData: [],
  invoiceSummaryData: [],
  timelinePageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    opening_val: 0,
    inwards_val: 0,
    outwards_val: 0,
    closing_val: 0,
    gross_profit: 0,
    profit_percent: 0
  },
  inventoryPageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    unique_groups: [],
    unique_categories: [],
  },
  hsnPageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    total_value: 0,
    taxable_value: 0,
    tax_amount: 0,
  },
  partyPageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    total_value: 0,
    taxable_value: 0,
    tax_amount: 0,
  },
  invoicePageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    total_value: 0,
    taxable_value: 0,
    tax_amount: 0,
  },
  statsData: {
    sale_value: 0,
    purchase_value: 0,
    positive_stock: 0,
    negative_stock: 0,
    zero_stock: 0,
    low_stock: 0
  },
  summaryStats: {
    total_hsn: 0,
    total_party: 0,
    total_invoices: 0,
    total_revenue: 0,
    total_tax: 0
  },
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getStockMovement.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getStockMovement.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.stockMovement = action.payload.stockMovement;
          state.timelinePageMeta = action.payload.timelinePageMeta;
          state.loading = false;
        }
      )
      .addCase(getStockMovement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getHSNSummary.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getHSNSummary.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.hsnSummaryData = action.payload.hsnSummaryData;
          state.hsnPageMeta = action.payload.hsnPageMeta;
          state.loading = false;
        }
      )
      .addCase(getHSNSummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getSummaryStats.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getSummaryStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.summaryStats = action.payload.summaryStats;
          state.loading = false;
        }
      )
      .addCase(getSummaryStats.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getPartySummary.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getPartySummary.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.partySummaryData = action.payload.partySummaryData;
          state.partyPageMeta = action.payload.partyPageMeta;
          state.loading = false;
        }
      )
      .addCase(getPartySummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      
      .addCase(getBillSummary.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getBillSummary.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.invoiceSummaryData = action.payload.invoiceSummaryData;
          state.invoicePageMeta = action.payload.invoicePageMeta;
          state.loading = false;
        }
      )
      .addCase(getBillSummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getInventoryItems.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getInventoryItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.InventoryItems = action.payload.InventoryItems;
          state.inventoryPageMeta = action.payload.inventoryPageMeta;
          state.loading = false;
        }
      )
      .addCase(getInventoryItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })


      .addCase(getInventoryStats.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getInventoryStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.statsData = action.payload.statsData;
          state.loading = false;
        }
      )
      .addCase(getInventoryStats.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
  },
});

// export const {  } = inventorySlice.actions;
export default inventorySlice.reducer;
