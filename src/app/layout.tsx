import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Cormorant_Garamond, Inter, JetBrains_Mono} from 'next/font/google'
import './globals.css'
import {SITE_URL} from '@/shared/siteUrl'

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-jetbrains-mono',
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
        default: 'Pizzeria Verona - Restaurant, Abholung & Lieferservice',
        template: '%s - Pizzeria Verona',
    },
    description: 'Italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.',
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
        <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable}`}>
        <body>
        {children}
        </body>
        </html>
    )
}
