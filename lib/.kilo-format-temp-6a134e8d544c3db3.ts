import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Must be a valid email address");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long");

export const pinSchema = z
  .string()
  .regex(/^\d{4}$/, "PIN must be exactly 4 digits");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+\d{13}$/, "Phone number must start with '+' followed by 13 digits (e.g., +2348012345678)");

export const amountSchema = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? val.trim() : String(val)))
  .refine((v) => v !== "" && !Number.isNaN(Number(v)), {
    message: "Amount must be a number",
  })
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(String(v)), {
    message: "Amount must have at most two decimal places (e.g., 1000.00)",
  })
  .transform((v) => Number(Number(v).toFixed(2)))
  .refine((n) => n > 0, {
    message: "Amount must be greater than zero",
  });

export const accountNumberSchema = z
  .string()
  .regex(/^\d{10}$/, "Account number must be exactly 10 digits");

export const currencySchema = z.string().min(1, "Currency is required");

export const fileSchema = z
  .any()
  .refine((v) => v != null, { message: "File is required" })
  .refine((v) => v instanceof File, { message: "Invalid file" })
  .refine((f: File) => f.size <= 5 * 1024 * 1024, { message: "File must be <= 5MB" })
  .refine((f: File) => /image\//.test(f.type), { message: "File must be an image" });

export function combineSchemas<T extends z.ZodTypeAny>(schema: T) {
  return schema;
}

export type ZodSchema<T> = z.ZodType<T>;

export function getErrorMessage(err: unknown): string {
  if (!err) return "An unknown error occurred";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    // Handle common shapes like { message } or { data: { message } }
    if (err && typeof err === "object" && "message" in (err as any) && typeof (err as any).message === "string") {
      return (err as any).message;
    }
    if (err && typeof err === "object" && "data" in (err as any) && typeof (err as any).data?.message === "string") {
      return (err as any).data.message;
    }
  } catch {
    // ignore
  }
  return "Something went wrong";
}

/**
 * Round a number to two decimal places and return a Number (not a string)
 */
export function roundTwo(n: number): number {
  return Number(Number(n).toFixed(2));
}

/**
 * Format number with exactly two decimal places and thousands separators (e.g., "1,234.00")
 */
export function formatCurrency(n: number): string {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
