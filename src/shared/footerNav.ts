import type {FooterLink} from '@/layouts/Footer'
import {locationsData} from './locationsData'

export const speisekarteFooterLinks: FooterLink[] = locationsData.map((location) => ({
    label: `Speisekarte ${location.shortName}`,
    href: `/${location.slug}#speisekarte`,
}))
