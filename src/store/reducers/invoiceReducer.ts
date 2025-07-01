import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { GetAllVouchars, GetInvoiceData, PageMeta } from "@/utils/types";
import { updateInvoice, viewAllInvoices, viewInvoice } from "@/services/invoice";

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    invoiceData: GetInvoiceData | null;
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoices: [],
    invoiceData: null,
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
            })

            .addCase(viewInvoice.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewInvoice.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.invoiceData = action.payload.invoiceData;
                    state.loading = false;
                }
            )
            .addCase(viewInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(updateInvoice.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateInvoice.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    },
});

// export const { setInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
