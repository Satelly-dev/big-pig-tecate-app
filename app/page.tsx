import { ClientToTable } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Shop from "@/components/transaction";
import TableClients from "@/components/table_clients";
import TableProducts from "@/components/table_products";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);

  const [clients, products, exchanges, withdrawals] = await Promise.all([
    prisma.client.findMany({
      include: {
        transactions: {
          where: {
            createdAt: {
              gte: yesterday,
            },
          },
        },
      },
    }),
    prisma.product.findMany(),
    prisma.exchange.findMany(),
    prisma.withdrawal.findMany(),
  ]);

  const formattedClients: ClientToTable[] = clients.map((client) => ({
    ...client,
    transactions: client.transactions.length,
    cans: client.transactions.reduce(
      (acc, transaction) => acc + transaction.stock,
      0
    ),
    status: "Activo",
  }));

  const profit = exchanges.reduce((acc, exchange) => acc + exchange.revenue, 0);
  const withdrawal = withdrawals.reduce(
    (acc, withdrawal) => acc + withdrawal.amount,
    0
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <main>
        <h1 className="text-4xl font-semibold text-slate-800 my-5 px-14">
          🧌 Tkte Mng
        </h1>
        <section className="flex justify-between px-5">
          <div className="w-1/2">
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="ml-10">
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="products">Productos</TabsTrigger>
              </TabsList>
              <TabsContent value="clients">
                <TableClients clients={formattedClients} products={products} />
              </TabsContent>
              <TabsContent value="products">
                <TableProducts products={products} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-1/2 space-y-3">
            <Wallet profit={profit} withdrawal={withdrawal} />
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
