import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewAllCustomer = createAsyncThunk(
    "view/all/ledger",
    async (
        {
            searchQuery,
            company_id,
            filterState,
            pageNumber,
            type,
            is_deleted,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            filterState: string;
            company_id: string;
            sortField: string;
            type: string;
            is_deleted: boolean;
            pageNumber: number;
            limit: number;
            sortOrder: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/ledger/view/all?${company_id !== "" ? 'company_id=' + company_id : ''}${searchQuery !== "" ? '&search=' + searchQuery : ''}${type === "" || type === "All" ? "" : '&parent=' + type}&is_deleted=${is_deleted}&state=${filterState === 'All-States' ? "" : filterState}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            console.log("View All Customer API Response", response.data);

            if (response.data.success === true) {
                const customers = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { customers, pageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllCustomerWithType = createAsyncThunk(
    "view/all/ledger/with/type",
    async (
        {
            company_id,
            customerType,
        }: {
            company_id: string;
            customerType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/ledger/view/ledgers/with/type?company_id=${company_id}&type=${customerType}`
            );


            if (response.data.success === true) {
                const ledgersWithType = response.data.data;
                return ledgersWithType;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllCustomerWithTypes = createAsyncThunk(
    "view/all/ledger/with/types",
    async (
        {
            company_id,
            customerTypes,
        }: {
            company_id: string;
            customerTypes: Array<string>;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.post(
                `/ledger/view/ledgers/transaction/type?company_id=${company_id}`,
                customerTypes
            );

            console.log("View All Customer With Types Response", response);


            if (response.data.success === true) {
                const customerTypes = response.data.data;
                return {customerTypes};
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllCustomers = createAsyncThunk(
    "view/all/ledger/list",
    async (
        company_id: string,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `ledger/view/all/ledgers?company_id=${company_id}`
            );

            if (response.data.success === true) {
                const customersList = response.data.data;
                return { customersList };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const createCustomer = createAsyncThunk(
    "create/customer",
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await userApi.post(
                `/ledger/create`,
                data
            );
            console.log("Create Customer API Response", response);

            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            console.log("Error in createCustomer:", error);
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "update/customer",
    async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
        try {

            const response = await userApi.put(
                `/ledger/update/${id}`,
                data
            );


            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const getCustomer = createAsyncThunk(
    "get/customer",
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/ledger/view/${customer_id}`);

            console.log("Get Customer API Response", response);

            if (response.data.success === true) {
                const customer = response.data.data[0];
                return { customer };
            }
            else
                return rejectWithValue("Failed to fetch Customer profile");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getCustomerInvoices = createAsyncThunk(
    "get/customer/invoices",
    async ({
        searchQuery,
        company_id,
        customer_id,
        pageNumber,
        type,
        limit,
        sortField,
        sortOrder,
        start_date,
        end_date,
    }: {
        searchQuery: string;
        customer_id: string;
        company_id: string;
        sortField: string;
        type: string;
        pageNumber: number;
        limit: number;
        sortOrder: string;
        start_date: string;
        end_date: string;
    }, { rejectWithValue }) => {
        try {
            const response = await userApi.get(
                `/ledger/view/invoices/${customer_id}?${company_id !== "" ? 'company_id=' + company_id : ''}${searchQuery !== "" ? '&search=' + searchQuery : ''}${type !== "all" ? '&type=' + type : ''}&start_date=${start_date}&end_date=${end_date}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            console.log("Get Customer Invoices API Response", response);

            if (response.data.success === true) {
                const customerInvoices = response.data.data.docs;
                const customerInvoicesMeta = response.data.data.meta;
                return { customerInvoices, customerInvoicesMeta };
            }
            else
                return rejectWithValue("Failed to fetch Customer profile");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    "delete/customer",
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`/ledger/delete/${customer_id}`);

            if (response.data.success === true) {
                return;
            }
            else
                return rejectWithValue("Failed to delete Customer profile");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
