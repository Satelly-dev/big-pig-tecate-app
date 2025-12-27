"use server";

import { prisma } from "@/lib/prisma";
import type {
  ClientSchemaType,
  ExchangeSchemaType,
  ProductSchemaType,
  TransactionSchemaType,
} from "@/lib/schemas";
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

export async function updateClient(id: string, key: string, points: number) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const client = await prisma.client.update({
      where: { id },
      data: { points },
    });
    revalidatePath("/");
    return { success: true, data: client };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Failed to update client" };
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

export async function deleteProduct(id: string, key: string) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function updateProduct(
  id: string,
  key: string,
  price: string,
  stock: string
) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { price: Number(price), stock: Number(stock) },
    });
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

type TransactionWithTotal = TransactionSchemaType & {
  total: number;
  stock: number;
};

export async function createTransaction({
  key,
  client,
  product,
  amount,
  total,
  stock,
}: TransactionWithTotal) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const transaction = await prisma.transaction.create({
      data: {
        clientId: client,
        productId: product,
        amount,
        total,
        stock,
      },
    });
    await updateClient(client, key, total * 5);
    revalidatePath("/");
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

type ExchangeSchemaTypeWithRevenue = ExchangeSchemaType & {
  client: string;
  revenue: number;
};

export async function createExchange({
  key,
  client,
  product,
  amount,
  revenue,
}: ExchangeSchemaTypeWithRevenue) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }

  const pointToExchange = amount * revenue * 100;
  try {
    const clientFound = await prisma.client.findUnique({
      where: { id: client },
    });
    if (!clientFound) {
      return { success: false, error: "Cliente no encontrado" };
    }

    if (clientFound.points < pointToExchange) {
      return { success: false, error: "Cliente no tiene suficientes puntos" };
    }

    await prisma.exchange.create({
      data: {
        clientId: client,
        productId: product,
        amount,
        revenue,
      },
    });
    await updateClient(client, key, clientFound.points - pointToExchange);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating exchange:", error);
    return { success: false, error: "Failed to create exchange" };
  }
}

export async function createWithdrawal({
  key,
  amount,
}: {
  key: string;
  amount: number;
}) {
  if (!key || key !== process.env.KEY) {
    return { success: false, error: "Llave invalida" };
  }
  try {
    const exchanges = await prisma.exchange.findMany();
    const totalProfit = exchanges.reduce(
      (acc: number, exchange) => acc + (exchange.revenue ?? 0),
      0
    );

    if (totalProfit < amount) {
      return {
        success: false,
        error: "No hay suficiente ganancia para la cantidad a retirar.",
      };
    }

    await prisma.withdrawal.create({
      data: {
        amount,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return { success: false, error: "Failed to create withdrawal" };
  }
}
