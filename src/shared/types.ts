import type {ImageAsset} from './imagesData'

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface TimeSlot {
    open: string
    close: string
}

export type DaySchedule =
    | { closed: true }
    | { slots: TimeSlot[] }

export type DateOverride =
    | { recurring: true; monthDay: string /* 'MM-DD', e.g. '12-24' */; schedule: DaySchedule; label?: string }
    | { recurring: false; date: string /* ISO 'YYYY-MM-DD' */; schedule: DaySchedule; label?: string }

export interface OpeningHoursConfig {
    week: Record<WeekDay, DaySchedule>
    overrides?: DateOverride[]
}

export interface LocationAddress {
    street: string
    city: string
    zip: string
}

export interface LocationContact {
    phone: string
    email: string
}

export interface Socials {
    facebook: string
    instagram: string
}

export interface DeliveryCity {
    name: string
    aliases?: string[]  // alternate spellings/parts used to match free-text location search input
}

export interface MenuItem {
    id: string
    name: string
    description?: string
    price: string | Record<string, string>  // bare amount like '8,50' (€ added in render); for multi-size items, one entry per offered size keyed by the category's `sizes` label (sizes not offered are simply omitted).
    locations: '*' | string[]  // '*' = offered at every location
}

export interface MenuCategory {
    id: string
    name: string
    sizes?: string[]  // price column labels + order, e.g. ['Klein', 'Groß', 'Family']
    items: MenuItem[]
}

export interface LocationData {
    id: string
    slug: string
    name: string
    shortName: string
    address: LocationAddress
    contact: LocationContact
    socials: Socials
    openingHours: OpeningHoursConfig
    deliveryHours?: OpeningHoursConfig
    orderUrl: string
    menuPdf?: string
    image?: ImageAsset
    ogImage: ImageAsset
    galleryImages: ImageAsset[]
    descriptor: string
    titleSuffix: string
    aboutText: string
    deliveryCities: DeliveryCity[]
    metaDescription: string
}