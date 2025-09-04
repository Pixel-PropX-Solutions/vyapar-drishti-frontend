import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const viewAnalyticsData = createAsyncThunk(
    "view/analytics/data",
    async (
        {
            year,
            company_id,
        }: {
            year: number;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/get/analytics?company_id=${company_id}&financial_year=${year}`
            );

            console.log("View Analytics Data API Response", response);

            if (response.data.success === true) {
                const statsData = response.data.data;
                return { statsData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const viewMonthlyData = createAsyncThunk(
    "view/monthly/data",
    async (
        {
            year,
            company_id,
        }: {
            year: number;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/get/analytics/monthly?company_id=${company_id}&financial_year=${year}`
            );

            console.log("View Monthly Data API Response", response);

            if (response.data.success === true) {
                const monthlyData = response.data.data;
                return { monthlyData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const viewDailyData = createAsyncThunk(
    "view/daily/data",
    async (
        {
            month,
            year,
            company_id,
        }: {
            month: number;
            year: number;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/get/analytics/daily?company_id=${company_id}&financial_month=${month}&financial_year=${year}`
            );

            console.log("View Daily Data API Response", response);

            if (response.data.success === true) {
                const dailyData = response.data.data[0];
                return { dailyData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
