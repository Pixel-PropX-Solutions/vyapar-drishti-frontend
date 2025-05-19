import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminAnalyticsData, UserAnalyticsData } from "@/utils/types";
import { getAdminAnalytics, getUserAnalytics } from "@/services/analytics";

interface OrderState {
    userAnalyticsData: UserAnalyticsData | null;
    adminAnalyticsData: AdminAnalyticsData | null;
    loading: boolean;
    orderId: string;
    error: string | null;
}

const initialState: OrderState = {
    userAnalyticsData: null,
    adminAnalyticsData: null,
    loading: false,
    orderId: "",
    error: null,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserAnalytics.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getUserAnalytics.fulfilled, (state, action: PayloadAction<any>) => {
                state.userAnalyticsData = action.payload.userAnalyticsData;
                state.loading = false;
            })
            .addCase(getUserAnalytics.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getAdminAnalytics.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAdminAnalytics.fulfilled, (state, action: PayloadAction<any>) => {
                state.adminAnalyticsData = action.payload.adminAnalyticsData;
                state.loading = false;
            })
            .addCase(getAdminAnalytics.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


    },
});

// export const { } = analyticsSlice.actions;
export default analyticsSlice.reducer;
