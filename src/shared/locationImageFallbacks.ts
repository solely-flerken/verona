import type {ImageAsset} from './imagesData'
import {imagesData} from './imagesData'

export interface LocationImageFallback {
    heroImage: ImageAsset
    ogImage: ImageAsset
    galleryImages: ImageAsset[]
}

export const locationImageFallbacks: Record<string, LocationImageFallback> = {
    weseke: {
        heroImage: imagesData.wesekeEntry,
        ogImage: imagesData.wesekeOg,
        galleryImages: [imagesData.wesekeEntry, imagesData.wesekeLounge],
    },
    borken: {
        heroImage: imagesData.borkenLounge,
        ogImage: imagesData.borkenOg,
        galleryImages: [imagesData.borkenCounter, imagesData.borkenLounge],
    },
}
