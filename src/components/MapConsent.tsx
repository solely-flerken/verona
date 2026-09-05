'use client'

import {useEffect, useId, useRef, useState, useSyncExternalStore} from 'react'
import {MapPin, Maximize2, Minimize2} from 'lucide-react'
import {trackEvent, UmamiEvent} from '@/shared/analytics'
import './MapConsent.css'

const STORAGE_KEY = 'maps-consent'
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

function subscribe() {
    return () => {}
}

function getSnapshot() {
    try {
        return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function getServerSnapshot() {
    return false
}

interface MapConsentProps {
    address: string // full postal address used to center the embedded map
    title: string // accessible title for the iframe, e.g. "Verona Borken"
    locationSlug: string // for analytics
}

// Google Maps only loads (and sets its cookies / sends data to Google) after the visitor
// opts in here, so no site-wide cookie banner is needed just for this embed.
export function MapConsent({address, title, locationSlug}: MapConsentProps) {
    const storedAccept = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    const [justAccepted, setJustAccepted] = useState(false)
    const accepted = storedAccept || justAccepted
    const wrapRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const filterId = `map-consent-spotcolor-${useId().replace(/:/g, '')}`

    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(document.fullscreenElement === wrapRef.current)
        }
        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    function accept() {
        setJustAccepted(true)
        trackEvent(UmamiEvent.MapsConsent, {locationSlug})
        try {
            localStorage.setItem(STORAGE_KEY, '1')
        } catch {
            // ignore
        }
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            void document.exitFullscreen()
        } else {
            void wrapRef.current?.requestFullscreen()
        }
    }

    if (accepted) {
        return (
            <div ref={wrapRef} className="map-consent__wrap relative">
                <svg aria-hidden focusable="false" className="map-consent__filter-defs">
                    <filter id={filterId}>
                        <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray"/>
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2 -3 -0.8 0 -0.25"
                            result="redMask"
                        />
                        <feComposite in="SourceGraphic" in2="redMask" operator="in" result="colorRed"/>
                        <feComposite in="colorRed" in2="gray" operator="over"/>
                    </filter>
                </svg>
                <iframe
                    className="map-consent__frame w-full"
                    style={{filter: `url(#${filterId})`}}
                    src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${encodeURIComponent(address)}`}
                    title={title}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                <button
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Vollbild verlassen' : 'Karte im Vollbild anzeigen'}
                    className="map-consent__maximize cursor-pointer absolute"
                >
                    {isFullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
            </div>
        )
    }

    return (
        <div className="map-consent__placeholder flex flex-col items-center justify-center gap-3 text-center">
            <MapPin size={28} className="map-consent__icon"/>
            <p className="map-consent__text">
                Um die Karte nutzen zu können, müssen Sie den Cookies für Google Maps zustimmen.
            </p>
            <button onClick={accept} className="map-consent__button cursor-pointer">
                Google Maps Cookies akzeptieren
            </button>
        </div>
    )
}
