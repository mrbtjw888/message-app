import { integer, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { user } from "./auth-schema"
import { messageLike } from "./like-schema";

export const message = pgTable("message", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  content: text("content").notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("messages_user_idx").on(table.userId),
  index("messages_created_at_idx").on(table.createdAt),
]);

export const messageRelations = relations(message, ({ one, many }) => ({
  user: one(user, {
    fields: [message.userId],
    references: [user.id],
  }),
  likes: many(messageLike)
}));
