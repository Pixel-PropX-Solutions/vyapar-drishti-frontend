import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const uploadBill = createAsyncThunk(
    "upload/bill",
    async (
        formData: FormData,
        { rejectWithValue }
    ) => {
        try {
            // console.log("uploadBill formData", formData);
            const response = await userApi.post(
                `/extraction/file/upload`,
                formData,
            );

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else return rejectWithValue("File upload failed: No data received.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "File upload failed: Server error."
            );
        }
    }
);
