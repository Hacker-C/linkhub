import { z } from 'zod';

// email schema
const emailSchema = z.string().email({ message: 'Invalid email address' });

// validate email
export function validateEmail(email: string): { isValid: boolean; isNotValid:boolean; error?: string } {
  const result = emailSchema.safeParse(email);
  return {
    isValid: result.success,
    isNotValid: !result.success,
    error: result.success ? undefined : result.error.errors[0]?.message,
  };
}
