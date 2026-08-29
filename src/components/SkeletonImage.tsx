'use client'

import {useEffect, useRef, useState} from 'react'
import type {ImgHTMLAttributes} from 'react'
import './SkeletonImage.css'

// Shows a skeleton while the image loads, and leaves the skeleton in place instead of a
// broken image if it fails to load. The caller's positioning className goes on the
// wrapper, so the skeleton and the <img> always occupy the exact same box.
export function SkeletonImage({onError, onLoad, className, src, alt, ...props}: ImgHTMLAttributes<HTMLImageElement>) {
    const [checkedSrc, setCheckedSrc] = useState(src)
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    // Resets if the caller swaps in a different image
    if (src !== checkedSrc) {
        setCheckedSrc(src)
        setLoaded(false)
        setFailed(false)
    }

    useEffect(() => {
        const img = imgRef.current
        if (!img?.complete) return
        if (img.naturalWidth > 0) {
            setLoaded(true)
        } else {
            setFailed(true)
        }
    }, [src])

    return (
        <div className={className}>
            <div className={`image-skeleton absolute inset-0 animate-pulse motion-reduce:animate-none transition-opacity duration-100 ${loaded ? 'opacity-0' : ''}`}/>
            {!failed && (
                <img
                    {...props}
                    ref={imgRef}
                    src={src}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={(e) => {
                        setLoaded(true)
                        onLoad?.(e)
                    }}
                    onError={(e) => {
                        setFailed(true)
                        onError?.(e)
                    }}
                    alt={alt ?? ''}/>
            )}
        </div>
    )
}
