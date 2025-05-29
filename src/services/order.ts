// import adminApi from "@/api/adminApi";
// import userApi from "@/api/api";
// import { OrderCreate, OrderDetailsCreate, OrderStatus, StockOutState } from "@/utils/types";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// export const getStockistShops = createAsyncThunk(
//     "get/stockist/shops",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await adminApi.get(`/view/stockists/shops`);
//             // console.log("view stockistShops response", response.data);

//             if (response.data.success === true) {
//                 const stockistShops = response.data.data;
//                 return { stockistShops };
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

// export const createOrder = createAsyncThunk(
//     "create/order",
//     async ({ data, status }: { data: OrderCreate, status: OrderStatus }, { rejectWithValue }) => {
//         try {
//             const response = await userApi.post(`/orders/create/user/orders?status=${status}`, data);
//             // console.log("createOrder response", response);

//             if (response.data.success === true) {
//                 const id = response.data.data;
//                 return { id };
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

// export const createOrderDetails = createAsyncThunk(
//     "create/orderDetails",
//     async ({ data }: { data: OrderDetailsCreate, }, { rejectWithValue }) => {
//         try {
//             const response = await userApi.post(`/orders/create/orders/details`, data);
//             // console.log("createOrderDetails response", response);

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

// export const viewOrders = createAsyncThunk(
//     "view/orders",
//     async (chemist_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.get(`/orders/get/users/orders/${chemist_id}`);
//             // console.log("view Order response", response.data);

//             if (response.data.success === true) {
//                 const orderData = response.data.data;
//                 return { orderData };
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

// export const viewOrderDetails = createAsyncThunk(
//     "view/orderDetails",
//     async (order_id: string, { rejectWithValue }) => {
//         try {
//             const response = await userApi.get(`/orders/get/orders/details/${order_id}`);
//             // console.log("view OrderDetails response", response.data);

//             if (response.data.success === true) {
//                 const orderDetailsData = response.data.data;
//                 return { orderDetailsData };
//             } else return rejectWithValue("Login Failed: No access token recieved.");
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message ||
//                 "Login failed: Invalid credentials or server error."
//             );
//         }
//     }
// );

// export const updateOrder = createAsyncThunk(
//     "update/order",
//     async (
//         { data, order_id, status }: { data: OrderCreate; order_id: string, status: 'Pending' | "Shipped" | 'Cancelled' },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await userApi.put(`/orders/update/orders/${order_id}?status=${status}`, data);
//             // console.log("updateOrder response", response);

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

// export const updateOrderDetails = createAsyncThunk(
//     "update/orderDetails",
//     async (
//         { data, order_id }: { data: Array<StockOutState>; order_id: string },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await userApi.put(`/orders/update/orders/details/${order_id}`, data);
//             console.log("updateOrderDetails response", response);

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
