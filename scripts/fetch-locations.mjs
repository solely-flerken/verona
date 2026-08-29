// Fetches Location data from the Payload CMS at build time and writes it to
// src/shared/locationsData.generated.json, which locationsData.ts imports.

import {writeFile} from 'node:fs/promises'
import {extname, join} from 'node:path'
import {ORIGIN, REPO_ROOT, downloadAsset, fetchCmsJson, makeWarn} from './lib/cms-fetch.mjs'

const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'locationsData.generated.json')
const MENU_DIR = join(REPO_ROOT, 'public', 'menu')
const IMAGES_DIR = join(REPO_ROOT, 'public', 'images', 'cms')
const warn = makeWarn('fetch-locations', 'locationsData.generated.json')

const WEEK_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// Downloads the CMS-hosted menu PDF to public/menu/<slug>.pdf so the site links to its own domain instead of the CMS's.
function downloadMenuPdf(slug, url) {
    return downloadAsset({
        url,
        fsPath: join(MENU_DIR, `${slug}.pdf`),
        publicPath: `/menu/${slug}.pdf`,
        scriptName: 'fetch-locations',
        label: `menu PDF for ${slug}`,
    })
}

function extFromUrl(url) {
    const path = String(url ?? '').split(/[?#]/)[0]
    return extname(path) || '.jpg'
}

// Downloads a CMS-hosted image to public/images/cms/<fileBaseName>.<ext>
async function downloadLocationImage(remote, fileBaseName, label) {
    if (!remote) return undefined

    const ext = extFromUrl(remote.url)
    const publicPath = `/images/cms/${fileBaseName}${ext}`
    const src = await downloadAsset({
        url: remote.url,
        fsPath: join(IMAGES_DIR, `${fileBaseName}${ext}`),
        publicPath,
        scriptName: 'fetch-locations',
        label,
    })

    return src ? {src, alt: remote.alt} : undefined
}

function absoluteUrl(url) {
    if (!url) return url
    return /^https?:\/\//.test(url) ? url : `${ORIGIN}${url}`
}

// Raw CMS image reference (remote URL + alt), resolved to a local downloaded ImageAsset later.
function mapRemoteImage(img) {
    if (!img) return undefined
    return {url: absoluteUrl(img.url), alt: img.alt ?? ''}
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
        heroImage: mapRemoteImage(doc.heroImage),
        ogImage: mapRemoteImage(doc.ogImage),
        galleryImages: (doc.galleryImages ?? []).map(mapRemoteImage).filter(Boolean),
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
        const loc = locations[i]

        const menuPdfUrl = doc.ordering?.menuPdf ? absoluteUrl(doc.ordering.menuPdf.url) : undefined
        loc.menuPdf = menuPdfUrl ? await downloadMenuPdf(loc.slug, menuPdfUrl) : undefined

        loc.heroImage = await downloadLocationImage(loc.heroImage, `${loc.slug}-hero`, `hero image for ${loc.slug}`)
        loc.ogImage = (await downloadLocationImage(loc.ogImage, `${loc.slug}-og`, `og image for ${loc.slug}`)) ?? {
            src: '',
            alt: ''
        }

        const galleryImages = []
        for (const [idx, img] of loc.galleryImages.entries()) {
            const resolved = await downloadLocationImage(img, `${loc.slug}-gallery-${idx}`, `gallery image ${idx + 1} for ${loc.slug}`)
            if (resolved) galleryImages.push(resolved)
        }
        loc.galleryImages = galleryImages
    }

    await writeFile(OUT_FILE, JSON.stringify(locations, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-locations] Wrote ${locations.length} location(s) to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-locations] Unexpected error:', err)
    process.exit(1)
})
