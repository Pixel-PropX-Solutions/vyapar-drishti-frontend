import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { setUser } from "./store/reducers/authReducer";
import { AuthStates, ROLE_ENUM } from "./utils/enums";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "./pages/Dashboard";
import { Box, CircularProgress, CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import MyProfile from "./pages/Profile";
import Products from "./pages/Products";
import UploadDocuments from "./pages/UploadDocuments";
import Settings from "./pages/Settings";
import Stockist from "./pages/Stockist";
import CreateChemistProfile from "./features/profile/chemist/CreateChemistProfile";
import CreateStockistProfile from "./features/profile/stockist/CreateStockistProfile";
import CreateUserProfile from "./features/profile/createUser";
import CreateProduct from "./features/products/createProduct";
import Chemists from "./pages/Chemist";
import ChemistProfile from "./features/profile/chemist/Chemistprofile";
import StockistProfile from "./features/profile/stockist/StockistProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { getCurrentUser } from "./services/auth";
import OrdersPage from "./pages/Order";
import CreateOrder from "./features/order/createOrder";
import ViewOrder from "./features/order/viewOrder";
import UpdateOrderProduct from "./features/order/updateOrder";
import LandingPage from "./components/LandingPage/LandingPage";
import AboutPage from "./components/About/AboutPage";
import Timeline from "./features/inventory/timeline";
import Warehouse from "./features/inventory/warehouse";
import InvoiceEditor from "./features/upload-documents/InvoiceEditor";
import ProductBilling from "./features/products/SellProduct";
import ViewInventory from "./pages/Inventory";
import ViewItem from "./features/products/ViewItem";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const App: React.FC<{ themeComponents?: object }> = (props) => {
  const { authState, user, isUserFetched } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        dispatch(setUser({ authState: AuthStates.IDLE }));
        return;
      }

      if (!isUserFetched && accessToken) {
        try {
          await dispatch(getCurrentUser());
          dispatch(setUser({ authState: AuthStates.AUTHENTICATED }));
        } catch {
          localStorage.removeItem("accessToken");
          dispatch(setUser({ authState: AuthStates.IDLE }));
        }
      }
    };

    initializeAuth();
  }, [dispatch, isUserFetched]);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!isInitialized.current)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (authState === AuthStates.INITIALIZING && user === null)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Routes>

        {/* if authenticed */}
        {authState === AuthStates.AUTHENTICATED ? (
          <>
            {user?.role === ROLE_ENUM.ADMIN && (
              <Route element={<Dashboard />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/add/product" element={<CreateProduct />} />
                <Route path="/products/:id" element={<ViewItem />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<ViewInventory />} />
                <Route path="/upload" element={<UploadDocuments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/create/user" element={<CreateUserProfile />} />
                <Route path="/stockists" element={<Stockist />} />
                <Route path="/stockists/:stockistId" element={<StockistProfile />} />
                <Route
                  path="/create/user/stockist/:id"
                  element={<CreateStockistProfile />}
                />
                <Route path="/chemists" element={<Chemists />} />
                <Route path="/chemists/:chemistId" element={<ChemistProfile />} />
                <Route
                  path="/create/user/chemist/:id"
                  element={<CreateChemistProfile />}
                />
                <Route path="/sell" element={<ProductBilling />} />
                <Route path="/*" element={<Navigate to="/" replace />} />

              </Route>
            )}

            {user?.role === ROLE_ENUM.CHEMIST && (
              <Route element={<Dashboard />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/add/product" element={<CreateProduct />} />
                <Route path="/products/:id" element={<ViewItem />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<Warehouse />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/create" element={<CreateOrder />} />
                <Route path="/orders/:orderId" element={<ViewOrder />} />
                <Route path="/orders/:orderId/product" element={<UpdateOrderProduct />} />
                <Route path="/invoice" element={<InvoiceEditor />} />
                <Route path="/upload" element={<UploadDocuments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/stockists" element={<Stockist />} />
                <Route path="/chemists/:chemistId" element={<ChemistProfile />} />
                <Route path="/sell" element={<ProductBilling />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </Route>
            )}
          </>
        ) : (
          // not authenticated
          <>
            <Route path="/" element={<LandingPage />} >
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/security" element={<SecurityPolicyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />

            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<LoginPage />} />

            {/* <Route path="/signup" element={<SignUpPage />} /> */}
            <Route path="/*" element={<Navigate to="/" replace />} />
          </>
        )
        }

      </Routes>
    </AppTheme >
  );
};

export default App;
