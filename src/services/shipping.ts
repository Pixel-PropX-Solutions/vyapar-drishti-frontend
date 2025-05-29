import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewAllShippings = createAsyncThunk(
    "view/all/shipping",
    async (
        _,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get("user/get/all/shipping");

            // console.log("viewAllShipping response", response);

            if (response.data.success === true) {
                const shippings = response.data.data;
                // const pageMeta = response.data.data.meta;
                return { shippings };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const getShipping = createAsyncThunk(
    "get/shipping",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`user/get/shipping/${billing_id}`);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else
                return rejectWithValue("Failed to fetch Shipping profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const deleteShipping = createAsyncThunk(
    "delete/shipping",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`user/delete/shipping/${billing_id}`);

            if (response.data.success === true) {
                return;
            }
            else
                return rejectWithValue("Failed to delete Shipping profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const restoreShipping = createAsyncThunk(
    "restore/shipping",
    async (billing_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.put(`user/restore/shipping/${billing_id}`);

            if (response.data.success === true) {
                return;
            }
            else
                return rejectWithValue("Failed to delete Shipping profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const createShipping = createAsyncThunk(
    "create/shipping",
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await userApi.post(
                `user/create/shipping`,
                data
            );
            // console.log("createShipping response", response);

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

export const updateShipping = createAsyncThunk(
    "update/shipping",
    async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
        try {
            const response = await userApi.put(
                `user/update/shipping/${id}`,
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