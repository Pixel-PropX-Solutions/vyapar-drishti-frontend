import adminApi from "@/api/adminApi";
import { Chemist, CreateChemist } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const viewAllChemist = createAsyncThunk(
    "view/allChemist",
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
                `view/all/chemist?search=${searchQuery}&state=${filterState === 'All-States' ? "" : filterState}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            if (response.data.success === true) {
                const chemistsData = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { chemistsData, pageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const getChemistProfile = createAsyncThunk(
    "Chemist/profile",
    async (chemistId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/view/chemist/profile/${chemistId}`);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else
                return rejectWithValue("Failed to fetch chemist profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

export const createChemist = createAsyncThunk(
    "chemist/create-chemist",
    async ({ data, id }: { data: CreateChemist; id: string }, { rejectWithValue }) => {
        try {
            const response = await adminApi.post(
                `/create/chemist/${id}`,
                data.ChemistData
            );
            console.log("createChemist response", response);

            if (response.data.success === true) {
                const chemistData = response.data.data;
                return { chemistData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const updateChemist = createAsyncThunk(
    "update/chemist",
    async ({ data, id }: { data: Chemist; id: string }, { rejectWithValue }) => {
        try {
            console.log("updateChemist data", data);
            const response = await adminApi.put(
                `/update/chemist/${id}`,
                data.ChemistData
            );
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