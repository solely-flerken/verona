'use client'

import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import type {CSSProperties} from 'react'
import {FileDown} from 'lucide-react'
import type {MenuCategory, MenuItem} from '@/shared/types'
import {trackEvent, UmamiEvent} from '@/shared/analytics'
import './Menu.css'

const TABS_EDGE_FADE = 32
/* Desktop: a category this long breaks out to full width and splits into two sub-columns */
const WIDE_CATEGORY_ITEMS = 20
/* Desktop: a category this long spans two grid rows so shorter ones stack beside it */
const TALL_CATEGORY_ITEMS = 12

function PriceRow({sizes, price}: { sizes: string[], price: MenuItem['price'] }) {
    const mid = Math.floor((sizes.length - 1) / 2)
    const prices = typeof price === 'string'
        ? sizes.map((_, i) => (i === mid ? price : ''))
        : sizes.map((s) => price[s] ?? '')

    return (
        <>
            {prices.map((p, i) => (
                <span key={sizes[i]} className="menu__price menu__price-col">{p && `${p} €`}</span>
            ))}
        </>
    )
}

function ItemList({items, sizes, offset = 0}: { items: MenuItem[], sizes?: string[], offset?: number }) {
    return (
        <ul className="menu__items">
            {items.map((item, i) => (
                <li key={`${item.id}-${offset + i}`}>
                    <div className="menu__row">
                        <span className="menu__name">{item.id ? `${item.id}. ${item.name}` : item.name}</span>
                        <span className="menu__leader" aria-hidden="true"></span>
                        {sizes ? (
                            <PriceRow sizes={sizes} price={item.price}/>
                        ) : (
                            <span className="menu__price">
                                {typeof item.price === 'string' ? `${item.price} €` : `${Object.values(item.price).join(' / ')} €`}
                            </span>
                        )}
                    </div>
                    {item.description && (
                        <p className="menu__description">{item.description}</p>
                    )}
                </li>
            ))}
        </ul>
    )
}

function SizeLegend({sizes}: { sizes: string[] }) {
    return (
        <div className="menu__legend" aria-hidden="true">
            <span/>
            {sizes.map((s) => (
                <span key={s} className="menu__sizes menu__price-col">{s}</span>
            ))}
        </div>
    )
}

interface MenuProps {
    categories: MenuCategory[]
    heading: string
    menuPdf?: string
    locationSlug: string
}

export function Menu({categories, heading, menuPdf, locationSlug}: MenuProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const tabsBarRef = useRef<HTMLDivElement>(null)
    const tabsListRef = useRef<HTMLDivElement>(null)
    const [tabsBarHeight, setTabsBarHeight] = useState(0)
    const [railNav, setRailNav] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null)
    const suppressObserver = useRef(false)
    const suppressTimeout = useRef<number | undefined>(undefined)
    const dragged = useRef(false)

    /* Wide viewports hang the nav in the left margin (vertical, fully visible);
       narrower ones keep it as a horizontally-scrolling sticky bar */
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 78rem)')
        const update = () => setRailNav(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    /* Measures the mobile sticky bar's own height so scroll targets clear it */
    useLayoutEffect(() => {
        const element = tabsBarRef.current
        if (!element) return
        const observer = new ResizeObserver(() => setTabsBarHeight(element.getBoundingClientRect().height))
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    /* Nav highlight: mark whichever category sits at the top */
    useEffect(() => {
        const sections = listRef.current?.querySelectorAll<HTMLElement>('[data-category]')
        if (!sections?.length) return

        const topInset = railNav ? 24 : tabsBarHeight
        const observer = new IntersectionObserver(
            (entries) => {
                if (suppressObserver.current) return
                const visible = entries.filter((e) => e.isIntersecting)
                if (visible.length === 0) return
                visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                setActiveCategory(visible[0].target.getAttribute('data-category'))
            },
            {rootMargin: `-${topInset}px 0px -70% 0px`},
        )
        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [categories, tabsBarHeight, railNav])

    useEffect(() => {
        if (railNav || !activeCategory) return
        const container = tabsListRef.current
        const tab = container?.querySelector<HTMLElement>(`[data-tab="${activeCategory}"]`)
        if (!container || !tab) return

        const containerBox = container.getBoundingClientRect()
        const tabBox = tab.getBoundingClientRect()
        if (tabBox.left < containerBox.left) {
            container.scrollBy({left: tabBox.left - containerBox.left, behavior: 'smooth'})
        } else if (tabBox.right > containerBox.right) {
            container.scrollBy({left: tabBox.right - containerBox.right + TABS_EDGE_FADE, behavior: 'smooth'})
        }
    }, [activeCategory, railNav])

    /* Mobile bar: touch scrolls it natively; give the mouse click-and-drag too. */
    useEffect(() => {
        const el = tabsListRef.current
        if (!el || railNav) return

        let startX = 0
        let startScroll = 0
        let dragging = false

        const onMove = (e: PointerEvent) => {
            if (!dragging) {
                if (Math.abs(e.clientX - startX) < 6) return
                dragging = true
                startX = e.clientX
                startScroll = el.scrollLeft
                el.classList.add('menu-tabs__list--dragging')
            }
            el.scrollLeft = startScroll - (e.clientX - startX)
            e.preventDefault()
        }
        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
            if (dragging) {
                el.classList.remove('menu-tabs__list--dragging')
                /* Don't let the release fire a tab click */
                dragged.current = true
                setTimeout(() => {
                    dragged.current = false
                }, 0)
            }
        }
        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            startX = e.clientX
            startScroll = el.scrollLeft
            dragging = false
            window.addEventListener('pointermove', onMove)
            window.addEventListener('pointerup', onUp)
            window.addEventListener('pointercancel', onUp)
        }

        el.addEventListener('pointerdown', onDown)
        return () => {
            el.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
        }
    }, [railNav])

    function selectCategory(id: string) {
        if (dragged.current) return
        suppressObserver.current = true
        setActiveCategory(id)
        listRef.current?.querySelector<HTMLElement>(`[data-category="${id}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })

        window.clearTimeout(suppressTimeout.current)
        suppressTimeout.current = window.setTimeout(() => {
            suppressObserver.current = false
        }, 700)
    }

    const header = (
        <>
            <h2 className="location-heading">{heading}</h2>
            {menuPdf && (
                <a
                    href={menuPdf}
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent(UmamiEvent.MenuPdfOpen, {locationSlug})}
                    className="location-menu-link inline-flex items-center gap-2"
                >
                    Speisekarte als PDF
                    <FileDown size={15}/>
                </a>
            )}
        </>
    )

    return (
        <div>
            <div className="location-menu-heading-row hidden min-[78rem]:flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                {header}
            </div>
            <div className="menu-body">
                <div className="menu-tabs" ref={tabsBarRef}>
                    <div className="menu-tabs__header flex min-[78rem]:hidden flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        {header}
                    </div>
                    <div className="menu-tabs__list" ref={tabsListRef}>
                        {categories.map(({id, name}) => (
                            <button
                                key={id}
                                type="button"
                                data-tab={id}
                                onClick={() => selectCategory(id)}
                                className={`menu-tabs__tab ${activeCategory === id ? 'menu-tabs__tab--active' : ''}`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
                <div ref={listRef} className="menu-list" style={tabsBarHeight ? {'--menu-sticky-offset': `${tabsBarHeight}px`} as CSSProperties : undefined}>
                    {categories.map(({id, name, sizes, items}) => {
                        const wide = items.length >= WIDE_CATEGORY_ITEMS
                        const tall = !wide && items.length >= TALL_CATEGORY_ITEMS
                        const split = Math.ceil(items.length / 2)

                        return (
                            <section
                                key={id}
                                data-category={id}
                                className={`menu__category ${sizes ? 'menu__category--sized' : ''} ${wide ? 'menu__category--wide' : ''} ${tall ? 'menu__category--tall' : ''}`}
                                style={sizes ? {'--menu-sizes': sizes.length} as CSSProperties : undefined}
                            >
                                <div className="menu__head">
                                    <h3 className="menu__heading">
                                        <span className="menu__heading-name">{name}</span>
                                        {sizes?.map((s) => (
                                            <span key={s} className="menu__sizes menu__price-col">{s}</span>
                                        ))}
                                    </h3>
                                    {wide && sizes && <SizeLegend sizes={sizes}/>}
                                </div>
                                <div className="menu__cols">
                                    {wide ? (
                                        <>
                                            <div className="menu__col">
                                                <ItemList items={items.slice(0, split)} sizes={sizes}/>
                                            </div>
                                            <div className="menu__col">
                                                <ItemList items={items.slice(split)} sizes={sizes} offset={split}/>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="menu__col">
                                            <ItemList items={items} sizes={sizes}/>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
