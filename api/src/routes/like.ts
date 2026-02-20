import { Hono } from 'hono'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { messageLike } from '@/db/schema'
import { requireAuth } from '@/middlewares/auth'

import { AppEnv } from '@/types'


const likeRouter = new Hono<AppEnv>()

// Like a message
likeRouter.post('/message/:id/like', requireAuth, async (c) => {
  const messageId = Number(c.req.param('id'))
  const user = c.get('user')

  try {
    await db.transaction(async (tx) => {
      // 1. Insert like (will throw if duplicate)
      await tx.insert(messageLike).values({
        userId: user.id,
        messageId,
      })

      // 2. Increment likeCount
      await tx
        .update(message)
        .set({
          likeCount: sql`${message.likeCount} + 1`,
        })
        .where(eq(message.id, messageId))
    })

    return c.json({ success: true }, 201)
  } catch (e) {
    return c.json(
      { error: 'Already liked or message does not exist' },
      400
    )
  }
})


// Unlike a message
likeRouter.delete('/message/:id/like', requireAuth, async (c) => {
  const messageId = Number(c.req.param('id'))
  const user = c.get('user')

  try {
    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(messageLike)
        .where(
          and(
            eq(messageLike.messageId, messageId),
            eq(messageLike.userId, user.id)
          )
        )
        .returning()

      if (deleted.length === 0) {
        throw new Error('Like not found')
      }

      await tx
        .update(message)
        .set({
          likeCount: sql`${message.likeCount} - 1`,
        })
        .where(eq(message.id, messageId))
    })

    return c.json({ success: true })
  } catch (e) {
    return c.json({ error: 'Like not found' }, 404)
  }
})


export default likeRouter
