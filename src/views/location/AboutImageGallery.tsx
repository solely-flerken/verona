'use client'

import {useEffect, useRef, useState} from 'react'
import type {TouchEvent} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import type {ImageAsset} from '@/shared/imagesData'
import './AboutImageGallery.css'

const ROTATE_MS = 5000
const SWIPE_THRESHOLD_PX = 40

export function AboutImageGallery({images}: { images: ImageAsset[] }) {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const touchStartX = useRef<number | null>(null)

    useEffect(() => {
        if (paused || images.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const id = window.setInterval(() => setActive((a) => (a + 1) % images.length), ROTATE_MS)
        return () => clearInterval(id)
    }, [images.length, paused])

    function selectImage(i: number) {
        setPaused(true)
        setActive(i)
    }

    function step(delta: number) {
        selectImage((active + delta + images.length) % images.length)
    }

    function handleTouchStart(e: TouchEvent) {
        touchStartX.current = e.touches[0].clientX
    }

    function handleTouchEnd(e: TouchEvent) {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
        step(delta < 0 ? 1 : -1)
    }

    return (
        <div
            className="about-gallery relative w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {images.map((img, i) => (
                <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className={`about-gallery__image absolute inset-0 w-full h-full ${i === active ? 'about-gallery__image--active' : ''}`}
                />
            ))}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => step(-1)}
                        aria-label="Vorheriges Bild"
                        className="about-gallery__arrow about-gallery__arrow--prev cursor-pointer absolute inset-y-0 flex items-center"
                    >
                        <ChevronLeft/>
                    </button>
                    <button
                        onClick={() => step(1)}
                        aria-label="Nächstes Bild"
                        className="about-gallery__arrow about-gallery__arrow--next cursor-pointer absolute inset-y-0 flex items-center"
                    >
                        <ChevronRight/>
                    </button>
                    <div className="about-gallery__dots absolute inset-x-0 flex justify-center gap-2">
                        {images.map((img, i) => (
                            <button
                                key={img.src}
                                onClick={() => selectImage(i)}
                                aria-label={`Bild ${i + 1} anzeigen`}
                                className={`about-gallery__dot cursor-pointer ${i === active ? 'about-gallery__dot--active' : ''}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
