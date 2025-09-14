import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { StockMovement, InventoryItem } from "@/utils/types";
import { getInventoryItems, getInventoryStats, getStockMovement } from "@/services/inventory";

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
  timelinePageMeta: TimeLinePageMeta;
  InventoryItems: Array<InventoryItem> | null;
  inventoryPageMeta: {
    page: number;
    limit: number;
    total: number;
    unique_categories: string[];
    unique_groups: string[];
  };
  statsData: {
    sale_value: number;
    purchase_value: number;
    positive_stock: number;
    negative_stock: number;
    zero_stock: number;
    low_stock: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  authState: AuthStates.INITIALIZING,
  stockMovement: [],
  InventoryItems: [],
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
  statsData: {
    sale_value: 0,
    purchase_value: 0,
    positive_stock: 0,
    negative_stock: 0,
    zero_stock: 0,
    low_stock: 0
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
