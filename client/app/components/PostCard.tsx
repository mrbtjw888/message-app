import { Heart, Trash2  } from "lucide-react"
import { useState } from "react"
import { formatDate } from "lib/formatDate"
import { messageApi } from "lib/api"

type PostCardProps = {
  id: number
  username: string
  content: string
  createdAt: string
  userImage?: string
  likeCount: number
  initiallyLiked?: boolean
  isOwner?: boolean
  onDelete?: (id: number) => void
}

export default function PostCard({
  id,
  username,
  content,
  createdAt,
  userImage,
  likeCount,
  isOwner = false,
  onDelete,
}: PostCardProps) {

  const [count, setCount] = useState(likeCount)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)



  const handleDelete = async () => {
    if (!isOwner || deleting) return

    const confirmed = confirm("Delete this message?")
    if (!confirmed) return

    setDeleting(true)

    try {
      await messageApi.delete(id)
      onDelete?.(id)
    } catch {
      alert("Failed to delete message")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 items-center">
          {userImage && (
            <img
              src={userImage}
              alt={username}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}

          <div className="flex gap-2">
            <div className="text-sm font-medium text-black">
              {username}
            </div>
            <div className="text-sm text-slate-500">
              {formatDate(createdAt)}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <button>
          <Heart
            size={18}
          />
        </button>
        <span>{count}</span>
      </div>
    </div>
  )
}