"use client";

import { useState } from "react";
import { transactionSchema } from "@/lib/schemas";
import type { product } from "@prisma/client";
import type { TransactionSchemaType } from "@/lib/schemas";
import type { ClientToTable } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

export default function Shop({
  clients,
  products,
}: {
  clients: ClientToTable[];
  products: product[];
}) {
  const [clientSelected, setClientSelected] = useState<ClientToTable | null>(
    null
  );
  const [productSelected, setProductSelected] = useState<product | null>(null);

  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      client: "",
      amount: 0,
      total: 0,
    },
  });

  const onSubmit = (data: TransactionSchemaType) => {
    console.log(data);
  };

  return (
    <Sheet>
      <SheetTrigger className="border border-slate-300 rounded-full p-2 shadow-md hover:bg-slate-100 hover:cursor-pointer transition-colors ease-in">
        <Store size={24} strokeWidth={1.5} className="text-slate-800" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comprar</SheetTitle>
          <SheetDescription>Agregar puntos a un cliente.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 px-5"
          >
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={client.id}
                          onClick={() => setClientSelected(client)}
                        >
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Cliente al que se le agregaran puntos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id}
                          onClick={() => setProductSelected(product)}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Producto que se vendio.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input placeholder="Cantidad" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cantidad de productos vendidos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {clientSelected && <p>Puntos actuales: {clientSelected?.points}</p>}
            {/* <p>
              Se le agregaran{" "}
              {productSelected
                ? productSelected?.price * form.watch("amount")
                : 0}{" "}
              puntos al cliente.
            </p> */}
            <Button type="submit" variant={"default"} className="w-full">
              Comprar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
