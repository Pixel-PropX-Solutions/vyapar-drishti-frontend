import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { Inventory, PageMeta, StockMovement, InventoryItem } from "@/utils/types";
import { getProductStock, getStockMovement, viewInventrory } from "@/services/inventory";

interface InventoryState {
  authState: AuthStates;
  inventoryData: Array<Inventory> | null;
  stockMovement: Array<StockMovement> | null;
  InventoryItems: Array<InventoryItem> | null;
  pageMeta: PageMeta;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  authState: AuthStates.INITIALIZING,
  inventoryData: [],
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
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(viewInventrory.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        viewInventrory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.inventoryData = action.payload.inventoryData;
          state.loading = false;
        }
      )
      .addCase(viewInventrory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

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

      .addCase(getProductStock.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getProductStock.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.InventoryItems = action.payload.InventoryItems;
          state.pageMeta = action.payload.pageMeta;
          state.loading = false;
        }
      )
      .addCase(getProductStock.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// export const {  } = inventorySlice.actions;
export default inventorySlice.reducer;
