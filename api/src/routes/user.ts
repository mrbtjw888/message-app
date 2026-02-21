import { Hono } from 'hono'
import { desc, eq, lt, and } from 'drizzle-orm'
import { db } from '@/db'
import { user, message, messageLike } from '@/db/schema'


import { AppEnv } from '@/types'
import { requireAuth, } from '@/middlewares/auth'

const userRouter = new Hono<AppEnv>()

// GET /api/users/:username - Profile lookup by name
userRouter.get('/:username', async (c) => {
    const username = c.req.param('username')

    const foundUser = await db
        .select({
            id: user.id,
            name: user.name,
            bio: user.bio,
            createdAt: user.createdAt,
            image: user.image
        })
        .from(user)
        .where(eq(user.name, username)) 
        .limit(1)

    if (foundUser.length === 0) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(foundUser[0])
})




// // GET /api/users/:username/messages
// userRouter.get('/:username/messages', async (c) => {
//     const username = c.req.param('username')

//     const messages = await db
//         .select()
//         .from(message)
//         .innerJoin(user, eq(message.userId, user.id))
//         .where(eq(user.name, username))
//         .orderBy(desc(message.createdAt))

//     return c.json(messages)
// })


// GET /api/users/:username/messages?cursor=...&limit=10
userRouter.get('/:username/messages', async (c) => {
  const username = c.req.param('username')
  const cursor = c.req.query('cursor')
  const limit = Number(c.req.query('limit')) || 5

  // Check user exists
  const foundUser = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(eq(user.name, username))
    .limit(1)

  if (foundUser.length === 0) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Query messages
  const messages = await db
    .select({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      likeCount: message.likeCount,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(message)
    .leftJoin(user, eq(message.userId, user.id))
    .where(
      and(
        eq(message.userId, foundUser[0].id),
        cursor ? lt(message.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(limit)

  const nextCursor =
    messages.length === limit
      ? messages[messages.length - 1].createdAt
      : null

  return c.json({
    user: {
      name: foundUser[0].name,
    },
    data: messages,
    nextCursor,
  })
})







// // GET /api/users/:username/likes
// userRouter.get('/:username/likes', async (c) => {
//     const username = c.req.param('username')

//     const likedMessages = await db
//         .select({
//             message: message
//         })
//         .from(messageLike)
//         .innerJoin(user, eq(messageLike.userId, user.id))
//         .innerJoin(message, eq(messageLike.messageId, message.id))
//         .where(eq(user.name, username))

//     return c.json(likedMessages)
// })

// GET /api/users/:username/likes?cursor=...&limit=10
userRouter.get('/:username/likes', async (c) => {
  const username = c.req.param('username')
  const cursor = c.req.query('cursor')
  const limit = Number(c.req.query('limit')) || 10

  // Check user
  const foundUser = await db
    .select({ id: user.id, name: user.name, image: user.image, })
    .from(user)
    .where(eq(user.name, username))
    .limit(1)

  if (foundUser.length === 0) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Get liked messages
  const likedMessages = await db
    .select({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      likeCount: message.likeCount,
    })
    .from(messageLike)
    .innerJoin(message, eq(messageLike.messageId, message.id))
    .where(
      and(
        eq(messageLike.userId, foundUser[0].id),
        cursor ? lt(message.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(limit)

  const nextCursor =
    likedMessages.length === limit
      ? likedMessages[likedMessages.length - 1].createdAt
      : null

  return c.json({
    user: {
      name: foundUser[0].name,
      image: foundUser[0].image
    },
    data: likedMessages,
    nextCursor,
  })
})

export default userRouter
