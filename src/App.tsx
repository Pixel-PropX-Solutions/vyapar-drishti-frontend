import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { setUser } from "./store/reducers/authReducer";
import { AuthStates, ROLE_ENUM } from "./utils/enums";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "./pages/Dashboard";
import { CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import Products from "./pages/Products";
import CreateUserProfile from "./features/profile/createUser";
import CreateProduct from "./features/products/createProduct";
import { getCurrentUser } from "./services/auth";
import LandingPage from "./components/LandingPage/LandingPage";
import AboutPage from "./components/About/AboutPage";
import Timeline from "./pages/Timeline";
import ViewItem from "./features/products/ViewItem";
import CookiePolicyPage from "./components/Legal/CookiePolicy";
import PrivacyPolicyPage from "./components/Legal/PrivacyPolicyPage";
import SecurityPolicyPage from "./components/Legal/SecurityPolicyPage";
import TermsOfServicePage from "./components/Legal/TermsOfServicePage";
import PricingPage from "./components/Pricing/PricingPage";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/Profile";
import CustomerLedger from "./pages/CustomerLedger";
import Invoices from "./pages/Invoices";
import SalePurchaseInvoiceCreation from "./components/Invoice/SalePurchaseInvoiceCreation";
import PaymentReceiptInvoice from "./components/Invoice/PaymentReceiptInvoice";
import UpdateSalePurchase from "./components/Invoice/UpdateSalePurchase";
import Transactions from "./pages/Transactions";
import Inventory from "./pages/Inventory";
import EditCustomer from "./features/customer/EditCustomer";
import CustomerProfile from "./features/customer/CustomerProfile";
import Xyz from "./pages/xyz";
import toast from "react-hot-toast";
import CenterLoader from "./common/loaders/CenterLoader";
import ContactPage from "./components/Contact/ContactPage";
import UpdatePaymentReceipt from "./components/Invoice/UpdatePaymentReceipt";
import { ViewInvoiceInfo } from "./components/Invoice/ViewInvoice";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
// import PromptModal from "./common/modals/PromptModal";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const App: React.FC<{ themeComponents?: object }> = (props) => {
  // const [showProfileModal, setShowProfileModal] = React.useState(false);

  const { authState, user, isUserFetched, switchCompanyLoading, deleteCompanyLoading } = useSelector(
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
          await dispatch(getCurrentUser()).unwrap().then(() => {
            dispatch(setUser({ authState: AuthStates.AUTHENTICATED }));
          }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
          });
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
                {/* <Route path="/inventory" element={<AdminInventory />} /> */}
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
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/" element={<ProfilePage />} />
                <Route path="/add/product" element={<CreateProduct />} />
                <Route path="/products/:id" element={<ViewItem />} />
                <Route path="/products" element={<Products />} />
                <Route path="/warehouses" element={<Inventory />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/customers" element={<CustomerLedger />} />
                <Route path="/customers/view/:customer_id" element={<CustomerProfile />} />
                <Route path="/customers/create/:type" element={<EditCustomer />} />
                <Route path="/customers/edit/:type" element={<EditCustomer />} />

                <Route path="/transactions" element={<Transactions />} />
                {/* <Route path="/expenses" element={<Transactions />} /> */}
                <Route path="/transactions/create/:type" element={<PaymentReceiptInvoice />} />
                <Route path="/transactions/update/:type/:voucher_id" element={<UpdatePaymentReceipt />} />

                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/:invoice_id" element={<ViewInvoiceInfo />} />
                <Route path="/invoices/create/:type" element={<SalePurchaseInvoiceCreation />} />
                <Route path="/invoices/update/:type/:voucher_id" element={<UpdateSalePurchase />} />
                <Route path="/xyz" element={<Xyz />} />
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify" element={<VerifyEmail />} />
            {/* <Route path="/*" element={<Navigate to="/" replace />} /> */}
          </>
        )
        }

      </Routes>
      {!isInitialized.current &&
        <CenterLoader size={80} />
      }
      {(authState === AuthStates.INITIALIZING && user === null) &&
        <CenterLoader size={80} />
      }
      {switchCompanyLoading &&
        <CenterLoader size={80} />
      }
      {deleteCompanyLoading &&
        <CenterLoader size={80} />
      }
      {/* <PromptModal
        open={showProfileModal}
        onClose={() => {
          localStorage.setItem("profilePromptDismissed", "true");
          setShowProfileModal(false);
        }}
        onSubmit={(data) => {
          localStorage.setItem("profilePromptDismissed", "true");
          setShowProfileModal(false);
        }}
      /> */}
    </AppTheme >
  );
};

export default App;
