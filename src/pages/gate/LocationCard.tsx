import {MapPin, Phone, Clock, Bike} from 'lucide-react'
import {getOpeningStatus} from '../../shared/openingHours'
import type {OpeningStatus} from '../../shared/openingHours'
import type {LocationData} from '../../shared/types'
import './LocationCard.css'

function dotState(s: OpeningStatus) {
    if (s.closesSoon) return 'soon'
    if (s.isOpen) return 'open'
    return 'closed'
}

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
    const deliveryStatus = location.deliveryHours ? getOpeningStatus(location.deliveryHours, new Date(), 'delivery') : null
    const idx = String(index + 1).padStart(2, '0')

    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                flexGrow: isActive ? 1.2 : isPassive ? 0.8 : 1,
                backgroundColor: location.fallbackBg,
                ...(location.image && {backgroundImage: `url(${location.image})`, backgroundSize: 'cover', backgroundPosition: 'center'}),
            }}
            className="card flex-1 flex flex-col cursor-pointer min-w-0 transition-[flex-grow] duration-500 ease-in-out"
        >
            <div className="card__meta flex items-center justify-between">
                <span className="card__meta-index">{idx}</span>
                <span className="card__meta-city">{location.address.city}</span>
            </div>

            <div className="flex-1"/>

            <div className="card__content">
                <div className="card__status-row flex flex-wrap gap-2">
                    <div className="card__status-badge inline-flex items-center gap-[0.4rem]">
                        <span className={`card__status-dot card__status-dot--${dotState(status)}`}/>
                        <Clock size={18} className="card__status-icon shrink-0"/>
                        <span className="card__status-label">{status.label}</span>
                    </div>
                    {deliveryStatus && (
                        <div className="card__status-badge inline-flex items-center gap-[0.4rem]">
                            <span className={`card__status-dot card__status-dot--${dotState(deliveryStatus)}`}/>
                            <Bike size={18} className="card__status-icon shrink-0"/>
                            <span className="card__status-label">{deliveryStatus.label}</span>
                        </div>
                    )}
                </div>

                <h2 className="card__title">{location.shortName}</h2>
                <p className="card__descriptor">{location.descriptor}</p>
                <div className="card__divider"/>

                <div className="card__contact flex flex-col gap-[0.6rem]">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="card__contact-icon shrink-0"/>
                        <address className="card__address">
                            <p>{location.address.street}</p>
                            <p>{location.address.zip} {location.address.city}</p>
                        </address>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={18} className="card__contact-icon shrink-0"/>
                        <p className="card__phone">{location.contact.phone}</p>
                    </div>
                </div>

                <div className="card__delivery-section">
                    <p className="card__section-label">Wir liefern u. a. nach:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {location.deliveryCities.map(city => (
                            <span key={city} className="card__chip card__chip--delivery">{city}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card__cta-bar">
                <span className="card__cta-inner inline-flex items-center gap-3">
                    {location.shortName} wählen
                    <span className="card__cta-arrow">→</span>
                </span>
            </div>
        </button>
    )
}