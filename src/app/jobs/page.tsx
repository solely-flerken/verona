import type {Metadata} from 'next'
import {JobsPage} from '@/views/jobs'
import {buildPageMetadata, pageSeoData} from '@/shared/pageSeo'

export const metadata: Metadata = buildPageMetadata(pageSeoData.jobs)

export default function Page() {
    return <JobsPage/>
}
