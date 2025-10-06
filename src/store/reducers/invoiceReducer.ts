import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { GetAllInvoiceGroups, GetAllVouchars, GetInvoiceData, InvoicesSortField, PageMeta, SortOrder } from "@/utils/types";
import { deleteTAXInvoice, deleteInvoice, updateInvoice, viewAllInvoiceGroups, viewAllInvoices, viewInvoice } from "@/services/invoice";
import { getAllInvoiceGroups } from "@/services/invoice";

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    invoiceData: GetInvoiceData | null;
    editingInvoice: GetInvoiceData | null;
    invoiceType_id: string | null;
    invoiceGroups: Array<{
        _id: string;
        name: string;
    }>;
    viewInvoiceGroups: Array<GetAllInvoiceGroups>;
    invoiceGroupPageMeta: PageMeta
    pageMeta: PageMeta;
    loading: boolean;
    isInvoiceFecthing: boolean;
    error: string | null;
    invoicesFilters: {
        searchQuery: string,
        type: string,
        filterState: string,
        page: number,
        startDate: string,
        endDate: string,
        rowsPerPage: number,
        sortField: InvoicesSortField,
        sortOrder: SortOrder,
    }
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoices: [],
    invoiceData: null,
    editingInvoice: null,
    invoiceType_id: null,
    invoiceGroups: [],
    viewInvoiceGroups: [],
    invoiceGroupPageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    isInvoiceFecthing: false,
    error: null,
    invoicesFilters: {
        searchQuery: "",
        type: "Invoices",
        filterState: "All-States",
        page: 1,
        startDate: (new Date(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
        endDate: (new Date()).toISOString(),
        rowsPerPage: 10,
        sortField: "date",
        sortOrder: "desc" as SortOrder,
    }
};

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        setEditingInvoice: (state, action: PayloadAction<GetInvoiceData | null>) => {
            state.editingInvoice = action.payload;
        },
        setInvoiceTypeId: (state, action: PayloadAction<string | null>) => {
            state.invoiceType_id = action.payload;
        },
        setInvoicesFilters: (state, action: PayloadAction<Partial<InvoiceState['invoicesFilters']>>) => {
            state.invoicesFilters = {
                ...state.invoicesFilters,
                ...action.payload,
            };
        }
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
                state.isInvoiceFecthing = true;
            })
            .addCase(
                viewInvoice.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.invoiceData = action.payload.invoiceData;
                    state.isInvoiceFecthing = false;
                }
            )
            .addCase(viewInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isInvoiceFecthing = false;
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


            .addCase(viewAllInvoiceGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllInvoiceGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.viewInvoiceGroups = action.payload.invoiceGroups;
                state.invoiceGroupPageMeta = action.payload.invoiceGroupPageMeta;
                state.loading = false;
            })
            .addCase(viewAllInvoiceGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getAllInvoiceGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAllInvoiceGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.invoiceGroups = action.payload.invoiceGroups;
                state.loading = false;
            })
            .addCase(getAllInvoiceGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(deleteInvoice.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteInvoice.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(deleteTAXInvoice.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteTAXInvoice.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteTAXInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    },
});

export const { setEditingInvoice, setInvoiceTypeId, setInvoicesFilters } = invoiceSlice.actions;
export default invoiceSlice.reducer;
