import adminApi from "@/api/adminApi";
import { Stockist } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewAllStockist = createAsyncThunk(
  "view/allStockist",
  async (
    {
      searchQuery,
      filterState,
      pageNumber,
      limit,
      sortField,
      sortOrder,
    }: {
      searchQuery: string;
      filterState: string;
      sortField: string;
      pageNumber: number;
      limit: number;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminApi.get(
        `view/all/stockist?search=${searchQuery}&state=${filterState === 'All-States' ? "" : filterState}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );

      console.log("viewAllStockist response", response.data);
      if (response.data.success === true) {
        const stockistsData = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { stockistsData, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const getStockistProfile = createAsyncThunk(
  "stockist/getProfile",
  async (
    stockistId: string,
    { rejectWithValue }
  ) => {
    try {
      const res = await adminApi.get(`/view/stockist/profile/${stockistId}`);
      // console.log("res", res);
      if (res.status == 200) {
        return res.data.data[0];
      }
      else
        return rejectWithValue("Failed to fetch stockist profile");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed: Unable to fetch stockist profile"
      );
    }
  }
)

export const createStockist = createAsyncThunk(
  "stockist/create-stockist",
  async ({ data, id }: { data: Stockist; id: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.post(
        `/create/stockist/${id}`,
        data.StockistData
      );
      // console.log("createStockist response", response);

      if (response.data.success === true) {
        const stockistData = response.data.data;
        return { stockistData };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const updateStockist = createAsyncThunk(
  "/stockist/update-stokcist",
  async ({ data, id }: { data: Stockist; id: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.put(
        `/update/stockist/${id}`,
        data.StockistData
      );
      // console.log("updateStockist response", response);

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