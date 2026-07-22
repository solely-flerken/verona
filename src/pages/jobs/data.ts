export type EmploymentType = 'Vollzeit' | 'Teilzeit' | 'Minijob'
export type JobLocation = 'weseke' | 'borken' | 'beide'

export const LOCATION_LABELS: Record<JobLocation, string> = {
    weseke: 'Weseke',
    borken: 'Borken',
    beide: 'Weseke & Borken',
}

export interface JobListing {
    id: string
    active: boolean
    title: string
    employmentType: EmploymentType
    location: JobLocation
    description: string
    tasks: string[]
    requirements: string[]
    postedAt: string // 'DD.MM.YYYY'
}

export const jobsContact = {
    phone: '02862 3724',
    email: 'info@pizzeria-verona.de',
}

export const jobsMetaDescription = 'Aktuelle Stellenangebote bei Pizzeria Verona in Weseke und Borken. Werde Teil unseres Teams in Gastronomie und Service.'

export const jobsData: JobListing[] = [
    {
        id: 'fahrer',
        active: true,
        title: 'Lieferfahrer (m/w/d)',
        employmentType: 'Minijob',
        location: 'beide',
        description: 'Du bringst unsere Pizzen frisch und pünktlich zu unseren Kunden im Raum Weseke, Borken und den angrenzenden Ortschaften. Die Touren sind gut planbar, das Team nett und die Schichten flexibel einteilbar. Ideal als Nebenjob oder Einstieg, auch ohne Erfahrung in der Gastronomie.',
        tasks: [
            'Auslieferung von Speisen im Liefergebiet',
            'Mithilfe im Laden zwischen den Touren, z.B. Kartons falten oder Bestand auffüllen',
            'Sorgfältiger Umgang mit Essen und Fahrzeug',
            'Freundlicher Kontakt zu unseren Kunden',
        ],
        requirements: [
            'Führerschein Klasse B',
            'Zuverlässigkeit und Pünktlichkeit',
            'Gute Deutschkenntnisse',
            'Eigenes Fahrzeug von Vorteil – Kilometergeld wird erstattet',
        ],
        postedAt: '25.06.2026',
    },
]