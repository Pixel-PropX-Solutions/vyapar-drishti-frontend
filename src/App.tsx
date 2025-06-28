import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { setUser } from "./store/reducers/authReducer";
import { AuthStates, ROLE_ENUM } from "./utils/enums";
import { Route, Routes, useLocation } from "react-router-dom";
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
import Products from "./pages/Products";
// import UploadDocuments from "./pages/UploadDocuments";
import CreateUserProfile from "./features/profile/createUser";
import CreateProduct from "./features/products/createProduct";
// import AdminDashboard from "./pages/AdminDashboard";
import { getCurrentUser } from "./services/auth";
import LandingPage from "./components/LandingPage/LandingPage";
import AboutPage from "./components/About/AboutPage";
import Timeline from "./features/inventory/timeline";
import Warehouse from "./features/inventory/warehouse";
import ViewInventory from "./pages/Inventory";
import ViewItem from "./features/products/ViewItem";
import { ContactPage } from "@mui/icons-material";
import CookiePolicyPage from "./components/Legal/CookiePolicy";
import PrivacyPolicyPage from "./components/Legal/PrivacyPolicyPage";
import SecurityPolicyPage from "./components/Legal/SecurityPolicyPage";
import TermsOfServicePage from "./components/Legal/TermsOfServicePage";
import PricingPage from "./components/Pricing/PricingPage";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/Profile";
import CustomerLedger from "./pages/CustomerLedger";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./components/Invoice/createInvoice";
import GroupAndTypes from "./pages/GroupAndTypes";
import SalePurchaseInvoiceCreation from "./components/Invoice/SalePurchaseInvoiceCreation";
import PaymentReceiptInvoice from "./components/Invoice/PaymentReceiptInvoice";
// import PromptModal from "./common/PromptModal";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const App: React.FC<{ themeComponents?: object }> = (props) => {
  // const [showProfileModal, setShowProfileModal] = React.useState(false);

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
          // await dispatch(getCompany());
          // await dispatch(getCompany());
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

  // useEffect(() => {
  //   if (authState === AuthStates.AUTHENTICATED && user) {
  //     const isProfileComplete = false;
  //     const modalDismissed = localStorage.getItem("company");

  //     if (!isProfileComplete && !modalDismissed) {
  //       setShowProfileModal(true);
  //     }
  //   }
  // }, [authState, user]);


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
            {user?.user_type === ROLE_ENUM.ADMIN && (
              <Route element={<Dashboard />}>
                {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
                {/* <Route path="/" element={<AdminDashboard />} /> */}
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/" element={<ProfilePage />} />
                <Route path="/add/product" element={<CreateProduct />} />
                <Route path="/products/:id" element={<ViewItem />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<ViewInventory />} />
                {/* <Route path="/upload" element={<UploadDocuments />} /> */}
                {/* <Route path="/settings" element={<Settings />} /> */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/create/user" element={<CreateUserProfile />} />
                <Route path="/customers" element={<CustomerLedger />} />
                {/* <Route path="/*" element={<Navigate to="/" replace />} /> */}

              </Route>
            )}

            {user?.user_type === ROLE_ENUM.USER && (
              <Route element={<Dashboard />}>
                {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
                {/* <Route path="/" element={<AdminDashboard />} /> */}
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/" element={<ProfilePage />} />
                <Route path="/add/product" element={<CreateProduct />} />
                <Route path="/products/:id" element={<ViewItem />} />
                <Route path="/products" element={<Products />} />
                <Route path="/groups" element={<GroupAndTypes />} />
                <Route path="/inventory" element={<Warehouse />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/customers" element={<CustomerLedger />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/create" element={<CreateInvoice />} />
                <Route path="/transaction/:type" element={<PaymentReceiptInvoice />} />
                <Route path="/invoices/create/:type" element={<SalePurchaseInvoiceCreation />} />
                {/* <Route path="/*" element={<Navigate to="/" replace />} /> */}
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

            <Route path="/signup" element={<SignUpPage />} />
            {/* <Route path="/*" element={<Navigate to="/" replace />} /> */}
          </>
        )
        }

      </Routes>
      {/* <PromptModal
        open={showProfileModal}
        onClose={() => {
          localStorage.setItem("profilePromptDismissed", "true");
          setShowProfileModal(false);
        }}
        onSubmit={(data) => {
          console.log("Submitted:", data);
          localStorage.setItem("profilePromptDismissed", "true");
          setShowProfileModal(false);
        }}
      /> */}
    </AppTheme >
  );
};

export default App;
