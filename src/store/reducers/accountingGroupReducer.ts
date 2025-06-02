import { getAllInvoiceGroups, viewAllAccountingGroups, viewAllCustomerGroups, viewAllInvoiceGroups, viewDefaultAccountingGroup } from "@/services/accountingGroup";
import { PageMeta, GetAllUserGroups, GetAllAccountingGroups, GetAllInvoiceGroups, DefaultAccountingGroup } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    accountingGroups: Array<GetAllUserGroups> | [];
    invoiceGroupList: Array<{
        _id: string;
        name: string;
    }>;
    customerGroups: Array<GetAllAccountingGroups>;
    defaultAccountingGroup: Array<DefaultAccountingGroup> | [];
    invoiceGroups: Array<GetAllInvoiceGroups>;
    loading: boolean,
    error: string | null;
    accountingGroupPageMeta: PageMeta
    invoiceGroupPageMeta: PageMeta
}

const initialState: GroupState = {
    accountingGroups: [],
    customerGroups: [],
    defaultAccountingGroup: [],
    invoiceGroups: [],
    invoiceGroupList: [],
    accountingGroupPageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    invoiceGroupPageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const groupSlice = createSlice({
    name: "accountingGroup",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder

            .addCase(viewAllCustomerGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCustomerGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.customerGroups = action.payload.customerGroups;
                state.accountingGroupPageMeta = action.payload.accountingGroupPageMeta;
                state.loading = false;
            })
            .addCase(viewAllCustomerGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewAllAccountingGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllAccountingGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.accountingGroups = action.payload.accountingGroups;
                state.loading = false;
            })
            .addCase(viewAllAccountingGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewAllInvoiceGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllInvoiceGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.invoiceGroups = action.payload.invoiceGroups;
                state.invoiceGroupPageMeta = action.payload.invoiceGroupPageMeta;
                state.loading = false;
            })
            .addCase(viewAllInvoiceGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewDefaultAccountingGroup.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewDefaultAccountingGroup.fulfilled, (state, action: PayloadAction<any>) => {
                state.defaultAccountingGroup = action.payload.defaultAccountingGroup;
                state.loading = false;
            })
            .addCase(viewDefaultAccountingGroup.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getAllInvoiceGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAllInvoiceGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.invoiceGroupList = action.payload.invoiceGroupList;
                state.loading = false;
            })
            .addCase(getAllInvoiceGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    }
});

export default groupSlice.reducer;