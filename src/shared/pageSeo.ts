import type {Metadata} from 'next'
import type {ImageAsset} from './types'
import {locationsData} from './locationsData'
import {SITE_NAME, SITE_URL} from './siteData'

// Site-wide pages aren't tied to one location, so they borrow the first location's OG image.
const DEFAULT_OG_IMAGE: ImageAsset = locationsData[0]?.ogImage ?? {src: '', alt: ''}

export interface PageSeo {
    title?: string
    ogTitle: string
    description: string
    path: string
    ogImage: ImageAsset
}

export function buildPageMetadata(seo: PageSeo): Metadata {
    return {
        ...(seo.title ? {title: seo.title} : {}),
        description: seo.description,
        alternates: {canonical: seo.path},
        openGraph: {
            type: 'website',
            locale: 'de_DE',
            siteName: SITE_NAME,
            title: seo.ogTitle,
            description: seo.description,
            url: seo.path,
            ...(seo.ogImage.src && {images: [{url: `${SITE_URL}${seo.ogImage.src}`, alt: seo.ogImage.alt}]}),
        },
    }
}

export const pageSeoData: Record<'home' | 'jobs' | 'impressum', PageSeo> = {
    home: {
        ogTitle: 'Pizzeria Verona - Restaurant, Abholung & Lieferservice',
        description: 'Italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.',
        path: '/',
        ogImage: DEFAULT_OG_IMAGE,
    },
    jobs: {
        title: 'Jobs',
        ogTitle: 'Pizzeria Verona - Jobs',
        description: 'Aktuelle Stellenangebote bei Pizzeria Verona in Weseke und Borken. Werde Teil unseres Teams in Gastronomie und Service.',
        path: '/jobs',
        ogImage: DEFAULT_OG_IMAGE,
    },
    impressum: {
        title: 'Impressum',
        ogTitle: 'Pizzeria Verona - Impressum',
        description: 'Impressum und rechtliche Angaben der Pizzeria Verona in Weseke und Borken.',
        path: '/impressum',
        ogImage: DEFAULT_OG_IMAGE,
    },
}
