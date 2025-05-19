import { createStockist, getStockistProfile, updateStockist, viewAllStockist } from "@/services/stockist";
import { PageMeta, Stockist } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StockistState {
    stockistList: Stockist[];
    stockist: Stockist | null;
    stockistData: Stockist | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: StockistState = {
    stockistList: [],
    stockist: null,
    stockistData: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const stockistSlice = createSlice({
    name: "stockist",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(viewAllStockist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                viewAllStockist.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.stockistList = action.payload.stockistsData;
                    state.pageMeta = action.payload.pageMeta;
                    state.loading = false;
                }
            )
            .addCase(viewAllStockist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            // getStockistProfile
            .addCase(getStockistProfile.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                getStockistProfile.fulfilled,
                (state, action: PayloadAction<Stockist>) => {
                    state.stockist = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getStockistProfile.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            // create stockist
            .addCase(createStockist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                createStockist.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.stockistData = action.payload.stockistData;
                    state.loading = false;
                }
            )
            .addCase(createStockist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            // update stockist
            .addCase(updateStockist.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateStockist.fulfilled, (state) => {
                // state.stockistData = action.payload.stockistData;
                state.loading = false;
            })
            .addCase(updateStockist.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export default stockistSlice.reducer;