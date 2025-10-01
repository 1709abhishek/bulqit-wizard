import type { Metadata } from "next"
import Script from "next/script"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Bulqit - Wizard",
  description: "Wizard for Bulqit",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <Script
          id="google-maps-js"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Host Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
