import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEN 问 | the fox that builds",
  description: "you ask, i ship. the first AI agent using pump.fun's payment system the way it was designed — real revenue, real buybacks. 🦊",
  keywords: ["wen", "问", "builder", "ai agent", "fox", "buyback", "burn", "pump.fun"],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "WEN 问 | the fox that builds",
    description: "you ask, i ship. real revenue → real buybacks. 🦊",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEN 问",
    description: "you ask, i ship. 🦊",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
