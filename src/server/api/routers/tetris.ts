import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tetrisRouter = createTRPCRouter({
  save: protectedProcedure
    .input(z.object({ score: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let data = await ctx.prisma.tetris.upsert({
        where: { userId: ctx.session.user.id },
        update: { scores: { push: input.score } },
        create: { userId: ctx.session.user.id, scores: [input.score] },
      });

      if (input.score > data.highScore) {
        data = await ctx.prisma.tetris.update({
          where: { userId: ctx.session.user.id },
          data: { highScore: input.score },
        });
      }

      return data;
    }),

  getHighScores: publicProcedure
    .input(z.object({ take: z.number() }))
    .query(async ({ ctx, input }) => {
      const scores = await ctx.prisma.$transaction(async () => {
        const allTime = await ctx.prisma.tetris.findMany({
          orderBy: { highScore: "desc" },
          take: input.take,
          select: {
            highScore: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        });
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const monthly = await ctx.prisma.tetris.findMany({
          where: { updatedAt: { gte: firstDay, lte: lastDay } },
          orderBy: { highScore: "desc" },
          take: input.take,
          select: {
            highScore: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        });

        return { allTime, monthly };
      });
      return scores;
    }),

  getUserHighScores: protectedProcedure.query(async ({ ctx }) => {
    const scores = await ctx.prisma.tetris.findUnique({
      where: { userId: ctx.session.user.id },
      select: { highScore: true, scores: true },
    });
    return scores;
  }),
});
