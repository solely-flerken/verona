import {describe, expect, it} from 'vitest'
import {getOpeningStatus, getUpcomingOverrides, getWeekSchedule} from './openingHours'
import type {OpeningHoursConfig} from './types'

// Local-time date to avoid UTC-vs-local issues
function at(year: number, month: number, day: number, hour: number, minute = 0): Date {
    return new Date(year, month - 1, day, hour, minute)
}

// Week of 2026-06-22 (Mon) – 2026-06-28 (Sun)
const MON = (h: number, m = 0) => at(2026, 6, 22, h, m)
const TUE = (h: number, m = 0) => at(2026, 6, 23, h, m)
const WED = (h: number, m = 0) => at(2026, 6, 24, h, m)
const THU = (h: number, m = 0) => at(2026, 6, 25, h, m)
const FRI = (h: number, m = 0) => at(2026, 6, 26, h, m)
const SAT = (h: number, m = 0) => at(2026, 6, 27, h, m)
const SUN = (h: number, m = 0) => at(2026, 6, 28, h, m)

const standard: OpeningHoursConfig = {
    week: {
        mon: {closed: true},
        tue: {slots: [{open: '11:30', close: '14:00'}, {open: '17:00', close: '22:00'}]},
        wed: {slots: [{open: '17:00', close: '22:00'}]},
        thu: {slots: [{open: '17:00', close: '22:00'}]},
        fri: {slots: [{open: '17:00', close: '22:00'}]},
        sat: {slots: [{open: '17:00', close: '22:00'}]},
        sun: {slots: [{open: '16:00', close: '22:00'}]},
    },
}

describe('restaurant — slot states', () => {
    it('open: inside a slot', () => {
        const result = getOpeningStatus(standard, THU(19))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 22:00 Uhr'})
    })

    it('open: exactly at open time', () => {
        const result = getOpeningStatus(standard, THU(17))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 22:00 Uhr'})
    })

    it('open: one minute before closing is still open (closesSoon)', () => {
        const result = getOpeningStatus(standard, THU(21, 59))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: true, label: 'Schließt demnächst · 22:00 Uhr'})
    })

    it('before: before first slot', () => {
        const result = getOpeningStatus(standard, THU(15))
        expect(result).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Öffnet heute um 17:00 Uhr'})
    })

    it('between: after first slot, before second (split shift)', () => {
        const result = getOpeningStatus(standard, TUE(15, 30))
        expect(result).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Öffnet wieder um 17:00 Uhr'})
    })

    it('open: inside first slot of split shift', () => {
        const result = getOpeningStatus(standard, TUE(12))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 14:00 Uhr'})
    })

    it('closed: between two slots', () => {
        const result = getOpeningStatus(standard, TUE(15))
        expect(result).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Öffnet wieder um 17:00 Uhr'})
    })

    it('closesSoon: within 30 min of closing', () => {
        const result = getOpeningStatus(standard, THU(21, 31))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: true, label: 'Schließt demnächst · 22:00 Uhr'})
    })

    it('closesSoon: exactly 30 min before close', () => {
        const result = getOpeningStatus(standard, THU(21, 30))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: true, label: 'Schließt demnächst · 22:00 Uhr'})
    })

    it('not closesSoon: 31 min before close', () => {
        const result = getOpeningStatus(standard, THU(21, 29))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 22:00 Uhr'})
    })

    it('afterClose: after last slot', () => {
        const result = getOpeningStatus(standard, THU(23))
        expect(result).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Geschlossen'})
    })

    it('afterClose: exactly at close time', () => {
        const result = getOpeningStatus(standard, THU(22))
        expect(result).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Geschlossen'})
    })

    it('closed: rest day', () => {
        const result = getOpeningStatus(standard, MON(12))
        expect(result).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heute geschlossen'})
    })

    it('sunday opens earlier', () => {
        const result = getOpeningStatus(standard, SUN(15))
        expect(result).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Öffnet heute um 16:00 Uhr'})
    })

    it('sunday inside slot', () => {
        const result = getOpeningStatus(standard, SUN(20))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 22:00 Uhr'})
    })

    it('saturday inside slot', () => {
        const result = getOpeningStatus(standard, SAT(20))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 22:00 Uhr'})
    })
})

describe('restaurant — overrides', () => {
    const withOverrides: OpeningHoursConfig = {
        ...standard,
        overrides: [
            {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
            {recurring: true, monthDay: '12-31', schedule: {closed: true}},
            {recurring: true, monthDay: '10-03', schedule: {slots: [{open: '12:00', close: '18:00'}]}, label: 'Tag der deutschen Einheit'},
        ],
    }

    it('annual override: named holiday is closed', () => {
        const christmas = at(2026, 12, 24, 15)
        expect(getOpeningStatus(withOverrides, christmas)).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heiligabend · geschlossen'})
    })

    it('annual override: applies every year', () => {
        const christmas2027 = at(2027, 12, 24, 15)
        expect(getOpeningStatus(withOverrides, christmas2027)).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heiligabend · geschlossen'})
    })

    it('annual override: unnamed falls back to closed label', () => {
        const nye = at(2026, 12, 31, 20)
        expect(getOpeningStatus(withOverrides, nye)).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heute geschlossen'})
    })

    it('one-time override: open with special hours', () => {
        const special = at(2026, 10, 3, 14)
        expect(getOpeningStatus(withOverrides, special)).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 18:00 Uhr'})
    })

    it('one-time override: outside special hours is afterClose', () => {
        const special = at(2026, 10, 3, 20)
        expect(getOpeningStatus(withOverrides, special)).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Geschlossen'})
    })

    it('exact date override beats annual override on same DD.MM', () => {
        const withBoth: OpeningHoursConfig = {
            ...standard,
            overrides: [
                {recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'},
                {recurring: false, date: '2026-12-24', schedule: {slots: [{open: '14:00', close: '20:00'}]}},
            ],
        }

        const result = getOpeningStatus(withBoth, at(2026, 12, 24, 16))
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Geöffnet · bis 20:00 Uhr'})
    })
})

describe('delivery mode', () => {
    it('open', () => {
        expect(getOpeningStatus(standard, WED(19), 'delivery')).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Lieferservice · bis 22:00 Uhr'})
    })

    it('before', () => {
        expect(getOpeningStatus(standard, THU(15), 'delivery')).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Lieferservice ab 17:00 Uhr'})
    })

    it('afterClose', () => {
        expect(getOpeningStatus(standard, FRI(23), 'delivery')).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Lieferservice geschlossen'})
    })

    it('named holiday override', () => {
        const config: OpeningHoursConfig = {
            ...standard,
            overrides: [{recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'}],
        }
        expect(getOpeningStatus(config, at(2026, 12, 24, 15), 'delivery')).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heiligabend · kein Lieferservice'})
    })
})

describe('delivery clamped to opening hours', () => {
    it('closes delivery on an opening-hours override, even without a matching delivery override', () => {
        const opening: OpeningHoursConfig = {
            ...standard,
            overrides: [{recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'}],
        }

        const result = getOpeningStatus(standard, at(2026, 12, 24, 15), 'delivery', opening)
        expect(result).toEqual({isOpen: false, opensLater: false, closesSoon: false, label: 'Heiligabend · kein Lieferservice'})
    })

    it('inherits an opening-hours override with special (non-closed) hours when delivery has none of its own', () => {
        const opening: OpeningHoursConfig = {
            week: standard.week,
            overrides: [{recurring: true, monthDay: '10-03', schedule: {slots: [{open: '12:00', close: '18:00'}]}, label: 'Feiertag'}],
        }

        // Closed every regular day and has no override — should still pick up the opening override's window wholesale.
        const delivery: OpeningHoursConfig = {
            week: {mon: {closed: true}, tue: {closed: true}, wed: {closed: true}, thu: {closed: true}, fri: {closed: true}, sat: {closed: true}, sun: {closed: true}},
        }

        const result = getOpeningStatus(delivery, at(2026, 10, 3, 14), 'delivery', opening)
        expect(result).toEqual({isOpen: true, opensLater: false, closesSoon: false, label: 'Lieferservice · bis 18:00 Uhr'})
    })

    it('narrows a delivery slot that runs wider than opening hours', () => {
        const wideDelivery: OpeningHoursConfig = {
            week: {...standard.week, tue: {slots: [{open: '10:00', close: '23:00'}]}},
        }

        // 10:00 is inside delivery's own slot but before the restaurant opens (11:30)
        const before = getOpeningStatus(wideDelivery, TUE(10), 'delivery', standard)
        expect(before).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Lieferservice ab 11:30 Uhr'})

        // 12:00 is inside both
        const inside = getOpeningStatus(wideDelivery, TUE(12), 'delivery', standard)
        expect(inside.isOpen).toBe(true)
    })

    it('leaves a delivery slot untouched when it starts later and ends earlier than opening', () => {
        // opening (standard) tue: 11:30–14:00 & 17:00–22:00; delivery is narrower on both slots — a subset already
        const narrowDelivery: OpeningHoursConfig = {
            week: {...standard.week, tue: {slots: [{open: '12:00', close: '13:30'}, {open: '17:30', close: '21:30'}]}},
        }

        const before = getOpeningStatus(narrowDelivery, TUE(11, 45), 'delivery', standard)
        expect(before).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Lieferservice ab 12:00 Uhr'})

        const betweenSlots = getOpeningStatus(narrowDelivery, TUE(13, 45), 'delivery', standard)
        expect(betweenSlots).toEqual({isOpen: false, opensLater: true, closesSoon: false, label: 'Lieferservice ab 17:30 Uhr'})
    })

    it('getWeekSchedule intersects each day with the clamp target', () => {
        const wideDelivery: OpeningHoursConfig = {
            week: {...standard.week, tue: {slots: [{open: '10:00', close: '23:00'}]}},
        }

        const rows = getWeekSchedule(wideDelivery, TUE(12), standard)
        expect(rows[1]).toEqual({day: 'tue', label: 'Dienstag', text: '11:30 – 14:00 & 17:00 – 22:00', isToday: true})
    })

    it('getUpcomingOverrides surfaces a date only overridden on the clamp target', () => {
        const opening: OpeningHoursConfig = {
            ...standard,
            overrides: [{recurring: true, monthDay: '12-24', schedule: {closed: true}, label: 'Heiligabend'}],
        }

        const rows = getUpcomingOverrides(standard, at(2026, 12, 20, 12), 14, opening)
        expect(rows).toHaveLength(1)
        expect(rows[0]).toMatchObject({dateLabel: '24.12.', label: 'Heiligabend', text: 'Geschlossen'})
    })
})

describe('getWeekSchedule', () => {
    it('returns Mo -> So rows with labels and marks today', () => {
        const rows = getWeekSchedule(standard, THU(12))
        expect(rows).toHaveLength(7)
        expect(rows[0]).toEqual({day: 'mon', label: 'Montag', text: 'Geschlossen', isToday: false})
        expect(rows.map(r => r.isToday)).toEqual([false, false, false, true, false, false, false])
    })

    it('joins split shifts with &', () => {
        const rows = getWeekSchedule(standard, MON(12))
        expect(rows[1].text).toBe('11:30 – 14:00 & 17:00 – 22:00')
    })

    it('formats a single slot as a range', () => {
        const rows = getWeekSchedule(standard, MON(12))
        expect(rows[6]).toEqual({day: 'sun', label: 'Sonntag', text: '16:00 – 22:00', isToday: false})
    })
})
