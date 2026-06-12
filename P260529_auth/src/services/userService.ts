import { apiClient } from './apiClient';

import type { User } from '../models/user.model';

export async function getUsers():
    Promise<User[]> {

    const response =
        await apiClient.get<User[]>(
            '/users',
        );

    return response.data;
}