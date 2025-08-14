import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "product/uploadAndCreate",
  async (
    { productData }: { productData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/product/create/product`, productData);

      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Product creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const viewAllProducts = createAsyncThunk(
  "view/allProduct",
  async (
    {
      searchQuery,
      company_id,
      category,
      pageNumber,
      limit,
      sortField,
      sortOrder,
      // is_deleted,
    }: {
      searchQuery: string;
      company_id: string;
      category: string;
      sortField: string;
      pageNumber: number;
      limit: number;
      sortOrder: string;
      // is_deleted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/all/product?company_id=${company_id}&search=${searchQuery}${category === 'All' ? "" : "&category=" + category}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );

      if (response.data.success === true) {
        const productsData = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { productsData, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const viewAllStockItems = createAsyncThunk(
  "view/all/StockItems",
  async (
    {
      searchQuery,
      company_id,
      category,
      group,
      pageNumber,
      limit,
      sortField,
      sortOrder,
      // is_deleted,
    }: {
      searchQuery: string;
      company_id: string;
      category: string;
      group: string;
      sortField: string;
      pageNumber: number;
      limit: number;
      sortOrder: string;
      // is_deleted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `product/view/all/stock/items?company_id=${company_id}&search=${searchQuery}${group === 'All' ? "" : "&group=" + group}${category === 'All' ? "" : "&category=" + category}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );

      console.log('View All Stock Items API Response', response);

      if (response.data.success === true) {
        const stockItems = response.data.data.docs;
        const stockItemsMeta = response.data.data.meta;
        return { stockItems, stockItemsMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const viewProduct = createAsyncThunk(
  "view/product",
  async ({ product_id, company_id }: { product_id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/get/product/${product_id}?company_id=${company_id}`);

      if (response.data.success === true) {
        const product = response.data.data[0];
        return { product };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getProduct = createAsyncThunk(
  "view/product/detail",
  async ({ product_id, company_id }: { product_id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/get/product/details/${product_id}?company_id=${company_id}`);

      console.log("Get Product Details API Response", response);

      if (response.data.success === true) {
        const item = response.data.data[0];
        return { item };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getProductTimeline = createAsyncThunk(
  "view/product/timeline",
  async ({ product_id, company_id }: { product_id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`product/get/timeline/${product_id}?company_id=${company_id}`);

      console.log("Get Product Timeline API Response", response);

      if (response.data.success === true) {
        const timeline = response.data.data[0];
        return { timeline };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const viewProductsWithId = createAsyncThunk(
  "view/products/withId",
  async (company_id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`product/view/products/with_id?company_id=${company_id}`);

      if (response.data.success === true) {
        const itemsList = response.data.data;
        return itemsList;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "update/product",
  async (
    { data, id }: { data: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/product/update/product/${id}`, data);

      if (response.data.success === true) {
        return;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "delete/product",
  async ({ id, company_id }: { id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(`/product/delete/product/${id}${company_id !== '' ? '?company_id=' + company_id : ''}`);
      console.log("Delete product response", response);
      if (response.data.success === true) {
        return;
      } else if (!response.data.success) {
        return response.data.message
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
