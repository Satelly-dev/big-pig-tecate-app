"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Archive } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exchangeSchema } from "@/lib/schemas";
import type { ExchangeSchemaType } from "@/lib/schemas";
import type { product } from "@prisma/client";
import { createExchange, createTransaction } from "@/app/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Exchange({
  id,
  points,
  accountName,
  products,
}: {
  id: string;
  points: number;
  accountName: string;
  products: product[];
}) {
  const [open, setOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<product | null>(null);
  const isDisabled = !products.some((p) => p.price * 100 <= points);
  const productsValid = products.filter((p) => p.price * 100 <= points);

  const form = useForm<ExchangeSchemaType>({
    resolver: zodResolver(exchangeSchema) as any,
    defaultValues: {
      product: "",
      amount: 0,
      key: "",
    },
  });

  const onSubmit = async (data: ExchangeSchemaType) => {
    console.log(data);
    if (!productSelected) {
      toast.error("Selecciona un producto");
      return;
    }
    const [exchange, transaction] = await Promise.all([
      createExchange({
        ...data,
        client: id,
        revenue: data.amount * productSelected?.price,
      }),
      createTransaction({
        ...data,
        client: id,
        product: productSelected?.id,
        amount: data.amount,
        total: data.amount * productSelected?.price,
        stock: productSelected?.stock * data.amount,
      }),
    ]);
    if (!exchange.success || !transaction.success) {
      toast.error(exchange.error || transaction.error);
    } else {
      toast.success("Canje realizado");
      setOpen(false);
      form.reset();
      setProductSelected(null);
    }
  };

  return (
    <Sheet
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
        setProductSelected(null);
      }}
    >
      <SheetTrigger asChild>
        <button
          disabled={isDisabled}
          type="button"
          title={`Almacenar dinero`}
          className="text-slate-500 hover:text-slate-700 hover:cursor-pointer disabled:opacity-30 disabled:hover:cursor-not-allowed"
        >
          <Archive strokeWidth={1.5} size={20} />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Canjear puntos</SheetTitle>
          <SheetDescription>
            Canjear los puntos de la cuenta de {accountName}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 px-5"
          >
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
                      {productsValid.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Producto que se canjea.</FormDescription>
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
                    Cantidad de productos canjeados.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clave</FormLabel>
                  <FormControl>
                    <Input placeholder="Clave" {...field} />
                  </FormControl>
                  <FormDescription>Clave de seguridad.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isDisabled}>
              Canjear
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
