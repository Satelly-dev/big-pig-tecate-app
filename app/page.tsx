import { ClientToTable } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Shop from "@/components/transaction";
import Table from "@/components/table";
import Wallet from "@/components/wallet";
import NewClient from "@/components/new_client";
import NewProduct from "@/components/new_product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Home() {
  const [clients, products] = await Promise.all([
    prisma.client.findMany({
      include: {
        transactions: true,
      },
    }),
    prisma.product.findMany(),
  ]);

  const formattedClients: ClientToTable[] = clients.map((client) => ({
    ...client,
    transactions: client.transactions.length,
    cans: 0,
    status: "Activo",
  }));

  return (
    <div className="h-screen relative overflow-hidden">
      <main>
        <h1 className="text-2xl text-slate-800 text-center my-5">
          📌 Big Pig{" "}
        </h1>
        <section className="flex justify-between px-5">
          <div className="w-1/2">
            <Table clients={formattedClients} />
          </div>
          <div className="w-1/2 space-y-3">
            <Wallet />
          </div>
        </section>
        <div className="absolute bottom-10 right-10 h-fit flex flex-col gap-y-5">
          <Shop clients={formattedClients} products={products} />
          <DropdownMenu>
            <DropdownMenuTrigger className="border border-slate-300 rounded-full p-2 shadow-md hover:bg-slate-100 hover:cursor-pointer transition-colors ease-in">
              <Plus size={24} strokeWidth={1.5} className="text-slate-800" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" sideOffset={10}>
              <DropdownMenuLabel>Selecciona una opción</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NewClient />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NewProduct />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </main>
    </div>
  );
}
