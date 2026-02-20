// routes/well-known.tsx
export function loader() {
  return new Response(null, { status: 204 })
}

export default function WellKnown() {
  return null
}