import type { UserListStatus } from "../model/user.type";

type Props = { 
    status: UserListStatus;

};

export function UserListStatus({ status }: Props) {

    if (status === "idle") {
        return (
        <p>Lista ancora non caricata</p>
        );
    }

    if (status === "loading") {
          return (
        <p>Caricamento in corso...</p>
        );
    }

    if (status === "empty") {
          return (
        <p>Nessun dato disponibile</p>
        );
    }

    if (status === "error") {
          return (
        <p>Errore durante il caricamento</p>
        );
    }
    
    return null;
    
} 