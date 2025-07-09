import userApi from "@/api/api";
import { StockOutState } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "product/uploadAndCreate",
  async (
    { productData }: { productData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const createRes = await userApi.post(`/product/create/product`, productData);
      console.log("createProduct response", createRes);
      if (createRes.data.success === true) {
        return createRes.data.data;
      } else {
        return rejectWithValue("Product creation failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Upload or creation failed: Invalid input or server error."
      );
    }
  }
);


export const sellProduct = createAsyncThunk(
  "sell/product",
  async (data: Array<StockOutState>, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`/sales/create/mulitple_sales`, data);
      // console.log("sellProduct response", response);

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
      // console.log("viewAllProduct response", response.data);

      if (response.data.success === true) {
        const productsData = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { productsData, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
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
        `product/view/all/stock/items?company_id=${company_id}&search=${searchQuery}${category === 'All' ? "" : "&category=" + category}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
        }`
      );
      console.log("viewAllStockItems response", response.data);

      if (response.data.success === true) {
        const stockItems = response.data.data.docs;
        const pageMeta = response.data.data.meta;
        return { stockItems, pageMeta };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const viewProduct = createAsyncThunk(
  "view/product",
  async ({ product_id, company_id }: { product_id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/get/product/${product_id}?company_id=${company_id}`);
      // console.log("view Product response", response.data);

      if (response.data.success === true) {
        const product = response.data.data[0];
        return { product };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const getProduct = createAsyncThunk(
  "view/product/detail",
  async ({ product_id, company_id }: { product_id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/get/product/details/${product_id}?company_id=${company_id}`);
      // console.log("view Product response", response.data);

      if (response.data.success === true) {
        const item = response.data.data[0];
        return { item };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const viewProductsWithId = createAsyncThunk(
  "view/products/withId",
  async (company_id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`product/view/products/with_id?company_id=${company_id}`);
      console.log("view Product with id response", response.data);

      if (response.data.success === true) {
        const itemsList = response.data.data;
        return itemsList;
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
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
      console.log("updateProduct data", data);
      const response = await userApi.put(`/product/update/product/${id}`, data);
      console.log("updateProduct response", response);

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

export const deleteProduct = createAsyncThunk(
  "delete/product",
  async ({ id, company_id }: { id: string, company_id: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(`/product/delete/product/${id}?company_id=${company_id}`);
      // console.log("deleteProduct response", response);

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
