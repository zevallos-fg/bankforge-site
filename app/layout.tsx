import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import { SITE_URL, BRAND_NAME, LEGAL_ENTITY, ANSWER_ENGINES } from "./lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — see your public presence the way an examiner does`,
    template: `%s · ${BRAND_NAME}`,
  },
  description:
    "Tiqsi reviews the public websites of investment advisers, banks and credit unions against regulatory criteria, and measures how those firms appear in AI search. Findings carry their regulatory citation and go to your compliance counsel.",
  keywords: [
    "RIA compliance review",
    "SEC Marketing Rule 206(4)-1",
    "bank website compliance",
    "UDAAP website review",
    "Regulation DD advertising",
    "credit union compliance",
    "AI SEO",
    "AI visibility",
  ],
  openGraph: {
    title: `${BRAND_NAME} — see your public presence the way an examiner does`,
    description:
      "Regulatory review of public websites for investment advisers, banks and credit unions, plus peer-benchmarked AI search visibility.",
    url: SITE_URL,
    siteName: BRAND_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — see your public presence the way an examiner does`,
    description:
      "Regulatory review of public websites, plus peer-benchmarked AI search visibility.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
};

/**
 * Organization JSON-LD. `name` is the product brand; `legalName` is the entity
 * on the EIN (D-TW-11). Both are true and they are different, so both are said.
 */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  legalName: LEGAL_ENTITY,
  url: SITE_URL,
  foundingDate: "2026",
  areaServed: "United States",
  description:
    `Tiqsi reviews the public websites of regulated financial institutions against regulatory criteria and measures their visibility in AI search across ${ANSWER_ENGINES.join(", ")}.`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-body), sans-serif" }}
      >
        <SiteNav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
