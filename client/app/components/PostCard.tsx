import { useState } from "react"

type PostCardProps = {
  id: number
  username: string
  content: string
  createdAt: string
  userImage: string
  likedCount: number
  initiallyLiked?: boolean
  onLike?: (id: number, liked: boolean) => Promise<void>
}

export default function PostCard({
  id,
  username,
  content,
  likedCount,
  initiallyLiked = false,
  onLike,
}: PostCardProps) {
  const [liked, setLiked] = useState(initiallyLiked)
  const [count, setCount] = useState(likedCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!onLike) return

    setLoading(true)

    const newLiked = !liked
    setLiked(newLiked)
    setCount((prev) => (newLiked ? prev + 1 : prev - 1))

    try {
      await onLike(id, newLiked)
    } catch {
      // revert on failure
      setLiked(!newLiked)
      setCount((prev) => (newLiked ? prev - 1 : prev + 1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="mb-3 text-sm font-medium text-slate-700">
        @{username}
      </div>

      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 transition ${
            liked
              ? "text-red-500"
              : "text-slate-500 hover:text-red-500"
          }`}
        >
          heart
          <span>{count}</span>
        </button>
      </div>
    </div>
  )
}