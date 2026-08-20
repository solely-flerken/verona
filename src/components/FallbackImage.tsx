'use client'

import type {ImgHTMLAttributes} from 'react'

interface FallbackImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc: string
}

// Swaps to a locally-hosted fallback if the primary (external) src fails to load.
export function FallbackImage({fallbackSrc, onError, ...props}: FallbackImageProps) {
    return (
        <img
            {...props}
            onError={(e) => {
                if (e.currentTarget.src !== fallbackSrc) e.currentTarget.src = fallbackSrc
                onError?.(e)
            }}
            alt={"no image"}/>
    )
}
