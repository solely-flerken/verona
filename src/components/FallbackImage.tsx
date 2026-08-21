'use client'

import {useEffect, useRef, useState} from 'react'
import type {ImgHTMLAttributes} from 'react'
import './FallbackImage.css'

interface FallbackImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc: string
}

type Stage = 'primary' | 'fallback' | 'failed'

const LOAD_TIMEOUT_MS = 5000

// Shows a skeleton while the primary (external) src loads, swaps to a locally-hosted
// fallback if it fails (or takes too long), and leaves the skeleton in place if the
// fallback fails too.
// The caller's positioning className goes on the wrapper, so the skeleton and the <img>
// always occupy the exact same box.
export function FallbackImage({fallbackSrc, onError, onLoad, className, src, ...props}: FallbackImageProps) {
    const [checkedSrc, setCheckedSrc] = useState({src, fallbackSrc})
    const [stage, setStage] = useState<Stage>('primary')
    const [loaded, setLoaded] = useState(false)
    const timerRef = useRef<number>(undefined)

    // Resets if the caller swaps in a different image on an already-mounted instance.
    if (src !== checkedSrc.src || fallbackSrc !== checkedSrc.fallbackSrc) {
        setCheckedSrc({src, fallbackSrc})
        setStage('primary')
        setLoaded(false)
    }

    useEffect(() => {
        if (stage === 'failed') return
        timerRef.current = window.setTimeout(() => {
            setStage((s) => s === 'primary' ? 'fallback' : 'failed')
        }, LOAD_TIMEOUT_MS)
        return () => window.clearTimeout(timerRef.current)
    }, [stage, src, fallbackSrc])

    return (
        <div className={className}>
            <div
                className={`fallback-image-skeleton absolute inset-0 animate-pulse motion-reduce:animate-none transition-opacity duration-100 ${loaded ? 'opacity-0' : ''}`}
            />
            {stage !== 'failed' && (
                <img
                    {...props}
                    src={stage === 'fallback' ? fallbackSrc : src}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={(e) => {
                        window.clearTimeout(timerRef.current)
                        setLoaded(true)
                        onLoad?.(e)
                    }}
                    onError={(e) => {
                        window.clearTimeout(timerRef.current)
                        setStage((s) => s === 'primary' ? 'fallback' : 'failed')
                        onError?.(e)
                    }}
                    alt={''}/>
            )}
        </div>
    )
}
