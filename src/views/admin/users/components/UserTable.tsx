import React, { useEffect } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Card from "../../../../components/card";
import { User } from "../../../../models/login.model";

interface UserTableRow extends User {
  action?: {
    onUpdate: () => void;
    onDelete: () => void;
  };
}

const columnHelper = createColumnHelper<UserTableRow>();

const UserTable = ({
  users,
  onEdit,
  onDelete,
}: {
  users: UserTableRow[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = [
    columnHelper.accessor("name", {
      id: "Name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Name</p>
      ),
      cell: (info) => {
        return (
          <div className="flex items-center">
            <img
              src={info.row.original.avatar}
              className="mr-5 h-10 w-10 rounded-full object-cover"
              alt={info.getValue()}
            />
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {info.getValue()}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("email", {
      id: "Email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Email</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("username", {
      id: "Username",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Username
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("role", {
      id: "Role",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Role</p>
      ),
      cell: (info) => {
        switch (info.getValue()) {
          case "admin":
            return (
              <div className="w-fit rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-brand-400">
                ADMIN
              </div>
            );
          default:
            return (
              <div className="w-fit rounded-lg bg-green-500 px-3 py-2 text-xs font-bold uppercase text-white transition duration-200 dark:bg-green-400">
                KARYAWAN
              </div>
            );
        }
      },
    }),
    columnHelper.accessor("action", {
      id: "Action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Actions
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <button
            onClick={() => onEdit(info.row.original.id)}
            className="rounded-[20px] bg-brand-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)}
            className="ml-2 rounded-[20px] bg-red-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = React.useState<UserTableRow[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="min-w-[150px] border-white/0 py-3  pr-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UserTable;
