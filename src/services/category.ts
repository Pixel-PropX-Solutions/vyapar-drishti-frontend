import userApi from "@/api/api";
import { CategoryCreate } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createCategory = createAsyncThunk(
    "category/Create",
    async (
        { categoryData }: { categoryData: FormData },
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post(`/category/create/category`, categoryData);
            console.log("createCategory response", createRes);
            if (createRes.data.success === true) {
                return createRes.data.data;
            } else {
                return rejectWithValue("Category creation failed");
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Upload or creation failed: Invalid input or server error."
            );
        }
    }
);
export const viewCategory = createAsyncThunk(
    "view/category",
    async (category_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/category/get/category?category_id=${category_id}`);
            // console.log("View Category response", response.data);

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

export const viewAllCategory = createAsyncThunk(
    "view/all/Category",
    async (
        {
            searchQuery,
            pageNumber,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            sortField: string;
            pageNumber: number;
            limit: number;
            sortOrder: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/category/view/all/category?search=${searchQuery}&is_deleted=False&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );
            // console.log("viewAllCategory response", response);

            if (response.data.success === true) {
                const categories = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { categories, pageMeta };
            } else return rejectWithValue("Internal Server Error.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Invalid credentials or server error."
            );
        }
    }
);

export const viewAllCategories = createAsyncThunk(
    "view/categories",
    async (
        _,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                '/category/view/categories'
            );
            // console.log("view/categories response", response.data);

            if (response.data.success === true) {
                const categoryLists = response.data.data;
                return { categoryLists };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const updateCategory = createAsyncThunk(
    "update/category",
    async (
        { data, id }: { data: FormData; id: string },
        { rejectWithValue }
    ) => {
        try {
            console.log("updateProduct data", data);
            const response = await userApi.put(`/category/update/category/${id}`, data);
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

export const deleteCategory = createAsyncThunk(
    "delete/category",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`/category/delete/category/${id}`);
            console.log("deleteCategory response", response);

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
