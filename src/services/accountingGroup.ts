import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createAccountingGroup = createAsyncThunk(
    "Create/accounting/group",
    async (
        data: FormData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post(`/user/accounting/create/group`, data);
            if (createRes.data.success === true) {
                return createRes.data.data;
            } else {
                return rejectWithValue("Group creation failed");
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllCustomerGroups = createAsyncThunk(
    "view/all/ledger/groups",
    async (
        {
            searchQuery,
            company_id,
            // filterState,
            pageNumber,
            type,
            is_deleted,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            // filterState: string;
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
                `/user/accounting/view/all?company_id=${company_id}${searchQuery !== "" ? '&search=' + searchQuery : ''}${type === "" || type === "All" ? "" : '&parent=' + type}&is_deleted=${is_deleted}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );


            if (response.data.success === true) {
                const customerGroups = response.data.data.docs;
                const accountingGroupPageMeta = response.data.data.meta;
                return { customerGroups, accountingGroupPageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewDefaultAccountingGroup = createAsyncThunk(
    "view/default/accounting/groups",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/user/view/default/accounting/groups`);

            if (response.data.success === true) {
                const defaultAccountingGroup = response.data.data;
                return { defaultAccountingGroup };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const viewAllAccountingGroups = createAsyncThunk(
    "view/all/accounting/groups",
    async (
        company_id: string,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/accounting/view/all/groups?company_id=${company_id}`
            );

            if (response.data.success === true) {
                const accountingGroups = response.data.data;
                return { accountingGroups };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const updateAccountingGroup = createAsyncThunk(
    "update/accounting/group",
    async (
        { data, id }: { data: FormData; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put(`/user/update/group/${id}`, data);

            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
