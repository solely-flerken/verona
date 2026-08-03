import type {Metadata} from 'next'
import {GatePage} from '@/views/gate'

export const metadata: Metadata = {
    description: 'Pizzeria Verona: italienische Pizzeria mit Restaurant, Abholung und Lieferservice in Weseke und Borken. Speisekarte, Öffnungszeiten & Online-Bestellung.',
    alternates: {canonical: '/'},
}

export default function Page() {
    return <GatePage/>
}
