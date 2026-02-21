import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { requireAuth, } from '@/middlewares/auth'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { message, user } from '@/db/schema'
import { AppEnv } from '@/types'


const messageRouter = new Hono<AppEnv>()

const messageSchema = z.object({
  content: z.string().min(1),
})


// Create a message
messageRouter.post('/message', requireAuth, zValidator('json', messageSchema), async (c) => {
  const { content } = c.req.valid('json')
  const user = c.get('user')
  
  
	const newMessage = await db
		.insert(message)
		.values({ content, userId: user.id })
		.returning()

  return c.json(newMessage[0], 201)
})


// Get a message
messageRouter.get('/message/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID format' }, 400)

  const getMessage = await db
    .select({
      id: message.id,
      content: message.content,
      likeCount: message.likeCount,
      createdAt: message.createdAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
    }

    })
    .from(message)
    .leftJoin(user, eq(message.userId, user.id))
    .where(eq(message.id, id))
    .limit(1);

  if (getMessage.length === 0) {
    return c.json({ error: 'Message not found' }, 404)
  }


  return c.json(getMessage[0], 200)
})


// Delete a message
messageRouter.delete('/message/:id', requireAuth, async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID format' }, 400)

  const user = c.get('user')
  
  const deleteMessage = await db
    .delete(message)
    .where(
      and(
        eq(message.id, id),
        eq(message.userId, user.id)
      )
    )
    .returning()


  if (deleteMessage.length === 0) {
    return c.json({ error: 'Message not found or unauthorized' }, 404)
  }

  return c.json(deleteMessage[0], 200)
})



export default messageRouter