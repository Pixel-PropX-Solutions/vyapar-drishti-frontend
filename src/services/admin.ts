import adminApi from "@/api/adminApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk(
    "get/users",
    async ({
        search,
        pageNumber,
        limit,
        sortField,
        sortOrder,
    }: {
        search: string;
        sortField: string;
        pageNumber: number;
        limit: number;
        sortOrder: string;
    }, { rejectWithValue }
    ) => {
        try {
            const response = await adminApi.get(`/view/all/users?search=${search}&start_date=&end_date=&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"}`);

            console.log("getUsers response:", response);

            if (response.data.success === true) {
                const usersList = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { usersList, pageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);