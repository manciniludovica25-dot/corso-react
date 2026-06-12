import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../helpers/authHelper';

export function Navbar() {

    const {
        isLoggedIn,
        user,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    function handleLogout(): void {

        logout();

        navigate('/login');
    }

    return (
        <nav>

            <Link to="/">
                Home
            </Link>

            {!isLoggedIn && (
                <>
                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Registrazione
                    </Link>
                </>
            )}

            {isLoggedIn &&
                hasPermission('users-view') && (
                 <Link to="/users">
                    Utenti
                    </Link>
                )
            }

            {isLoggedIn && (
                <>
                    <Link to="/private">
                        Area Privata
                    </Link>

                    <span>
                        {user?.nome}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </>
            )}

        </nav>
    );
}