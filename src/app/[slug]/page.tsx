import type {Metadata} from 'next'
import {LocationPage} from '@/views/location'
import {getLocationBySlug, locationsData} from '@/shared/locationsData'

export function generateStaticParams() {
    return locationsData.map((location) => ({slug: location.slug}))
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params
    const locationData = getLocationBySlug(slug)
    if (!locationData) return {}

    return {
        title: locationData.shortName,
        description: locationData.metaDescription,
        alternates: {canonical: `/${locationData.slug}`},
    }
}

export default async function Page({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params
    return <LocationPage slug={slug}/>
}
