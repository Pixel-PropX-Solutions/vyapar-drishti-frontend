import adminApi from "@/api/adminApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserAnalytics = createAsyncThunk(
    "get/user/analytics",
    async ({ month, year }: { month: string, year: string }, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/get/analytics?month=${month}&year=${year}`);
            // console.log("getUserAnalytics response", response);

            if (response.data.success === true) {
                const userAnalyticsData = response.data.data;
                return { userAnalyticsData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const getAdminAnalytics = createAsyncThunk(
    "get/admin/analytics",
    async ({ month, year }: { month: string, year: string }, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/get/analytics/admin?month=${month}&year=${year}`);
            // console.log("getAdminAnalytics response", response);

            if (response.data.success === true) {
                const adminAnalyticsData = response.data.data;
                return { adminAnalyticsData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);
