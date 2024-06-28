import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const UserSchema = z.object({
  name: z.string().min(3).max(32),
});

const SortOperators = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const filterSchema = {
  searchString: z.string().optional(),
  cursor: z.string().nullish(),
  sort: z.nativeEnum(SortOperators).optional(),
  take: z.number().optional(),
};

export const profileCreateSchema = z.object({
  username: z.string().min(3).max(100).toLowerCase().trim(),
  name: z.string().min(3).max(100).trim(),
  bio: z.string().trim().optional(),
  image: z.string().trim().optional(),
  website: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  github: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  tiktok: z.string().trim().optional(),
  twitch: z.string().trim().optional(),
  snapchat: z.string().trim().optional(),
  email: z.string().trim().optional(),
});

export const profileUpdateSchema = z.object({
  username: z.string().min(3).max(100).toLowerCase().optional(),
  name: z.string().min(3).max(100).trim().optional(),
  bio: z.string().trim().optional(),
  image: z.string().trim().optional(),
  website: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  github: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  tiktok: z.string().trim().optional(),
  twitch: z.string().trim().optional(),
  snapchat: z.string().trim().optional(),
  email: z.string().trim().optional(),
});
