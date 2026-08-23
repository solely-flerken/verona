// Fetches menu categories (with nested items) from the Payload CMS at build time

import {writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {REPO_ROOT, fetchCmsJson, makeWarn} from './lib/cms-fetch.mjs'

const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'menuData.generated.json')
const warn = makeWarn('fetch-menu', 'menuData.generated.json')

function mapPrice(rows, sizes) {
    const withAmount = (Array.isArray(rows) ? rows : [])
        .map((r) => ({label: (r?.label ?? '').trim(), amount: (r?.amount ?? '').trim()}))
        .filter((r) => r.amount !== '')

    if (sizes.length > 0) {
        const bySize = {}
        for (const size of sizes) {
            const match = withAmount.find((r) => r.label === size)
            if (match) bySize[size] = match.amount
        }
        return bySize
    }

    return withAmount[0]?.amount ?? ''
}

function mapItem(doc, sizes) {
    const locations = doc.allLocations
        ? '*'
        : (doc.locations ?? []).map((l) => (typeof l === 'object' ? l?.slug : l)).filter(Boolean)

    const item = {
        id: doc.itemId ?? '',
        name: doc.name ?? '',
        price: mapPrice(doc.price, sizes),
        locations,
    }
    if (doc.description) item.description = doc.description
    if (doc.active === false) item.active = false

    return item
}

function mapCategory(doc) {
    const sizes = (doc.sizes ?? []).filter((s) => typeof s === 'string' && s.trim() !== '')

    const category = {
        id: String(doc.id),
        name: doc.name ?? '',
        items: (doc.items ?? []).map((item) => mapItem(item, sizes)),
    }
    if (sizes.length > 0) category.sizes = sizes

    return category
}

async function main() {
    const body = await fetchCmsJson('/api/menu-categories?depth=1&limit=0&sort=order', warn)
    if (!body) return

    const docs = body.docs ?? []

    if (docs.length === 0) {
        warn('verona-cms returned zero menu categories')
        return
    }

    const categories = docs.map(mapCategory)

    await writeFile(OUT_FILE, JSON.stringify(categories, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-menu] Wrote ${categories.length} menu categories to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-menu] Unexpected error:', err)
    process.exit(1)
})
