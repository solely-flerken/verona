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
    image?: string
    galleryImages: ImageAsset[]
    fallbackBg: string
    descriptor: string
    deliveryCities: string[]
}