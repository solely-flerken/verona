import type {LocationData, OpeningHoursConfig, WeekDay} from './types'
import {SITE_URL} from './siteUrl'

const WEEK_ORDER: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const SCHEMA_DAY = {
    mon: 'https://schema.org/Monday',
    tue: 'https://schema.org/Tuesday',
    wed: 'https://schema.org/Wednesday',
    thu: 'https://schema.org/Thursday',
    fri: 'https://schema.org/Friday',
    sat: 'https://schema.org/Saturday',
    sun: 'https://schema.org/Sunday',
} as const satisfies Record<WeekDay, string>

function toInternationalPhone(phone: string): string {
    return `+49${phone.replace(/\D/g, '').replace(/^0/, '')}`
}

/* Regular week only */
function openingHoursSpecification(config: OpeningHoursConfig) {
    return WEEK_ORDER.flatMap((day) => {
        const schedule = config.week[day]
        if ('closed' in schedule) return []
        return schedule.slots.map(({open, close}) => ({
            '@type': 'OpeningHoursSpecification' as const,
            dayOfWeek: SCHEMA_DAY[day],
            opens: open,
            closes: close,
        }))
    })
}

const ORG_NAME = 'Pizzeria Verona'

function organizationRef() {
    return {
        '@type': 'Organization' as const,
        name: ORG_NAME,
        url: SITE_URL,
    }
}

export function organizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        ...organizationRef(),
    }
}

export function locationJsonLd(location: LocationData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: location.name,
        url: `${SITE_URL}/${location.slug}`,
        parentOrganization: organizationRef(),
        ...(location.image && {image: `${SITE_URL}${location.image}`}),
        telephone: toInternationalPhone(location.contact.phone),
        servesCuisine: ['Italian', 'Pizza'],
        priceRange: '€€',
        address: {
            '@type': 'PostalAddress',
            streetAddress: location.address.street,
            postalCode: location.address.zip,
            addressLocality: location.address.city,
            addressRegion: 'Nordrhein-Westfalen',
            addressCountry: 'DE',
        },
        openingHoursSpecification: openingHoursSpecification(location.openingHours),
        ...(location.menuPdf && {hasMenu: `${SITE_URL}${location.menuPdf}`}),
    }
}
