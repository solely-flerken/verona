import {useEffect, useLayoutEffect, useRef} from 'react'
import {ChevronDown, ChevronUp} from 'lucide-react'
import type {MenuCategory, MenuItem} from '../../shared/types'
import './Menu.css'

const PREVIEW_ITEMS = 3

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
    const fromHeight = useRef<number | null>(null)
    const fromShellMax = useRef<string | null>(null)
    const focusCategory = useRef<string | null>(null)
    const hasMore = categories.some((c) => c.items.length > PREVIEW_ITEMS)

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
