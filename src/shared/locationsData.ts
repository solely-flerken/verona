import type {LocationData} from './types'
import generatedLocations from './locationsData.generated.json'

// Populated at build time by scripts/fetch-locations.mjs
export const locationsData: LocationData[] = generatedLocations as LocationData[]

export function getLocationBySlug(slug: string): LocationData | undefined {
    return locationsData.find((l) => l.slug === slug)
}
