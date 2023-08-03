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
import { AttendanceModel } from "../../../../models/attendance.model";
import { MdBolt } from "react-icons/md";
import Badge from "./Badge";

interface AttendanceTableRow extends AttendanceModel {
  action?: {
    onUpdate: () => void;
    onDelete: () => void;
  };
}

const columnHelper = createColumnHelper<AttendanceTableRow>();

const AttendanceTable = ({
  attendances,
  onEdit,
  onDelete,
}: {
  attendances: AttendanceTableRow[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = [
    columnHelper.accessor("user.name", {
      id: "Name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Nama</p>
      ),
      cell: (info) => {
        return (
          <div className="flex items-center">
            <img
              src={info.row.original.user.avatar}
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
    columnHelper.accessor("date", {
      id: "Tanggal Masuk",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Tanggal Masuk
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? info.getValue().toString() : "-"}
        </p>
      ),
    }),
    columnHelper.accessor("time_sign_in", {
      id: "Jam Masuk",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Jam Masuk
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? info.getValue().toString() : "-"}
        </p>
      ),
    }),
    columnHelper.accessor("time_sign_out", {
      id: "Jam Keluar",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Jam Keluar
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? info.getValue().toString() : "-"}
        </p>
      ),
    }),

    columnHelper.accessor("work_time", {
      id: "Jam Bekerja",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Jam Bekerja
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() ? info.getValue().toString() + " Jam" : "-"}
        </p>
      ),
    }),
    columnHelper.accessor("type", {
      id: "Status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Status
        </p>
      ),
      cell: (info) => {
        switch (info.getValue()) {
          case "present":
            return <Badge text="Hadir" color="bg-green-500" />;
          case "absent":
            return (
              <div className="flex items-center gap-5">
                <Badge text="Tidak Hadir" color="bg-red-500" />
                <Badge
                  text={
                    info.row.original.absence_type === "sick"
                      ? "Sakit"
                      : info.row.original.absence_type === "permit"
                      ? "Izin"
                      : "Lainnya"
                  }
                />
              </div>
            );
          case "late":
            return <Badge text="Terlambat" color="bg-yellow-500" />;
          default:
            return (
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                {"-"}
              </p>
            );
        }
      },
    }),
    columnHelper.accessor("action", {
      id: "Action",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Lokasi
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <a
            href={`https://maps.google.com/?q=${info.row.original.latitude_in},${info.row.original.longitude_in}`}
            target="_blank"
            className={`min-w-max rounded-[20px] bg-brand-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-600 ${
              info.row.original.latitude_in && info.row.original.longitude_in
                ? "bg-green-500 hover:bg-green-600"
                : "pointer-events-none cursor-default bg-gray-300"
            }`}
            rel="noreferrer"
          >
            Lokasi Masuk
          </a>
          <a
            href={`https://maps.google.com/?q=${info.row.original.latitude_out},${info.row.original.longitude_out}`}
            target="_blank"
            className={`ml-2 min-w-max rounded-[20px] px-5 py-2 text-white transition-colors duration-200 ${
              info.row.original.latitude_out && info.row.original.longitude_out
                ? "bg-red-500 hover:bg-red-600"
                : "pointer-events-none cursor-default bg-gray-300"
            }`}
            rel="noreferrer"
          >
            Lokasi Keluar
          </a>
          {info.row.original.file_absence && (
            <a
              href={`http://103.175.221.10:3000/${info.row.original.file_absence}`}
              target="_blank"
              className={`ml-2 min-w-max rounded-[20px] bg-blue-500 px-5 py-2 text-white transition-colors duration-200`}
              rel="noreferrer"
            >
              File Absensi
            </a>
          )}
        </div>
      ),
    }),
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = React.useState<AttendanceTableRow[]>([]);

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
    setData(attendances);
  }, [attendances]);

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="overflow-x-scroll 4xl:overflow-x-hidden">
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

export default AttendanceTable;
