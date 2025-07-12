import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { PageMeta, GetProduct, ProductCreate, UploadData, CategoryLists, GetCategory } from "@/utils/types";
import { deleteCategory, updateCategory, createCategory, viewAllCategories, viewAllCategory, viewCategory } from "@/services/category";

interface CategoryState {
    authState: AuthStates;
    productData: ProductCreate | null;
    uploadData: UploadData | null;
    categories: Array<GetCategory> | [];
    categoryLists: Array<CategoryLists> | null;
    productsData: Array<GetProduct> | null;
    loading: boolean;
    deletionModal: boolean;
    productId: string;
    pageMeta: PageMeta;

    error: string | null;
}

const initialState: CategoryState = {
    authState: AuthStates.INITIALIZING,
    productsData: [],
    categoryLists: [],
    categories: [],
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

const categorySlice = createSlice({
    name: "category",
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
            .addCase(createCategory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewCategory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.productData = action.payload.productData;
                state.loading = false;
            })
            .addCase(viewCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewAllCategories.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCategories.fulfilled, (state, action: PayloadAction<any>) => {
                state.categoryLists = action.payload.categoryLists;
                state.loading = false;
            })
            .addCase(viewAllCategories.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllCategory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewAllCategory.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.categories = action.payload.categories;
                    state.pageMeta = action.payload.pageMeta;
                    state.loading = false;
                }
            )
            .addCase(viewAllCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(updateCategory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateCategory.fulfilled, (state, _action: PayloadAction<any>) => {
                state.loading = false;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(deleteCategory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, _action: PayloadAction<any>) => {
                state.loading = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { setProductId, setProductDataNull } = categorySlice.actions;
export default categorySlice.reducer;
