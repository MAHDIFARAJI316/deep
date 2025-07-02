import { z } from 'zod';

// This is a placeholder for a Mongoose model, using Zod for schema validation.
// In a real implementation, you would define a Mongoose schema and model here.

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>; 