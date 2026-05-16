import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatgptUpgrades } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const chatgptRouter = createRouter({
  create: authedQuery
    .input(z.object({
      accountEmail: z.string().email(),
      accountPassword: z.string().min(1),
      upgradeType: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(chatgptUpgrades).values({
        userId: ctx.user.id,
        accountEmail: input.accountEmail,
        accountPassword: input.accountPassword,
        upgradeType: input.upgradeType,
        status: "pending",
      }).returning();
      return result[0];
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(chatgptUpgrades)
      .where(eq(chatgptUpgrades.userId, ctx.user.id))
      .orderBy(desc(chatgptUpgrades.createdAt));
  }),
});
