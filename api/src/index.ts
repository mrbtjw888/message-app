import { Hono } from 'hono'
import { auth } from "./lib/auth";
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import messageRouter from '@/routes/message'
import likeRouter from '@/routes/like'
import userRouter from '@/routes/user'
import { AppEnv } from '@/types'

const app = new Hono<AppEnv>();

app.use('*', logger()) 

// app.use(
//   "/api/*", // or replace with "*" to enable cors for all routes
//   cors({
//     origin: "http://localhost:5173", // replace with your origin
//     allowHeaders: ["Content-Type", "Authorization"],
//     allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
//     exposeHeaders: ["Content-Length"],
//     maxAge: 600,
//     credentials: true,
//   }),
// );

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      await next();
        return;
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
});


app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});



app.notFound((c) => c.json({ message: 'Route not found' }, 404))



app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.route('/api', messageRouter)

app.route('/api', likeRouter)

app.route('/api/user', userRouter)

export default { 
  port: 3000, 
  fetch: app.fetch, 
} 