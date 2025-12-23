"use client";

import { deleteClient } from "@/app/actions";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import type { ClientToTable } from "@/lib/types";
import { Archive, X } from "lucide-react";
import { Client } from "@prisma/client";

const columnHelper = createColumnHelper<ClientToTable>();

const columns = [
  columnHelper.accessor("id", {
    header: "Id",
  }),
  columnHelper.accessor("name", {
    header: "Nombre",
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Telefono",
  }),
  columnHelper.accessor("points", {
    header: "Puntos",
  }),
  columnHelper.accessor("transactions", {
    header: "Txh",
  }),
  columnHelper.accessor("cans", {
    header: "Lath",
  }),
  columnHelper.accessor("status", {
    header: "Estado",
  }),
];

export default function Table({ clients }: { clients: Client[] }) {
  const tableInstance = useReactTable({
    columns,
    data: clients,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="w-[90%] mx-auto divide-y-2 divide-gray-200">
      <thead className="ltr:text-left rtl:text-right">
        <tr className="*:font-medium *:text-gray-900">
          <th className="px-3 py-2 whitespace-nowrap">Id</th>
          <th className="px-3 py-2 whitespace-nowrap">Nombre</th>
          <th className="px-3 py-2 whitespace-nowrap">Telefono</th>
          <th className="px-3 py-2 whitespace-nowrap">Puntos</th>
          <th className="px-3 py-2 whitespace-nowrap">Txh</th>
          <th className="px-3 py-2 whitespace-nowrap">Lath</th>
          <th className="px-3 py-2 whitespace-nowrap">Estado</th>
          <th className="px-3 py-2 whitespace-nowrap">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
        {tableInstance.getSortedRowModel().rows.map((row) => (
          <tr key={row.id} className="*:text-gray-900 *:first:font-medium">
            <td className="px-3 py-2 whitespace-nowrap">
              <p className="w-24 truncate">{row.getValue("id")}</p>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("name")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("phoneNumber")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("points")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("transactions")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("cans")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("status")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap flex items-center gap-x-5">
              <button
                type="button"
                title={`Eliminar ${row.getValue("id")}`}
                className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                onClick={() => {
                  const key = prompt(
                    `¿Estas seguro de eliminar la cuenta de ${row.getValue(
                      "name"
                    )}? ingrese la llave para confirmar.`
                  );
                  if (key) {
                    deleteClient(row.getValue("id"), key);
                  }
                }}
              >
                <X size={20} />
              </button>
              <button
                type="button"
                title={`Almacenar dinero`}
                className="text-slate-500 hover:text-slate-700 hover:cursor-pointer"
                onClick={() =>
                  confirm(
                    `¿Estas seguro de canjear los puntos de la cuenta de ${row.getValue(
                      "name"
                    )}?`
                  )
                    ? console.log("Canjear", row.getValue("id"))
                    : null
                }
              >
                <Archive strokeWidth={1.5} size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
