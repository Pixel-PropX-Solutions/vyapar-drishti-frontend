import { viewAllAccountingGroups, viewAllCustomerGroups, viewDefaultAccountingGroup } from "@/services/accountingGroup";
import { PageMeta, GetAllUserGroups, GetAllAccountingGroups, DefaultAccountingGroup } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    accountingGroups: Array<GetAllUserGroups> | [];
    customerGroups: Array<GetAllAccountingGroups>;
    defaultAccountingGroup: Array<DefaultAccountingGroup> | [];
    
    loading: boolean,
    error: string | null;
    accountingGroupPageMeta: PageMeta
}

const initialState: GroupState = {
    accountingGroups: [],
    customerGroups: [],
    defaultAccountingGroup: [],
    accountingGroupPageMeta: {
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

    }
});

export default groupSlice.reducer;