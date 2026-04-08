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
  title: "BankForge.ai — Compliance Intelligence for Banks & RIAs",
  description:
    "BankForge scans your public digital presence for UDAAP, Reg Z, Reg DD, Fair Lending, and SEC Marketing Rule compliance gaps. Built by practitioners with examiner-side experience at $100B+ institutions.",
  keywords: [
    "RIA compliance review",
    "Marketing Rule 206(4)-1",
    "bank compliance monitoring",
    "UDAAP website audit",
    "Reg Z compliance",
    "SEC examination prep",
  ],
  openGraph: {
    title: "BankForge.ai — Compliance Intelligence for Banks & RIAs",
    description:
      "We scrape your website and run a compliance Ctrl+F against the exact criteria your examiners use. Severity-graded findings. Regulatory citations. Reviewed by the BankForge team.",
    url: "https://bankforge.ai",
    siteName: "BankForge.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BankForge.ai — Compliance Intelligence for Banks & RIAs",
    description:
      "Marketing Rule compliance reviews for RIAs. UDAAP and Reg Z monitoring for community banks.",
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
