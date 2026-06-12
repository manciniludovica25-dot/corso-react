import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { isAuthenticated } from '../helpers/authHelper';

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({
    children,
}: PrivateRouteProps) {

    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}