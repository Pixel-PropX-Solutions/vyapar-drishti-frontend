import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersList } from "@/utils/types";
import { getUsers } from "@/services/admin";

interface AdminState {
    usersList: Array<UsersList> | [];
    pageMeta: {
        page: number;
        limit: number;
        total: number;
    };
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    usersList: [],
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
    },
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getUsers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(
                getUsers.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.usersList = action.payload.usersList;
                    state.pageMeta = action.payload.pageMeta;
                    state.loading = false;
                }
            )
            .addCase(getUsers.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

    },
});

// export const {  } = adminSlice.actions;
export default adminSlice.reducer;
