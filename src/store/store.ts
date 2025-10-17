import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import companyReducer from "./reducers/companyReducer";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import inventoryReducer from "./reducers/inventoryReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import analyticsReducer from "./reducers/analyticsReducer";
import customerReducer from "./reducers/customersReducer";
import accountingGroupReducer from "./reducers/accountingGroupReducer";
import inventoryGroupReducer from "./reducers/inventoryGroupReducer";
import adminReducer from "./reducers/adminReducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    company: companyReducer,

    accountingGroup: accountingGroupReducer,
    inventoryGroup: inventoryGroupReducer,
    customersLedger: customerReducer,

    admin: adminReducer,
    auth: authReducer,
    user: userReducer,
    inventory: inventoryReducer,
    invoice: invoiceReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
