import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { GetAllVouchars, PageMeta } from "@/utils/types";
import {  viewAllInvoices } from "@/services/invoice";

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoices: [],
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null,
};

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        // setInvoiceData: (state, action: PayloadAction<InvoiceData>) => {
        //     state.invoiceData = action.payload;
        // }
    },
    extraReducers: (builder) => {
        builder

            .addCase(viewAllInvoices.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewAllInvoices.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.invoices = action.payload.invoices;
                    state.pageMeta = action.payload.pageMeta;
                    state.loading = false;
                }
            )
            .addCase(viewAllInvoices.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

// export const { setInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
