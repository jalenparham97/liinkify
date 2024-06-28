import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  filterSchema,
  profileCreateSchema,
  profileUpdateSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const profilesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(profileCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const profile = await ctx.db.profile.create({
          data: {
            ...input,
            username: input.username.toLowerCase(),
            userId: ctx.user.id,
          },
        });
        return profile;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Profile username already exists!",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
  checkUsername: protectedProcedure
    .input(z.object({ username: z.string().toLowerCase() }))
    .query(async ({ ctx, input }) => {
      const username = await ctx.db.profile.findUnique({
        where: { username: input.username },
        select: {
          username: true,
        },
      });
      return { isUsernameTaken: username ? true : false };
    }),
  getAll: protectedProcedure
    .input(z.object({ ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const profilesQuery = { userId: ctx.user.id };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.profile.findMany({
        where: {
          ...profilesQuery,
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          userId: true,
          name: true,
          image: true,
          username: true,
        },
        ...(input.cursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }),
        take,
        orderBy: { createdAt: "desc" },
      });

      const result = { data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.profile.findUnique({
        where: { id: input.id },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      if (profile?.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return profile;
    }),
  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.profile.findUnique({
        where: { id: input.id },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return profile;
    }),
  updateById: protectedProcedure
    .input(z.object({ id: z.string() }).merge(profileUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.profile.update({
        where: { id: input.id },
        data: {
          ...omit(input, ["id"]),
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.profile.delete({ where: { id: input.id } });
    }),
});
