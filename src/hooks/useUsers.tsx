import React, { useEffect } from "react";
import { getUsers } from "../services/User/user.service";
import { User } from "../models/login.model";

const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await getUsers({ role: "user" });
      setUsers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsersPromise = async (): Promise<
    { label: string; value: string }[]
  > => {
    return new Promise(async (resolve) => {
      const users = await getUsers({ role: "user" });

      const map = users.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));

      resolve(map);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, fetchUsers, fetchUsersPromise };
};

export default useUsers;
