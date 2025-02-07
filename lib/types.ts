import { z } from 'zod';

import { createTodoSchema } from '@/app/validationSchemas';

export type TodoForm = z.infer<typeof createTodoSchema>;

export type TExtendedTodoForm = TodoForm & {
  userId: number;
};

export type TStatus = 'OPEN' | 'COMPLETED' | 'IN_PROGRESS';

export type ExtendedTodo = TodoForm & {
  id: number;
  status: TStatus;
  createdAt: string;
  updatedAt: string;
};

export type TProfile = {
  email: string;
  password: string;
  name: string;
};

export type TProfileWithoutName = Omit<TProfile, 'name'>;
