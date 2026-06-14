import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(10, 'Description must be detailed'),
    requirements: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const generateJobSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    stack: z.string().min(2, 'Stack is required'),
  }),
});

