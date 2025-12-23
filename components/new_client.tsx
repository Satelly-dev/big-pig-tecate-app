"use client";

import { useState } from "react";

import { toast } from "sonner";
import { clientSchema } from "@/lib/schemas";
import type { ClientSchemaType } from "@/lib/schemas";
import { createClient } from "@/app/actions";
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
import { Dot } from "lucide-react";

export default function NewClient() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ClientSchemaType>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      key: "",
    },
  });

  const onSubmit = async (data: ClientSchemaType) => {
    const res = await createClient(data);
    if (!res.success) {
      toast.error(res?.error || "Error al agregar cliente.");
      return;
    }
    toast.success("Cliente agregado exitosamente.");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="w-full flex justify-between items-center pl-2 text-sm hover:cursor-pointer group">
        Agregar cliente
        <Dot
          size={30}
          className="group-hover:opacity-100 opacity-0 transition-opacity ease-in-out"
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Agregar cliente</SheetTitle>
          <SheetDescription>
            Agrega un nuevo cliente ala tabla.
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
                  <FormDescription>Nombre del cliente.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefono" {...field} />
                  </FormControl>
                  <FormDescription>Telefono del cliente.</FormDescription>
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
                  <FormDescription>Validacion de papa.</FormDescription>
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
