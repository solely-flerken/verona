'use client'

import {useEffect, useState} from 'react'
import type {AnchorHTMLAttributes} from 'react'

interface FallbackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    fallbackHref: string
}

// Swaps to a locally-hosted fallback if the primary (external) href is unreachable.
export function FallbackLink({href, fallbackHref, ...props}: FallbackLinkProps) {
    const [checkedHref, setCheckedHref] = useState(href)
    const [useFallback, setUseFallback] = useState(false)

    if (href !== checkedHref) {
        setCheckedHref(href)
        setUseFallback(false)
    }

    useEffect(() => {
        if (href === fallbackHref) return
        let cancelled = false
        fetch(href, {method: 'HEAD', mode: 'no-cors'})
            .catch(() => {
                if (!cancelled) setUseFallback(true)
            })
        return () => {
            cancelled = true
        }
    }, [href, fallbackHref])

    return <a {...props} href={useFallback ? fallbackHref : href}/>
}
