import {Bike, Clock} from 'lucide-react'
import type {OpeningStatus} from '../shared/openingHours'
import './StatusBadge.css'

function dotState(s: OpeningStatus) {
    if (s.closesSoon) return 'soon'
    if (s.isOpen) return 'open'
    return 'closed'
}

interface StatusBadgeProps {
    status: OpeningStatus
    icon: 'clock' | 'bike'
    iconSize?: number
}

export function StatusBadge({status, icon, iconSize = 16}: StatusBadgeProps) {
    const Icon = icon === 'clock' ? Clock : Bike
    return (
        <div className="status-badge inline-flex items-center gap-[0.4rem]">
            <span className={`status-badge__dot status-badge__dot--${dotState(status)}`}/>
            <Icon size={iconSize} className="status-badge__icon shrink-0"/>
            <span className="status-badge__label">{status.label}</span>
        </div>
    )
}
