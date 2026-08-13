import type {Metadata} from 'next'
import {LocationPage} from '@/views/location'
import {getLocationBySlug, locationsData} from '@/shared/locationsData'
import {SITE_NAME, SITE_URL} from '@/shared/siteData'

export function generateStaticParams() {
    return locationsData.map((location) => ({slug: location.slug}))
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params
    const locationData = getLocationBySlug(slug)
    if (!locationData) return {}

    const ogImage = locationData.ogImage
    const titleSuffix = locationData.titleSuffix

    return {
        title: `${locationData.shortName} - ${titleSuffix}`,
        description: locationData.metaDescription,
        alternates: {canonical: `/${locationData.slug}`},
        openGraph: {
            type: 'website',
            locale: 'de_DE',
            siteName: SITE_NAME,
            title: `Pizzeria Verona ${locationData.shortName} - ${titleSuffix}`,
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
