import { useState } from 'react';
import type { FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { registerUser } from '../services/authService';

import { useAuth } from '../hooks/useAuth';

import { LoadingMessage } from '../components/LoadingMessage';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';

export function RegisterPage() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [nome, setNome] =
        useState('');

    const [cognome, setCognome] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
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

        if (!nome.trim()) {

            setErrorMessage(
                'Inserire il nome',
            );

            return;
        }

        if (!cognome.trim()) {

            setErrorMessage(
                'Inserire il cognome',
            );

            return;
        }

        if (password.length < 6) {

            setErrorMessage(
                'La password deve contenere almeno 6 caratteri',
            );

            return;
        }

        if (password !== confirmPassword) {

            setErrorMessage(
                'Le password non coincidono',
            );

            return;
        }

        try {

            setIsLoading(true);

            const response =
                await registerUser({
                    nome,
                    cognome,
                    email,
                    password,
                    role: 'reader',
                    permissions: [
                        'user-view'
                    ] as const
                });

            login(
                response.accessToken,
                response.user,
            );

            setSuccessMessage(
                'Registrazione effettuata con successo. Reindirizzamento in corso...',
            );

            window.setTimeout(() => {

                navigate('/private');

            }, 2000);

        } catch {

            setErrorMessage(
                'Impossibile completare la registrazione',
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
                        Registrazione
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
                    Registrazione
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        required
                        disabled={isLoading}
                        value={nome}
                        onChange={(event) =>
                            setNome(
                                event.target.value,
                            )
                        }
                        placeholder="Nome"
                    />

                    <input
                        type="text"
                        required
                        disabled={isLoading}
                        value={cognome}
                        onChange={(event) =>
                            setCognome(
                                event.target.value,
                            )
                        }
                        placeholder="Cognome"
                    />

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

                    <input
                        type="password"
                        required
                        disabled={isLoading}
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value,
                            )
                        }
                        placeholder="Conferma Password"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                    >
                        Registrati
                    </button>

                </form>

                {isLoading && (
                    <LoadingMessage
                        message="Registrazione in corso..."
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