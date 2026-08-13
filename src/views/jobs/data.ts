import {locationsData} from '@/shared/locationsData'

export type EmploymentType = 'Vollzeit' | 'Teilzeit' | 'Minijob'

export interface JobListing {
    id: string
    active: boolean
    title: string
    employmentType: EmploymentType
    locationSlugs: '*' | string[]
    description: string
    tasks: string[]
    requirements: string[]
    postedAt: string // 'DD.MM.YYYY'
}

export function getJobLocationLabel(locationSlugs: '*' | string[]): string {
    const slugs = locationSlugs === '*' ? locationsData.map((l) => l.slug) : locationSlugs
    return slugs
        .map((slug) => locationsData.find((l) => l.slug === slug)?.shortName ?? slug)
        .join(' & ')
}

export interface JobBenefit {
    icon: 'clock' | 'users' | 'heart-handshake' | 'sparkles'
    title: string
    text: string
}

export const jobBenefits: JobBenefit[] = [
    {
        icon: 'clock',
        title: 'Flexible Zeiten',
        text: 'Deine Schicht planen wir gemeinsam, damit Job und Alltag zusammenpassen.',
    },
    {
        icon: 'users',
        title: 'Familiäres Team',
        text: 'Bei uns kennt man sich beim Vornamen, ganz ohne große Hierarchien.',
    },
    {
        icon: 'heart-handshake',
        title: 'Faire Trinkgeld-Teilung',
        text: 'Trinkgeld wird zur Hälfte mit der Küche geteilt, fair für das ganze Team.',
    },
    {
        icon: 'sparkles',
        title: 'Auch ohne Erfahrung',
        text: 'Quereinsteiger sind bei uns herzlich willkommen. Wir zeigen dir alles.',
    },
]

export interface JobProcessStep {
    step: string
    title: string
    text: string
    optional?: boolean
}

export const jobProcessSteps: JobProcessStep[] = [
    {
        step: '01',
        title: 'Bewerben',
        text: 'Ruf an, schreib eine Mail oder komm einfach im Laden vorbei.',
    },
    {
        step: '02',
        title: 'Kennenlernen',
        text: 'Bei einem kurzen Gespräch erzählen wir dir mehr und lernen dich kennen.',
    },
    {
        step: '03',
        title: 'Probearbeiten',
        text: 'Du schnupperst unverbindlich in eine Schicht rein und lernst das Team live kennen.',
        optional: true,
    },
    {
        step: '04',
        title: 'Loslegen',
        text: 'Passt es für beide Seiten, kannst du zeitnah bei uns starten.',
    },
]

export const jobsData: JobListing[] = [
    {
        id: 'fahrer',
        active: true,
        title: 'Lieferfahrer (m/w/d)',
        employmentType: 'Minijob',
        locationSlugs: '*',
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
            'Eigenes Fahrzeug von Vorteil (Kilometergeld wird erstattet)',
        ],
        postedAt: '25.06.2026',
    },
]