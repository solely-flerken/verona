import type {Metadata} from 'next'
import {GatePage} from '@/views/gate'
import {buildPageMetadata, pageSeoData} from '@/shared/pageSeo'

export const metadata: Metadata = buildPageMetadata(pageSeoData.home)

export default function Page() {
    return <GatePage/>
}
