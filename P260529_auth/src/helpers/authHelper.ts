import {
    getAccessToken,
    getUser,
} from './localStorageHelper';

import type {
    UserPermission,
} from '../models/user.model';

export function isAuthenticated(): boolean {

    return Boolean(
        getAccessToken(),
    );
}

export function hasPermission(
    permission: UserPermission,
): boolean {

    const user =
        getUser();

    return (
        user?.permissions?.includes(
            permission,
        ) ?? false
    );
}

export function hasAnyPermission(
    permissions: UserPermission[],
): boolean {

    const user =
        getUser();

    if (!user) {
        return false;
    }

    return permissions.some(
        permission =>
            user.permissions.includes(
                permission,
            ),
    );
}

export function hasAllPermissions(
    permissions: UserPermission[],
): boolean {

    const user =
        getUser();

    if (!user) {
        return false;
    }

    return permissions.every(
        permission =>
            user.permissions.includes(
                permission,
            ),
    );
}