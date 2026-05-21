import { fetchMockUsers } from './user.api';
import { getUserFromCache, saveUserToCache} from '../cache/user.cache';
import { validateUsersApiResponse } from "../validators/user.validator";
import { mapUserApiResponseToUser } from "../mappers/user.mapper";
import type { User } from "../model/user.type";

type UserDataSource = "cache" | "api";

export type GetUsersResponse = {
    users: User[];
    source: UserDataSource;
};

export async function getUsers(): Promise<GetUsersResponse> {

    const cachedUsers = getUserFromCache();

    if (cachedUsers) {
        return {
            users: cachedUsers,
            source: "cache",
        };
    }

    const usersApiResponse = await fetchMockUsers();

    const validUsersApiResponse = validateUsersApiResponse(usersApiResponse);

    const mappedUsers = validUsersApiResponse
    .map(mapUserApiResponseToUser
    );
    saveUserToCache(mappedUsers);

    return {
        users: mappedUsers,
        source : "api",

    };
}