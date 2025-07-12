import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthStates } from "@/utils/enums";
import { PageMeta, GetProduct, ProductCreate, UploadData, GetInventoryGroups, InventoryGroupList } from "@/utils/types";
import { deleteCategory, updateCategory, createCategory, viewCategory } from "@/services/category";
import { viewAllInventoryGroup, viewAllInventoryGroups } from "@/services/inventoryGroup";

interface InventoryGroupState {
    // authState: AuthStates;
    productData: ProductCreate | null;
    uploadData: UploadData | null;
    inventoryGroups: Array<GetInventoryGroups> | [];
    inventoryGroupLists: Array<InventoryGroupList> | null;
    productsData: Array<GetProduct> | null;
    loading: boolean;
    deletionModal: boolean;
    productId: string;
    inventoryGroupPageMeta: PageMeta;
    error: string | null;
}

const initialState: InventoryGroupState = {
    // authState: AuthStates.INITIALIZING,
    productsData: [],
    inventoryGroupLists: [],
    inventoryGroups: [],
    productData: null,
    uploadData: null,
    loading: false,
    deletionModal: false,
    productId: "",
    inventoryGroupPageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    error: null,
};

const inventoryGroupSlice = createSlice({
    name: "inventoryGroup",
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

            .addCase(viewAllInventoryGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllInventoryGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.inventoryGroupLists = action.payload.inventoryGroupLists;
                state.loading = false;
            })
            .addCase(viewAllInventoryGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllInventoryGroup.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewAllInventoryGroup.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.inventoryGroups = action.payload.inventoryGroups;
                    state.inventoryGroupPageMeta = action.payload.inventoryGroupPageMeta;
                    state.loading = false;
                }
            )
            .addCase(viewAllInventoryGroup.rejected, (state, action) => {
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

export const { setProductId, setProductDataNull } = inventoryGroupSlice.actions;
export default inventoryGroupSlice.reducer;
