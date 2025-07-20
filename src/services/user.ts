import adminApi from "@/api/adminApi";
import userApi from "@/api/api";
import { CreateBasicUser } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createUser = createAsyncThunk(
  "create/BasicUser",
  async (
    {
      email,
      role,
    }: {
      email: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.post("/create/user", {
        email,
        role,
      });

      if (response.data.success === true) {
        const id = response.data.id;
        return { id };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const createBasicUser = createAsyncThunk(
  "create/user",
  async (
    data: CreateBasicUser,
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.post("/create/user", data);

      if (response.data.success === true) {
        const id = response.data.id;
        return { id };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


// export const createCompany = createAsyncThunk(
//   "company/create",
//   async (
//     {  data }: {  data: FormData },
//     { rejectWithValue }
//   ) => {
//     try {
//       const createRes = await userApi.post(`/user/create/company`, data);

//       if (createRes.data.success === true) {
//         return createRes.data.data;
//       } else {
//         return rejectWithValue("Company creation failed");
//       }
//     } catch (error: any) {
// return rejectWithValue(error?.response?.data?.message);
//     }
//   }
// );

// export const getCompany = createAsyncThunk(
//   "get/company",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await userApi.get('/user/company',);

//       if (response.data.success) {
//         const company = response.data.data[0];
//         localStorage.setItem("company", company);
//         return { company };
//       } else return rejectWithValue(" No access token recieved.");
//     } catch (error: any) {
// return rejectWithValue(error?.response?.data?.message);
//     }
//   }
// );


export const updateUser = createAsyncThunk(
  "update/user",
  async (
    { data, id }: { data: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/update/${id}`, data);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const updateUserSettings = createAsyncThunk(
  "update/user/settings",
  async (
    { id, data }: { id: string; data: Record<string, unknown> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/settings/update/${id}`, data);

      if (response.data.success === true) {
        const data = response.data.data;
        return data;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const setCurrentCompany = createAsyncThunk(
  "set/current/company",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/set/company/${id}`);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);