import type { Client, Transaction } from "@prisma/client";

export type ClientToTable = Client & {
  transactions?: number;
  points?: number;
  cans?: number;
  status?: string;
};
