'use client'

import {Fragment, useCallback, useRef, useState} from 'react'
import {ChevronDown, ChevronRight} from 'lucide-react'
import {getLocationBySlug, locationsData} from '@/shared/locationsData.ts'
import {findNearestLocation} from './cityLookup'
import {useCloseOnOutsideOrEscape, useViewTransitionNavigate} from './hooks'
import './LocationWidgetV2.css'

export function LocationWidgetV2() {
    const navigate = useViewTransitionNavigate()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const match = findNearestLocation(query)
    const matchedLocation = match ? getLocationBySlug(match.locationSlug) : null

    const close = useCallback(() => {
        setOpen(false)
        setQuery('')
    }, [])

    useCloseOnOutsideOrEscape(rootRef, open, close)

    return (
        <div ref={rootRef} className={`widget2 ${open ? 'widget2--open' : ''}`}>
            <button
                type="button"
                className="widget2__toggle"
                aria-expanded={open}
                onClick={() => (open ? close() : setOpen(true))}
            >
                <span className="widget2__toggle-label">
                    Nicht sicher? <span className="widget2__toggle-sub">Liefergebiete anzeigen.</span>
                </span>
                <ChevronDown size={18} className={`widget2__chevron ${open ? 'widget2__chevron--open' : ''}`}/>
            </button>

            <div className="widget2__panel">
                <div className="widget2__panel-inner">
                    <div className="widget2__search">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && matchedLocation && navigate(`/${matchedLocation.slug}`)}
                            placeholder="Ort eingeben, z. B. Ramsdorf"
                            className="widget2__input"
                            tabIndex={open ? 0 : -1}
                        />

                        {matchedLocation ? (
                            <div className="flex items-end justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="widget2__result-label">Bestellen Sie bei</p>
                                    <p className="widget2__heading">{matchedLocation.name}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/${matchedLocation.slug}`)}
                                    className="widget2__continue-btn"
                                    tabIndex={open ? 0 : -1}
                                >
                                    Weiter <ChevronRight size={14}/>
                                </button>
                            </div>
                        ) : query.trim().length >= 3 && (
                            <p className="widget2__no-match">Wir konnten Ihrer Eingabe keinen Standort zuordnen.</p>
                        )}
                    </div>

                    <div className="widget2__divider"/>

                    <div className="widget2__cities">
                        {locationsData.map((location, i) => (
                            <Fragment key={location.slug}>
                                {i > 0 && <div className="widget2__divider"/>}
                                <div className="flex flex-col gap-2">
                                    <div className="widget2__cities-header">
                                        <p className="widget2__heading">{location.shortName}</p>
                                        <button
                                            type="button"
                                            className="widget2__continue-btn"
                                            tabIndex={open ? 0 : -1}
                                            onClick={() => navigate(`/${location.slug}`)}
                                        >
                                            Weiter <ChevronRight size={14}/>
                                        </button>
                                    </div>
                                    <div className="widget2__cities-list">
                                        {location.deliveryCities.map((city) => (
                                            <span key={city.name} className="widget2__cities-item">{city.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
