import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, lt } from 'drizzle-orm'
import { db } from '../db'
import { message, user } from '../db/schema'
import { requireAuth } from '../middlewares/auth'

const messageRouter = new Hono()

// GET /api/message - Feed with simple pagination
messageRouter.get('/message', zValidator('query', z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().default(20),
})), async (c) => {
    const { cursor, limit } = c.req.valid('query')

    const results = await db
        .select({
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            author: {
                id: user.id,
                name: user.name,
                image: user.image,
            }
        })
        .from(message)
        .innerJoin(user, eq(message.userId, user.id))
        .where(cursor ? lt(message.createdAt, new Date(cursor)) : undefined)
        .orderBy(desc(message.createdAt))
        .limit(limit)

    return c.json(results)
})

// ... other routes (POST, DELETE) as you already have them
export default messageRouter
