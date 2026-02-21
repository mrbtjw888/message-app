import type { Route } from "./+types/message";
import { messageApi } from "../../lib/api"
import PostCard from "../components/PostCard"

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const messageId = Number(params.messageId)

  if (isNaN(messageId)) {
    throw new Response("Invalid message ID", { status: 400 })
  }

  const message = await messageApi.getById(messageId)
  return message
}



export default function MessagePage({ loaderData }: Route.ComponentProps) {
  const message = loaderData

  return (
    <div className="max-w-2xl mx-auto">
      <PostCard
        id={message.id}
        username={message.user.name}
        content={message.content}
        likeCount={message.likeCount}
        createdAt={message.createdAt}
        userImage={message.user?.image}
      />
    </div>
  )
}