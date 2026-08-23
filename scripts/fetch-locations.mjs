// Fetches Location data from the Payload CMS at build time and writes it to
// src/shared/locationsData.generated.json, which locationsData.ts imports.

import {existsSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {ORIGIN, REPO_ROOT, fetchCmsJson, makeWarn} from './lib/cms-fetch.mjs'

const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'locationsData.generated.json')
const MENU_DIR = join(REPO_ROOT, 'public', 'menu')
const warn = makeWarn('fetch-locations', 'locationsData.generated.json')

const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// Downloads the CMS-hosted menu PDF to public/menu/<slug>.pdf so the site links to its own domain instead of the CMS's.
async function downloadMenuPdf(slug, url) {
    const localPath = `/menu/${slug}.pdf`
    const fsPath = join(MENU_DIR, `${slug}.pdf`)

    function keepExisting(reason) {
        console.warn(`[fetch-locations] Could not download menu PDF for ${slug} (${reason}) — keeping existing ${localPath}.`)
        return existsSync(fsPath) ? localPath : undefined
    }

    let res
    try {
        res = await fetch(url, {signal: AbortSignal.timeout(20000)})
    } catch (err) {
        return keepExisting(err.message)
    }
    if (!res.ok) return keepExisting(`${res.status} ${res.statusText}`)

    try {
        await mkdir(MENU_DIR, {recursive: true})
        await writeFile(fsPath, Buffer.from(await res.arrayBuffer()))
    } catch (err) {
        return keepExisting(err.message)
    }

    console.log(`[fetch-locations] Downloaded menu PDF for ${slug}`)
    return localPath
}

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
    const byDay = new Map((Array.isArray(week) ? week : []).map((row) => [row.day, row]))
    const result = {}
    for (const day of WEEK_DAYS) result[day] = mapDaySchedule(byDay.get(day))
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
        // menuPdf is filled in after mapping — see downloadMenuPdf()
        heroImage: mapImage(doc.heroImage),
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
    const body = await fetchCmsJson('/api/locations?depth=2&limit=0', warn)
    if (!body) return

    const docs = body.docs ?? []

    if (docs.length === 0) {
        warn('verona-cms returned zero locations')
        return
    }

    const locations = docs.map(mapLocation)
    for (const [i, doc] of docs.entries()) {
        const menuPdfUrl = doc.ordering?.menuPdf ? absoluteUrl(doc.ordering.menuPdf.url) : undefined
        locations[i].menuPdf = menuPdfUrl ? await downloadMenuPdf(locations[i].slug, menuPdfUrl) : undefined
    }

    await writeFile(OUT_FILE, JSON.stringify(locations, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-locations] Wrote ${locations.length} location(s) to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-locations] Unexpected error:', err)
    process.exit(1)
})
