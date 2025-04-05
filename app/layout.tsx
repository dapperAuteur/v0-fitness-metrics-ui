import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import ConsoltoChat from "@/components/ConsoltoChat"
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "World Fastest Centenarian",
  description: "Track your fitness journey to becoming the world's fastest centenarian",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          {children}
          <Analytics />
          <ConsoltoChat />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}