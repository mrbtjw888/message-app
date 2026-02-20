import { Hono } from 'hono'
import { desc, eq, lt, and } from 'drizzle-orm'
import { db } from '@/db'
import { user, message, messageLike } from '@/db/schema'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const userRouter = new Hono()

// GET /api/users/:name - Profile lookup by name
userRouter.get('/:username', async (c) => {
    const username = c.req.param('username')

    const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.username, username)) // Using 'name' as requested
        .limit(1)

    if (!foundUser) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(foundUser)
})

// GET /api/users/:name/messages
userRouter.get('/:username/messages', async (c) => {
    const username = c.req.param('username')

    const messages = await db
        .select()
        .from(message)
        .innerJoin(user, eq(message.userId, user.id))
        .where(eq(user.username, username))
        .orderBy(desc(message.createdAt))

    return c.json(messages)
})

// GET /api/users/:name/liked
userRouter.get('/:username/liked', async (c) => {
    const username = c.req.param('username')

    const likedMessages = await db
        .select({
            message: message
        })
        .from(messageLike)
        .innerJoin(user, eq(messageLike.userId, user.id))
        .innerJoin(message, eq(messageLike.messageId, message.id))
        .where(eq(user.username, username))

    return c.json(likedMessages)
})

export default userRouter
