import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createInventoryGroup = createAsyncThunk(
    "Create/inventory/group",
    async (
        data: FormData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post(`/user/inventory/create/group`, data);
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


export const viewInventoryGroup = createAsyncThunk(
    "view/inventory/group",
    async (group_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/user/inventory/view/group/${group_id}`);

            if (response.data.success === true) {
                const productData = response.data.data;
                return { productData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllInventoryGroup = createAsyncThunk(
    "view/all/inventory/group",
    async (
        {
            searchQuery,
            company_id,
            parent,
            pageNumber,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            company_id: string;
            parent: string;
            sortField: string;
            pageNumber: number;
            limit: number;
            sortOrder: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/inventory/group/view/all?company_id=${company_id}${searchQuery !== "" ? '&search=' + searchQuery : ''}${parent === "" || parent === "All" ? "" : '&parent=' + parent}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            if (response.data.success === true) {
                const inventoryGroups = response.data.data.docs;
                const inventoryGroupPageMeta = response.data.data.meta;
                return { inventoryGroups, inventoryGroupPageMeta };
            } else return rejectWithValue("Internal Server Error.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const viewAllInventoryGroups = createAsyncThunk(
    "view/inventory/groups",
    async (
        company_id: string,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/inventory/view/all/groups?company_id=${company_id}`
            );

            if (response.data.success === true) {
                const inventoryGroupLists = response.data.data;
                return { inventoryGroupLists };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const updateInventoryGroup = createAsyncThunk(
    "update/inventory/group",
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

export const deleteInventoryGroup = createAsyncThunk(
    "delete/inventory/group",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`/user/delete/group/${id}`);

            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
