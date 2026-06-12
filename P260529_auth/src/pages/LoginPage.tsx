import { useState } from 'react';
import type { FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { loginUser } from '../services/authService';

import { useAuth } from '../hooks/useAuth';

import { LoadingMessage } from '../components/LoadingMessage';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';

export function LoginPage() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [isLoading, setIsLoading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState('');

    const [successMessage, setSuccessMessage] =
        useState('');

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {

        event.preventDefault();

        setErrorMessage('');

        try {

            setIsLoading(true);

            const response =
                await loginUser({
                    email,
                    password,
                });

            login(
                response.accessToken,
                response.user,
            );

            setSuccessMessage(
                'Login effettuato con successo. Reindirizzamento in corso...',
            );

            window.setTimeout(() => {

                navigate('/private');

            }, 1500);

        } catch {

            setErrorMessage(
                'Credenziali non valide',
            );

        } finally {

            setIsLoading(false);
        }
    }

    if (successMessage) {

        return (
            <div className="page-container">

                <div className="page-card">

                    <h1>
                        Login
                    </h1>

                    <SuccessMessage
                        message={successMessage}
                    />

                </div>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-card">

                <h1>
                    Login
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value,
                            )
                        }
                        placeholder="Email"
                    />

                    <input
                        type="password"
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value,
                            )
                        }
                        placeholder="Password"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                    >
                        Login
                    </button>

                </form>

                {isLoading && (
                    <LoadingMessage
                        message="Accesso in corso..."
                    />
                )}

                {errorMessage && (
                    <ErrorMessage
                        message={errorMessage}
                    />
                )}

            </div>

        </div>
    );
}