import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface Token {
    accessToken: string;
    refreshToken: string;
}

const userApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    // baseURL: import.meta.env.VITE_LOCAL_BACKEND_BASE_URL,
    withCredentials: true,
});

userApi.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
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
                    // `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/handleRefreshToken`,
                    `${import.meta.env.VITE_LOCAL_BACKEND_BASE_URL}/auth/handleRefreshToken`,
                    {},
                    {withCredentials : true}
                );
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

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
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default userApi;
