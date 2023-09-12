import React, { useEffect } from "react";
import { getUsers } from "../services/User/user.service";
import { User } from "../models/login.model";

const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  const fetchUsers = async ({
    role = null,
    name = null,
  }: {
    role?: "admin" | "user";
    name?: string;
  }) => {
    try {
      const result = await getUsers({
        name,
        role,
      });
      setUsers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsersPromise = async (): Promise<
    { label: string; value: string }[]
  > => {
    return new Promise(async (resolve) => {
      const users = await getUsers({});

      const map = users.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));

      resolve(map);
    });
  };

  useEffect(() => {
    fetchUsers({});
  }, []);

  return { users, fetchUsers, fetchUsersPromise };
};

export default useUsers;
