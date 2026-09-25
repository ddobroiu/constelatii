import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import GlobalStarfield from "@/components/layout/GlobalStarfield";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Constelații Familiale",
  description:
    "Descoperă dinamica relațiilor tale de familie printr-o constelație interactivă, interpretată cu ajutorul astrologiei și al inteligenței artificiale.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* mydashboard.ro: vizite, surse de trafic și legătura cu plățile (proiectul constelatii) */}
        <script defer src="https://mydashboard.ro/t.js" data-site="e042bf6033475cf2" />
        {/* Consent Mode v2 -- trebuie sa ruleze inainte de gtag.js. Pe acest
            site paginile vizitate spun singure prin ce trece omul, asa ca
            implicit totul e refuzat pana la acceptul explicit. */}
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
              try {
                if (localStorage.getItem('cookie_consent') === 'granted') {
                  gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                  });
                }
              } catch (e) {}
            `,
          }}
        />
        {/* GA4 property "Constelatii.com", in contul Culoarea din Viata SA SRL.
            Site-ul nu avea deloc masurare pana acum. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8CD8R3GESM" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-8CD8R3GESM');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GlobalStarfield />
        <AuthProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
