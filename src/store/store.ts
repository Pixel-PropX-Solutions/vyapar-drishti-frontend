import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import companyReducer from "./reducers/companyReducer";
import productReducer from "./reducers/productReducer";
import categoryReducer from "./reducers/categoryReducer";
import inventoryReducer from "./reducers/inventoryReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import stockistReducer from "./reducers/stockistReducer";
<<<<<<< HEAD
import customerReducer from "./reducers/customersReducer";
import accountingGroupReducer from "./reducers/accountingGroupReducer";
import inventoryGroupReducer from "./reducers/inventoryGroupReducer";
=======
import creditorReducer from "./reducers/creditorsLedgerReducer";
import groupReducer from "./reducers/groupReducer";
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
import billingReducer from "./reducers/billingReducer";
import shippingReducer from "./reducers/shippingReducer";
// import orderReducer from "./reducers/orderReducer";
import analyticsReducer from "./reducers/analyticsReducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    company: companyReducer,

<<<<<<< HEAD
    accountingGroup: accountingGroupReducer,
    inventoryGroup: inventoryGroupReducer,
    billing: billingReducer,
    shipping: shippingReducer,
    customersLedger: customerReducer,
=======
    group: groupReducer,
    billing: billingReducer,
    shipping: shippingReducer,
    creditorsLedger: creditorReducer,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637

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
