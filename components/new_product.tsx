"use client";
import { useState } from "react";
import { productSchema } from "@/lib/schemas";
import type { ProductSchemaType } from "@/lib/schemas";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
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
import { createProduct } from "@/app/actions";
import { Dot } from "lucide-react";

export default function NewProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      key: "",
    },
  });

  const onSubmit = async (data: ProductSchemaType) => {
    const res = await createProduct(data);
    if (!res.success) {
      toast.error(res?.error || "Error al agregar producto.");
      return;
    }
    toast.success("Producto agregado exitosamente.");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="w-full flex justify-between items-center pl-2 text-sm hover:cursor-pointer group">
        Agregar producto
        <Dot
          size={30}
          className="group-hover:opacity-100 opacity-0 transition-opacity ease-in-out"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Agregar producto</SheetTitle>
          <SheetDescription>
            Agrega un nuevo producto a la tabla.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 px-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} type="tel" />
                  </FormControl>
                  <FormDescription>Nombre del producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input placeholder="Precio" {...field} type="number" />
                  </FormControl>
                  <FormDescription>Precio del producto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Stock" {...field} type="number" />
                  </FormControl>
                  <FormDescription>Cantidad de latas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Llave</FormLabel>
                  <FormControl>
                    <Input placeholder="Llave" {...field} type="tel" />
                  </FormControl>
                  <FormDescription>Clave de seguridad.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={"default"}
              className="w-full hover:cursor-pointer"
            >
              Agregar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
