import { Hono } from 'hono'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { messageLike } from '@/db/schema'
import { requireAuth } from '@/middlewares/auth'
import { Variables } from '@/types'



const likeRouter = new Hono<{ Variables: Variables }>()

/**
 * POST /api/message/:id/like
 * Allows a user to like a message.
 */
likeRouter.post('/message/:id/like', requireAuth, async (c) => {
    const messageId = Number(c.req.param('id'))
    const user = c.get('user')

    try {
        await db.insert(messageLike).values({
            userId: user.id,
            messageId,
        })
        return c.json({ success: true }, 201)
    } catch (e) {
        return c.json({ error: 'Already liked or message does not exist' }, 400)
    }
})

/**
 * DELETE /api/message/:id/like
 * Allows a user to unlike a message.
 */
likeRouter.delete('/message/:id/like', requireAuth, async (c) => {
    const messageId = Number(c.req.param('id'))
    const user = c.get('user')

    const deleted = await db
        .delete(messageLike)
        .where(
            and(
                eq(messageLike.messageId, messageId),
                eq(messageLike.userId, user.id)
            )
        )
        .returning()

    if (deleted.length === 0) {
        return c.json({ error: 'Like not found' }, 404)
    }

    return c.json({ success: true })
})







export default likeRouter
