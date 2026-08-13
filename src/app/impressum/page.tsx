import type {Metadata} from 'next'
import {ImpressumPage} from '@/views/impressum'
import {buildPageMetadata, pageSeoData} from '@/shared/pageSeo'

export const metadata: Metadata = buildPageMetadata(pageSeoData.impressum)

export default function Page() {
    return <ImpressumPage/>
}
