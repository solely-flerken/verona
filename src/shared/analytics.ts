type UmamiEventValue = string | number | boolean | UmamiEventValue[] | { [key: string]: UmamiEventValue }
type UmamiEventData = Record<string, UmamiEventValue>

interface UmamiEventDef<D extends UmamiEventData> {
    readonly name: string
    // Phantom, never set. Lets trackEvent infer D from the event passed in.
    readonly data?: D
}

function defineEvent<D extends UmamiEventData>(name: string): UmamiEventDef<D> {
    return {name}
}

export const UmamiEvent = {
    LocationSelect: defineEvent<{ locationSlug: string }>('location-select'),
    OrderClick: defineEvent<{ location: 'header' | 'hero' | 'cta-band', locationSlug: string }>('order-click'),
    PhoneClick: defineEvent<{ location: 'gate-card' | 'contact' | 'cta-band', locationSlug: string }>('phone-click'),
    MenuPdfOpen: defineEvent<{ locationSlug: string }>('menu-pdf-open'),
    SocialClick: defineEvent<{ platform: 'facebook' | 'instagram' }>('social-click'),
    GateSearchNoMatch: defineEvent<{ query: string }>('gate-search-widget-no-match'),
    GateWidgetOpen: defineEvent<Record<string, never>>('gate-search-widget-open'),
    MenuExpand: defineEvent<{ locationSlug: string }>('menu-expand'),
    MapsConsent: defineEvent<{ locationSlug: string }>('maps-consent'),
} as const

declare global {
    interface Window {
        umami?: {
            track: (eventName: string, data?: UmamiEventData) => void
        }
    }
}

export function trackEvent<D extends UmamiEventData>(event: UmamiEventDef<D>, data: D) {
    if (typeof window === 'undefined') return
    window.umami?.track(event.name, data)
}
