import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long')
      .trim()
      .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(254, 'Email is too long')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Contact Form Schema ──────────────────────────────────────────────────────

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .max(50, 'Last name is too long')
    .trim()
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .regex(/^[+\d\s\-().]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  subject: z.enum([
    'General Inquiry',
    'Order Status',
    'Product Information',
    'Returns & Exchanges',
    'Styling Consultation',
  ]),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long (max 2000 characters)')
    .trim(),
});

// ─── Newsletter Schema ────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ─── Sanitization Helpers ─────────────────────────────────────────────────────

/**
 * Strips HTML tags and dangerous characters from user input.
 * Use before displaying any user-provided content.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets (XSS prevention)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validates and sanitizes a product ID from URL params.
 * Returns null if invalid.
 */
export function parseProductId(id: string | undefined): number | null {
  if (!id) return null;
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 999999) return null;
  return parsed;
}
