// layouts/AppLayout.tsx
import { Outlet } from "react-router"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { authClient } from "lib/auth-client"

export default function AppLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null // or loading spinner
  }


  return (
    <div className="app-container">
      <Header user={session?.user ?? null} />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
