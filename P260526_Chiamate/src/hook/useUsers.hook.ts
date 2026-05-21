import { useCallback, useEffect, useRef, useState } from 'react';
import { getUsers } from "../services/user.service";
import type { User, UserListStatus } from "../model/user.type";

type UserDataSource = "cache" | "api" | null; 

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);

  const [userListStatus, setUserListStatus] =
    useState<UserListStatus>("idle");

  const [dataSource, setDataSource] =
    useState<UserDataSource>(null);

  const latestRequestId = useRef(0);

  const loadUsers = useCallback(async () => {
    const currentRequestId =
      ++latestRequestId.current;

    setUserListStatus("loading");

    try {
      const response = await getUsers();

      const isOutdatedRequest =
        currentRequestId !== latestRequestId.current;

      if (isOutdatedRequest) {
        return;
      }

      setUsers(response.users);

      setDataSource(response.source);

      const isEmptyUserList =
        response.users.length === 0;

      if (isEmptyUserList) {
        setUserListStatus("empty");

        return;
      }

      setUserListStatus("success");

    } catch {
      const isOutdatedRequest =
        currentRequestId !== latestRequestId.current;

      if (isOutdatedRequest) {
        return;
      }

      setUserListStatus("error");
    }
}, []);

  useEffect(() => {
    async function initializeUsers() {
    await loadUsers();
    }

  void initializeUsers();
  }, [loadUsers]);
  
  
  return {
    users,
    userListStatus,
    dataSource,
    reloadUsers: loadUsers,
  };
}