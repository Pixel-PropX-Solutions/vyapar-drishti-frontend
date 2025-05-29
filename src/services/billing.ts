import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewAllBillings = createAsyncThunk(
    "view/all/billing",
    async (
        _,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("user/get/all/billing");

            console.log("viewAllBillings response", response);

            if (response.data.success === true) {
                const billings = response.data.data;
                // const pageMeta = response.data.data.meta;
                return { billings };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const getBilling = createAsyncThunk(
    "get/billing",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`user/get/billing/${billing_id}`);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else
                return rejectWithValue("Failed to fetch Billing profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const deleteBilling = createAsyncThunk(
    "delete/billing",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`user/delete/billing/${billing_id}`);

            if (response.data.success === true) {
                return;
            }
            else
                return rejectWithValue("Failed to delete Billing profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const restoreBilling = createAsyncThunk(
    "restore/billing",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.put(`user/restore/billing/${billing_id}`);

            if (response.data.success === true) {
                return;
            }
            else
                return rejectWithValue("Failed to delete Billing profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const createBilling = createAsyncThunk(
    "create/billing",
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await userApi.post(
                `user/create/billing`,
                data
            );
            console.log("createBilling response", response);

            if (response.data.success === true) {
                return response.data.data;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const updateBilling = createAsyncThunk(
    "update/billing",
    async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
        try {
            console.log("updateChemist data", data);
            const response = await userApi.put(
                `user/update/billing/${id}`,
                data
            );
            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);