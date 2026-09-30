import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import GlobalStarfield from "@/components/layout/GlobalStarfield";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CookieConsent from "@/components/layout/CookieConsent";
import LeadCapture from "@/components/layout/LeadCapture";
import TikTokPixel from "@/components/layout/TikTokPixel";
import { organizationJsonLd } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Constelații Familiale", template: "%s | Constelații Familiale" },
  description:
    "Descoperă dinamica relațiilor tale de familie printr-o constelație interactivă, interpretată cu ajutorul astrologiei și al inteligenței artificiale.",
  openGraph: { type: "website", locale: "ro_RO", siteName: "Constelații Familiale" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Consent Mode v2 -- ruleaza inainte de orice script Google. Implicit totul e
            refuzat; GA4 si mydashboard.ro se incarca doar dupa acordul pentru statistici
            (vezi components/layout/CookieConsent.tsx). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(SITE_URL)) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GlobalStarfield />
        <AuthProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
          <CookieConsent />
          {/* ghidul primei constelații pe e-mail, pentru vizitatori; o singură dată */}
          <LeadCapture />
          <TikTokPixel />
        </AuthProvider>
      </body>
    </html>
  );
}
