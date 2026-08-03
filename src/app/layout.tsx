import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/jetbrains-mono/300.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/700-italic.css'
import './globals.css'
import {SITE_URL} from '@/shared/siteUrl'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Pizzeria Verona',
        template: '%s · Pizzeria Verona',
    },
    description: 'Pizzeria Verona: italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.',
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
        <html lang="de">
        <body>
        {children}
        </body>
        </html>
    )
}
