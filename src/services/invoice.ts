import userApi from "@/api/api";
import { CreateInvoiceData, CreateInvoiceWithTAXData, UpdateTAXInvoice, UpdateInvoice } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createInvoice = createAsyncThunk(
    "create/invoice",
    async (
        data: CreateInvoiceData,
        { rejectWithValue }
    ) => {
        try {
            console.log("Data in createInvoice:", data);
            const createRes = await userApi.post(`/invoices/create/vouchar`, data);
            console.log("Response from createInvoice:", createRes);

            if (createRes.data.success === true) {
                return;
            } else {
                return rejectWithValue("Invoice creation failed");
            }
        } catch (error: any) {
            console.error("Error in createInvoice:", error);
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const createInvoiceWithTAX = createAsyncThunk(
    "create/invoice/tax",
    async (
        data: CreateInvoiceWithTAXData,
        { rejectWithValue }
    ) => {
        try {
            console.log("Data in createInvoiceWithTAX:", data);
            const createRes = await userApi.post(`/invoices/create/vouchar/tax`, data);
            console.log("Create TAX Invoice api response ", createRes);

            if (createRes.data.success === true) {
                return;
            } else {
                return rejectWithValue("Product creation failed");
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
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
                `/invoices/view/all/vouchar?company_id=${company_id}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type !== 'All' ? '&type=' + type : ''}&start_date=${start_date}&end_date=${end_date}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            console.log("View All Invoices API Response", response);

            if (response.data.success === true) {
                const invoices = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { invoices, pageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
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
                `/invoices/get/vouchar/${vouchar_id}?company_id=${company_id}`
            );

            console.log("View Invoice API Response", response);

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getInvoiceCounter = createAsyncThunk(
    "view/invoices",
    async (
        {
            voucher_type,
            company_id,
        }: {
            voucher_type: string;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/serial-number/get/current/${voucher_type}${company_id !== '' ? '?company_id=' + company_id : ''}`
            );

            if (response.data.success === true) {
                return response.data.data;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const viewAllInvoiceGroups = createAsyncThunk(
    "view/all/onvoice/groups",
    async (
        {
            searchQuery,
            company_id,
            // filterState,
            pageNumber,
            // type,
            is_deleted,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            // filterState: string;
            company_id: string;
            sortField: string;
            // type: string;
            is_deleted: boolean;
            pageNumber: number;
            limit: number;
            sortOrder: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/view/all/vouchar/type?${company_id !== "" ? 'company_id=' + company_id : ''}&${searchQuery !== "" ? 'search=' + searchQuery : ''}&is_deleted=${is_deleted}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );


            if (response.data.success === true) {
                const invoiceGroups = response.data.data.docs;
                const invoiceGroupPageMeta = response.data.data.meta;
                return { invoiceGroups, invoiceGroupPageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const getAllInvoiceGroups = createAsyncThunk(
    "get/all/invoice/groups",
    async (company_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/invoices/get/all/vouchar/type?company_id=${company_id}`);

            console.log("Response from getAllInvoiceGroups:", response);

            if (response.data.success === true) {
                const invoiceGroups = response.data.data;
                return { invoiceGroups };
            }
            else
                return rejectWithValue("Failed to fetch Customer profile");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
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

            const updateRes = await userApi.put(`/invoices/update/vouchar/${data.vouchar_id}`, data);

            if (updateRes.data.success === true) {
                return;
            } else {
                return rejectWithValue("Invoice update failed");
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const updateTaxInvoice = createAsyncThunk(
    "update/invoice/tax/vouchar",
    async (
        data: UpdateTAXInvoice,
        { rejectWithValue }
    ) => {
        try {

            console.log("updateTaxInvoice:", data);
            const updateRes = await userApi.put(`/invoices/update/vouchar/tax/${data.vouchar_id}`, data);
            console.log("Response from updateTaxInvoice:", updateRes);

            if (updateRes.data.success === true) {
                return;
            } else {
                return rejectWithValue("Invoice update failed");
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getInvoicesPDF = createAsyncThunk(
    "get/invoices/pdf",
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
                `/invoices/print/vouchar?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'blob' }
            );
            console.log('Response Get Invoice PDF API', response);
            if (response.status === 200) {
                const pdfBlob = response.data as Blob;

                // ✅ Convert Blob → Object URL (serializable string)
                const pdfUrl = URL.createObjectURL(pdfBlob);

                return { pdfUrl }; // keep state serializable
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getTaxInvoicesPDF = createAsyncThunk(
    "get/tax/invoices/pdf",
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
                `/invoices/print/vouchar/tax?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'blob' }
            );
            console.log('Response Get Tax Invoice PDF API', response);
            if (response.status === 200) {
                const pdfBlob = response.data as Blob;

                // ✅ Convert Blob → Object URL (serializable string)
                const pdfUrl = URL.createObjectURL(pdfBlob);

                return { pdfUrl }; // keep state serializable
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const getRecieptPdf = createAsyncThunk(
    "get/receipt/pdf",
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
                `/invoices/print/vouchar/receipt?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'blob' }
            );
            console.log('Response Get Receipt PDF API', response);
            if (response.status === 200) {
                const pdfBlob = response.data as Blob;

                // ✅ Convert Blob → Object URL (serializable string)
                const pdfUrl = URL.createObjectURL(pdfBlob);

                return { pdfUrl }; // keep state serializable
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const getPaymentPdf = createAsyncThunk(
    "get/payment/pdf",
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
                `/invoices/print/vouchar/payment?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'blob' }
            );

            console.log('Response Get Payment PDF API', response);

            if (response.status === 200) {
                const pdfBlob = response.data as Blob;

                // ✅ Convert Blob → Object URL (serializable string)
                const pdfUrl = URL.createObjectURL(pdfBlob);

                return { pdfUrl }; // keep state serializable
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
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
            const response = await userApi.post(
                `/extraction/file/upload`,
                formData,
            );

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else return rejectWithValue("File upload failed: No data received.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const deleteInvoice = createAsyncThunk(
    "delete/invoice",
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
            const response = await userApi.delete(
                `/invoices/delete/${vouchar_id}?company_id=${company_id}`
            );

            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const deleteTAXInvoice = createAsyncThunk(
    "delete/tax/invoice",
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
            const response = await userApi.delete(
                `/invoices/tax/delete/${vouchar_id}?company_id=${company_id}`
            );

            if (response.data.success === true) {
                return;
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);