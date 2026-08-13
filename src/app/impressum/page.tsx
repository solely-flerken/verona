import type {Metadata} from 'next'
import {ImpressumPage} from '@/views/impressum'
import {imagesData} from '@/shared/imagesData'
import {SITE_NAME, SITE_URL} from '@/shared/siteData'

const description = 'Impressum und rechtliche Angaben der Pizzeria Verona in Weseke und Borken.'

export const metadata: Metadata = {
    title: 'Impressum',
    description,
    alternates: {canonical: '/impressum'},
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        siteName: SITE_NAME,
        title: 'Pizzeria Verona - Impressum',
        description,
        url: '/impressum',
        images: [{url: `${SITE_URL}${imagesData.wesekeOg.src}`, alt: imagesData.wesekeOg.alt}],
    },
}

export default function Page() {
    return <ImpressumPage/>
}
