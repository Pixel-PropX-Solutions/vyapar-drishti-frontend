import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUser,
} from "@/services/user";
import { CreateUser, PageMeta } from "@/utils/types";

interface UserState {
  id: string;
  // authState: AuthStates;
  accessToken: string | null;
  createdUser: CreateUser | null;
  loading: boolean;
  pageMeta: PageMeta;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  accessToken: localStorage.getItem("accessToken")
    ? (localStorage.getItem("accessToken") as string)
    : null,
  // authState: AuthStates.INITIALIZING,
  createdUser: null,
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
      // create user chemist/stockist
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

    // // create stockist
    // .addCase(createStockist.pending, (state) => {
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(
    //   createStockist.fulfilled,
    //   (state, action: PayloadAction<any>) => {
    //     state.stockistData = action.payload.stockistData;
    //     state.loading = false;
    //   }
    // )
    // .addCase(createStockist.rejected, (state, action) => {
    //   state.error = action.payload as string;
    //   state.loading = false;
    // })
    // // update stockist
    // .addCase(updateStockist.pending, (state) => {
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(updateStockist.fulfilled, (state) => {
    //   // state.stockistData = action.payload.stockistData;
    //   state.loading = false;
    // })
    // .addCase(updateStockist.rejected, (state, action) => {
    //   state.error = action.payload as string;
    //   state.loading = false;
    // })

    // // create chemist
    // .addCase(createChemist.pending, (state) => {
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(createChemist.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.chemistData = action.payload.chemistData;
    //   state.loading = false;
    // })
    // .addCase(createChemist.rejected, (state, action) => {
    //   state.error = action.payload as string;
    //   state.loading = false;
    // })


    // // update chemist
    // .addCase(updateChemist.pending, (state) => {
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(updateChemist.fulfilled, (state) => {
    //   // state.chemistData = action.payload.chemistData;
    //   state.loading = false;
    // })
    // .addCase(updateChemist.rejected, (state, action) => {
    //   state.error = action.payload as string;
    //   state.loading = false;
    // });
  },
});

export const { setId } = userSlice.actions;
export default userSlice.reducer;
