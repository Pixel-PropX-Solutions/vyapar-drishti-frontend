import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewInventrory = createAsyncThunk(
  "view/inventory",
  async (
    {
      chemistId,
      productId,
    }: {
      chemistId: string;
      productId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `inventory/inventory/product?chemist_id=${chemistId}&product_id=${productId}`
      );

      if (response.data.success === true) {
        const inventoryData = response.data.data;
        return { inventoryData };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);


export const getStockMovement = createAsyncThunk(
  "view/timeline",
  async (
    {
      search,
      movement_type,
      page_no,
      limit,
      startDate,
      endDate,
      sortField,
      sortOrder
    }: {
      search: string;
      startDate: string;
      endDate: string;
      movement_type: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/user/get/timeline?${search ? `search=${search}&` : ''}${movement_type ? `type=${movement_type}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
      );

      if (response.data.success === true) {
        const stockMovement = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { stockMovement, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);



export const getProductStock = createAsyncThunk(
  "view/productStock",
  async (
    {
      company_id,
      search,
      category,
      page_no,
      limit,
      sortField,
      sortOrder
    }: {
      company_id: string;
      search: string;
      category: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/all/product?company_id=${company_id}&search=${search}${category === 'All' ? "" : "&category=" + category}&page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );

      if (response.data.success === true) {
        const InventoryItems = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { InventoryItems, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);
