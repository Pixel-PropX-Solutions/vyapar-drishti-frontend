import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import companyReducer from "./reducers/companyReducer";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import inventoryReducer from "./reducers/inventoryReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import stockistReducer from "./reducers/stockistReducer";
import creditorReducer from "./reducers/creditorsReducer";
import billingReducer from "./reducers/billingReducer";
import shippingReducer from "./reducers/shippingReducer";
// import orderReducer from "./reducers/orderReducer";
import analyticsReducer from "./reducers/analyticsReducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    company: companyReducer,

    creditor: creditorReducer,
    billing: billingReducer,
    shipping: shippingReducer,

    auth: authReducer,
    user: userReducer,
    inventory: inventoryReducer,
    invoice: invoiceReducer,
    stockist: stockistReducer,
    // order: orderReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
