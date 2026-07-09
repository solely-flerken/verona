import type {DaySchedule, OpeningHoursConfig, WeekDay} from './types'

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

function findOverride(config: OpeningHoursConfig, d: Date) {
    const dateStr = toDateStr(d)
    const monthDay = toMonthDay(d)
    return config.overrides?.find((o) => o.date === dateStr)
        ?? config.overrides?.find((o) => o.date === monthDay)
}

function scheduleText(schedule: DaySchedule): string {
    return 'closed' in schedule
        ? 'Geschlossen'
        : schedule.slots.map(({open, close}) => `${open} – ${close}`).join(' & ')
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

const DAY_LABELS: Record<WeekDay, string> = {
    mon: 'Montag',
    tue: 'Dienstag',
    wed: 'Mittwoch',
    thu: 'Donnerstag',
    fri: 'Freitag',
    sat: 'Samstag',
    sun: 'Sonntag',
}

const WEEK_ORDER: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export interface WeekScheduleRow {
    day: WeekDay
    label: string
    text: string
    isToday: boolean
}

/**
 * Weekly schedule as display rows (Mo -> So), e.g. "11:30 – 14:00 & 17:00 – 22:00" or "Geschlossen".
 * Always renders the regular week; date overrides are exposed separately
 * via getUpcomingOverrides so the general hours stay readable.
 *
 * @param config opening hours to format
 * @param now reference date, used only to set `isToday`
 */
export function getWeekSchedule(config: OpeningHoursConfig, now = new Date()): WeekScheduleRow[] {
    const today = toWeekDay(now)

    return WEEK_ORDER.map((day) => ({
        day,
        label: DAY_LABELS[day],
        text: scheduleText(config.week[day]),
        isToday: day === today,
    }))
}

export interface UpcomingOverride {
    day: WeekDay
    dateLabel: string
    label?: string
    text: string
    isToday: boolean
    daysFromNow: number
}

/**
 * Date overrides within the next `daysAhead` days as display rows, e.g. "Heiligabend (24.12.): Geschlossen".
 *
 * @param config opening hours whose overrides to scan
 * @param now reference date, day 0 of the scan
 * @param daysAhead how many days past `now` to include
 */
export function getUpcomingOverrides(config: OpeningHoursConfig, now = new Date(), daysAhead = 14): UpcomingOverride[] {
    const result: UpcomingOverride[] = []
    for (let i = 0; i <= daysAhead; i++) {
        const d = new Date(now)
        d.setDate(d.getDate() + i)
        const override = findOverride(config, d)
        if (override) {
            result.push({
                day: toWeekDay(d),
                dateLabel: `${toMonthDay(d)}.`,
                label: override.label,
                text: scheduleText(override.schedule),
                isToday: i === 0,
                daysFromNow: i,
            })
        }
    }
    return result
}

export function getOpeningStatus(config: OpeningHoursConfig, now = new Date(), mode: Mode = 'restaurant', closingSoonMinutes = 30): OpeningStatus {
    const LABEL = LABELS[mode]
    const override = findOverride(config, now)
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