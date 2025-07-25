import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createCompany = createAsyncThunk(
  "company/create",
  async (
    data: FormData,
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/company`, data);


      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getCompany = createAsyncThunk(
  "get/company",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/user/company',);

      if (response.data.success) {
        const company = response.data.data[0];
        localStorage.setItem("company", company);
        return { company };
      } else return rejectWithValue(" No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getAllCompanies = createAsyncThunk(
  "get/all/company",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/user/all/company',);
      console.log('response get All companies', response);

      if (response.data.success) {
        const companies = response.data.data;
        return { companies };
      } else return rejectWithValue(" No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
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

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "delete/company",
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.delete(`/auth/delete/user/company/${id}`);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createCompanyBilling = createAsyncThunk(
  "create/company/billing",
  async (
    { data }: { data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/company/billing`, data);


      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
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

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const createCompanyShipping = createAsyncThunk(
  "create/company/shipping",
  async (
    { data }: { data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/user/create/shipping`, data);

      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Company creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
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

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);