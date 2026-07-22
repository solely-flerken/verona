import {useEffect, useState} from 'react'
import {useParams} from 'react-router'
import {MapPin, Phone, Clock, Bike, ExternalLink, FileDown} from 'lucide-react'
import {getLocationBySlug} from '../../shared/locationsData.ts'
import {getOpeningStatus, getUpcomingOverrides, getWeekSchedule} from '../../shared/openingHours'
import {telRef} from '../../shared/telRef.ts'
import {StatusBadge} from '../../components/StatusBadge'
import {PageLayout} from '../../layouts/PageLayout'
import {NotFoundPage} from '../not-found'
import {Menu} from './Menu'
import {AboutImageGallery} from './AboutImageGallery.tsx'
import {getMenuForLocation} from '../../shared/menuData'
import type {MenuCategory} from '../../shared/types'
import {aboutTexts} from './data'
import './index.css'

/* struck: the times are shown but don't apply (overridden today) */
function TimeCell({text, struck}: { text: string, struck?: boolean }) {
    return (
        <td className={`location-ticket__time ${struck ? 'location-ticket__time--struck' : ''}`}>
            {text.split(' & ').map((slot) => (
                <span key={slot} className="block whitespace-nowrap">{slot}</span>
            ))}
        </td>
    )
}

function MenuSection({categories, menuPdf}: { categories: MenuCategory[], menuPdf?: string }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <section className="location-section">
            <div className={`menu-shell ${expanded ? 'menu-shell--wide' : ''}`}>
                <p className="location-eyebrow">Speisekarte</p>
                <div className="location-menu-heading-row flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="location-heading">Aus unserer Küche</h2>
                    {menuPdf && (
                        <a href={menuPdf} download className="location-menu-link inline-flex items-center gap-2">
                            Speisekarte als PDF
                            <FileDown size={15}/>
                        </a>
                    )}
                </div>
                <Menu categories={categories} expanded={expanded} onToggle={() => setExpanded((e) => !e)}/>
                <p className="location-menu-note">
                    Irrtümer und Änderungen vorbehalten — es gelten die Preise in unserem Bestellshop.
                </p>
            </div>
        </section>
    )
}

export function LocationPage() {
    const {slug} = useParams()
    const [now, setNow] = useState(() => new Date())
    const location = slug ? getLocationBySlug(slug) : undefined

    useEffect(() => {
        const tick = () => setNow(new Date())
        const id = setInterval(tick, 60_000)
        document.addEventListener('visibilitychange', tick)
        return () => {
            clearInterval(id)
            document.removeEventListener('visibilitychange', tick)
        }
    }, [])

    if (!location) return <NotFoundPage/>

    const deliveryStatus = location.deliveryHours ? getOpeningStatus(location.deliveryHours, now, 'delivery') : null
    const deliveryUpcoming = location.deliveryHours ? getUpcomingOverrides(location.deliveryHours, now) : null
    const deliveryWeek = location.deliveryHours ? getWeekSchedule(location.deliveryHours, now) : null
    const galleryImages = [
        ...location.galleryImages.filter((img) => img.src !== location.image),
        ...location.galleryImages.filter((img) => img.src === location.image),
    ]
    const status = getOpeningStatus(location.openingHours, now)
    const upcoming = getUpcomingOverrides(location.openingHours, now)
    const week = getWeekSchedule(location.openingHours, now)

    const specialDays = [...upcoming, ...(deliveryUpcoming?.filter((d) => !upcoming.some((o) => o.dateLabel === d.dateLabel)) ?? [])].sort((a, b) => a.daysFromNow - b.daysFromNow)
    const todayHasSpecial = specialDays.some((o) => o.isToday)

    return (
        <PageLayout
            subtitle={location.shortName}
            description={location.metaDescription}
            showBack
            cta={{label: 'Online bestellen', href: location.orderUrl}}
        >
            <main className="flex-1">
                {/* ── Hero ─────────────────────────────────────────── */}
                <section
                    className="location-hero relative flex flex-col justify-end"
                    style={{
                        backgroundColor: location.fallbackBg,
                        ...(location.image && {backgroundImage: `url(${location.image})`}),
                    }}
                >
                    <div className="relative px-6 pb-8 md:pb-12">
                        <div className="location-section__inner flex flex-col items-start gap-3">
                            <p className="location-hero__eyebrow">Pizzeria Verona · Standort {location.address.city}</p>
                            <h1 className="location-hero__title">{location.shortName}</h1>
                            <p className="location-hero__descriptor">{location.descriptor}</p>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={status} icon="clock"/>
                                {deliveryStatus && <StatusBadge status={deliveryStatus} icon="bike"/>}
                            </div>
                            <a
                                href={location.orderUrl}
                                target="_blank"
                                rel="noopener"
                                className="location-hero__cta inline-flex items-center gap-2 mt-2"
                            >
                                Online bestellen
                                <ExternalLink size={15}/>
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Info: hours + contact ─────────────────── */}
                <section className="location-section">
                    <div className="location-section__inner grid gap-10 md:grid-cols-2 md:gap-16">
                        <div className="location-ticket">
                            <p className="location-eyebrow">Öffnungszeiten</p>
                            <h2 className="location-heading">Wann Sie uns erreichen</h2>
                            <table className="location-ticket__table w-full">
                                <thead>
                                <tr>
                                    <th/>
                                    <th className="location-ticket__col"><Clock size={14} className="inline"/> Restaurant</th>
                                    {deliveryWeek && <th className="location-ticket__col"><Bike size={14} className="inline"/> Lieferung</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {week.map((row, i) => (
                                    <tr key={row.day} className={row.isToday && !todayHasSpecial ? 'location-ticket__row--today' : ''}>
                                        <td className="location-ticket__day">{row.label}</td>
                                        <TimeCell text={row.text} struck={row.isToday && todayHasSpecial}/>
                                        {deliveryWeek && <TimeCell text={deliveryWeek[i].text} struck={row.isToday && todayHasSpecial}/>}
                                    </tr>
                                ))}
                                </tbody>
                                {specialDays.length > 0 && (
                                    <tbody className="location-ticket__specials">
                                    {specialDays.map((o) => (
                                        <tr key={o.dateLabel} className={o.isToday ? 'location-ticket__row--today' : ''}>
                                            <td className="location-ticket__day">
                                                {o.label ?? o.dateLabel}
                                                <span className="location-ticket__date">({o.dateLabel})</span>
                                            </td>
                                            <TimeCell text={
                                                upcoming.find((u) => u.dateLabel === o.dateLabel)?.text
                                                ?? week.find((r) => r.day === o.day)?.text
                                                ?? ''
                                            }/>
                                            {deliveryWeek && (
                                                <TimeCell text={
                                                    deliveryUpcoming?.find((u) => u.dateLabel === o.dateLabel)?.text
                                                    ?? deliveryWeek.find((r) => r.day === o.day)?.text
                                                    ?? ''
                                                }/>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                )}
                            </table>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div>
                                <p className="location-eyebrow">Kontakt</p>
                                <h2 className="location-heading">So finden Sie uns</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={20} className="location-contact-icon shrink-0"/>
                                        <address className="location-contact-text not-italic">
                                            <p>{location.address.street}</p>
                                            <p>{location.address.zip} {location.address.city}</p>
                                        </address>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={20} className="location-contact-icon shrink-0"/>
                                        <a href={telRef(location.contact.phone)}
                                           className="location-contact-link">
                                            {location.contact.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="location-section-label">Wir liefern u. a. nach:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {location.deliveryCities.map(city => (
                                        <span key={city} className="location-chip">{city}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── About ────────────────────────────────────────── */}
                <section className="location-section location-section--warm">
                    <div className="location-section__inner grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
                        <div>
                            <p className="location-eyebrow">Über uns</p>
                            <h2 className="location-heading">Italienisch aus Überzeugung</h2>
                            <p className="location-about-text">{aboutTexts[location.id]}</p>
                        </div>
                        <AboutImageGallery images={galleryImages}/>
                    </div>
                </section>

                {/* ── Menu ─────────────────────────────────────────── */}
                <MenuSection categories={getMenuForLocation(location.id)} menuPdf={location.menuPdf}/>

                {/* ── Order band ───────────────────────────────────── */}
                <section className="location-order-band">
                    <div className="location-section__inner flex flex-col items-center gap-4 text-center">
                        <h2 className="location-order-band__title">Hungrig? Dann bestellen Sie jetzt.</h2>
                        <p className="location-order-band__text">
                            Am schnellsten geht es online über unseren Bestellshop. Oder Sie rufen
                            uns einfach an — wir sind gern für Sie da.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            <a href={location.orderUrl} target="_blank" rel="noopener" className="location-order-band__cta inline-flex items-center gap-2">
                                Online bestellen
                                <ExternalLink size={17}/>
                            </a>
                            <a
                                href={telRef(location.contact.phone)}
                                className="location-order-band__phone inline-flex items-center gap-2"
                            >
                                <Phone size={17}/>
                                {location.contact.phone}
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </PageLayout>
    )
}
