export type UserRole =
    | 'reader'
    | 'editor'
    | 'admin';

export type UserPermission =
    | 'users-view'
    | 'user-details'
    | 'user-create'
    | 'user-edit'
    | 'user-delete';

export interface User {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    role: UserRole;
    permissions: UserPermission[];
}