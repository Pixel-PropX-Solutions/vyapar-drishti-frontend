import { updateBilling, getBilling, createBilling, deleteBilling, restoreBilling, viewAllBillings } from "@/services/billing";
import { PageMeta, GetAllBilling } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BillingState {
    billings: Array<GetAllBilling>;
    billing: GetAllBilling | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: BillingState = {
    billings: [],
    billing: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder

            .addCase(createBilling.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createBilling.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createBilling.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllBillings.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllBillings.fulfilled, (state, action: PayloadAction<any>) => {
                state.billings = action.payload.billings;
                // state.pageMeta = action.payload.pageMeta;
                state.loading = false;
            })
            .addCase(viewAllBillings.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(getBilling.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getBilling.fulfilled,
                (state, action: PayloadAction<GetAllBilling>) => {
                    state.billing = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getBilling.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(updateBilling.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateBilling.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateBilling.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(deleteBilling.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteBilling.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteBilling.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(restoreBilling.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(restoreBilling.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreBilling.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export default billingSlice.reducer;