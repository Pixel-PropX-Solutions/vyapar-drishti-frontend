import userApi from "@/api/api";
import { StockOutState } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "product/uploadAndCreate",
  async (
    {  productData }: {  productData: FormData },
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
  async ({ data }: { data: Array<StockOutState> }, { rejectWithValue }) => {
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
      category,
      pageNumber,
      limit,
      sortField,
      sortOrder,
      is_deleted,
    }: {
      searchQuery: string;
      category: string;
      sortField: string;
      pageNumber: number;
      limit: number;
      sortOrder: string;
      is_deleted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/all/product?search=${searchQuery}&category=${category}&is_deleted=${is_deleted}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
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

export const viewAllCategories = createAsyncThunk(
  "view/all/categories",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        '/product/view/all/categories'
      );
      // console.log("view/all/categories response", response.data);

      if (response.data.success === true) {
        const categories = response.data.data;
        return { categories };
      } else return rejectWithValue(" No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Invalid credentials or server error."
      );
    }
  }
);

export const viewProduct = createAsyncThunk(
  "view/product",
  async (product_id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/get/product/${product_id}`);
      // console.log("view Product response", response.data);

      if (response.data.success === true) {
        const productData = response.data.data;
        return { productData };
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
  async (productName: string, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/product/view/products/with_id?search=${productName}`);
      // console.log("view Product response", response.data);

      if (response.data.success === true) {
        const productsListing = response.data.data;
        return { productsListing };
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
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(`/product/delete/product/${id}`);
      console.log("deleteProduct response", response);

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
