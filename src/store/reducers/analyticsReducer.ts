import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { viewAnalyticsData, viewDailyData, viewMonthlyData } from "@/services/analytics";
import { DailyData, MonthlyData, StatsData } from "@/utils/types";

interface AnalyticsState {
    authState: AuthStates;
    loading: boolean;
    error: string | null;
    monthlyData: MonthlyData | null;
    dailyData: DailyData | null;
    statsData: StatsData;
}

const initialState: AnalyticsState = {
    authState: AuthStates.INITIALIZING,
    loading: false,
    error: null,
    monthlyData: null,
    dailyData: null,
    statsData: {
        opening: 0,
        purchase: 0,
        sales: 0,
        current: 0,
        profit: 0,
        profit_percent: 0,
    },

};

const invoiceSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

            .addCase(viewAnalyticsData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewAnalyticsData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.statsData = action.payload.statsData;
                    state.loading = false;
                }
            )
            .addCase(viewAnalyticsData.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewMonthlyData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewMonthlyData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.monthlyData = action.payload.monthlyData;
                    state.loading = false;
                }
            )
            .addCase(viewMonthlyData.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(viewDailyData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewDailyData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.dailyData = action.payload.dailyData;
                    state.loading = false;
                }
            )
            .addCase(viewDailyData.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    },
});

// export const { } = invoiceSlice.actions;
export default invoiceSlice.reducer;
