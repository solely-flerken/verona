'use client'

import {MapPin, Phone} from 'lucide-react'
import {getOpeningStatus} from '@/shared/openingHours'
import {telRef} from '@/shared/telRef.ts'
import {trackEvent, UmamiEvent} from '@/shared/analytics'
import {StatusBadge} from '@/components/StatusBadge'
import {SkeletonImage} from '@/components/SkeletonImage'
import type {CSSProperties} from 'react'
import type {LocationData} from '@/shared/types'
import './LocationCard.css'

interface LocationCardProps {
    location: LocationData
    index: number
    onClick: () => void
    isActive: boolean
    isPassive: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export function LocationCard({location, index, onClick, isActive, isPassive, onMouseEnter, onMouseLeave}: LocationCardProps) {
    const status = getOpeningStatus(location.openingHours)
    const deliveryStatus = location.deliveryHours ? getOpeningStatus(location.deliveryHours, new Date(), 'delivery', location.openingHours) : null
    const idx = String(index + 1).padStart(2, '0')

    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{'--card-grow': isActive ? 1.2 : isPassive ? 0.8 : 1} as CSSProperties}
            className="card md:grow-(--card-grow) md:basis-0 flex flex-col cursor-pointer min-w-0 md:transition-[flex-grow] md:duration-500 md:ease-in-out"
        >
            {location.heroImage && (
                <SkeletonImage
                    src={location.heroImage.src}
                    alt={location.heroImage.alt}
                    className="card__photo"
                />
            )}
            <div className="card__meta hidden md:flex items-center justify-between gap-3">
                <span className="card__meta-index" aria-hidden="true">{idx}</span>
                <span className="card__meta-city">{location.address.city}</span>
            </div>

            <div className="card__spacer flex-1"/>

            <div className="card__body">
                <div className="card__status-row flex flex-wrap gap-2">
                    <StatusBadge status={status} icon="clock" iconSize={18} transitionName={`status-badge-${location.slug}-clock`}/>
                    {deliveryStatus && (
                        <span className="hidden md:contents">
                            <StatusBadge status={deliveryStatus} icon="bike" iconSize={18} transitionName={`status-badge-${location.slug}-bike`}/>
                        </span>
                    )}
                </div>

                <h2 className="card__title">{location.shortName}</h2>
                <p className="card__descriptor hidden md:block">{location.descriptor}</p>
                <div className="card__divider"/>

                <div className="card__contact flex flex-col gap-[0.6rem]">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="card__contact-icon shrink-0"/>
                        <address className="card__address">
                            <p>{location.address.street}</p>
                            <p className="hidden md:block">{location.address.zip} {location.address.city}</p>
                        </address>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={18} className="card__contact-icon shrink-0"/>
                        <a
                            href={telRef(location.contact.phone)}
                            className="card__phone"
                            onClick={(e) => {
                                e.stopPropagation()
                                trackEvent(UmamiEvent.PhoneClick, {location: 'gate-card', locationSlug: location.slug})
                            }}
                        >
                            {location.contact.phone}
                        </a>
                    </div>
                </div>

                <div className="card__delivery-section hidden md:block">
                    <p className="card__section-label">Wir liefern u. a. nach:</p>
                    <div className="card__delivery-chips flex flex-wrap gap-1.5">
                        {location.deliveryCities.map(city => (
                            <span key={city.name} className="card__chip">{city.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card__band flex items-center">
                <span className="flex flex-col items-start gap-1">
                    <span className="card__band-kicker">Speisekarte &amp; Bestellung</span>
                    <span className="card__band-label">{location.shortName} wählen</span>
                </span>
            </div>
        </button>
    )
}
