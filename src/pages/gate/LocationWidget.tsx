import {useCallback, useRef, useState} from 'react'
import {X} from 'lucide-react'
import {getLocationBySlug} from '../../shared/locationsData.ts'
import {findNearestLocation} from './cityLookup'
import {useCloseOnOutsideOrEscape, useViewTransitionNavigate} from './hooks'
import './LocationWidget.css'

type Phase = 'closed' | 'open' | 'closing'

interface LocationWidgetProps {
    onOpenChange?: (open: boolean) => void
}

function TriggerButton({className, onClick}: { className?: string, onClick: () => void }) {
    return (
        <button
            className={['widget-trigger', 'pointer-events-auto', className].filter(Boolean).join(' ')}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
        >
            Nicht sicher?
        </button>
    )
}

export function LocationWidget({onOpenChange}: LocationWidgetProps) {
    const navigate = useViewTransitionNavigate()
    const [phase, setPhase] = useState<Phase>('closed')
    const [query, setQuery] = useState('')
    const rootRef = useRef<HTMLDivElement>(null)

    const match = findNearestLocation(query)
    const matchedLocation = match ? getLocationBySlug(match.locationSlug) : null

    const open = useCallback(() => {
        setPhase('open')
        onOpenChange?.(true)
    }, [onOpenChange])

    const close = useCallback(() => {
        setPhase('closing')
        onOpenChange?.(false)
    }, [onOpenChange])

    useCloseOnOutsideOrEscape(rootRef, phase === 'open', close)

    if (phase === 'closed') {
        return <TriggerButton onClick={open}/>
    }

    const panel = (
        <div
            ref={rootRef}
            className={`widget pointer-events-auto ${phase === 'closing' ? 'widget--exit' : 'widget--enter'}`}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={() => {
                if (phase === 'closing') {
                    setPhase('closed')
                    setQuery('')
                }
            }}
        >
            <button className="widget__close" onClick={close} aria-label="Schließen">
                <X size={16}/>
            </button>

            <p className="widget__title">Nicht sicher?</p>
            <p className="widget__subtitle">Geben Sie Ihren Ort ein.</p>
            <input
                autoFocus
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

    return (
        <div className="widget-swap">
            {phase === 'closing' && <TriggerButton className="widget-trigger--enter" onClick={open}/>}
            {panel}
        </div>
    )
}