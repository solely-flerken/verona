// Fetches the Impressum (legal info) global from the Payload CMS at build time and writes it to
// src/shared/impressumData.generated.json, which impressumData.ts imports.

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
    console.warn(`[fetch-impressum] ${message} — keeping existing impressumData.generated.json.`)
}

const ORIGIN = PAYLOAD_API_URL?.replace(/\/+$/, '')
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = join(REPO_ROOT, 'src', 'shared', 'impressumData.generated.json')

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
    if (!PAYLOAD_API_URL) {
        warnAndKeepExisting('PAYLOAD_API_URL is not set')
        return
    }

    let res
    try {
        res = await fetch(`${ORIGIN}/api/globals/impressum`, {
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

    const doc = await res.json()

    if (!doc?.companyName) {
        warnAndKeepExisting('verona-cms returned an empty impressum document')
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
