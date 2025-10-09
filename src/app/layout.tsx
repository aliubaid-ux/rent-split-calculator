import type { Metadata } from 'next';
import { Inter, Lobster_Two } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lobster-two',
  display: 'swap',
});

const siteConfig = {
  name: "Rent Fairness",
  url: "https://rentfairness.com",
  description: "A free tool to help roommates divide rent fairly based on room size, features, and comfort level. Stop splitting rent equally, start splitting it fairly.",
  ogImage: "https://rentfairness.com/og-image.png",
  links: {
    creator: "https://aliubaid.com",
  }
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "rent splitter",
    "rent calculator",
    "fair rent",
    "roommate rent calculator",
    "split rent",
    "rent division",
    "apartment rent",
  ],
  authors: [
    {
      name: "Ali Ubaid",
      url: siteConfig.links.creator,
    },
  ],
  creator: "Ali Ubaid",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@example",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lobsterTwo.variable} dark`} suppressHydrationWarning>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
