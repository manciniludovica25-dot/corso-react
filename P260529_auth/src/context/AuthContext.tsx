import { createContext } from 'react';
import type { User } from '../models/user.model';

export interface AuthContextValue {
    isLoggedIn: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextValue | null>(
        null
    );