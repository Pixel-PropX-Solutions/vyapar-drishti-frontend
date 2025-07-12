import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { deleteAccount, getCurrentCompany, getCurrentUser, login, logout, register } from "@/services/auth";
import { GetCompany } from "@/utils/types";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  confirmPassword: string;
}



interface AuthState {
  signupData: SignupData;
  currentCompany: GetCompany | null;
  email: string;
  user: any;
  isUserFetched: boolean;
  authState: AuthStates;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentCompany: null,
  email: "",
  accessToken: localStorage.getItem("accessToken")
    ? (localStorage.getItem("accessToken") as string)
    : null,
  authState: AuthStates.INITIALIZING,
  isUserFetched: false,
  user: null,
  signupData: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: "",
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setSignupData(state, action: PayloadAction<SignupData>) {
      state.signupData = action.payload;
    },

    setUser(state, action: PayloadAction<any>) {
      state.authState = action.payload.authState ?? state.authState;
      state.error = action.payload.error ?? state.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.authState = AuthStates.AUTHENTICATED;
        // state.email = action.payload.user.email;
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state,) => {
        state.authState = AuthStates.IDLE;
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.error = null;
        // state.authState = AuthStates.INITIALIZING;
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload.user;
        // state.authState = AuthStates.AUTHENTICATED;
        state.isUserFetched = true;

        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        // state.authState = AuthStates.IDLE
        state.isUserFetched = true;
        state.loading = false;
      })

      .addCase(getCurrentCompany.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getCurrentCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.currentCompany = action.payload.currentCompany;
        state.loading = false;
      })
      .addCase(getCurrentCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(register.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.authState = AuthStates.AUTHENTICATED;
        // state.email = action.payload.user.email;
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(logout.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authState = AuthStates.IDLE;
        state.email = "";
        state.accessToken = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })
  },
});

export const { setUser, setSignupData } =
  authSlice.actions;
export default authSlice.reducer;
