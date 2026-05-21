import { useUsers } from "../hook/useUsers.hook"
import { UserCard } from "./UserCard.component";
import { UserListStatus } from "./UserListStatus.component"  

export function UserList() {
  const {
    users,
    userListStatus,
    dataSource,
    reloadUsers,
  } = useUsers();

const shouldShowUsers = 
  userListStatus === "success";

  return (
    <section>
        <h1>Lista Utenti</h1>

        <button onClick={reloadUsers}>
            Ricarica Utenti
        </button>

        {dataSource && ( 
            <p>
                Dati caricati da: {dataSource}
            </p>
        )}

        <UserListStatus status = 
            {userListStatus}
        />

        {shouldShowUsers && (
            <div>
                {users.map((user)=> (
                    <UserCard 
                        key = {user.id}
                        user = {user}
                />
            ))}

            </div>
        )}

    </section>
  );
}