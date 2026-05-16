import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { settings, announcements, khqrCodes, banners, instructions } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const publicRouter = createRouter({
  settings: publicQuery.query(async () => {
    const db = getDb();
    const allSettings = await db.select().from(settings);
    return Object.fromEntries(allSettings.map(s => [s.key, s.value]));
  }),

  announcements: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(announcements).where(eq(announcements.isActive, true)).orderBy(desc(announcements.priority));
  }),

  khqrCodes: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(khqrCodes).where(eq(khqrCodes.isActive, true));
  }),

  banners: publicQuery
    .query(async () => {
      const db = getDb();
      return db.select().from(banners).where(eq(banners.isActive, true)).orderBy(banners.sortOrder);
    }),

  instructions: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(instructions).where(eq(instructions.isActive, true)).orderBy(instructions.sortOrder);
  }),
});
