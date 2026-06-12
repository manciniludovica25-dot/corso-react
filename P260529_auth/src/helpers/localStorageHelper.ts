import type { User } from '../models/user.model';

const ACCESS_TOKEN_KEY = 'access_token';

const USER_KEY = 'user';

export function saveAccessToken(
    token: string,
): void {

    localStorage.setItem(
        ACCESS_TOKEN_KEY,
        token,
    );
}

export function getAccessToken():
    string | null {

    return localStorage.getItem(
        ACCESS_TOKEN_KEY,
    );
}

export function removeAccessToken():
    void {

    localStorage.removeItem(
        ACCESS_TOKEN_KEY,
    );
}

export function saveUser(
    user: User,
): void {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user),
    );
}

export function getUser():
    User | null {

    const user =
        localStorage.getItem(
            USER_KEY,
        );

    if (!user) {
        return null;
    }

    return JSON.parse(user) as User;
}

export function removeUser():
    void {

    localStorage.removeItem(
        USER_KEY,
    );
}