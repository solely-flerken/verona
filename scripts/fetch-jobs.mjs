// Fetches the Jobs global (contact, listings) from the Payload CMS at build time

import {writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {REPO_ROOT, fetchCmsJson, makeWarn} from './lib/cms-fetch.mjs'

const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'jobsData.generated.json')
const warn = makeWarn('fetch-jobs', 'jobsData.generated.json')

// Formats an ISO date string ("2026-06-25T00:00:00.000Z") as "DD.MM.YYYY"
function formatDateDMY(iso) {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return undefined
    const dd = String(date.getUTCDate()).padStart(2, '0')
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
    return `${dd}.${mm}.${date.getUTCFullYear()}`
}

function mapListing(doc) {
    const locationSlugs = doc.allLocations
        ? '*'
        : (doc.locations ?? []).map((l) => (typeof l === 'object' ? l?.slug : l)).filter(Boolean)

    const listing = {
        id: doc.id,
        active: !!doc.active,
        title: doc.title ?? '',
        employmentType: doc.employmentType ?? 'Vollzeit',
        locationSlugs,
        description: doc.description ?? '',
        tasks: (doc.tasks ?? []).map((t) => t.text).filter(Boolean),
        requirements: (doc.requirements ?? []).map((r) => r.text).filter(Boolean),
    }

    const postedAt = doc.postedAt ? formatDateDMY(doc.postedAt) : undefined
    if (postedAt) listing.postedAt = postedAt

    return listing
}

async function main() {
    const doc = await fetchCmsJson('/api/globals/jobs?depth=1', warn)
    if (!doc) return

    if (!doc.contact?.phone) {
        warn('verona-cms returned an empty jobs document')
        return
    }

    const jobs = {
        contact: {phone: doc.contact?.phone ?? '', email: doc.contact?.email ?? ''},
        listings: (doc.listings ?? []).map(mapListing),
    }

    await writeFile(OUT_FILE, JSON.stringify(jobs, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-jobs] Wrote jobs data to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-jobs] Unexpected error:', err)
    process.exit(1)
})
