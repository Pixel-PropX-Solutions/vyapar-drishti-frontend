import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { InvoiceData, PageMeta } from "@/utils/types";
import { uploadBill } from "@/services/invoice";

interface InvoiceState {
    authState: AuthStates;
    invoiceData: InvoiceData | null;
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoiceData: {} as InvoiceData,
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
        setInvoiceData: (state, action: PayloadAction<InvoiceData>) => {
            state.invoiceData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(uploadBill.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                uploadBill.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.invoiceData = action.payload.invoiceData;
                    state.pageMeta = action.payload.pageMeta;
                    state.loading = false;
                }
            )
            .addCase(uploadBill.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { setInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
