import type {OpeningHoursConfig, WeekDay} from './types'

const WEEK_DAYS: WeekDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function toWeekDay(d: Date): WeekDay {
    return WEEK_DAYS[d.getDay()]
}

function toDateStr(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${dd}.${mm}.${d.getFullYear()}`
}

function toMonthDay(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${dd}.${mm}`
}

function timeToMinutes(time: string): number {
    const [h, m = '0'] = time.split(':')
    return parseInt(h) * 60 + parseInt(m)
}

export interface OpeningStatus {
    isOpen: boolean
    opensLater: boolean
    closesSoon: boolean
    label: string
}

type Mode = 'restaurant' | 'delivery'

const LABELS = {
    restaurant: {
        open: (time: string) => `Geöffnet · bis ${time} Uhr`,
        closingSoon: (time: string) => `Schließt demnächst · ${time} Uhr`,
        before: (time: string) => `Öffnet heute um ${time} Uhr`,
        between: (time: string) => `Öffnet wieder um ${time} Uhr`,
        afterClose: 'Geschlossen',
        closed: 'Heute geschlossen',
        override: (name: string) => `${name} · geschlossen`,
    },
    delivery: {
        open: (time: string) => `Lieferservice · bis ${time} Uhr`,
        closingSoon: (time: string) => `Lieferservice endet · ${time} Uhr`,
        before: (time: string) => `Lieferservice ab ${time} Uhr`,
        between: (time: string) => `Lieferservice ab ${time} Uhr`,
        afterClose: 'Lieferservice geschlossen',
        closed: 'Lieferservice geschlossen',
        override: (name: string) => `${name} · kein Lieferservice`,
    },
} satisfies Record<Mode, Record<string, string | ((s: string) => string)>>

export function getOpeningStatus(config: OpeningHoursConfig, now = new Date(), mode: Mode = 'restaurant', closingSoonMinutes = 30): OpeningStatus {
    const LABEL = LABELS[mode]
    const dateStr = toDateStr(now)
    const monthDay = toMonthDay(now)

    const exactOverride = config.overrides?.find((o) => o.date === dateStr)
    const annualOverride = config.overrides?.find((o) => o.date === monthDay)
    const override = exactOverride ?? annualOverride

    const schedule = override ? override.schedule : config.week[toWeekDay(now)]

    if ('closed' in schedule) {
        return {isOpen: false, opensLater: false, closesSoon: false, label: override?.label ? LABEL.override(override.label) : LABEL.closed}
    }

    const nowMin = now.getHours() * 60 + now.getMinutes()

    for (let i = 0; i < schedule.slots.length; i++) {
        const {open, close} = schedule.slots[i]
        const openMin = timeToMinutes(open)
        const closeMin = timeToMinutes(close)

        if (nowMin >= openMin && nowMin < closeMin) {
            const closesSoon = closeMin - nowMin <= closingSoonMinutes
            const label = closesSoon ? LABEL.closingSoon(close) : LABEL.open(close)
            return {isOpen: true, opensLater: false, closesSoon, label}
        }
        if (nowMin < openMin) {
            return {isOpen: false, opensLater: true, closesSoon: false, label: i === 0 ? LABEL.before(open) : LABEL.between(open)}
        }
    }

    return {isOpen: false, opensLater: false, closesSoon: false, label: LABEL.afterClose}
}