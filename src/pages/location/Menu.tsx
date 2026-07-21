import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {ChevronDown, ChevronUp} from 'lucide-react'
import type {MenuCategory, MenuItem} from '../../shared/types'
import './Menu.css'

const PREVIEW_ITEMS = 3
const TABS_EDGE_FADE = 32

/* Price cells for a row in a sized category: the first available price renders
   at natural width so the dot leader reaches it, the € follows the last one,
   and the fixed-width cells in between keep every price on its size column.
   A lone string price counts as available only in the middle size. */
function PriceRow({sizes, price}: { sizes: string[], price: MenuItem['price'] }) {
    const mid = Math.floor((sizes.length - 1) / 2)
    const prices = typeof price === 'string'
        ? sizes.map((_, i) => (i === mid ? price : ''))
        : price

    const first = Math.max(prices.findIndex((p) => p !== ''), 0)
    let last = prices.length - 1
    while (last > first && !prices[last]) {
        last--
    }

    return (
        <span className="flex items-baseline">
            <span className="menu__price">{prices[first] ?? ''}</span>
            {sizes.slice(first + 1, last + 1).map((s, i) => (
                <span key={s} className="menu__price menu__price-col">{prices[first + 1 + i] ?? ''}</span>
            ))}
            <span className="menu__price menu__price-euro">€</span>
            {sizes.slice(last + 1).map((s) => (
                <span key={s} className="menu__price-col" aria-hidden="true"/>
            ))}
        </span>
    )
}

interface MenuProps {
    categories: MenuCategory[]
    expanded: boolean
    onToggle: () => void
}

export function Menu({categories, expanded, onToggle}: MenuProps) {
    const listRef = useRef<HTMLDivElement>(null)
    const tabsListRef = useRef<HTMLDivElement>(null)
    const fromHeight = useRef<number | null>(null)
    const fromShellMax = useRef<string | null>(null)
    const focusCategory = useRef<string | null>(null)
    const hasMore = categories.some((c) => c.items.length > PREVIEW_ITEMS)
    const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null)
    const suppressObserver = useRef(false)
    const suppressTimeout = useRef<number | undefined>(undefined)

    /* Mobile-only quick-nav: highlight whichever category section is at the top of the viewport */
    useEffect(() => {
        const sections = listRef.current?.querySelectorAll<HTMLElement>('[data-category]')
        if (!sections?.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                /* Ignore intermediate sections the smooth-scroll passes through after a tab click */
                if (suppressObserver.current) return
                const visible = entries.filter((e) => e.isIntersecting)
                if (visible.length === 0) return
                visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                setActiveCategory(visible[0].target.getAttribute('data-category'))
            },
            {rootMargin: '-60px 0px -70% 0px'},
        )
        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [categories])

    /* Scrolls the horizontally-scrollable nav row only — using scrollBy instead of tab.scrollIntoView() to avoid scrolling ancestor containers, like the page. */
    useEffect(() => {
        if (!activeCategory) return
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
    }, [activeCategory])

    function scrollToCategory(id: string) {
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

    /* A category's 'extend' button unmounts itself on expand */
    useEffect(() => {
        if (!focusCategory.current) return
        const heading = listRef.current?.querySelector<HTMLElement>(`[data-category="${focusCategory.current}"] h3`)
        focusCategory.current = null
        heading?.focus()
    }, [expanded])

    function handleToggle() {
        const element = listRef.current
        fromHeight.current = element?.offsetHeight ?? null
        const shell = element?.closest<HTMLElement>('.menu-shell')
        fromShellMax.current = shell ? getComputedStyle(shell).maxWidth : null
        onToggle()
    }

    useLayoutEffect(() => {
        const element = listRef.current
        const from = fromHeight.current
        const fromMax = fromShellMax.current
        fromHeight.current = null
        fromShellMax.current = null
        if (!element || from === null) return
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

        /* Measure the end height at the shell's final width — suspend its width
           transition, measure, then restart it from the pre-toggle width.
           Otherwise, the height animation lands short and content below jumps. */
        const shell = element.closest<HTMLElement>('.menu-shell')
        if (shell) shell.style.transition = 'none'
        const to = element.offsetHeight
        if (shell && fromMax) {
            shell.style.maxWidth = fromMax
            void shell.offsetWidth
            shell.style.transition = ''
            shell.style.maxWidth = ''
        }

        if (from === to) return

        element.animate(
            [
                {height: `${from}px`, overflow: 'hidden'},
                {height: `${to}px`, overflow: 'hidden'},
            ],
            {duration: 400, easing: 'ease'},
        )
    }, [expanded])

    return (
        <div>
            <div className="menu-tabs md:hidden">
                <div className="menu-tabs__list" ref={tabsListRef}>
                    {categories.map(({id, name}) => (
                        <button
                            key={id}
                            type="button"
                            data-tab={id}
                            onClick={() => scrollToCategory(id)}
                            className={`menu-tabs__tab ${activeCategory === id ? 'menu-tabs__tab--active' : ''}`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={listRef}>
                <div className={`md:columns-2 md:gap-12 ${expanded ? 'xl:columns-3' : ''}`}>
                    {categories.map(({id, name, sizes, items: allItems}) => {
                        const items = expanded ? allItems : allItems.slice(0, PREVIEW_ITEMS)
                        const truncated = !expanded && allItems.length > PREVIEW_ITEMS
                        return (
                            <section key={id} data-category={id} className="menu__category break-inside-avoid">
                                <h3 tabIndex={-1} className="menu__heading flex items-baseline justify-between gap-4">
                                    {name}
                                    {sizes && (
                                        <span className="flex items-baseline">
                                            {sizes.map((s) => (
                                                <span key={s} className="menu__sizes menu__price-col">{s}</span>
                                            ))}
                                            {/* Ghost € reserves the same width as the rows' € so columns align */}
                                            <span className="menu__price menu__price-euro menu__price-euro--ghost" aria-hidden="true">€</span>
                                        </span>
                                    )}
                                </h3>
                                <ul className="space-y-4">
                                    {items.map((item) => (
                                        <li key={item.id} className="break-inside-avoid">
                                            <div className="flex items-baseline gap-2">
                                                <span className="menu__name">{item.name}</span>
                                                <span className="menu__leader flex-1" aria-hidden="true"></span>
                                                {sizes ? (
                                                    <PriceRow sizes={sizes} price={item.price}/>
                                                ) : (
                                                    <span className="menu__price">
                                                        {typeof item.price === 'string' ? `${item.price} €` : `${item.price.join(' / ')} €`}
                                                    </span>
                                                )}
                                            </div>
                                            {item.description && (
                                                <p className="menu__description">{item.description}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {truncated && (
                                    <button
                                        onClick={() => {
                                            focusCategory.current = id
                                            handleToggle()
                                        }}
                                        aria-expanded={expanded}
                                        className="menu__more cursor-pointer"
                                    >
                                        … und weitere Gerichte
                                    </button>
                                )}
                            </section>
                        )
                    })}
                </div>
            </div>
            {hasMore && (
                <div className="flex justify-center">
                    <button
                        onClick={handleToggle}
                        aria-expanded={expanded}
                        className="menu__toggle inline-flex items-center gap-2 cursor-pointer"
                    >
                        {expanded ? 'Weniger anzeigen' : 'Gesamte Speisekarte anzeigen'}
                        {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                </div>
            )}
        </div>
    )
}
