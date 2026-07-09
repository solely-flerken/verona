import {useEffect, useState} from 'react'
import type {ImageAsset} from '../../shared/imagesData'
import './AboutImageGallery.css'

const ROTATE_MS = 5000

export function AboutImageGallery({images}: { images: ImageAsset[] }) {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused || images.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const id = window.setInterval(() => setActive((a) => (a + 1) % images.length), ROTATE_MS)
        return () => clearInterval(id)
    }, [images.length, paused])

    function selectImage(i: number) {
        setPaused(true)
        setActive(i)
    }

    return (
        <div className="about-gallery relative w-full overflow-hidden">
            {images.map((img, i) => (
                <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className={`about-gallery__image absolute inset-0 w-full h-full ${i === active ? 'about-gallery__image--active' : ''}`}
                />
            ))}
            {images.length > 1 && (
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
            )}
        </div>
    )
}
