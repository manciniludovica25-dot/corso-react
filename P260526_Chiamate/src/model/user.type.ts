export type User = {
    id: number;
    fullName: string;
    email: string;
}


export type UserApiResponse = {
    id: number;
    first_name: string;
    email: string;
};

export type UserListStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';