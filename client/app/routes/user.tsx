import type { Route } from "./+types/user";
import { useEffect, useState } from "react"
import { userApi } from "../../lib/api"
import PostCard from "~/components/PostCard"
import { authClient } from "lib/auth-client"

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const username = params.username?.toString()

  if (!username) {
    throw new Response("Username invalid", { status: 400 })
  }

  const userMessage = await userApi.getUserMessage(username)
  
  return userMessage
}


export default function User({ loaderData }: Route.ComponentProps) {
  const {
    data: session,
  } = authClient.useSession()
  const user = session?.user

  const initialData = loaderData
  const [messages, setMessages] = useState(initialData.data)
  const [nextCursor, setNextCursor] = useState(initialData.nextCursor)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
      setMessages(initialData.data)
      setNextCursor(initialData.nextCursor)
    }, [initialData])


  const loadMore = async () => {
    if (!nextCursor) return

    try {
      setLoadingMore(true)

      const res = await userApi.getUserMessage(
        initialData.user.name,
        nextCursor
      )

      setMessages((prev) => [...prev, ...res.data])
      setNextCursor(res.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleDelete = (postId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== postId))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">
        {initialData.user.name}
      </h1>

      <div className="space-y-4">
        {messages.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            username={post.user.name}
            content={post.content}
            likeCount={post.likeCount}
            createdAt={post.createdAt}
            userImage={post.user.image}
            isOwner={user?.name == post.user.name}
            onDelete={() => handleDelete(post.id)}
          />
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="max-w-2xl mx-auto p-10 text-center">
      <h1 className="text-xl font-bold">Oops!</h1>
      <p className="text-slate-600">This user profile doesn't exist.</p>
    </div>
  )
}