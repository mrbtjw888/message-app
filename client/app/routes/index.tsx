import React from 'react';
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome
      </h1>

      <div className="card">
        <p className="text-slate-700">
          This is a minimal Pixiv-style layout.
        </p>
      </div>
    </div>
  )
}
