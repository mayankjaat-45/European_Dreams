import { Geist, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.europeandreamss.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Study in Europe & Italy for Indian Students | European Dreams",
    template: "%s | European Dreams",
  },

  description:
    "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "European Dreams",
    title: "Study in Europe & Italy for Indian Students | European Dreams",
    description:
      "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "European Dreams - Study in Italy and Europe",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Study in Europe & Italy for Indian Students | European Dreams",
    description:
      "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",
    images: ["/images/hero.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  // Google Search Console verification
  verification: {
    google: "ZU-fHs01QUNKfLf6QDJxE8uiB_ratA1Yt2ftRbt2ttA",
  },
};

const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "European Dreams",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/european-dreams-logo.png`,
  image: `${SITE_URL}/images/hero.jpg`,
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "European Dreams",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
};

const globalGraphSchema = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("theme");

                const prefersDark = window.matchMedia(
                  "(prefers-color-scheme: dark)"
                ).matches;

                const shouldUseDarkTheme =
                  savedTheme === "dark" ||
                  (!savedTheme && prefersDark);

                document.documentElement.classList.toggle(
                  "dark",
                  shouldUseDarkTheme
                );
              } catch (error) {}
            `,
          }}
        />
      </head>

      <body
        className={`
          ${geistSans.variable}
          ${playfairDisplay.variable}
          min-h-screen
          bg-background
          font-sans
          text-foreground
          antialiased
        `}
      >
        <AppShell footer={<Footer />}>{children}</AppShell>

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3500,
          }}
        />

        <JsonLd data={globalGraphSchema} />

        {/* Google Analytics and Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DZC6LC5WJK"
          strategy="afterInteractive"
        />

        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag("js", new Date());

            gtag("config", "G-DZC6LC5WJK");
            gtag("config", "AW-18374171344");
          `}
        </Script>
      </body>
    </html>
  );
}
