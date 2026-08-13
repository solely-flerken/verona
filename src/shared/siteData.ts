import type {LocationAddress} from './types'

export const SITE_URL = 'https://pizzeria-verona.de'
export const SITE_NAME = 'Pizzeria Verona'

export interface ContactInfo {
    phone: string
    email: string
}

export const jobsContact: ContactInfo = {
    phone: '02862 3724',
    email: 'info@pizzeria-verona.de',
}

export interface LegalInfo {
    companyName: string
    owner: string
    address: LocationAddress
    vatId: string
    contact: ContactInfo
}

export const legalInfo: LegalInfo = {
    companyName: 'Pizzeria Verona Weseke & Borken',
    owner: 'Marek Kaminski',
    address: {
        street: 'Schlückersring 13',
        city: 'Borken',
        zip: '46325',
    },
    vatId: 'DE 157284978',
    contact: {
        phone: '02862 3724',
        email: 'info@pizzeria-verona.de',
    },
}
