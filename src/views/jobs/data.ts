import {locationsData} from '@/shared/locationsData'
import generatedJobs from '@/shared/jobsData.generated.json'

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
    postedAt?: string // 'DD.MM.YYYY'
}

export function getJobLocationLabel(locationSlugs: '*' | string[]): string {
    const slugs = locationSlugs === '*' ? locationsData.map((l) => l.slug) : locationSlugs
    return slugs
        .map((slug) => locationsData.find((l) => l.slug === slug)?.shortName ?? slug)
        .join(' & ')
}

export interface JobsContact {
    phone: string
    email: string
}

interface GeneratedJobsData {
    contact: JobsContact
    listings: JobListing[]
}

const generated = generatedJobs as GeneratedJobsData

export const jobsContact: JobsContact = generated.contact
export const jobsData: JobListing[] = generated.listings

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
