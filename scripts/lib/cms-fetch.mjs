// Shared build-time helpers for the scripts/fetch-*.mjs prebuild scripts

import {existsSync, readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

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

export const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL
export const ORIGIN = PAYLOAD_API_URL?.replace(/\/+$/, '')
export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export function makeWarn(scriptName, outFileName) {
    return (message) => console.warn(`[${scriptName}] ${message} — keeping existing ${outFileName}.`)
}

// Fetches JSON from a CMS endpoint (path relative to ORIGIN), applying the shared
// unset-URL / unreachable / non-OK fallback behavior via `warn`. Returns the parsed
// JSON body, or undefined if the caller should keep whatever's already on disk.
export async function fetchCmsJson(path, warn) {
    if (!PAYLOAD_API_URL) {
        warn('PAYLOAD_API_URL is not set')
        return undefined
    }

    let res
    try {
        res = await fetch(`${ORIGIN}${path}`, {signal: AbortSignal.timeout(20000)})
    } catch (err) {
        warn(`Could not reach verona-cms at ${ORIGIN}: ${err.message}`)
        return undefined
    }

    if (!res.ok) {
        warn(`verona-cms responded with ${res.status} ${res.statusText}`)
        return undefined
    }

    return res.json()
}
