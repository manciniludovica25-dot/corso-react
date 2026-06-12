import { apiClient } from './apiClient';

import type { LoginRequest, RegisterApiRequest, LoginResponse } from '../models/auth.model';

export async function loginUser(
    payload: LoginRequest,
): Promise<LoginResponse> {

    const response =
        await apiClient.post<LoginResponse>(
            '/login',
            payload,
        );

    return response.data;
}

export async function registerUser(
    payload: RegisterApiRequest,
): Promise<LoginResponse> {

    const response =
        await apiClient.post<LoginResponse>(
            '/register',
            payload,
        );

    return response.data;
}