import { getAllGroups } from "@/services/group";
import { PageMeta, GetAllUserGroups } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    groups: Array<GetAllUserGroups>;
    // group: GetUserLedgers | null;
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: GroupState = {
    groups: [],
    // group: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null
}

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder

            .addCase(getAllGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAllGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.groups = action.payload;
                state.loading = false;
            })
            .addCase(getAllGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    }
});

export default groupSlice.reducer;