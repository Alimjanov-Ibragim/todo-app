import { z } from "zod";

import { createTodoSchema } from "@/app/validationSchemas";

export type TodoForm = z.infer<typeof createTodoSchema>;

export type TStatus = "OPEN" | "CLOSED" | "IN_PROGRESS";

export type ExtendedTodo = TodoForm & {
  id: number;
  status: TStatus;
  createdAt: string;
  updatedAt: string;
};
