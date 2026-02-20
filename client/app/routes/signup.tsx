import { useState } from "react"
import { Form, Link, useNavigate } from "react-router"
import { authClient } from "lib/auth-client"


export default function SignUp() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!name.trim()) return "Name is required"
    if (!email.includes("@")) return "Invalid email address"
    if (password.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    await authClient.signUp.email(
      { email, password, name },
      {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          navigate("/")
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Something went wrong")
          setLoading(false)
        },
      }
    )
  }

  return (
    <div>
      <h2 className="auth-title">Create your account</h2>

      {error && <div className="auth-error-box">{error}</div>}

      <Form onSubmit={signUp}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className={`form-input ${!name && error ? "input-error" : ""}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input ${error?.includes("email") ? "input-error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className={`form-input ${error?.includes("Password") ? "input-error" : ""}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </Form>

      <div className="auth-footer">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </div>
    </div>
  )
}
