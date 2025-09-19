import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Online Chess Game',
  description: 'Real-time multiplayer chess game built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
