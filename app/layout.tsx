import '@/styles/globals.css'

import localFont from "next/font/local"
import { Inter as FontSans } from "next/font/google"
import { siteConfig } from "@/config/site"
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be collocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

// export const viewport = {
//     themeColor: [
//         { media: "(prefers-color-scheme: light)", color: "white" },
//         { media: "(prefers-color-scheme: dark)", color: "black" },
//     ],
// }

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body
          className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
              fontHeading.variable
          )}
      >
      <Providers themeProps={{
        enableSystem: true,
        disableTransitionOnChange: true,
        attribute: "class",
        defaultTheme: "system"
      }}>
        <Suspense fallback={null}>
          {children}
          <Toaster/>
        </Suspense>
      </Providers>
      </body>
      </html>
  )
}
