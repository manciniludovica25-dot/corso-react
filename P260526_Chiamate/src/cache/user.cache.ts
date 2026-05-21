import type { User } from "../model/user.type";

const USERS_CACHE_KEY = "user_list_cache";

const CACHE_DURATION_IN_MS = 2*60*1000;

type UserCache = {
    users: User[];
    savedAt: number;
}

let usersMemoryCache: UserCache | null = null;

export function saveUserToCache (users: User[]) : void {
    usersMemoryCache = {
        users,
        savedAt: Date.now(),
    };
}

export function getUserFromCache(): User[] | null {
    if (!usersMemoryCache) {
        return null;
    }

    const currentTime = Date.now();

    const cacheAge = currentTime - usersMemoryCache.savedAt;

    const isCacheExpired = cacheAge > CACHE_DURATION_IN_MS;

    if (isCacheExpired) {
        invalidateUserCache();

        return null;
    }

    return usersMemoryCache.users;
}

export function invalidateUserCache(): void {
    usersMemoryCache  = null;
}

export { USERS_CACHE_KEY };

