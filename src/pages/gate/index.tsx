import {useState} from 'react'
import {locationsData} from '../../shared/locationsData.ts'
import {useHoverIntent, useViewTransitionNavigate} from './hooks'
import {PageLayout} from '../../layouts/PageLayout'
import './index.css'
import {LocationCard} from './LocationCard'
import {LocationWidget} from './LocationWidget'

const [weseke, borken] = locationsData

export function GatePage() {
    const navigate = useViewTransitionNavigate()
    const [hoveredSlug, onCardHoverEnter, onCardHoverLeave] = useHoverIntent(50)
    const [widgetOpen, setWidgetOpen] = useState(false)

    return (
        <PageLayout>
            <main className={`gate-main relative flex-1 flex flex-col md:flex-row gap-px ${widgetOpen ? 'gate-main--widget-open' : ''}`}>
                <LocationCard
                    location={weseke}
                    index={0}
                    onClick={() => navigate(`/${weseke.slug}`)}
                    isActive={hoveredSlug === weseke.slug}
                    isPassive={hoveredSlug !== null && hoveredSlug !== weseke.slug}
                    onMouseEnter={() => onCardHoverEnter(weseke.slug)}
                    onMouseLeave={onCardHoverLeave}
                />

                <div className="widget-dock pointer-events-none">
                    <LocationWidget onOpenChange={setWidgetOpen}/>
                </div>

                <LocationCard
                    location={borken}
                    index={1}
                    onClick={() => navigate(`/${borken.slug}`)}
                    isActive={hoveredSlug === borken.slug}
                    isPassive={hoveredSlug !== null && hoveredSlug !== borken.slug}
                    onMouseEnter={() => onCardHoverEnter(borken.slug)}
                    onMouseLeave={onCardHoverLeave}
                />
            </main>
        </PageLayout>
    )
}