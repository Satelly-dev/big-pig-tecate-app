"use client";

import { useState } from "react";
import { transactionSchema } from "@/lib/schemas";
import { createTransaction } from "@/app/actions";
import type { product } from "@prisma/client";
import type { TransactionSchemaType } from "@/lib/schemas";
import type { ClientToTable } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  const [isOpen, setIsOpen] = useState(false);
  const [clientSelected, setClientSelected] = useState<ClientToTable | null>(
    null
  );
  const [productSelected, setProductSelected] = useState<product | null>(null);

  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      client: "",
      product: "",
      amount: 0,
    },
  });

  const onSubmit = async (data: TransactionSchemaType) => {
    const transaction = {
      ...data,
      total: data.amount * productSelected!.price,
    };
    const res = await createTransaction(transaction);
    if (!res.success) {
      toast.error(res?.error || "Error al agregar cliente.");
      return;
    }
    toast.success("Cliente agregado exitosamente.");
    setIsOpen(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        form.reset();
        setClientSelected(null);
        setProductSelected(null);
      }}
    >
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      const client = clients.find((c) => c.id === value);
                      if (client) setClientSelected(client);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      const product = products.find((p) => p.id === value);
                      if (product) setProductSelected(product);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
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
                    <Input placeholder="Cantidad" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cantidad de productos vendidos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-2 w-full" />
            {clientSelected && (
              <p className="text-sm text-muted-foreground">
                Puntos actuales: {clientSelected?.points}
              </p>
            )}
            {productSelected && (
              <p className="text-sm text-muted-foreground">
                Se le agregaran{" "}
                {productSelected?.price * 5 * form.watch("amount")} puntos al
                cliente.
              </p>
            )}
            <Button type="submit" variant={"default"} className="w-full">
              Comprar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
