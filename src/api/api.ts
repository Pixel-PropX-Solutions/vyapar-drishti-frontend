import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from 'jwt-decode';


interface Token {
    accessToken: string;
    refreshToken: string;
}

const userApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    // baseURL: import.meta.env.VITE_LOCAL_BACKEND_BASE_URL,
    withCredentials: true,
});

// Add request interceptor to always send financial year
// userApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     const year = localStorage.getItem("financial_year") || new Date().getFullYear().toString();

//     if (!config.params) {
//         config.params = {};
//     }
//     config.params.financial_year = year;

//     return config;
// }, (error) => Promise.reject(error));

userApi.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        if (response.data.accessToken && response.data.refreshToken) {
            console.log("Response in user api", response)
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            const decoded: any = jwtDecode(response.data.accessToken);
            const current_company_id = decoded.current_company_id;
            localStorage.setItem("current_company_id", current_company_id);
        }
        return response;
    },

    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post<Token>(
                    // `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
                    `${import.meta.env.VITE_LOCAL_BACKEND_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                console.log("Token refresh response:", data);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                const decoded: any = jwtDecode(data.accessToken);
                const current_company_id = decoded.current_company_id;
                localStorage.setItem("current_company_id", current_company_id);

                userApi.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                return userApi(originalRequest)
            }
            catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("current_company_id");
                window.location.href = "/";
            }
        }
        console.error("API response error:", error);

        return Promise.reject(error);
    }
);

export default userApi;
