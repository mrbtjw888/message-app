import {
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
  index
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { messages } from "./messages";

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.messageId] }),

    messageIdx: index("likes_message_idx").on(table.messageId),
    userIdx: index("likes_user_idx").on(table.userId),
  })
);
