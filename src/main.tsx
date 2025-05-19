import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: "",
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: "#fff",
                color: "#000",
                zIndex: "1000",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "green",
                  secondary: "white",
                },
              },
            }}
          />
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
