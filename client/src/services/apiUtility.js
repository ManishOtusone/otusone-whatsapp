import axios from "axios";
import { logout } from "../redux/slices/authSlice";
import store from "../redux/store/store";
import {baseUrl} from '../utils/baseUrl';

const api = axios.create({
    baseURL: baseUrl,
});


api.interceptors.request.use(
    (config) => {
        const { token } = store.getState().auth;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        throw error;
    }
);

api.interceptors.response.use(
    (response) => {
        // console.log("request success", response)
        return response;
    },
    (error) => {
        console.log("request error", error)

        if (error.response && error.response.status === 401) {
            // Unauthorized: clear the token and log the user out
            store.dispatch(logout());

        }
        throw error;
    }
);

export default api;
