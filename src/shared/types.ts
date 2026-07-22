import type {ImageAsset} from './imagesData'

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface TimeSlot {
    open: string
    close: string
}

export type DaySchedule =
    | { closed: true }
    | { slots: TimeSlot[] }

export interface DateOverride {
    date: string  // "DD.MM.YYYY" one-time  |  "DD.MM" recurring annually (e.g. "24.12")
    schedule: DaySchedule
    label?: string
}

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

export interface MenuItem {
    id: string
    name: string
    description?: string
    price: string | string[]  // bare amounts like '8,50' (€ is added in render); arrays map positionally to the category's `sizes`
    locations: '*' | string[]  // '*' = offered at every location
}

export interface MenuCategory {
    id: string
    name: string
    sizes?: string[]  // price column labels, e.g. ['Ø 26', 'Ø 32', 'Ø 40']
    items: MenuItem[]
}

export interface LocationData {
    id: string
    slug: string
    name: string
    shortName: string
    address: LocationAddress
    contact: LocationContact
    openingHours: OpeningHoursConfig
    deliveryHours?: OpeningHoursConfig
    orderUrl: string
    menuPdf?: string
    image?: string
    galleryImages: ImageAsset[]
    fallbackBg: string
    descriptor: string
    deliveryCities: string[]
    metaDescription: string
}