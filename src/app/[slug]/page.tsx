import type {Metadata} from 'next'
import {LocationPage} from '@/views/location'
import {getLocationBySlug, locationsData} from '@/shared/locationsData'
import {buildPageMetadata} from '@/shared/pageSeo'

export function generateStaticParams() {
    return locationsData.map((location) => ({slug: location.slug}))
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params
    const locationData = getLocationBySlug(slug)
    if (!locationData) return {}

    return buildPageMetadata({
        title: `${locationData.shortName} - ${locationData.titleSuffix}`,
        ogTitle: `Pizzeria Verona ${locationData.shortName} - ${locationData.titleSuffix}`,
        description: locationData.metaDescription,
        path: `/${locationData.slug}`,
        ogImage: locationData.ogImage,
    })
}

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params
    return <LocationPage slug={slug}/>
}
