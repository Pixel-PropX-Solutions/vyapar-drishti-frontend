import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getStockMovement = createAsyncThunk(
  "view/timeline",
  async (
    {
      search,
      category,
      company_id,
      page_no,
      limit,
      startDate,
      endDate,
      sortField,
      sortOrder
    }: {
      search: string;
      company_id: string;
      startDate: string;
      endDate: string;
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
        `/invoices/get/timeline?${company_id ? `company_id=${company_id}&` : ''}${search ? `search=${search}&` : ''}${category !== 'all' ? `category=${category}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
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

export const getHSNSummary = createAsyncThunk(
  "view/hsn/summary",
  async (
    {
      search,
      category,
      company_id,
      page_no,
      limit,
      startDate,
      endDate,
      sortField,
      sortOrder
    }: {
      search: string;
      company_id: string;
      startDate: string;
      endDate: string;
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
        `/invoices/get/hsn/summary?${company_id ? `company_id=${company_id}&` : ''}${search ? `search=${search}&` : ''}${category !== 'all' ? `category=${category}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
      );

      console.log("View getSummary response", response)

      if (response.data.success === true) {
        const hsnSummaryData = response.data.data.docs;
        const hsnPageMeta = response.data.data.meta;
        return { hsnSummaryData, hsnPageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getSummaryStats = createAsyncThunk(
  "view/summary/stats",
  async (
    {
      company_id,
      startDate,
      endDate,
    }: {
      company_id: string;
      startDate: string;
      endDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/invoices/get/summary/stats?${company_id ? `company_id=${company_id}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}`
      );

      console.log("View getSummaryStats response", response)

      if (response.data.success === true) {
        const summaryStats = response.data.data;
        return { summaryStats };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getPartySummary = createAsyncThunk(
  "view/party/summary",
  async (
    {
      search,
      company_id,
      page_no,
      limit,
      startDate,
      endDate,
      sortField,
      sortOrder
    }: {
      search: string;
      company_id: string;
      startDate: string;
      endDate: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/invoices/get/party/summary?${company_id ? `company_id=${company_id}&` : ''}${search ? `search=${search}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
      );

      console.log("View getPartySummary response", response)

      if (response.data.success === true) {
        const partySummaryData = response.data.data.docs;
        const partyPageMeta = response.data.data.meta;
        return { partySummaryData, partyPageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getBillSummary = createAsyncThunk(
  "view/bill/summary",
  async (
    {
      search,
      company_id,
      page_no,
      limit,
      startDate,
      endDate,
      sortField,
      sortOrder
    }: {
      search: string;
      company_id: string;
      startDate: string;
      endDate: string;
      page_no: number;
      limit: number;
      sortField: string;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/invoices/get/invoice/summary?${company_id ? `company_id=${company_id}&` : ''}${search ? `search=${search}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`
      );

      console.log("View getBillSummary response", response)

      if (response.data.success === true) {
        const invoiceSummaryData = response.data.data.docs;
        const invoicePageMeta = response.data.data.meta;
        return { invoiceSummaryData, invoicePageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
