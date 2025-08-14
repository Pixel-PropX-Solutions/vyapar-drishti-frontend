import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getEntityName,
  updateUserSettings,
} from "@/services/user";
import { PageMeta } from "@/utils/types";
// import { setCurrentCompany } from "@/services/user";

interface UserState {
  name: string;
  accessToken: string | null;
  loading: boolean;
  pageMeta: PageMeta;
  error: string | null;
}

const initialState: UserState = {
  name: "",
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
  },
  extraReducers: (builder) => {
    builder
      // create user 
      .addCase(getEntityName.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getEntityName.fulfilled, (state, action: PayloadAction<any>) => {
        state.name = action.payload.name;
        state.loading = false;
      })
      .addCase(getEntityName.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // .addCase(setCurrentCompany.pending, (state) => {
      //   state.error = null;
      //   state.loading = true;
      // })
      // .addCase(setCurrentCompany.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(setCurrentCompany.rejected, (state, action) => {
      //   state.error = action.payload as string;
      //   state.loading = false;
      // })
      
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

// export const {  } = userSlice.actions;
export default userSlice.reducer;
