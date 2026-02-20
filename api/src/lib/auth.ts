import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins: ["http://localhost:5173"],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    user: {
        deleteUser: { 
            enabled: true
        },
        additionalFields: {
            bio: { type: "string" },
        }
    },
    emailAndPassword: { 
        enabled: true, 
    }, 
});