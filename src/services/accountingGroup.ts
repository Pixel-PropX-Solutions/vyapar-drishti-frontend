import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createAccountingGroup = createAsyncThunk(
    "Create/accounting/group",
    async (
        data: FormData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post(`/user/accounting/create/group`, data);
            console.log("createAccountingGroup response", createRes);
            if (createRes.data.success === true) {
                return createRes.data.data;
            } else {
                return rejectWithValue("Group creation failed");
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Upload or creation failed: Invalid input or server error."
            );
        }
    }
);

export const viewAllCustomerGroups = createAsyncThunk(
    "view/all/ledger/groups",
    async (
        {
            searchQuery,
            company_id,
            // filterState,
            pageNumber,
            type,
            is_deleted,
            limit,
            sortField,
            sortOrder,
        }: {
            searchQuery: string;
            // filterState: string;
            company_id: string;
            sortField: string;
            type: string;
            is_deleted: boolean;
            pageNumber: number;
            limit: number;
            sortOrder: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/accounting/view/all?company_id=${company_id}${searchQuery !== "" ? '&search=' + searchQuery : ''}${type === "" || type === "All" ? "" : '&parent=' + type}&is_deleted=${is_deleted}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            console.log("view all Customer Groups response", response);

            if (response.data.success === true) {
                const customerGroups = response.data.data.docs;
                const accountingGroupPageMeta = response.data.data.meta;
                return { customerGroups, accountingGroupPageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const viewDefaultAccountingGroup = createAsyncThunk(
    "view/default/accounitng/groups",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/user/view/default/accounting/groups`);
            console.log("View Default accounting group response", response.data);

            if (response.data.success === true) {
                const defaultAccountingGroup = response.data.data;
                return { defaultAccountingGroup };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const viewAllAccountingGroups = createAsyncThunk(
    "view/accounting/groups",
    async (
        company_id: string,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/user/accounting/view/all/groups?company_id=${company_id}`
            );
            console.log("view/groups response", response);

            if (response.data.success === true) {
                const accountingGroups = response.data.data;
                return { accountingGroups };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);


export const updateAccountingGroup = createAsyncThunk(
    "update/accounting/group",
    async (
        { data, id }: { data: FormData; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.put(`/user/update/group/${id}`, data);
            console.log("updateInventoryGroup response", response);

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

// export const deleteAccountingGroup = createAsyncThunk(
//     "delete/accounting/group",
//     async (id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.delete(`/category/delete/category/${id}`);
//             console.log("deleteCategory response", response);

//             if (response.data.success === true) {
//                 return;
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );


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
                `user/view/all/vouchar/type?${company_id !== "" ? 'company_id=' + company_id : ''}&${searchQuery !== "" ? 'search=' + searchQuery : ''}&is_deleted=${is_deleted}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
                }`
            );

            console.log("view all Invoice Groups response", response);

            if (response.data.success === true) {
                const invoiceGroups = response.data.data.docs;
                const invoiceGroupPageMeta = response.data.data.meta;
                return { invoiceGroups, invoiceGroupPageMeta };
            } else return rejectWithValue("Login Failed: No access token recieved.");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error."
            );
        }
    }
);

export const getAllInvoiceGroups = createAsyncThunk(
    "get/all/invoice/groups",
    async (company_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/user/get/all/vouchar/type?company_id=${company_id}`);

            console.log("getAllInvoiceGroups response", response);

            if (response.data.success === true) {
                const invoiceGroupList = response.data.data;
                return { invoiceGroupList };
            }
            else
                return rejectWithValue("Failed to fetch Customer profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

// export const deleteCustomer = createAsyncThunk(
//     "delete/customer",
//     async (customer_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.delete(`/customer/delete/${customer_id}`);

//             if (response.data.success === true) {
//                 return;
//             }
//             else
//                 return rejectWithValue("Failed to delete Customer profile");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Failed: Unable to fetch chemist profile"
//             );
//         }
//     }
// );

// export const restoreCustomer = createAsyncThunk(
//     "restore/customer",
//     async (customer_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.put(`/customer/restore/${customer_id}`);

//             if (response.data.success === true) {
//                 return;
//             }
//             else
//                 return rejectWithValue("Failed to delete Customer profile");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Failed: Unable to fetch chemist profile"
//             );
//         }
//     }
// );

// export const createCustomer = createAsyncThunk(
//     "create/customer",
//     async (data: FormData, { rejectWithValue }) => {
//         try {
//             const response = await userApi.post(
//                 `/customer/create`,
//                 data
//             );
//             // console.log("createCustomer response", response);

//             if (response.data.success === true) {
//                 return;
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

// export const updateCustomer = createAsyncThunk(
//     "update/customer",
//     async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
//         try {

//             console.log("updateChemist data", data);
//             const response = await userApi.put(
//                 `/customer/update/${id}`,
//                 data
//             );

//             // console.log("updateCustomer response", response);

//             if (response.data.success === true) {
//                 return;
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );