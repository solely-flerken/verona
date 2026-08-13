import type {Metadata} from 'next'
import {GatePage} from '@/views/gate'
import {imagesData} from '@/shared/imagesData'
import {SITE_NAME, SITE_URL} from '@/shared/siteData'

const description = 'Italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.'

export const metadata: Metadata = {
    description: description,
    alternates: {canonical: '/'},
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        siteName: SITE_NAME,
        title: 'Pizzeria Verona - Restaurant, Abholung & Lieferservice',
        description: description,
        url: '/',
        images: [{url: `${SITE_URL}${imagesData.wesekeOg.src}`, alt: imagesData.wesekeOg.alt}],
    },
}

export default function Page() {
    return <GatePage/>
}
