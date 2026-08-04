import type {Metadata} from 'next'
import {LocationPage} from '@/views/location'
import {getLocationBySlug, locationsData} from '@/shared/locationsData'
import {imagesData} from '@/shared/imagesData'
import {SITE_NAME, SITE_URL} from '@/shared/siteUrl'

const TITLE_SUFFIX: Record<string, string> = {
    weseke: 'Restaurant & Lieferservice',
    borken: 'Mittagstisch & Lieferservice',
}

export function generateStaticParams() {
    return locationsData.map((location) => ({slug: location.slug}))
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params
    const locationData = getLocationBySlug(slug)
    if (!locationData) return {}

    const ogImage = locationData.slug === 'weseke' ? imagesData.wesekeOg : imagesData.borkenOg
    const titleSuffix = TITLE_SUFFIX[locationData.slug] ?? 'Restaurant & Lieferservice'

    return {
        title: `${locationData.shortName} · ${titleSuffix}`,
        description: locationData.metaDescription,
        alternates: {canonical: `/${locationData.slug}`},
        openGraph: {
            type: 'website',
            locale: 'de_DE',
            siteName: SITE_NAME,
            title: `${locationData.shortName} · Pizzeria Verona`,
            description: locationData.metaDescription,
            url: `/${locationData.slug}`,
            images: [{url: `${SITE_URL}${ogImage.src}`, alt: ogImage.alt}],
        },
    }
}

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params
    return <LocationPage slug={slug}/>
}
