import { updateCustomer, getCustomer, createCustomer, deleteCustomer, restoreCustomer, viewAllCustomer, viewAllCustomers } from "@/services/customers";
import { PageMeta, GetUserLedgers, CustomersList } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
    customers: Array<GetUserLedgers>;
    customer: GetUserLedgers | null;
    editingCustomer: GetUserLedgers | null;
    customerType_id: string | null;
    customersList: Array<CustomersList> | [];
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: CustomerState = {
    customers: [],
    customersList: [],
    customer: null,
    editingCustomer: null,
    customerType_id: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const customerSlice = createSlice({
    name: "customersLedger",
    initialState,
    reducers: {
        setEditingCustomer: (state, action: PayloadAction<GetUserLedgers | null>) => {
            state.editingCustomer = action.payload;
        },
        setCustomerTypeId: (state, action: PayloadAction<string | null>) => {
            state.customerType_id = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(createCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCustomer.fulfilled, (state, action: PayloadAction<any>) => {
                state.customers = action.payload.customers;
                state.pageMeta = action.payload.pageMeta;
                state.loading = false;
            })
            .addCase(viewAllCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewAllCustomers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCustomers.fulfilled, (state, action: PayloadAction<any>) => {
                state.customersList = action.payload.customersList;
                state.loading = false;
            })
            .addCase(viewAllCustomers.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(getCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getCustomer.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.customer = action.payload.customer;
                    state.loading = false;
                }
            )
            .addCase(getCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(updateCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(deleteCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(restoreCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(restoreCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export const { setEditingCustomer, setCustomerTypeId } = customerSlice.actions;

export default customerSlice.reducer;