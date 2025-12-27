"use client";

import { deleteProduct, updateProduct } from "@/app/actions";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Pencil, X } from "lucide-react";
import { product } from "@prisma/client";

const columnHelper = createColumnHelper<product>();

const columns = [
  columnHelper.accessor("id", {
    header: "Id",
  }),
  columnHelper.accessor("name", {
    header: "Nombre",
  }),
  columnHelper.accessor("price", {
    header: "Precio",
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
  }),
];

export default function TableProducts({ products }: { products: product[] }) {
  const tableInstance = useReactTable({
    columns,
    data: products,
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
          <th className="px-3 py-2 whitespace-nowrap">Precio</th>
          <th className="px-3 py-2 whitespace-nowrap">Stock</th>
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
              {row.getValue("price")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {row.getValue("stock")}
            </td>
            <td className="px-3 py-2 whitespace-nowrap flex items-center gap-x-5">
              <button
                type="button"
                title={`Eliminar ${row.getValue("id")}`}
                className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                onClick={() => {
                  const key = prompt(
                    `¿Estas seguro de eliminar el producto ${row.getValue(
                      "name"
                    )}? ingrese la llave para confirmar.`
                  );
                  if (key) {
                    deleteProduct(row.getValue("id"), key);
                  }
                }}
              >
                <X size={20} />
              </button>
              <button
                type="button"
                title={`Almacenar dinero`}
                className="text-slate-500 hover:text-slate-700 hover:cursor-pointer"
                onClick={async () => {
                  const key = prompt(
                    `¿Ingrese la llave para confirmar la edicion del producto ${row.getValue(
                      "name"
                    )}?`
                  );
                  if (key) {
                    const price = prompt(
                      `Ingrese el nuevo precio del producto ${row.getValue(
                        "name"
                      )}`
                    );
                    const stock = prompt(
                      `Ingrese el nuevo stock del producto ${row.getValue(
                        "name"
                      )}`
                    );
                    if (price && stock) {
                      const res = await updateProduct(
                        row.getValue("id"),
                        key,
                        price,
                        stock
                      );
                      if (!res.success) {
                        toast.error(res.error);
                      } else {
                        toast.success("Producto editado");
                      }
                    }
                  }
                }}
              >
                <Pencil strokeWidth={1.5} size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
