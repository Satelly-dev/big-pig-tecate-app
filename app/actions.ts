"use server";

import { prisma } from "@/lib/prisma";
import type { ClientSchemaType, ProductSchemaType } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createClient({ key, ...rest }: ClientSchemaType) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const client = await prisma.client.create({
      data: rest,
    });
    revalidatePath("/");
    return { success: true, data: client };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

export async function createProduct({ key, ...rest }: ProductSchemaType) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const product = await prisma.product.create({
      data: rest,
    });
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function deleteClient(id: string, key: string) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, error: "Failed to delete client" };
  }
}
