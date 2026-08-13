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
        socials: {
            facebook: 'https://www.facebook.com/p/Pizzeria-Verona-100063678484513/',
            instagram: 'https://www.instagram.com/verona.weseke/',
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
                {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
                {recurring: true, monthDay: '12-25', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {recurring: true, monthDay: '12-26', schedule: {closed: true}, label: '2. Weihnachtstag'},
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
                {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
                {recurring: true, monthDay: '12-25', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {recurring: true, monthDay: '12-26', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        orderUrl: 'https://verona1.pizzeria-verona.de/kategorie/Pizza',
        menuPdf: '/menu/Speisekarte_Weseke_03-2025.pdf',
        image: imagesData.wesekeEntry,
        ogImage: imagesData.wesekeOg,
        galleryImages: [imagesData.wesekeEntry, imagesData.wesekeLounge],
        fallbackBg: '#1c140d',
        descriptor: 'Hauptrestaurant · 42 Plätze',
        titleSuffix: 'Restaurant & Lieferservice',
        aboutText: 'Vor nun über 30 Jahren haben wir eine kleine Stehpizzeria in Weseke übernommen. Seitdem haben wir den Betrieb ausgebaut mit dem Ziel, unseren Gästen einen immer besseren Service und ein unvergessliches Geschmackserlebnis zu bieten. Heute sind wir ein gemütliches, inhabergeführtes Restaurant mit 42 Sitzplätzen sowie mit einem Abhol- und Lieferservice und einer Filiale in Borken auf der Raesfelder Str. 28. Unsere Küche ist eine Mischung aus traditionellen italienischen sowie modernen saisonalen Gerichten.',
        deliveryCities: [
            {name: 'Weseke'},
            {name: 'Ramsdorf'},
            {name: 'Ramsdorf-Holthausen', aliases: ['holthausen']},
            {name: 'Südlohn'},
            {name: 'Oeding'},
        ],
        metaDescription: 'Pizzeria Verona Weseke: unser Hauptrestaurant mit 42 Sitzplätzen, Abholung und Lieferservice nach Weseke, Ramsdorf, Südlohn und Oeding. Öffnungszeiten, Speisekarte & Online-Bestellung.',
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
        socials: {
            facebook: 'https://www.facebook.com/PizzeriaVerona2/',
            instagram: 'https://www.instagram.com/pizzeria_verona2_borken_/',
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
                {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
                {recurring: true, monthDay: '12-25', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {recurring: true, monthDay: '12-26', schedule: {closed: true}, label: '2. Weihnachtstag'},
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
                {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
                {recurring: true, monthDay: '12-25', schedule: {closed: true}, label: '1. Weihnachtstag'},
                {recurring: true, monthDay: '12-26', schedule: {closed: true}, label: '2. Weihnachtstag'},
            ],
        } satisfies OpeningHoursConfig,
        orderUrl: 'https://verona2.pizzeria-verona.de/kategorie/Pizza',
        menuPdf: '/menu/Speisekarte_Borken_03-2025.pdf',
        image: imagesData.borkenLounge,
        ogImage: imagesData.borkenOg,
        galleryImages: [imagesData.borkenCounter, imagesData.borkenLounge],
        fallbackBg: '#2d2318',
        descriptor: 'Filiale · Mittagstisch',
        titleSuffix: 'Mittagstisch & Lieferservice',
        aboutText: 'Vor nun über 30 Jahren haben wir eine kleine Stehpizzeria in Weseke übernommen. Seitdem haben wir den Betrieb ausgebaut mit dem Ziel, unseren Gästen einen immer besseren Service und ein unvergessliches Geschmackserlebnis zu bieten. Heute sind wir ein gemütliches, inhabergeführtes Restaurant mit 42 Sitzplätzen sowie mit einem Abhol- und Lieferservice und einer Filiale in Borken auf der Raesfelder Str. 28. Unsere Küche ist eine Mischung aus traditionellen italienischen sowie modernen saisonalen Gerichten.',
        deliveryCities: [
            {name: 'Borken'},
            {name: 'Hovesath'},
            {name: 'Borkenwirthe'},
            {name: 'Gemen'},
            {name: 'Gemenwirthe'},
            {name: 'Grütlohn'},
            {name: 'Hoxfeld'},
            {name: 'Marbeck'},
        ],
        metaDescription: 'Pizzeria Verona Borken: unsere Filiale mit Mittagstisch, Abholung und Lieferservice nach Borken, Gemen, Marbeck und Umgebung. Öffnungszeiten, Speisekarte & Online-Bestellung.',
    },
]

export function getLocationBySlug(slug: string): LocationData | undefined {
    return locationsData.find((l) => l.slug === slug)
}
