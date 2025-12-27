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
import { X } from "lucide-react";
import { Client, product } from "@prisma/client";
import Exchange from "./exchange";

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

export default function TableClients({
  clients,
  products,
}: {
  clients: Client[];
  products: product[];
}) {
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
                onClick={async () => {
                  const key = prompt(
                    `¿Estas seguro de eliminar la cuenta de ${row.getValue(
                      "name"
                    )}? ingrese la llave para confirmar.`
                  );
                  if (key) {
                    const res = await deleteClient(row.getValue("id"), key);
                    if (!res.success) {
                      toast.error(res.error);
                    } else {
                      toast.success("Cliente eliminado");
                    }
                  }
                }}
              >
                <X size={20} />
              </button>
              <Exchange
                id={row.getValue("id")}
                points={row.getValue("points")}
                accountName={row.getValue("name")}
                products={products}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
