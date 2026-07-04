import {flushSync} from 'react-dom'
import {useNavigate} from 'react-router'
import {useCallback, useEffect, useRef, useState} from 'react'
import type {RefObject} from 'react'

export function useViewTransitionNavigate() {
    const navigate = useNavigate()

    return (path: string) => {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => {
                flushSync(() => navigate(path))
            })
        } else {
            navigate(path)
        }
    }
}

/**
 * Calls onClose on an outside pointerdown or Escape, for as long as `active` is true.
 *
 * @param ref element that counts as "inside" — a pointerdown on it won't close
 * @param active whether the listeners are attached at all
 * @param onClose called once on an outside pointerdown or an Escape keydown
 */
export function useCloseOnOutsideOrEscape(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
    useEffect(() => {
        if (!active) return

        function onPointerDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose()
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [ref, active, onClose])
}

/**
 * Tracks a hovered id, but only commits it after delayMs of continuous
 * hover — a quick pass-through never triggers it.
 *
 * @param delayMs
 */
export function useHoverIntent(delayMs: number) {
    const [active, setActive] = useState<string | null>(null)
    const timeoutRef = useRef<number | undefined>(undefined)

    const onEnter = useCallback((id: string) => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => setActive(id), delayMs)
    }, [delayMs])

    const onLeave = useCallback(() => {
        clearTimeout(timeoutRef.current)
        setActive(null)
    }, [])

    useEffect(() => () => clearTimeout(timeoutRef.current), [])

    return [active, onEnter, onLeave] as const
}
