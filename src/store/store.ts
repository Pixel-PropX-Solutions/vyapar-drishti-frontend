import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import productReducer from "./reducers/productReducer";
import inventoryReducer from "./reducers/inventoryReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import stockistReducer from "./reducers/stockistReducer";
import chemistReducer from "./reducers/chemistReducer";
import orderReducer from "./reducers/orderReducer";
import analyticsReducer from "./reducers/analyticsReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    inventory: inventoryReducer,
    invoice: invoiceReducer,
    stockist: stockistReducer,
    chemist: chemistReducer,
    order: orderReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
