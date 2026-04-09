import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "BankForge.ai — Know What Your Website Says About You",
  description:
    "BankForge scans bank, credit union, and RIA websites for regulatory compliance gaps and AI visibility signals. Built by practitioners from $100B+ institutions.",
  keywords: [
    "RIA compliance review",
    "Marketing Rule 206(4)-1",
    "bank compliance monitoring",
    "UDAAP website audit",
    "Reg Z compliance",
    "SEC examination prep",
    "credit union compliance",
    "AI SEO score",
    "AI visibility",
  ],
  openGraph: {
    title: "BankForge.ai — Know What Your Website Says About You",
    description:
      "BankForge scans bank, credit union, and RIA websites for regulatory compliance gaps and AI visibility signals. One scan. Two lenses. Built by practitioners from $100B+ institutions.",
    url: "https://bankforge.ai",
    siteName: "BankForge.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BankForge.ai — Know What Your Website Says About You",
    description:
      "BankForge scans bank, credit union, and RIA websites for regulatory compliance gaps and AI visibility signals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://bankforge.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-body), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
