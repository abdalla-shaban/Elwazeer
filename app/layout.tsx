import FloatAdminNav from "@/components/FloatAdminNav";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Zain } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import FacebookPixel from "@/components/metadata/FacebookPixel";

const rubik = Zain({
  variable: "--font-rubik",
  weight: ["200", "300", "400", "700", "800", "900"],
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: {
    default: "Elena Store | ايلينا ستور",
    template: "%s | Elena Store",
  },
  description:
    "ايلينا ستور تقدم الاجمل, الشارع السياحي مول مصباح الدور التالت محل ايلينا ستور",
  robots: {
    index: true,
    follow: true,
  },
  icons: { icon: "/webIcon.svg" },
  verification: {
    google: "DAKlgDDg8dKvXZoyHnMZ0zleLZF59UQtRF26TUbZT7Q",
    other: {
      "facebook-domain-verification": "h9zq2ayn8j9jizfy2pz89kqw3bz4yg",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TWNG92NQ');
      `}
        </Script>
      </head>

      <body
        suppressHydrationWarning
        className={`${rubik.variable} antialiased bg-[#F8F6F7]`}
      >
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TWNG92NQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <TanstackQueryProvider>
          {children}
          <FloatAdminNav />
          <FloatingWhatsapp />
          <Toaster richColors closeButton position="top-center" />
        </TanstackQueryProvider>
        <FacebookPixel />
      </body>
    </html>
  );
}
