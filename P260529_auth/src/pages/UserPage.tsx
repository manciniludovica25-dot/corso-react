import { useEffect, useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { getUsers } from '../services/userService';

import type { User } from '../models/user.model';

import { LoadingMessage } from '../components/LoadingMessage';
import { ErrorMessage } from '../components/ErrorMessage';

import { hasPermission } from '../helpers/authHelper';

import { useAuth } from '../hooks/useAuth';

export function UsersPage() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [users, setUsers] =
        useState<User[]>([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState('');

    useEffect(() => {

        async function loadUsers() {

            try {

                setIsLoading(true);

                setErrorMessage('');

                const users =
                    await getUsers();

                setUsers(users);

            } catch (error) {

                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 401
                ) {

                    logout();

                    navigate('/login');

                    return;
                }

                setErrorMessage(
                    'Errore durante il caricamento utenti',
                );

            } finally {

                setIsLoading(false);
            }
        }

        void loadUsers();

    }, [logout, navigate]);

    return (
        <div className="page-container">

            <div className="page-card">

                <h1>
                    Gestione Utenti
                </h1>

                {isLoading && (
                    <LoadingMessage
                        message="Caricamento utenti in corso..."
                    />
                )}

                {errorMessage && (
                    <ErrorMessage
                        message={errorMessage}
                    />
                )}

                {!isLoading &&
                    !errorMessage &&
                    users.length === 0 && (
                        <p>
                            Nessun utente trovato.
                        </p>
                    )
                }

                <div className="users-list">

                    {users.map(user => (

                        <div
                            key={user.id}
                            className="user-card"
                        >

                            <p>
                                <strong>
                                    {user.nome} {user.cognome}
                                </strong>
                            </p>

                            <p>
                                {user.email}
                            </p>

                            <p>
                                Ruolo: {user.role}
                            </p>

                            {hasPermission(
                                'user-details',
                            ) && (
                                <button
                                    type="button"
                                >
                                    Dettagli
                                </button>
                            )}

                            {hasPermission(
                                'user-edit',
                            ) && (
                                <button
                                    type="button"
                                >
                                    Modifica
                                </button>
                            )}

                            {hasPermission(
                                'user-delete',
                            ) && (
                                <button
                                    type="button"
                                >
                                    Elimina
                                </button>
                            )}

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}