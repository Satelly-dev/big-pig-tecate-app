"use client";

import { createWithdrawal } from "@/app/actions";
import { BanknoteArrowUpIcon } from "lucide-react";

export default function Wallet({
  profit,
  withdrawal,
}: {
  profit: number;
  withdrawal: number;
}) {
  return (
    <section className="flex gap-x-5">
      <article className="p-2">
        <div>
          <div className="flex items-center gap-x-2">
            <p className="text-sm text-slate-800">Profit</p>
            <button
              title="Retirar dinero"
              type="button"
              onClick={async () => {
                const key = prompt("Ingrese la llave para realizar el retiro");
                if (key) {
                  const amount = prompt(
                    `Ingrese la cantidad a retirar, su saldo actual es de $${
                      profit - withdrawal
                    } pesos`
                  );
                  if (amount) {
                    const res = await createWithdrawal({
                      key,
                      amount: Number(amount),
                    });
                    if (!res.success) {
                      alert(res.error);
                    } else {
                      alert("Retiro realizado correctamente");
                    }
                  }
                }
              }}
            >
              <BanknoteArrowUpIcon className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-2xl font-medium text-gray-900">
            ${profit - withdrawal}
          </p>
        </div>

        {/* <div className="mt-1 flex gap-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>

          <p className="flex gap-2 text-xs">
            <span className="font-medium"> 67.81% </span>

            <span className="text-gray-500"> Desde la semana pasada </span>
          </p>
        </div> */}
      </article>
      <article className="bg-white p-2">
        <div>
          <p className="text-sm text-slate-800">Retirado</p>

          <p className="text-2xl font-medium text-gray-900">${withdrawal}</p>
        </div>
      </article>
    </section>
  );
}
