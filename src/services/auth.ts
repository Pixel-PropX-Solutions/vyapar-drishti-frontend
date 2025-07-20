import userApi from "@/api/api";
import { UserSignUp } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
        localStorage.setItem("accessToken", accessToken);
        return { accessToken };
      } else {
        return rejectWithValue("Login failed: Unknown error.");
      }

    } catch (error: any) {
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

      const accessToken = response.data.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        return { accessToken };
      }
      else {
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
  "user/forgetPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.put("/auth/forgetPassword", {
        email,
      });

      if (response.data.sucess === true) {
        return 1;
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

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      password,
      confirmPassword,
      token,
    }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put("/auth/resetPassword", {
        password,
        confirmPassword,
        token,
      });

      if (response.data.sucess === true) {
        return 1;
      } else {
        return rejectWithValue("Password not updated.");
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
        // localStorage.clear();
        return response.data;
      } else {
        return rejectWithValue("Login Failed: No access token recieved.");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
