import type { ReactNode } from 'react';

import type { UserPermission } from '../models/user.model';

import { hasPermission } from '../helpers/authHelper';

import { ForbiddenPage } from '../pages/ForbiddenPage';

interface PermissionGuardProps {
    permission: UserPermission;
    children: ReactNode;
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {

    if (!hasPermission(permission)) {
        return <ForbiddenPage />;
    }

    return children;
}