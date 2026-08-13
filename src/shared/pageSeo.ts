import type {Metadata} from 'next'
import type {ImageAsset} from './imagesData'
import {imagesData} from './imagesData'
import {SITE_NAME, SITE_URL} from './siteData'

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
            images: [{url: `${SITE_URL}${seo.ogImage.src}`, alt: seo.ogImage.alt}],
        },
    }
}

export const pageSeoData: Record<'home' | 'jobs' | 'impressum', PageSeo> = {
    home: {
        ogTitle: 'Pizzeria Verona - Restaurant, Abholung & Lieferservice',
        description: 'Italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.',
        path: '/',
        ogImage: imagesData.wesekeOg,
    },
    jobs: {
        title: 'Jobs',
        ogTitle: 'Pizzeria Verona - Jobs',
        description: 'Aktuelle Stellenangebote bei Pizzeria Verona in Weseke und Borken. Werde Teil unseres Teams in Gastronomie und Service.',
        path: '/jobs',
        ogImage: imagesData.wesekeOg,
    },
    impressum: {
        title: 'Impressum',
        ogTitle: 'Pizzeria Verona - Impressum',
        description: 'Impressum und rechtliche Angaben der Pizzeria Verona in Weseke und Borken.',
        path: '/impressum',
        ogImage: imagesData.wesekeOg,
    },
}
