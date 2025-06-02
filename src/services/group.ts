import userApi from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// export const viewAllCreditors = createAsyncThunk(
//     "view/all/ledger",
//     async (
//         {
//             searchQuery,
//             company_id,
//             filterState,
//             pageNumber,
//             type,
//             is_deleted,
//             limit,
//             sortField,
//             sortOrder,
//         }: {
//             searchQuery: string;
//             filterState: string;
//             company_id: string;
//             sortField: string;
//             type: string;
//             is_deleted: boolean;
//             pageNumber: number;
//             limit: number;
//             sortOrder: string;
//         },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await userApi.get(
//                 `/ledger/view/all?${company_id !== "" ? 'company_id=' + company_id : ''}&${searchQuery !== "" ? 'search=' + searchQuery : ''}&${type === "" || type === "All" ? "" : 'parent=' + type}&is_deleted=${is_deleted}&state=${filterState === 'All-States' ? "" : filterState}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === "asc" ? "1" : "-1"
//                 }`
//             );

//             console.log("view all ledger response", response);

//             if (response.data.success === true) {
//                 const creditors = response.data.data.docs;
//                 const pageMeta = response.data.data.meta;
//                 return { creditors, pageMeta };
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

export const getAllGroups = createAsyncThunk(
    "get/creditor",
    async (company_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/user/view/all/groups?company_id=${company_id}`);

            console.log("getAllGroups response", response);

            if (response.data.success === true) {
                const groups = response.data.data;
                return groups;
            }
            else
                return rejectWithValue("Failed to fetch Creditor profile");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed: Unable to fetch chemist profile"
            );
        }
    }
);

// export const deleteCreditor = createAsyncThunk(
//     "delete/creditor",
//     async (creditor_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.delete(`/creditor/delete/${creditor_id}`);

//             if (response.data.success === true) {
//                 return;
//             }
//             else
//                 return rejectWithValue("Failed to delete Creditor profile");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Failed: Unable to fetch chemist profile"
//             );
//         }
//     }
// );

// export const restoreCreditor = createAsyncThunk(
//     "restore/creditor",
//     async (creditor_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.put(`/creditor/restore/${creditor_id}`);

//             if (response.data.success === true) {
//                 return;
//             }
//             else
//                 return rejectWithValue("Failed to delete Creditor profile");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Failed: Unable to fetch chemist profile"
//             );
//         }
//     }
// );

// export const createCreditor = createAsyncThunk(
//     "create/creditor",
//     async (data: FormData, { rejectWithValue }) => {
//         try {
//             const response = await userApi.post(
//                 `/creditor/create`,
//                 data
//             );
//             // console.log("createCreditor response", response);

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

// export const updateCreditor = createAsyncThunk(
//     "update/creditor",
//     async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
//         try {

//             console.log("updateChemist data", data);
//             const response = await userApi.put(
//                 `/creditor/update/${id}`,
//                 data
//             );

//             // console.log("updateCreditor response", response);

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