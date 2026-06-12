import { useAuth } from '../hooks/useAuth';

export function PrivatePage() {

    const { user } = useAuth();

    return (
        <div className="page-container">

            <div className="page-card">

                <h1>
                    Area Privata
                </h1>

                <div className="user-info">

                    <p>
                        Benvenuta {user?.nome}
                    </p>

                    <p>
                        Nome: {user?.nome}
                    </p>

                    <p>
                        Cognome: {user?.cognome}
                    </p>

                    <h2> Permessi </h2>
                    
                    <ul>
                        {user?.permissions.map(permission => (
                            
                            <li key={permission}>
                                
                                {permission}
                            
                            </li>
                            )
                        )}
                    
                    </ul>

                    
                </div>

            </div>

        </div>
    );
}