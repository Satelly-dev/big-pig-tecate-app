import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe ser mas largo.",
  }),
  phoneNumber: z.string().min(10, {
    message: "El numero de telefono debe tener al menos 10 caracteres.",
  }),
  key: z.string().min(5, {
    message: "La llave no es valida.",
  }),
});

export type ClientSchemaType = z.infer<typeof clientSchema>;

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe ser mas largo.",
  }),
  price: z.coerce.number().min(1, {
    message: "El precio debe ser mayor a 0.",
  }),
  stock: z.coerce.number().min(1, {
    message: "El stock debe ser mayor a 0.",
  }),
  key: z.string().min(5, {
    message: "La llave no es valida.",
  }),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

export const transactionSchema = z.object({
  client: z.string().min(2, {
    message: "El cliente es obligatorio.",
  }),
  product: z.string().min(2, {
    message: "El producto es obligatorio.",
  }),
  amount: z.coerce.number().min(1, {
    message: "El monto debe ser mayor a 0.",
  }),
  key: z.string().min(5, {
    message: "La llave no es valida.",
  }),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;

export const exchangeSchema = z.object({
  product: z.string().min(2, {
    message: "El producto es obligatorio.",
  }),
  amount: z.coerce.number().min(1, {
    message: "El monto debe ser mayor a 0.",
  }),
  key: z.string().min(5, {
    message: "La llave no es valida.",
  }),
});

export type ExchangeSchemaType = z.infer<typeof exchangeSchema>;
