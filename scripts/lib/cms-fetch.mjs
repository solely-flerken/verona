// Shared build-time helpers for the scripts/fetch-*.mjs prebuild scripts

import {existsSync, readFileSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
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

// Downloads a binary CMS asset (image, PDF, ...) from `url` to `fsPath` so the site can
// serve it from its own domain instead of the CMS's. If the fetch fails or errors, falls
// back to whatever is already on disk at `fsPath` (if anything), so a download failure or
// a JSON write failure never leaves `publicPath` pointing at a file that doesn't exist.
export async function downloadAsset({url, fsPath, publicPath, scriptName, label}) {
    function keepExisting(reason) {
        console.warn(`[${scriptName}] Could not download ${label} (${reason}) — keeping existing ${publicPath}.`)
        return existsSync(fsPath) ? publicPath : undefined
    }

    let res
    try {
        res = await fetch(url, {signal: AbortSignal.timeout(20000)})
    } catch (err) {
        return keepExisting(err.message)
    }
    if (!res.ok) return keepExisting(`${res.status} ${res.statusText}`)

    try {
        await mkdir(dirname(fsPath), {recursive: true})
        await writeFile(fsPath, Buffer.from(await res.arrayBuffer()))
    } catch (err) {
        return keepExisting(err.message)
    }

    console.log(`[${scriptName}] Downloaded ${label}`)
    return publicPath
}
