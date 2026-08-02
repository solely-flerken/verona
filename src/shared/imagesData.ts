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
    borkenCounter: {
        src: '/images/verona_borken_counter.jpeg',
        alt: 'Eingangsbereich Verona Borken',
    },
    borkenLounge: {
        src: '/images/verona_borken_lounge.jpeg',
        alt: 'Lounge Verona Borken',
    },
} satisfies Record<string, ImageAsset>
