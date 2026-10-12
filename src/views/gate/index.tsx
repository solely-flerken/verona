'use client'

import {locationsData} from '@/shared/locationsData.ts'
import {organizationJsonLd} from '@/shared/structuredData'
import {speisekarteFooterLinks} from '@/shared/footerNav'
import {trackEvent, UmamiEvent} from '@/shared/analytics'
import {useHoverIntent, useViewTransitionNavigate} from './hooks'
import {PageLayout} from '@/layouts/PageLayout'
import './index.css'
import {LocationCard} from './LocationCard'
import {LocationWidgetV2} from './LocationWidgetV2'

const [weseke, borken] = locationsData

export function GatePage() {
    const navigate = useViewTransitionNavigate()
    const [hoveredSlug, onCardHoverEnter, onCardHoverLeave] = useHoverIntent(50)

    const selectLocation = (slug: string) => {
        trackEvent(UmamiEvent.LocationSelect, {locationSlug: slug})
        navigate(`/${slug}`)
    }

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(organizationJsonLd())}</script>
            <PageLayout footerLinks={speisekarteFooterLinks}>
                <main className="gate-main relative md:flex-1 flex flex-col gap-px">
                <h1 className="sr-only">Pizzeria Verona in Weseke und Borken: Restaurant, Abholung &amp; Lieferservice</h1>

                <LocationWidgetV2/>

                <div className="md:flex-1 flex flex-col md:flex-row gap-px">
                    <LocationCard
                        location={weseke}
                        index={0}
                        onClick={() => selectLocation(weseke.slug)}
                        isActive={hoveredSlug === weseke.slug}
                        isPassive={hoveredSlug !== null && hoveredSlug !== weseke.slug}
                        onMouseEnter={() => onCardHoverEnter(weseke.slug)}
                        onMouseLeave={onCardHoverLeave}
                    />

                    <LocationCard
                        location={borken}
                        index={1}
                        onClick={() => selectLocation(borken.slug)}
                        isActive={hoveredSlug === borken.slug}
                        isPassive={hoveredSlug !== null && hoveredSlug !== borken.slug}
                        onMouseEnter={() => onCardHoverEnter(borken.slug)}
                        onMouseLeave={onCardHoverLeave}
                    />
                </div>
                </main>
            </PageLayout>
        </>
    )
}