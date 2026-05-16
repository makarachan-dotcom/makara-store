import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { supportMessages } from "@db/schema";
import { eq } from "drizzle-orm";

export const supportRouter = createRouter({
  sendMessage: publicQuery
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      userId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      
      // Store user message
      await db.insert(supportMessages).values({
        sessionId: input.sessionId,
        userId: input.userId || null,
        role: "user",
        content: input.content,
      });

      // Simple AI response
      const responses: Record<string, string> = {
        "hello": "Hello! Welcome to Makara Store. How can I help you today?",
        "help": "I can help you with:\n- Finding game keys\n- Order status\n- Payment methods\n- Account issues\n- ChatGPT upgrades\n\nWhat do you need?",
        "price": "Our game keys are priced competitively! Check out our Hot Deals section for the best discounts.",
        "payment": "We accept ABA Bank, ACLEDA Bank, and Wing Bank payments via KHQR. After checkout, upload your receipt for verification.",
        "order": "To check your order status, please log in and visit your dashboard. Orders are typically processed within 1-2 hours after receipt verification.",
        "chatgpt": "To upgrade your ChatGPT account, go to the ChatGPT Upgrade section in your dashboard and enter your OpenAI credentials.",
        "contact": "You can reach our admin via Telegram: @makara_admin or email: chanmakara672@gmail.com",
        "refund": "Refund requests are handled on a case-by-case basis. Please contact our support team with your order number.",
        "key": "Game keys are delivered to your email and dashboard immediately after payment confirmation.",
      };

      const lowerContent = input.content.toLowerCase();
      let aiResponse = "Thank you for your message. Our team will review it shortly. For immediate assistance, you can contact our admin on Telegram: @makara_admin";
      
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowerContent.includes(keyword)) {
          aiResponse = response;
          break;
        }
      }

      // Store AI response
      await db.insert(supportMessages).values({
        sessionId: input.sessionId,
        role: "ai",
        content: aiResponse,
      });

      return { response: aiResponse };
    }),

  getHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(supportMessages)
        .where(eq(supportMessages.sessionId, input.sessionId))
        .orderBy(supportMessages.createdAt);
    }),
});
