import { Role, languages, supportedTimeZone } from '@/types/shared.types';
import { z } from 'zod';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

export const nameSchema = z.string().min(2).max(50);
export const emailSchema = z.string().email();
export const passwordSchema = z.string();
export const labSchema = z.string().uuid();
export const urlSchema = z.string().url();
export const languageSchema = z.enum(['en', ...languages]);
export const timezoneSchema = z.enum(['Asia/Taipei', ...supportedTimeZone]);
export const companySchema = z.string();
export const userRoleSchema = z.nativeEnum(Role);
