import type { User } from './user.model';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterFormData {
    nome: string;
    cognome: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterApiRequest {
    nome: string;
    cognome: string;
    email: string;
    password: string;
    role: 'reader';
    permissions: string[];
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}