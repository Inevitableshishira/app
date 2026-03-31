import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

export const metadata = {
  metadataBase: new URL('https://apexforgestudio.in'),
  title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors in Bengaluru',
  description:
    'ApexForge Studio — Bespoke residential architecture and turnkey office interiors in Bengaluru, HSR Layout. Services: home design, office fit-out, general contracting. View portfolio and contact us.',
  authors: [{ name: 'ApexForge Studio' }],
  keywords: [
    'architecture firm Bengaluru',
    'residential architecture Bangalore',
    'office interiors Bengaluru',
    'turnkey interior design Bangalore',
    'HSR Layout architect',
    'home design Bengaluru',
    'office fit-out Bangalore',
    'bespoke architecture India',
    'ApexForge Studio',
    'general contracting Bengaluru',
  ],
  canonical: 'https://apexforgestudio.in/',
  openGraph: {
    type: 'website',
    siteName: 'ApexForge Studio',
    title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors',
    description:
      'Bespoke residential architecture and turnkey office interiors in Bengaluru. Precision-led design and complete project execution.',
    url: 'https://apexforgestudio.in/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ApexForge Studio — Architecture & Interiors' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors',
    description: 'Luxury architecture studio delivering bespoke residential architecture and turnkey office interiors in Bengaluru.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://apexforge-backend.onrender.com" />
        <link rel="dns-prefetch" href="https://apexforge-backend.onrender.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://apexforgestudio.in/" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ArchitecturalFirm',
              name: 'ApexForge Studio',
              alternateName: ['ApexForgeStudio', 'Apex Forge Studio', 'Apex Forge'],
              url: 'https://apexforgestudio.in',
              logo: 'https://apexforgestudio.in/favicon.png',
              image: 'https://apexforgestudio.in/og-image.jpg',
              description: 'Bespoke residential architecture and turnkey office interiors in Bengaluru.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '#34A, 2nd Floor, 22nd Main Rd, HSR Layout',
                addressLocality: 'Bengaluru',
                addressRegion: 'Karnataka',
                postalCode: '560102',
                addressCountry: 'IN',
              },
              geo: { '@type': 'GeoCoordinates', latitude: '12.9121', longitude: '77.6446' },
              telephone: '+91-9448815530',
              email: 'shreesha@apexforgestudio.in',
              hasMap: 'https://maps.google.com/?q=HSR+Layout+Bengaluru+560102',
              openingHours: 'Mo-Sa 09:00-18:00',
              priceRange: '₹₹₹',
              areaServed: [
                { '@type': 'City', name: 'Bengaluru' },
                { '@type': 'State', name: 'Karnataka' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Architecture & Interior Design Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pure Residential Architecture', url: 'https://apexforgestudio.in/#services' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Turnkey Office Interiors & Design Build', url: 'https://apexforgestudio.in/#services' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'General Contracting', url: 'https://apexforgestudio.in/#services' } },
                ],
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-9448815530',
                email: 'shreesha@apexforgestudio.in',
                contactType: 'customer service',
                availableLanguage: ['English', 'Kannada'],
                areaServed: 'IN',
                url: 'https://apexforgestudio.in/#contact',
              },
              sameAs: ['https://www.instagram.com/apexforgestudio', 'https://www.linkedin.com/company/apexforgestudio'],
              employee: { '@type': 'Person', name: 'Shreesha J', jobTitle: 'Principal Architect', telephone: '+91-9448815530', email: 'shreesha@apexforgestudio.in' },
            }),
          }}
        />
      </head>
      <body>
        {/*
          MagneticCursor wraps the entire app.
          - blendMode="exclusion" + cursorColor="white" → auto-inverts:
              white dot on black sections, black dot on white sections
          - cursorSize=40 → a visible but refined dot
          - magneticFactor=0.55 → strong but not silly pull
          - Any element with data-magnetic snaps the cursor to its bounds
        */}
        <MagneticCursor
          cursorSize={40}
          cursorColor="white"
          blendMode="exclusion"
          magneticFactor={0.55}
          lerpAmount={0.12}
          hoverPadding={10}
          speedMultiplier={0.025}
          maxScaleX={0.8}
          maxScaleY={0.25}
          contrastBoost={1.8}
          shape="circle"
        >
          {children}
        </MagneticCursor>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}