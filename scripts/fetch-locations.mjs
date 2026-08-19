// Fetches Location data from the Payload CMS at build time and writes it to
// src/shared/locationsData.generated.json, which locationsData.ts imports.
//
// Runs as a npm "prebuild" hook (see package.json). If Payload is unreachable,
// errors, or returns zero locations, this script logs a warning and leaves
// locationsData.generated.json untouched (i.e. whatever was checked out from
// git) instead of failing the build. The fallback is whatever's currently committed,
// not necessarily the latest content, so it's only as fresh as the last time this file was committed.

import {existsSync, readFileSync} from 'node:fs'
import {writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

// Tiny .env loader.
function loadDotEnv(path = '.env') {
    if (!existsSync(path)) return
    for (const line of readFileSync(path, 'utf-8').split('\n')) {
        const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line)
        if (!match) continue
        const [, key, rawValue = ''] = match
        if (key in process.env) continue
        process.env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2')
    }
}

loadDotEnv()

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL

function warnAndKeepExisting(message) {
    console.warn(`[fetch-locations] ${message} — keeping existing locationsData.generated.json.`)
}

const ORIGIN = PAYLOAD_API_URL?.replace(/\/+$/, '')
const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'shared', 'locationsData.generated.json')
const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function absoluteUrl(url) {
    if (!url) return url
    return /^https?:\/\//.test(url) ? url : `${ORIGIN}${url}`
}

function mapImage(img) {
    if (!img) return undefined
    return {src: absoluteUrl(img.url), alt: img.alt ?? ''}
}

function mapDaySchedule(day) {
    if (!day || day.closed) return {closed: true}
    const slots = (day.slots ?? [])
        .filter((s) => s && s.open && s.close)
        .map((s) => ({open: s.open, close: s.close}))
    return {slots}
}

function mapWeek(week) {
    const result = {}
    for (const day of WEEK_DAYS) result[day] = mapDaySchedule(week?.[day])
    return result
}

function mapOverrides(overrides) {
    return (overrides ?? []).map((o) => {
        const base = {recurring: !!o.recurring, schedule: mapDaySchedule(o.schedule)}
        if (o.label) base.label = o.label
        if (o.recurring) {
            base.monthDay = o.monthDay
        } else {
            base.date = (o.date ?? '').slice(0, 10)
        }
        return base
    })
}

function mapOpeningHoursConfig(config) {
    return {week: mapWeek(config?.week), overrides: mapOverrides(config?.overrides)}
}

function mapLocation(doc) {
    return {
        id: doc.slug,
        slug: doc.slug,
        name: doc.name,
        shortName: doc.shortName,
        address: {
            street: doc.address?.street ?? '', city: doc.address?.city ?? '', zip: doc.address?.zip ?? '',
        },
        contact: {
            phone: doc.contact?.phone ?? '', email: doc.contact?.email ?? '',
        },
        socials: {
            facebook: doc.social?.facebook ?? '', instagram: doc.social?.instagram ?? '',
        },
        openingHours: mapOpeningHoursConfig(doc.openingHours),
        deliveryHours: doc.deliveryHours ? mapOpeningHoursConfig(doc.deliveryHours) : undefined,
        orderUrl: doc.ordering?.orderUrl ?? '',
        menuPdf: doc.ordering?.menuPdf ? absoluteUrl(doc.ordering.menuPdf.url) : undefined,
        image: mapImage(doc.heroImage),
        ogImage: mapImage(doc.ogImage) ?? {src: '', alt: ''},
        galleryImages: (doc.galleryImages ?? []).map(mapImage).filter(Boolean),
        descriptor: doc.descriptor ?? '',
        titleSuffix: doc.titleSuffix ?? '',
        aboutText: doc.aboutText ?? '',
        deliveryCities: (doc.deliveryCities ?? []).map((c) => ({
            name: c.name, aliases: [c.alias1, c.alias2, c.alias3].filter(Boolean),
        })),
        metaDescription: doc.metaDescription ?? '',
    }
}

async function main() {
    if (!PAYLOAD_API_URL) {
        warnAndKeepExisting('PAYLOAD_API_URL is not set')
        return
    }

    let res
    try {
        res = await fetch(`${ORIGIN}/api/locations?depth=2&limit=0`, {
            signal: AbortSignal.timeout(20000),
        })
    } catch (err) {
        warnAndKeepExisting(`Could not reach verona-cms at ${ORIGIN}: ${err.message}`)
        return
    }

    if (!res.ok) {
        warnAndKeepExisting(`verona-cms responded with ${res.status} ${res.statusText}`)
        return
    }

    const body = await res.json()
    const docs = body?.docs ?? []

    if (docs.length === 0) {
        warnAndKeepExisting('verona-cms returned zero locations')
        return
    }

    const locations = docs.map(mapLocation)
    await writeFile(OUT_FILE, JSON.stringify(locations, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-locations] Wrote ${locations.length} location(s) to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-locations] Unexpected error:', err)
    process.exit(1)
})
