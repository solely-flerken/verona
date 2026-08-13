import type {Metadata} from 'next'
import {JobsPage} from '@/views/jobs'
import {imagesData} from '@/shared/imagesData'
import {SITE_NAME, SITE_URL} from '@/shared/siteData'

const description = 'Aktuelle Stellenangebote bei Pizzeria Verona in Weseke und Borken. Werde Teil unseres Teams in Gastronomie und Service.'

export const metadata: Metadata = {
    title: 'Jobs',
    description,
    alternates: {canonical: '/jobs'},
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        siteName: SITE_NAME,
        title: 'Pizzeria Verona - Jobs',
        description,
        url: '/jobs',
        images: [{url: `${SITE_URL}${imagesData.wesekeOg.src}`, alt: imagesData.wesekeOg.alt}],
    },
}

export default function Page() {
    return <JobsPage/>
}
