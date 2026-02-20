import { pgTable, text, timestamp, integer, primaryKey, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { message } from "./message-schema";
import { relations } from 'drizzle-orm';


export const messageLike  = pgTable("message_like", {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    messageId: integer("message_id")
      .notNull()
      .references(() => message.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.messageId] }),

    messageIdx: index("message_like_user_idx").on(table.messageId),
    userIdx: index("message_like_message_idx").on(table.userId),
  })
);

export const likesRelations = relations(messageLike, ({ one }) => ({
  user: one(user, {
    fields: [messageLike.userId],
    references: [user.id],
  }),

  message: one(message, {
    fields: [messageLike.messageId],
    references: [message.id],
  }),
}));