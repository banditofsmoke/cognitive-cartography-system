import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cognitive-cartography-system',
  description: 'Created with cognitive-cartography-system',
  generator: 'smokey-bandit',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
