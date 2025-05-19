import userApi from "@/api/api";
import { SingleProduct, StockOutState } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "create/product",
  async ({ data }: { data: SingleProduct }, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`/product/create/product`, data);
      // console.log("createProduct response", response);

      if (response.data.success === true) {
        // const productData = response.data.data;
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
    }: {
      searchQuery: string;
      category: string;
      sortField: string;
      pageNumber: number;
      limit: number;
      sortOrder: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.get(
        `/product/view/all/product?search=${searchQuery}&category=${category}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
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
    { data, id }: { data: SingleProduct; id: string },
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
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(`/product/delete/product/${id}`);
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
