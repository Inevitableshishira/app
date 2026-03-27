import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ApexForge Studio — Architecture & Interiors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors',
    description:
      'Luxury architecture studio delivering bespoke residential architecture and turnkey office interiors in Bengaluru.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Performance — preconnect to backend before JS runs */}
        <link rel="preconnect" href="https://apexforge-backend.onrender.com" />
        <link rel="dns-prefetch" href="https://apexforge-backend.onrender.com" />

        {/* Preconnect to image sources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <link rel="canonical" href="https://apexforgestudio.in/" />
        <meta name="theme-color" content="#ffffff" />

        {/* ── Rich Schema.org structured data ── */}
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
              description:
                'Bespoke residential architecture and turnkey office interiors in Bengaluru. Precision-led design and complete project execution.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '#34A, 2nd Floor, 22nd Main Rd, HSR Layout',
                addressLocality: 'Bengaluru',
                addressRegion: 'Karnataka',
                postalCode: '560102',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '12.9121',
                longitude: '77.6446',
              },
              telephone: '+91-9448815530',
              email: 'shreesha@apexforgestudio.in',
              hasMap: 'https://maps.google.com/?q=HSR+Layout+Bengaluru+560102',
              openingHours: 'Mo-Sa 09:00-18:00',
              priceRange: '₹₹₹',
              areaServed: [
                { '@type': 'City', name: 'Bengaluru' },
                { '@type': 'State', name: 'Karnataka' },
              ],
              // Tells Google about all three services
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Architecture & Interior Design Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Pure Residential Architecture',
                      description:
                        'Bespoke residential architecture from initial concept to final finishing touch. End-to-end home design and build management.',
                      url: 'https://apexforgestudio.in/#services',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Turnkey Office Interiors & Design Build',
                      description:
                        'Comprehensive office interior solutions engineered for productivity. Space planning, 3D visualization, material procurement and full execution.',
                      url: 'https://apexforgestudio.in/#services',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'General Contracting',
                      description:
                        'High-precision execution for large-scale projects. Expert oversight, vendor management and structural supervision.',
                      url: 'https://apexforgestudio.in/#services',
                    },
                  },
                ],
              },
              // Contact point — helps Google surface your contact info
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-9448815530',
                email: 'shreesha@apexforgestudio.in',
                contactType: 'customer service',
                availableLanguage: ['English', 'Kannada'],
                areaServed: 'IN',
                url: 'https://apexforgestudio.in/#contact',
              },
              // Portfolio section
              mainEntity: {
                '@type': 'ItemList',
                name: 'Architecture Portfolio',
                description: 'Selected residential and commercial architecture projects by ApexForge Studio.',
                url: 'https://apexforgestudio.in/#portfolio',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Residential Architecture Projects',
                    url: 'https://apexforgestudio.in/#portfolio',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Commercial Architecture Projects',
                    url: 'https://apexforgestudio.in/#portfolio',
                  },
                ],
              },
              // Process section
              knowsAbout: [
                'Residential Architecture',
                'Office Interior Design',
                'Turnkey Construction',
                'Space Planning',
                '3D Visualization',
                'General Contracting',
                'Biophilic Design',
                'Luxury Interiors',
              ],
              // Social profiles
              sameAs: [
                'https://www.instagram.com/apexforgestudio',
                'https://www.linkedin.com/company/apexforgestudio',
              ],
              // Founder / key person
              employee: {
                '@type': 'Person',
                name: 'Shreesha J',
                jobTitle: 'Principal Architect',
                telephone: '+91-9448815530',
                email: 'shreesha@apexforgestudio.in',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
