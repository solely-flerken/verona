import {useState} from 'react'
import {getLocationBySlug} from '../../shared/locationsData.ts'
import {findNearestLocation} from './cityLookup'
import {useViewTransitionNavigate} from './hooks'
import './LocationWidget.css'

export function LocationWidget() {
    const navigate = useViewTransitionNavigate()
    const [query, setQuery] = useState('')

    const match = findNearestLocation(query)
    const matchedLocation = match ? getLocationBySlug(match.locationSlug) : null

    return (
        <div className="widget pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <p className="widget__title">Nicht sicher?</p>
            <p className="widget__subtitle">Geben Sie Ihren Ort ein.</p>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && matchedLocation && navigate(`/${matchedLocation.slug}`)}
                placeholder="z. B. Ramsdorf"
                className="widget__input"
            />

            {matchedLocation ? (
                <div className="widget__result flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                        <p className="widget__result-label">Bestellen Sie bei</p>
                        <p className="widget__result-name">{matchedLocation.name}</p>
                    </div>
                    <button
                        onClick={() => navigate(`/${matchedLocation.slug}`)}
                        className="widget__result-btn inline-flex items-center shrink-0 whitespace-nowrap"
                    >
                        Weiter →
                    </button>
                </div>
            ) : query.trim().length >= 3 && (
                <p className="widget__no-match">Wir konnten Ihrer Eingabe keinen Standort zuordnen.</p>
            )}
        </div>
    )
}