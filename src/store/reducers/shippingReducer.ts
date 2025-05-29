import { createShipping, deleteShipping, getShipping, restoreShipping, updateShipping, viewAllShippings } from "@/services/shipping";
import { PageMeta, GetAllShipping } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShippingState {
    shippings: Array<GetAllShipping>;
    shipping: GetAllShipping | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: ShippingState = {
    shippings: [],
    shipping: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const shippingSlice = createSlice({
    name: "shipping",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder

            .addCase(createShipping.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createShipping.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createShipping.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllShippings.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllShippings.fulfilled, (state, action: PayloadAction<any>) => {
                state.shippings = action.payload.shippings;
                // state.pageMeta = action.payload.pageMeta;
                state.loading = false;
            })
            .addCase(viewAllShippings.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(getShipping.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getShipping.fulfilled,
                (state, action: PayloadAction<GetAllShipping>) => {
                    state.shipping = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getShipping.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(updateShipping.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateShipping.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateShipping.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(deleteShipping.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteShipping.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteShipping.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(restoreShipping.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(restoreShipping.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreShipping.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export default shippingSlice.reducer;