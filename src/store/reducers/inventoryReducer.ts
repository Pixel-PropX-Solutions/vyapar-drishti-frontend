import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { PageMeta, StockMovement, InventoryItem } from "@/utils/types";
import { getInventoryStockItems, getStockMovement } from "@/services/inventory";

interface InventoryState {
  authState: AuthStates;
  stockMovement: Array<StockMovement> | null;
  InventoryItems: Array<InventoryItem> | null;
  pageMeta: PageMeta;
  inventoryPageMeta: {
    page: number;
    limit: number;
    total: number;
    sale_value: number;
    purchase_value: number;
    positive_stock: number;
    negative_stock: number;
    low_stock: number;
    unique: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  authState: AuthStates.INITIALIZING,
  stockMovement: [],
  InventoryItems: [],
  pageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    unique: [],
    purchase_value: 0,
    sale_value: 0,
    positive_stock: 0,
    low_stock: 0,
  },
  inventoryPageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    sale_value: 0,
    purchase_value: 0,
    positive_stock: 0,
    negative_stock: 0,
    low_stock: 0,
    unique:[]
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
          state.pageMeta = action.payload.pageMeta;
          state.loading = false;
        }
      )
      .addCase(getStockMovement.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getInventoryStockItems.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getInventoryStockItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.InventoryItems = action.payload.InventoryItems;
          state.inventoryPageMeta = action.payload.inventoryPageMeta;
          state.loading = false;
        }
      )
      .addCase(getInventoryStockItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// export const {  } = inventorySlice.actions;
export default inventorySlice.reducer;
