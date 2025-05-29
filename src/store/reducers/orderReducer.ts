// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthStates } from "@/utils/enums";
// import { Order, OrderDetails, OrderStatus, StockistShops } from "@/utils/types";
// import { createOrder, createOrderDetails, getStockistShops, updateOrder, updateOrderDetails, viewOrderDetails, viewOrders } from "@/services/order";

// interface OrderState {
//     authState: AuthStates;
//     orderData: Array<Order> | [];
//     stockistShops: Array<StockistShops> | [];
//     orderDetailsData: OrderDetails | null;
//     loading: boolean;
//     orderId: string;
//     error: string | null;
// }

// const initialState: OrderState = {
//     authState: AuthStates.INITIALIZING,
//     orderData: [],
//     stockistShops: [],
//     orderDetailsData: null,
//     loading: false,
//     orderId: "",
//     error: null,
// };

// const orderSlice = createSlice({
//     name: "order",
//     initialState,
//     reducers: {
//         setOrderId(state, action: PayloadAction<any>) {
//             state.orderId = action.payload.orderId;
//         },
//         setOrderStatus(state, action: PayloadAction<{ orderId: string, status: OrderStatus }>) {
//             const { orderId, status } = action.payload;
//             // Update orderDetails status
//             if (state.orderDetailsData?.order_details && state.orderDetailsData.order_details._id === orderId) {
//                 state.orderDetailsData.order_details.status = status;
//             }

//             //update status in orderData array
//             const orderIndex = state.orderData.findIndex(order => order._id === orderId);
//             if (orderIndex !== -1) {
//                 state.orderData[orderIndex].status = status;
//             }
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(createOrder.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.orderId = action.payload.orderId;
//                 state.loading = false;
//             })
//             .addCase(createOrder.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(createOrderDetails.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(createOrderDetails.fulfilled, (state) => {
//                 state.loading = false;
//             })
//             .addCase(createOrderDetails.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(getStockistShops.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(getStockistShops.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.stockistShops = action.payload.stockistShops;
//                 state.loading = false;
//             })
//             .addCase(getStockistShops.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(viewOrders.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(viewOrders.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.orderData = action.payload.orderData;
//                 state.loading = false;
//             })
//             .addCase(viewOrders.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(viewOrderDetails.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(
//                 viewOrderDetails.fulfilled,
//                 (state, action: PayloadAction<any>) => {
//                     state.orderDetailsData = action.payload.orderDetailsData;
//                     state.loading = false;
//                 }
//             )
//             .addCase(viewOrderDetails.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(updateOrder.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(updateOrder.fulfilled, (state, _action: PayloadAction<any>) => {
//                 state.loading = false;
//             })
//             .addCase(updateOrder.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             })

//             .addCase(updateOrderDetails.pending, (state) => {
//                 state.error = null;
//                 state.loading = true;
//             })
//             .addCase(updateOrderDetails.fulfilled, (state, _action: PayloadAction<any>) => {
//                 state.loading = false;
//             })
//             .addCase(updateOrderDetails.rejected, (state, action) => {
//                 state.error = action.payload as string;
//                 state.loading = false;
//             });
//     },
// });

// export const { setOrderId, setOrderStatus } = orderSlice.actions;
// export default orderSlice.reducer;
