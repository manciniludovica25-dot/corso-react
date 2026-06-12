import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { isAuthenticated } from '../helpers/authHelper';

interface GuestRouteProps {
    children: ReactNode;
}

export function GuestRoute({
    children,
}: GuestRouteProps) {

    if (isAuthenticated()) {
        return (
            <Navigate
                to="/private"
                replace
            />
        );
    }

    return children;
}