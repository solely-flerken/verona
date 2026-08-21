'use client'

import {useState} from 'react'
import {locationsData} from '@/shared/locationsData.ts'
import {organizationJsonLd} from '@/shared/structuredData'
import {speisekarteFooterLinks} from '@/shared/footerNav'
import {trackEvent, UmamiEvent} from '@/shared/analytics'
import {useHoverIntent, useViewTransitionNavigate} from './hooks'
import {PageLayout} from '@/layouts/PageLayout'
import './index.css'
import {LocationCard} from './LocationCard'
import {LocationWidget} from './LocationWidget'
import {LocationWidgetV2} from './LocationWidgetV2'

const [weseke, borken] = locationsData

export function GatePage() {
    const navigate = useViewTransitionNavigate()
    const [hoveredSlug, onCardHoverEnter, onCardHoverLeave] = useHoverIntent(50)
    const [widgetOpen, setWidgetOpen] = useState(false)

    const selectLocation = (slug: string) => {
        trackEvent(UmamiEvent.LocationSelect, {locationSlug: slug})
        navigate(`/${slug}`)
    }

    return (
        <>
            <script type="application/ld+json">{JSON.stringify(organizationJsonLd())}</script>
            <PageLayout footerLinks={speisekarteFooterLinks}>
                <main className={`gate-main relative md:flex-1 flex flex-col md:flex-row gap-px ${widgetOpen ? 'gate-main--widget-open' : ''}`}>
                <h1 className="sr-only">Pizzeria Verona in Weseke und Borken: Restaurant, Abholung &amp; Lieferservice</h1>

                {/* Mobile: reserved-space bar above both cards */}
                <div className="md:hidden">
                    <LocationWidgetV2/>
                </div>

                <LocationCard
                    location={weseke}
                    index={0}
                    onClick={() => selectLocation(weseke.slug)}
                    isActive={hoveredSlug === weseke.slug}
                    isPassive={hoveredSlug !== null && hoveredSlug !== weseke.slug}
                    onMouseEnter={() => onCardHoverEnter(weseke.slug)}
                    onMouseLeave={onCardHoverLeave}
                />

                {/* Desktop: floating dock between the cards */}
                <div className="widget-dock pointer-events-none hidden md:flex">
                    <LocationWidget onOpenChange={setWidgetOpen}/>
                </div>

                <LocationCard
                    location={borken}
                    index={1}
                    onClick={() => selectLocation(borken.slug)}
                    isActive={hoveredSlug === borken.slug}
                    isPassive={hoveredSlug !== null && hoveredSlug !== borken.slug}
                    onMouseEnter={() => onCardHoverEnter(borken.slug)}
                    onMouseLeave={onCardHoverLeave}
                />
                </main>
            </PageLayout>
        </>
    )
}