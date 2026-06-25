const CITY_MAP: Record<string, string> = {
    // Borken
    'hovesath': 'borken',
    'borkenwirthe': 'borken',
    'borken': 'borken',
    'gemen': 'borken',
    'grütlohn': 'borken',
    'marbeck': 'borken',
    'hoxfeld': 'borken',
    'gemenwirthe': 'borken',
    // Weseke
    'ramsdorf': 'weseke',
    'holthausen': 'weseke',
    'südlohn': 'weseke',
    'oeding': 'weseke',
    'weseke': 'weseke',
}

export interface PostcodeMatch {
    locationSlug: string
    confidence: 'exact' | 'region'
}

export function findNearestLocation(query: string): PostcodeMatch | null {
    const trimmed = query.trim()
    if (trimmed.length < 2) return null

    const lower = trimmed.toLowerCase()

    // Exact city match
    if (CITY_MAP[lower]) {
        return {locationSlug: CITY_MAP[lower], confidence: 'exact'}
    }

    // Case 1: input is a prefix of one or more city names (user still typing, e.g. "bork")
    const startsWithMatches = Object.keys(CITY_MAP).filter((city) => city.startsWith(lower))
    if (startsWithMatches.length > 0) {
        const slugs = new Set(startsWithMatches.map((city) => CITY_MAP[city]))

        // Only guess if every match agrees on the same location
        if (slugs.size === 1) {
            return {locationSlug: CITY_MAP[startsWithMatches[0]], confidence: 'region'}
        }

        return null // ambiguous — e.g. "bork" would match both Borken and a hypothetical other-slug city
    }

    // Case 2: a known city name is a prefix of the input, followed by a real boundary
    const containsMatches = Object.keys(CITY_MAP)
        .filter((city) => {
            if (!lower.startsWith(city)) return false
            const rest = lower.slice(city.length)
            return rest.length === 0 || !/^[a-zäöüß]/.test(rest)
        })
        .sort((a, b) => b.length - a.length)

    if (containsMatches.length > 0) {
        return {locationSlug: CITY_MAP[containsMatches[0]], confidence: 'region'}
    }

    return null
}