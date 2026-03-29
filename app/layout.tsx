import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymPulse | Membership OS",
  description: "Track every gym member, their plan, days left, and renewal status in one clean view. Automated WhatsApp renewal alerts included.",
  icons: { icon: '/favicon.svg' },
  metadataBase: new URL('https://www.gympulse.co.in'),
  verification: {
    google: 'google26d335fa36166c00',
  },
  openGraph: {
    title: 'GymPulse | Membership OS',
    description: 'Track every gym member, their plan, days left, and renewal status in one clean view.',
    url: 'https://www.gympulse.co.in',
    siteName: 'GymPulse',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GymPulse | Membership OS',
    description: 'Gym membership management with WhatsApp renewal alerts.',
  },
  keywords: [
    'gym management software',
    'gym membership app',
    'gym membership management',
    'whatsapp gym alerts',
    'gym renewal reminders',
    'fitness center management',
    'gym software india',
  ],
};

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "GymPulse",
      "url": "https://www.gympulse.co.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.gympulse.co.in/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "GymPulse",
      "url": "https://www.gympulse.co.in",
      "description": "Gym membership management OS with WhatsApp renewal alerts. Track every member, their plan, days left, and renewal status.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "provider": {
        "@type": "Organization",
        "name": "GymPulse",
        "url": "https://www.gympulse.co.in"
      }
    },
    {
      "@type": "Organization",
      "name": "GymPulse",
      "url": "https://www.gympulse.co.in",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://www.gympulse.co.in/contact"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}