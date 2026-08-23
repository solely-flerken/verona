import type {MenuCategory} from './types'
import generatedMenu from './menuData.generated.json'

export const menu: MenuCategory[] = generatedMenu as MenuCategory[]

/* Menu for one location: keeps only active items available there, drops categories that end up empty */
export function getMenuForLocation(locationId: string): MenuCategory[] {
    return menu
        .map((category) => ({
            ...category,
            items: category.items.filter((item) => item.active !== false && (item.locations === '*' || item.locations.includes(locationId)),),
        }))
        .filter((category) => category.items.length > 0)
}
