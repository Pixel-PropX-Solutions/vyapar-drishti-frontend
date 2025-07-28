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