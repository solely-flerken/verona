export interface ImageAsset {
    src: string
    alt: string
}

export const imagesData = {
    wesekeEntry: {
        src: '/images/verona_weseke_entry.jpg',
        alt: 'Eingangsbereich Verona Weseke',
    },
    wesekeLounge: {
        src: '/images/verona_weseke_lounge.jpg',
        alt: 'Lounge Verona Weseke',
    },
} satisfies Record<string, ImageAsset>
