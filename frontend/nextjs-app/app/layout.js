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
  title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors',
  description:
    'ApexForge Studio is a bespoke architecture firm in Bengaluru specializing in luxury residential architecture and turnkey office interiors. Precision-driven design and seamless execution.',
  authors: [{ name: 'ApexForge Studio' }],
  canonical: 'https://apexforgestudio.in/',
  openGraph: {
    type: 'website',
    siteName: 'ApexForge Studio',
    title: 'ApexForge Studio | Bespoke Residential Architecture & Turnkey Office Interiors',
    description:
      'Bespoke residential architecture and turnkey office interiors in Bengaluru. Precision-led design and complete project execution.',
    url: 'https://apexforgestudio.in/',
    images: [{ url: '/og-image.jpg' }],
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
              alternateName: ['ApexForgeStudio', 'Apex Forge Studio'],
              url: 'https://apexforgestudio.in',
              logo: 'https://apexforgestudio.in/favicon.png',
              image: 'https://apexforgestudio.in/og-image.jpg',
              description: 'Luxury residential architecture and turnkey office interiors in Bengaluru.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bengaluru',
                addressRegion: 'Karnataka',
                postalCode: '560102',
                addressCountry: 'IN',
              },
              telephone: '+91-9448815530',
              serviceType: [
                'Residential Architecture',
                'Turnkey Office Interiors',
                'Commercial Architecture',
              ],
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
