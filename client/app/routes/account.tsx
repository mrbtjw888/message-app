import { useNavigate } from "react-router"
import { authClient } from "lib/auth-client"
import { formatDate } from "lib/formatDate"

type AccountProps = {
  user: {
    name: string,
    email: string,
    emailVerified: boolean,
    createdAt: string,
    bio: string,
    userID: string
  } | null
}

export default function Account() {
  const navigate = useNavigate()

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/")
        },
      },
    })
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Loading account...
      </div>
    )
  }

  const user = session?.user

  if (!user) {
    window.location.href = "/login"
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account
          </h1>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Username</span>
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Joined</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Email Verified</span>
            <span>
              {user.emailVerified ? (
                <span className="text-green-600 font-medium">
                  Verified
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Not Verified
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">User ID</span>
            <span className="text-slate-400 text-xs">
              {user.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
