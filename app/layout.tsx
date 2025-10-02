import type { Metadata } from "next"
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
        <meta
          httpEquiv="Content-Security-Policy"
          content="
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.google.com;
            style-src 'self' 'unsafe-inline' https://*.googleapis.com https://fonts.googleapis.com;
            img-src 'self' data: https: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.ggpht.com;
            font-src 'self' data: https://fonts.gstatic.com;
            connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.google.com;
            frame-src 'self' https://*.google.com https://*.googleapis.com;
            worker-src 'self' blob:;
          "
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Host Grotesk', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
