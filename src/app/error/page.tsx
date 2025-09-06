'use client'

import Link from "next/link"

export default function ErrorPage() {
  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-2">
      
      <p>Sorry, something went wrong</p>
      <Link
        href="/auth/login"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  )
}