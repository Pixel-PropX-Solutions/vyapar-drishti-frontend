import userApi from "@/api/api";
import { CreateInvoiceData, CreateInvoiceWithGSTData, UpdateInvoice } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createInvoice = createAsyncThunk(
    "create/invoice",
    async (
        data: CreateInvoiceData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post(`user/create/vouchar`, data);
            console.log("createInvoice response", createRes);
            if (createRes.data.success === true) {
                return;
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


export const createInvoiceWithGST = createAsyncThunk(
    "create/invoice/gst",
    async (
        data: CreateInvoiceWithGSTData,
        { rejectWithValue }
    ) => {
        try {
            console.log("createInvoiceWithGST data", data);
            const createRes = await userApi.post(`user/create/vouchar/gst`, data);
            console.log("createInvoice response", createRes);
            if (createRes.data.success === true) {
                return;
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


export const viewAllInvoices = createAsyncThunk(
    "view/all/invoices",
    async (
        {
            searchQuery,
            company_id,
            type,
            pageNumber,
            limit,
            sortField,
            sortOrder,
            start_date,
            end_date,
        }: {
            searchQuery: string;
            company_id: string;
            type: string;
            sortField: string;
            pageNumber: number;
            limit: number;
            sortOrder: string;
            start_date: string;
            end_date: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `user/view/all/vouchar?company_id=${company_id}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type !== 'All' ? '&type=' + type : ''}&start_date=${start_date}&end_date=${end_date}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );
            console.log("viewAllInvoices response", response.data);

            if (response.data.success === true) {
                const invoices = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { invoices, pageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const viewInvoice = createAsyncThunk(
    "view/invoices",
    async (
        {
            vouchar_id,
            company_id,
        }: {
            vouchar_id: string;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/get/vouchar/${vouchar_id}?company_id=${company_id}`
            );

            console.log("viewInvoice response", response.data);

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const updateInvoice = createAsyncThunk(
    "update/invoice/vouchar",
    async (
        data: UpdateInvoice,
        { rejectWithValue }
    ) => {
        try {

            console.log("updateInvoice data", data);
            const updateRes = await userApi.put(`/user/update/vouchar/${data.vouchar_id}`, data);
            console.log("updateInvoice response", updateRes);
            if (updateRes.data.success === true) {
                return;
            } else {
                return rejectWithValue("Invoice update failed");
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Upload or creation failed: Invalid input or server error."
            );
        }
    }
);

export const printInvoices = createAsyncThunk(
    "print/invoices",
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/print/vouchar?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log("printInvoices response", response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const printGSTInvoices = createAsyncThunk(
    "print/gst/invoices",
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/print/vouchar/gst?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log("printInvoices response", response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const printRecieptInvoices = createAsyncThunk(
    "print/receipt/invoices",
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/print/vouchar/receipt?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log("printInvoices response", response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const printPaymentInvoices = createAsyncThunk(
    "print/payment/invoices",
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/print/vouchar/payment?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log("printInvoices response", response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


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
