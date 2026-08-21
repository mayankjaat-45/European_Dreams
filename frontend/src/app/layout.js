import { Geist, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import AppShell from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";

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

export const metadata = {
  title: {
    default: "European Dreams | Study in Europe",
    template: "%s | European Dreams",
  },
  description:
    "Get expert guidance for studying in Europe, including university selection, applications, scholarships and student visa assistance.",
  keywords: [
    "Study in Europe",
    "European universities",
    "Study abroad consultancy",
    "European Dreams",
    "Student visa assistance",
  ],
  verification: {
    google: "ZU-fHs01QUNKfLf6QDJxE8uiB_ratA1Yt2ftRbt2ttA",
  },
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

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18374171344"
          strategy="afterInteractive"
        />

        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "AW-18374171344");
          `}
        </Script>
      </body>
    </html>
  );
}
