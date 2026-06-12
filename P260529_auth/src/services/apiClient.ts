import axios from 'axios';

import { API_BASE_URL } from '../config/apiConfig';

import { getAccessToken } from '../helpers/localStorageHelper';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    config => {

        const accessToken =
            getAccessToken();

        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
);