import { Hono } from 'hono'
import { desc, eq, lt, and } from 'drizzle-orm'
import { db } from '../db'
import { user, message, messageLike } from '../db/schema'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const userRouter = new Hono()

// GET /api/users/:name - Profile lookup by name
userRouter.get('/:name', async (c) => {
    const name = c.req.param('name')

    const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.name, name)) // Using 'name' as requested
        .limit(1)

    if (!foundUser) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(foundUser)
})

// GET /api/users/:name/messages
userRouter.get('/:name/messages', async (c) => {
    const name = c.req.param('name')

    const messages = await db
        .select()
        .from(message)
        .innerJoin(user, eq(message.userId, user.id))
        .where(eq(user.name, name))
        .orderBy(desc(message.createdAt))

    return c.json(messages)
})

// GET /api/users/:name/liked
userRouter.get('/:name/liked', async (c) => {
    const name = c.req.param('name')

    const likedMessages = await db
        .select({
            message: message
        })
        .from(messageLike)
        .innerJoin(user, eq(messageLike.userId, user.id))
        .innerJoin(message, eq(messageLike.messageId, message.id))
        .where(eq(user.name, name))

    return c.json(likedMessages)
})

export default userRouter
