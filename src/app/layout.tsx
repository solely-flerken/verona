import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Script from 'next/script'
import {Cormorant_Garamond, Inter} from 'next/font/google'
import './globals.css'
import {SITE_URL} from '@/shared/siteData'
import {pageSeoData} from '@/shared/pageSeo'

const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-inter',
    display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-cormorant-garamond',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: pageSeoData.home.ogTitle,
        template: '%s - Pizzeria Verona',
    },
    description: pageSeoData.home.description,
    icons: {
        icon: [
            {url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png'},
            {url: '/favicon.svg', type: 'image/svg+xml'},
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    appleWebApp: {
        title: 'Verona',
    },
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="de" className={`${inter.variable} ${cormorantGaramond.variable}`}>
        <body>
        {UMAMI_SRC && UMAMI_WEBSITE_ID && (
            <Script src={UMAMI_SRC} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive"/>
        )}
        {children}
        </body>
        </html>
    )
}
