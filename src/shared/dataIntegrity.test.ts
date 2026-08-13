import {describe, expect, it} from 'vitest'
import {menu} from './menuData'
import {locationsData} from './locationsData'
import {jobsData} from '../views/jobs/data'

const allSlugs = locationsData.map((l) => l.slug)
const validSlugs = new Set(allSlugs)

function isValidMonthDay(monthDay: string): boolean {
    const match = /^(\d{2})-(\d{2})$/.exec(monthDay)
    if (!match) return false
    const month = Number(match[1])
    const day = Number(match[2])
    return month >= 1 && month <= 12 && day >= 1 && day <= 31
}

function isValidIsoDate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(date).getTime())
}

describe('menu data integrity', () => {
    it('every item location reference is a real location slug', () => {
        for (const category of menu) {
            for (const item of category.items) {
                if (item.locations === '*') continue
                for (const slug of item.locations) {
                    expect(validSlugs.has(slug), `menu item ${item.id} references unknown location "${slug}"`).toBe(true)
                }
            }
        }
    })

    it('every sized-category item price key matches one of the category\'s sizes', () => {
        for (const category of menu) {
            if (!category.sizes) continue
            for (const item of category.items) {
                if (typeof item.price === 'string') continue
                for (const key of Object.keys(item.price)) {
                    expect(category.sizes.includes(key), `menu item ${item.id} has price key "${key}" not in category "${category.id}" sizes`).toBe(true)
                }
            }
        }
    })

    it('price records never contain an empty-string value', () => {
        for (const category of menu) {
            for (const item of category.items) {
                if (typeof item.price === 'string') continue
                for (const [size, amount] of Object.entries(item.price)) {
                    expect(amount === '', `menu item ${item.id} has an empty price for "${size}" — omit the key instead of leaving it blank`).toBe(false)
                }
            }
        }
    })
})

describe('job data integrity', () => {
    it('every job location reference is a real location slug', () => {
        for (const job of jobsData) {
            if (job.locationSlugs === '*') continue
            for (const slug of job.locationSlugs) {
                expect(validSlugs.has(slug), `job ${job.id} references unknown location "${slug}"`).toBe(true)
            }
        }
    })
})

describe('location data integrity', () => {
    it('every location has a unique slug and id', () => {
        const slugs = locationsData.map((l) => l.slug)
        const ids = locationsData.map((l) => l.id)
        expect(new Set(slugs).size, 'duplicate location slug found').toBe(slugs.length)
        expect(new Set(ids).size, 'duplicate location id found').toBe(ids.length)
    })
})

describe('opening-hours data integrity', () => {
    it('every date override has a validly formatted date', () => {
        for (const location of locationsData) {
            const configs = [location.openingHours, location.deliveryHours].filter((c) => c !== undefined)
            for (const config of configs) {
                for (const override of config.overrides ?? []) {
                    if (override.recurring) {
                        expect(isValidMonthDay(override.monthDay), `${location.slug} override monthDay "${override.monthDay}" is not MM-DD`).toBe(true)
                    } else {
                        expect(isValidIsoDate(override.date), `${location.slug} override date "${override.date}" is not ISO YYYY-MM-DD`).toBe(true)
                    }
                }
            }
        }
    })
})
