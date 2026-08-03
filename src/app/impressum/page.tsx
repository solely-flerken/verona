import type {Metadata} from 'next'
import {ImpressumPage} from '@/views/impressum'

export const metadata: Metadata = {
    title: 'Impressum',
    description: 'Impressum und rechtliche Angaben der Pizzeria Verona in Weseke und Borken.',
    alternates: {canonical: '/impressum'},
}

export default function Page() {
    return <ImpressumPage/>
}
