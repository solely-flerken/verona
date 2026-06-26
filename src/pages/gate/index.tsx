import {useState} from 'react'
import {locationsData} from '../../shared/locationsData.ts'
import {useViewTransitionNavigate} from './hooks'
import {PageLayout} from '../../layouts/PageLayout'
import './index.css'
import {LocationCard} from './LocationCard'
import {LocationWidget} from './LocationWidget'

export function GatePage() {
    const navigate = useViewTransitionNavigate()
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

    return (
        <PageLayout>
            <main className="gate-main relative flex-1 flex flex-col md:flex-row gap-px">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <LocationWidget/>
                </div>
                {locationsData.map((location, index) => (
                    <LocationCard
                        key={location.id}
                        location={location}
                        index={index}
                        onClick={() => navigate(`/${location.slug}`)}
                        isActive={hoveredSlug === location.slug}
                        isPassive={hoveredSlug !== null && hoveredSlug !== location.slug}
                        onMouseEnter={() => setHoveredSlug(location.slug)}
                        onMouseLeave={() => setHoveredSlug(null)}
                    />
                ))}
            </main>
        </PageLayout>
    )
}