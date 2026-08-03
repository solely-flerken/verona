import type {Metadata} from 'next'
import {JobsPage} from '@/views/jobs'

export const metadata: Metadata = {
    title: 'Jobs',
    description: 'Aktuelle Stellenangebote bei Pizzeria Verona in Weseke und Borken. Werde Teil unseres Teams in Gastronomie und Service.',
    alternates: {canonical: '/jobs'},
}

export default function Page() {
    return <JobsPage/>
}
