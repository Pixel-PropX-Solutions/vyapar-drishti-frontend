import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createCompany = createAsyncThunk(
  "company/create",
  async (
    {  data }: {  data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/company`, data);

      console.log("createCompany response", createRes);

      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Upload or creation failed: Invalid input or server error."
      );
    }
  }
);

export const getCompany = createAsyncThunk(
  "get/company",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/user/company',);
      console.log("getCompany response", response.data);

      if (response.data.success) {
        const company = response.data.data[0];
        localStorage.setItem("company", company);
        return { company };
      } else return rejectWithValue(" No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Invalid credentials or server error."
      );
    }
  }
);


export const updateCompany = createAsyncThunk(
  "update/company",
  async (
    { data, id }: { data: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/update/company/${id}`, data);
      console.log("updateCompany response", response);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);


export const createCompanyBilling = createAsyncThunk(
  "create/company/billing",
  async (
    {  data }: {  data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/company/billing`, data);

      console.log("createCompanyBilling response", createRes);

      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Upload or creation failed: Invalid input or server error."
      );
    }
  }
);

export const updateCompanyBilling = createAsyncThunk(
  "update/company/billing",
  async (
    { data, id }: { data: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/update/billing/${id}`, data);
      console.log("updateCompanyBilling response", response);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);


export const createCompanyShipping = createAsyncThunk(
  "create/company/shipping",
  async (
    {  data }: {  data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/shipping`, data);

      console.log("createCompanyShipping response", createRes);

      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Upload or creation failed: Invalid input or server error."
      );
    }
  }
);

export const updateCompanyShipping = createAsyncThunk(
  "update/company/shipping",
  async (
    { data, id }: { data: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/update/shipping/${id}`, data);
      console.log("updateCompanyShipping response", response);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);