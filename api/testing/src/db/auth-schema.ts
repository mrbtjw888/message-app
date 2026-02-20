import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { message } from "./message-schema";
import { messageLike } from "./like-schema";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // Using this as the identifier for profiles
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
    messages: many(message),
    likes: many(messageLike),
}));
