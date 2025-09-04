import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "@/utils/enums";
import { deleteAccount, deleteCompany, emailVerify, forgetPassword, getCurrentCompany, getCurrentUser, login, logout, register, resetPassword, sendQueryEmail, switchCompany } from "@/services/auth";
import { GetCompany, UserSignUp } from "@/utils/types";


interface AuthState {
  signupData: UserSignUp;
  currentCompany: GetCompany | null;
  email: string;
  user: any;
  isUserFetched: boolean;
  authState: AuthStates;
  accessToken: string | null;
  current_company_id: string | null;
  loading: boolean;
  switchCompanyLoading: boolean;
  deleteCompanyLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentCompany: null,
  email: "",
  accessToken: localStorage.getItem("accessToken")
    ? (localStorage.getItem("accessToken") as string)
    : null,
  current_company_id: localStorage.getItem("current_company_id")
    ? (localStorage.getItem("current_company_id") as string)
    : null,
  authState: AuthStates.INITIALIZING,
  isUserFetched: false,
  user: null,
  signupData: {
    name: {
      first: '',
      last: '',
    },
    email: '',
    phone: {
      code: '',
      number: '',
    },
    password: '',
  },
  loading: false,
  switchCompanyLoading: false,
  deleteCompanyLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setSignupData(state, action: PayloadAction<UserSignUp>) {
      state.signupData = action.payload;
    },

    setUser(state, action: PayloadAction<any>) {
      state.authState = action.payload.authState ?? state.authState;
      state.error = action.payload.error ?? state.error;
    },

    setCurrentCompanyId(state, action: PayloadAction<string | null>) {
      state.current_company_id = action.payload;
      localStorage.setItem("current_company_id", action.payload || '');
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
        state.accessToken = action.payload.accessToken;
        state.current_company_id = action.payload.current_company_id; // 👈 this!
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(resetPassword.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
        state.authState = AuthStates.AUTHENTICATED;
        state.accessToken = action.payload.accessToken;
        state.current_company_id = action.payload.current_company_id; // 👈 this!
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })


      .addCase(switchCompany.pending, (state) => {
        state.error = null;
        state.switchCompanyLoading = true;
      })
      .addCase(switchCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.accessToken = action.payload.accessToken;
        state.current_company_id = action.payload.current_company_id; // 👈 this!
        state.switchCompanyLoading = false;
      })
      .addCase(switchCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.switchCompanyLoading = false;
      })

      .addCase(deleteCompany.pending, (state) => {
        state.error = null;
        state.deleteCompanyLoading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action: PayloadAction<any>) => {
        state.accessToken = action.payload.accessToken;
        state.current_company_id = action.payload.current_company_id; // 👈 this!
        state.deleteCompanyLoading = false;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.error = action.payload as string;
        state.deleteCompanyLoading = false;
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
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload.user;
        if (state.current_company_id === null) {
          state.current_company_id = action.payload.user?.user_settings?.current_company_id;
          localStorage.setItem("current_company_id", action.payload.user?.user_settings?.current_company_id || '');
        }
        state.isUserFetched = true;

        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
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
        state.error = null;
        state.loading = true;
      })
      .addCase(register.fulfilled, (state,) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
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

      .addCase(forgetPassword.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.authState = AuthStates.IDLE;
        state.loading = false;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(emailVerify.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(emailVerify.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(emailVerify.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      
      .addCase(sendQueryEmail.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(sendQueryEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendQueryEmail.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
  },
});

export const { setUser, setSignupData, setCurrentCompanyId } =
  authSlice.actions;
export default authSlice.reducer;
