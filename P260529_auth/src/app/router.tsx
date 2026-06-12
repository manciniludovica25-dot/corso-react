import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '../layouts/AppLayout';

import { PublicPage } from '../pages/PublicPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivatePage } from '../pages/PrivatePage';

import { PrivateRoute } from '../guards/PrivateRoute';
import { GuestRoute } from '../guards/GuestRoute';
import { PermissionGuard } from '../guards/PermissionGuard';
import { UsersPage } from '../pages/UserPage';

export const router =
    createBrowserRouter([
        {
            element: <AppLayout />,
            children: [
                {
                    path: '/',
                    element: <PublicPage />,
                },
                {
                    path: '/login',
                    element: (
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    ),
                },
                {
                    path: '/register',
                    element: (
                        <GuestRoute>
                            <RegisterPage />
                        </GuestRoute>
                    ),
                },
                {
                    path: '/private',
                    element: (
                        <PrivateRoute>
                            <PrivatePage />
                        </PrivateRoute>
                    ),
                },
                {
                    path: '/users',
                    element: (
                        <PrivateRoute>
                            <PermissionGuard
                                 permission="users-view"
                             >
                                <UsersPage />
                            </PermissionGuard>
                        </PrivateRoute>
                    ),
                }
            ],
        },
    ]);