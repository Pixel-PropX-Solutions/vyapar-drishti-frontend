import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getStockMovement = createAsyncThunk(
  "view/timeline",
  async (
    {
      search,
      movement_type,
      party_name,
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
      party_name: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/invoices/get/timeline?${search ? `search=${search}&` : ''}${movement_type ? `type=${movement_type}&` : ''}${party_name !== 'all' ? `party_name=${party_name}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
      );

      console.log("View StockMovement response", response)

      if (response.data.success === true) {
        const stockMovement = response.data.data.docs;
        const timelinePageMeta = response.data.data.meta;
        return { stockMovement, timelinePageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getInventoryStats = createAsyncThunk(
  "view/Inventory/Stats",
  async (
    company_id: string,
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/inventory/stats?company_id=${company_id}`
      );

      console.log("View Inventory Stock Stats response", response)

      if (response.data.success === true) {
        const statsData = response.data.data;
        return { statsData };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getInventoryItems = createAsyncThunk(
  "view/Inventory/Items",
  async (
    {
      company_id,
      search,
      category,
      group,
      stock_status,
      page_no,
      limit,
      sortField,
      sortOrder
    }: {
      company_id: string;
      search: string;
      category: string;
      group: string;
      stock_status: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/inventory/items?company_id=${company_id}&search=${search}${category === 'all' ? "" : "&category=" + category}${group === 'all' ? "" : "&group=" + group}${stock_status === 'all' ? "" : "&stock_status=" + stock_status}&page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );

      console.log("View InventoryStockItems response", response)

      if (response.data.success === true) {
        const InventoryItems = response.data.data.docs;
        const inventoryPageMeta = response.data.data.meta;
        return { InventoryItems, inventoryPageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
