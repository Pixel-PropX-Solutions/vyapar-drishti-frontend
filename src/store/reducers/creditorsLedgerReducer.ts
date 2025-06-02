import { updateCreditor, getCreditor, createCreditor, deleteCreditor, restoreCreditor, viewAllCreditors } from "@/services/creditorsledger";
import { PageMeta, GetUserLedgers } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreditorState {
    creditors: Array<GetUserLedgers>;
    creditor: GetUserLedgers | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: CreditorState = {
    creditors: [],
    creditor: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const creditorSlice = createSlice({
    name: "creditorsLedger",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder

            .addCase(createCreditor.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCreditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCreditor.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllCreditors.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCreditors.fulfilled, (state, action: PayloadAction<any>) => {
                state.creditors = action.payload.creditors;
                state.pageMeta = action.payload.pageMeta;
                state.loading = false;
            })
            .addCase(viewAllCreditors.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(getCreditor.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getCreditor.fulfilled,
                (state, action: PayloadAction<GetUserLedgers>) => {
                    state.creditor = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getCreditor.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(updateCreditor.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateCreditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCreditor.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(deleteCreditor.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteCreditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteCreditor.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(restoreCreditor.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(restoreCreditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreCreditor.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
    }
});

export default creditorSlice.reducer;