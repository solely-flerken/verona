// Fetches the Impressum (legal info) global from the Payload CMS at build time and writes it to
// src/shared/impressumData.generated.json, which impressumData.ts imports.

import {writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {REPO_ROOT, fetchCmsJson, makeWarn} from './lib/cms-fetch.mjs'

const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'impressumData.generated.json')
const warn = makeWarn('fetch-impressum', 'impressumData.generated.json')

function mapImpressum(doc) {
    return {
        companyName: doc.companyName ?? '',
        owner: doc.owner ?? '',
        address: {
            street: doc.address?.street ?? '',
            city: doc.address?.city ?? '',
            zip: doc.address?.zip ?? '',
        },
        vatId: doc.vatId ?? '',
        contact: {
            phone: doc.contact?.phone ?? '',
            email: doc.contact?.email ?? '',
        },
    }
}

async function main() {
    const doc = await fetchCmsJson('/api/globals/impressum', warn)
    if (!doc) return

    if (!doc.companyName) {
        warn('verona-cms returned an empty impressum document')
        return
    }

    const impressum = mapImpressum(doc)

    await writeFile(OUT_FILE, JSON.stringify(impressum, null, 2) + '\n', 'utf-8')
    console.log(`[fetch-impressum] Wrote impressum data to ${OUT_FILE}`)
}

main().catch((err) => {
    console.error('[fetch-impressum] Unexpected error:', err)
    process.exit(1)
})
