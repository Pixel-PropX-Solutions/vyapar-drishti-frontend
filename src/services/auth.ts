import userApi from "@/api/api";
import { UserSignUp } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

// export const sendOTP = createAsyncThunk(
//   "user/sendOTP",
//   async (
//     { email, phone }: { email: string; phone: string; },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await userApi.post(`/auth/send/otp`, { email: email, phone_number: phone });

//       console.log("Send OTP response:", response);

//       // const accessToken = response.data.accessToken;

//       // if (accessToken) {
//       //   localStorage.setItem("accessToken", accessToken);
//       //   return { accessToken };
//       // }
//       // else {
//       //   return rejectWithValue(
//       //     "Registration failed: No access token received."
//       //   );
//       // }
//       return;
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message);
//     }
//   }
// );

export const login = createAsyncThunk(
  "user/login",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await userApi.post(
        `/auth/login?user_type=${formData.get("user_type")}`,
        formData
      );

      console.log("Login response:", response);

      if (response.data.ok) {
        const accessToken = response.data.accessToken;
        // 👇 Decode the token to get updated company ID
        const decoded: any = jwtDecode(accessToken);
        const current_company_id = decoded.current_company_id;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("current_company_id", current_company_id);
        return { accessToken, current_company_id };
      } else {
        return rejectWithValue("Login failed: Unknown error.");
      }

    } catch (error: any) {
      console.log("Login API Error", error)
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (
    userData: UserSignUp,
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.post(`/auth/register`, userData);

      if (response.data.ok) {
        // const accessToken = response.data.accessToken;
        // // 👇 Decode the token to get updated company ID
        // const decoded: any = jwtDecode(accessToken);
        // const current_company_id = decoded.current_company_id;

        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("current_company_id", current_company_id);
        return;
      } else {
        return rejectWithValue(
          "Registration failed: No access token received."
        );
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "get/current/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/auth/current/user',);
      console.log("Current user response:", response);
      const user = response.data.data[0];

      if (user) {
        localStorage.setItem("user", user);
        return { user };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getCurrentCompany = createAsyncThunk(
  "get/current/company",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`user/company`,);

      if (response.data.success === true) {
        const currentCompany = response.data.data[0];
        // localStorage.setItem("currentCompany", currentCompany);
        return { currentCompany };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "delete/account",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(`auth/delete/user`);

      if (response.data.success === true) {
        localStorage.clear();
        return { success: true };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forget/password",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`/auth/forgot/password/${email}`);
      console.log("Forgot password response:", response);

      if (response.data.success === true) {
        return 1;
      } else {
        return rejectWithValue(
          "Forgot password request failed."
        );
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/reset/password",
  async (
    {
      email,
      new_password,
      token,
    }: { email: string; new_password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.post("/auth/reset/password", {
        email,
        new_password,
        token,
      });

      console.log("Reset password response:", response);
      if (response.data.success === true) {
        const accessToken = response.data.accessToken;
        // 👇 Decode the token to get updated company ID
        const decoded: any = jwtDecode(accessToken);
        const current_company_id = decoded.current_company_id;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("current_company_id", current_company_id);
        return { accessToken, current_company_id };
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("current_company_id");
        return rejectWithValue("Reset password failed: No access token received.");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const switchCompany = createAsyncThunk(
  "switch/company",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {

      const response = await userApi.post(`/user/settings/switch-company/${id}`);
      console.log('Switch company response:', response);

      if (response.data.success === true) {
        const accessToken = response.data.accessToken;
        // 👇 Decode the token to get updated company ID
        const decoded: any = jwtDecode(accessToken);
        const current_company_id = decoded.current_company_id;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("current_company_id", current_company_id);
        return { accessToken, current_company_id };
      } else {
        return rejectWithValue("Login failed: Unknown error.");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("current_company_id");
        return response.data;
      } else {
        return rejectWithValue("Login Failed: No access token recieved.");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);



export const emailVerify = createAsyncThunk(
  "user/verify/email",
  async ({ email, token }: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`/auth/verify/email?email=${email}&token=${token}`);
      console.log("Email verification API response:", response);
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Email verification failed.");
      }
    } catch (error: any) {
      console.log("Email verification error:", error);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
