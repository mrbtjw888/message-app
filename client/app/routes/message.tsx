import { useLoaderData } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import { messageApi } from "../../lib/api"
import PostCard from "../components/PostCard"

export async function loader({ params }: LoaderFunctionArgs) {
  const messageId = Number(params.messageId)

  if (isNaN(messageId)) {
    throw new Response("Invalid message ID", { status: 400 })
  }

  const message = await messageApi.getById(messageId)

  return message
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/products/${params.pid}`);
  const product = await res.json();
  return product;
}







export default function MessagePage() {
  const message = useLoaderData() as Awaited<
    ReturnType<typeof messageApi.getById>
  >

  return (
    <div className="max-w-2xl mx-auto">
      <PostCard
        id={message.id}
        username={message.user?.name ?? "unknown"}
        content={message.content}
        likedCount={message.likedCount ?? 0}
        createdAt={message.createdAt}
        userImage={message.user?.image ?? "unknown"}
      />
    </div>
  )
}