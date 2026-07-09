import type {LocationData, OpeningHoursConfig} from './types'
import {imagesData} from './imagesData'

export const locationsData: LocationData[] = [
    {
        id: 'weseke',
        slug: 'weseke',
        name: 'Verona Weseke',
        shortName: 'Weseke',
        address: {
            street: 'Schlückersring 13',
            city: 'Weseke',
            zip: '46325',
        },
        contact: {
            phone: '02862 3724',
            email: '',
        },
        openingHours: {
            week: {
                mon: {closed: true},
                tue: {slots: [{open: '17:00', close: '22:00'}]},
                wed: {slots: [{open: '17:00', close: '22:00'}]},
                thu: {slots: [{open: '17:00', close: '22:00'}]},
                fri: {slots: [{open: '17:00', close: '22:00'}]},
                sat: {slots: [{open: '17:00', close: '22:00'}]},
                sun: {slots: [{open: '16:00', close: '22:00'}]},
            },
            overrides: [
                {date: '24.12', schedule: {closed: true}, label: 'Heiligabend'},
                {date: '25.12', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {date: '26.12', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        deliveryHours: {
            week: {
                mon: {closed: true},
                tue: {slots: [{open: '17:00', close: '22:00'}]},
                wed: {slots: [{open: '17:00', close: '22:00'}]},
                thu: {slots: [{open: '17:00', close: '22:00'}]},
                fri: {slots: [{open: '17:00', close: '22:00'}]},
                sat: {slots: [{open: '17:00', close: '22:00'}]},
                sun: {slots: [{open: '16:00', close: '21:30'}]},
            },
            overrides: [
                {date: '24.12', schedule: {closed: true}, label: 'Heiligabend'},
                {date: '25.12', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {date: '26.12', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        orderUrl: 'https://verona1.pizzeria-verona.de/kategorie/Pizza',
        menuPdf: '/menu/Speisekarte_Weseke_03-2025.pdf',
        image: imagesData.wesekeEntry.src,
        galleryImages: [imagesData.wesekeEntry, imagesData.wesekeLounge],
        fallbackBg: '#1c140d',
        descriptor: 'Hauptrestaurant · 42 Plätze',
        deliveryCities: ['Weseke', 'Ramsdorf', 'Ramsdorf-Holthausen', 'Südlohn', 'Oeding'],
    },
    {
        id: 'borken',
        slug: 'borken',
        name: 'Verona Borken',
        shortName: 'Borken',
        address: {
            street: 'Raesfelder Straße 28',
            city: 'Borken',
            zip: '46325',
        },
        contact: {
            phone: '02861 6899929',
            email: '',
        },
        openingHours: {
            week: {
                mon: {closed: true},
                tue: {slots: [{open: '11:30', close: '14:00'}, {open: '17:00', close: '22:00'}]},
                wed: {slots: [{open: '11:30', close: '14:00'}, {open: '17:00', close: '22:00'}]},
                thu: {slots: [{open: '11:30', close: '14:00'}, {open: '17:00', close: '22:00'}]},
                fri: {slots: [{open: '11:30', close: '14:00'}, {open: '17:00', close: '22:00'}]},
                sat: {slots: [{open: '17:00', close: '22:00'}]},
                sun: {slots: [{open: '16:00', close: '22:00'}]},
            },
            overrides: [
                {date: '24.12', schedule: {closed: true}, label: 'Heiligabend'},
                {date: '25.12', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {date: '26.12', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        deliveryHours: {
            week: {
                mon: {closed: true},
                tue: {slots: [{open: '12:00', close: '13:45'}, {open: '17:30', close: '22:00'}]},
                wed: {slots: [{open: '12:00', close: '13:45'}, {open: '17:30', close: '22:00'}]},
                thu: {slots: [{open: '12:00', close: '13:45'}, {open: '17:30', close: '22:00'}]},
                fri: {slots: [{open: '12:00', close: '13:45'}, {open: '17:30', close: '22:00'}]},
                sat: {slots: [{open: '17:00', close: '22:00'}]},
                sun: {slots: [{open: '16:00', close: '21:30'}]},
            },
            overrides: [
                {date: '24.12', schedule: {closed: true}, label: 'Heiligabend'},
                {date: '25.12', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {date: '26.12', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        orderUrl: 'https://verona2.pizzeria-verona.de/kategorie/Pizza',
        menuPdf: '/menu/Speisekarte_Borken_03-2025.pdf',
        image: imagesData.wesekeLounge.src,
        galleryImages: [imagesData.wesekeEntry, imagesData.wesekeLounge], // TODO: real Borken photos
        fallbackBg: '#2d2318',
        descriptor: 'Filiale · Mittagstisch',
        deliveryCities: ['Borken', 'Hovesath', 'Borkenwirthe', 'Gemen', 'Grütlohn', 'Hoxfeld', 'Marbeck'],
    },
]

export function getLocationBySlug(slug: string): LocationData | undefined {
    return locationsData.find((l) => l.slug === slug)
}
