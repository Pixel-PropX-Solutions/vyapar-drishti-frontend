import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface Token {
    adminAccessToken: string;
    adminRefreshToken: string;
}

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_ADMIN_URL,
    // baseURL: import.meta.env.VITE_LOCAL_BACKEND_ADMIN_URL,
    withCredentials: true,
});

adminApi.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        if (response.data.adminAccessToken && response.data.adminRefreshToken) {
            localStorage.setItem("accessToken", response.data.adminAccessToken);
            localStorage.setItem("refreshToken", response.data.adminRefreshToken);
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
                const {data} = await axios.post<Token>(
                    `${import.meta.env.VITE_LOCAL_BACKEND_ADMIN_URL}/auth/refresh`,
                    {},
                    {withCredentials : true}
                );
                localStorage.setItem("accessToken", data.adminAccessToken);
                localStorage.setItem("refreshToken", data.adminRefreshToken);

                adminApi.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.adminAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${data.adminAccessToken}`;

                return adminApi(originalRequest)
            }
            catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default adminApi;
