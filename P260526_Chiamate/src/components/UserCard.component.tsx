import type { User } from '../model/user.type';

type Props = {
    user: User;
};

export function UserCard({ user}: Props) {
    return ( 
        <article>
            <h2>{user.fullName}</h2>
            <p>{user.email}</p>
        </article>
    );
}