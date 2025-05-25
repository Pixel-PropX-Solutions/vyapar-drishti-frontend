import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import {
  deleteProduct,
  sellProduct,
  updateProduct,
  createProduct,
  viewAllCategories,
  viewAllProducts,
  viewProduct,
  viewProductsWithId,
} from "@/services/products";
import { PageMeta, GetProduct, ProductCreate, ProductListing, UploadData } from "@/utils/types";

interface ProductState {
  authState: AuthStates;
  productData: ProductCreate | null;
  uploadData: UploadData | null;
  categories: Array<string> | null;
  productsListing: Array<ProductListing> | null;
  productsData: Array<GetProduct> | null;
  loading: boolean;
  deletionModal: boolean;
  productId: string;
  pageMeta: PageMeta;

  error: string | null;
}

const initialState: ProductState = {
  authState: AuthStates.INITIALIZING,
  productsData: [],
  productsListing: [],
  categories: null,
  productData: null,
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
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductId(state, action: PayloadAction<any>) {
      console.log("payload", action.payload);
      state.productId = action.payload.productId;
      state.deletionModal = !state.deletionModal;
    },
    setProductDataNull(state) {
      state.productData = null
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(createProduct.pending, (state) => {
      //   state.error = null;
      //   state.loading = true;
      // })
      // .addCase(createProduct.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(createProduct.rejected, (state, action) => {
      //   state.error = action.payload as string;
      //   state.loading = false;
      // })

      // .addCase(uploadImage.pending, (state) => {
      //   state.error = null;
      //   state.loading = true;
      // })
      // .addCase(uploadImage.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(uploadImage.rejected, (state, action) => {
      //   state.error = action.payload as string;
      //   state.loading = false;
      // })

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

      .addCase(sellProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(sellProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sellProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(viewProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(viewProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.productData = action.payload.productData;
        state.loading = false;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(viewProductsWithId.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(viewProductsWithId.fulfilled, (state, action: PayloadAction<any>) => {
        state.productsListing = action.payload.productsListing;
        state.loading = false;
      })
      .addCase(viewProductsWithId.rejected, (state, action) => {
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

      .addCase(viewAllCategories.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        viewAllCategories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.categories = action.payload.categories;
          state.loading = false;
        }
      )
      .addCase(viewAllCategories.rejected, (state, action) => {
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
