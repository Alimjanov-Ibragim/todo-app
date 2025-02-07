import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']),
  userId: z.number()
});

export const createTodoSchemaWithoutUserId = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED'])
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email is too long')
    .email('Email is invalid'),
  password: z.string().min(1, 'Password is required')
});

export const profileSchemaWithoutName = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email is too long')
    .email('Email is invalid'),
  password: z.string().min(1, 'Password is required')
});
