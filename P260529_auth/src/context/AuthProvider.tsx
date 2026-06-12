import { useState } from 'react';

import type { User } from '../models/user.model';

import { AuthContext } from './AuthContext';

import {
    getAccessToken,
    getUser,
    removeAccessToken,
    removeUser,
    saveAccessToken,
    saveUser,
} from '../helpers/localStorageHelper';

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [isLoggedIn, setIsLoggedIn] =
        useState(Boolean(getAccessToken()));

    const [user, setUser] =
        useState<User | null>(
            getUser(),
        );

    function login(
        token: string,
        user: User,
    ): void {

        saveAccessToken(token);

        saveUser(user);

        setUser(user);

        setIsLoggedIn(true);
    }

    function logout(): void {

        removeAccessToken();

        removeUser();

        setUser(null);

        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}