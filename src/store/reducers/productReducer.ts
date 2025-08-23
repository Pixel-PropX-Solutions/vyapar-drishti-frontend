import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import {
  deleteProduct,
  updateProduct,
  createProduct,
  viewAllProducts,
  viewProduct,
  getProduct,
  viewAllStockItems,
  getProductTimeline,
} from "@/services/products";
import { PageMeta, GetProduct, ProductCreate, UploadData, ProductUpdate, GetStockItem } from "@/utils/types";

interface ProductState {
  authState: AuthStates;
  productData: ProductCreate | null;
  product: ProductUpdate | null;
  item: any | null;
  timeline: any | null;
  uploadData: UploadData | null;
  productsData: Array<GetProduct> | null;
  stockItems: Array<GetStockItem> | null;
  loading: boolean;
  deletionModal: boolean;
  productId: string;
  pageMeta: PageMeta;
  stockItemsMeta: {
    page: number;
    limit: number;
    total: number;
    unique_groups: Array<string>;
    unique_categories: Array<string>;
  },
  error: string | null;
}

const initialState: ProductState = {
  authState: AuthStates.INITIALIZING,
  productsData: [],
  stockItems: [],
  // productsListing: [],
  productData: null,
  product: null,
  item: null,
  timeline: null,
  uploadData: null,
  loading: false,
  deletionModal: false,
  productId: "",
  pageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    unique: [],
  },
  stockItemsMeta: {
    page: 0,
    limit: 0,
    total: 0,
    unique_groups: [],
    unique_categories: [],
  },
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductId(state, action: PayloadAction<any>) {
      state.productId = action.payload.productId;
      state.deletionModal = !state.deletionModal;
    },
    setProductDataNull(state) {
      state.productData = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(viewProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(viewProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.product = action.payload.product;
        state.loading = false;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.item = action.payload.item;
        state.loading = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      
      .addCase(getProductTimeline.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProductTimeline.fulfilled, (state, action: PayloadAction<any>) => {
        state.timeline = action.payload.timeline;
        state.loading = false;
      })
      .addCase(getProductTimeline.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })


      .addCase(viewAllProducts.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        viewAllProducts.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.productsData = action.payload.productsData;
          state.pageMeta = action.payload.pageMeta;
          state.loading = false;
        }
      )
      .addCase(viewAllProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(viewAllStockItems.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        viewAllStockItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.stockItems = action.payload.stockItems;
          state.stockItemsMeta = action.payload.stockItemsMeta;
          state.loading = false;
        }
      )
      .addCase(viewAllStockItems.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setProductId, setProductDataNull } = productSlice.actions;
export default productSlice.reducer;
