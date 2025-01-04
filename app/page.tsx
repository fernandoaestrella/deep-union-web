"use client"

import { Suspense } from 'react'
import Link from 'next/link'
import UserDataForm from '@/components/UserDataForm'
import CoordinatesInput from '@/components/CoordinatesInput'
import PostData from '@/components/PostData'
import MapView from '@/components/MapView'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <h1 className="mb-8 text-4xl font-bold">Web-powered Multi-Need Matching</h1>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">1. User Data</h2>
        <UserDataForm />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">2. Coordinates</h2>
        <CoordinatesInput />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">3. Post</h2>
        <PostData />
      </section>

      <section className="mb-8 w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-semibold">4. Map</h2>
        <Suspense fallback={<div>Loading map...</div>}>
          <MapView />
        </Suspense>
      </section>

      <footer className="mt-auto text-center text-sm text-gray-500">
        <p>Web-powered multi-need matching application</p>
        <Link href="/about" className="underline">About this project</Link>
      </footer>
    </main>
  )
}

