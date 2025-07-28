import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUser,
  updateUserSettings,
} from "@/services/user";
import { PageMeta } from "@/utils/types";
import { setCurrentCompany } from "@/services/user";

interface UserState {
  id: string;
  accessToken: string | null;
  loading: boolean;
  pageMeta: PageMeta;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  accessToken: localStorage.getItem("accessToken")
    ? (localStorage.getItem("accessToken") as string)
    : null,
  pageMeta: {
    page: 0,
    limit: 0,
    total: 0,
    unique: [],
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId(state) {
      state.id = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // create user 
      .addCase(createUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.id = action.payload.id;
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(setCurrentCompany.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setCurrentCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setCurrentCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      
      .addCase(updateUserSettings.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateUserSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })




  },
});

export const { setId } = userSlice.actions;
export default userSlice.reducer;
