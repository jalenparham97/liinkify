import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import type { profileCreateSchema, profileUpdateSchema } from "@/utils/schemas";
import type { InfiniteData } from "@tanstack/react-query";
import type { z } from "zod";

export type ProfileCreateFields = z.infer<typeof profileCreateSchema>;
export type ProfileeUpdateFields = z.infer<typeof profileUpdateSchema>;

export type ProfileCreateData = RouterInputs["profiles"]["create"];
export type ProfileUpdateData = RouterInputs["profiles"]["updateById"];

export type ProfilesOutput = RouterOutputs["profiles"]["getAll"];
export type ProfileOutput = RouterOutputs["profiles"]["getById"];

export type ProfileFindInput = RouterInputs["profiles"]["getAll"];

export type InfiniteProfilesData = InfiniteData<ProfilesOutput> | undefined;
