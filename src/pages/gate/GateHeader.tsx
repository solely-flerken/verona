import {Link} from 'react-router'
import {ArrowLeft} from 'lucide-react'
import './GateHeader.css'

interface GateHeaderProps {
    subtitle?: string
    showBack?: boolean
}

export function GateHeader({subtitle = 'Bitte Standort wählen', showBack = false}: GateHeaderProps) {
    return (
        <header className="gate-header grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5">
            <div className="flex items-center pr-4">
                {showBack && (
                    <Link to="/" className="gate-header-back inline-flex items-center gap-1.5">
                        <ArrowLeft size={15} strokeWidth={1.75}/>
                        Standort auswählen
                    </Link>
                )}
                <Link to="/" className="gate-wordmark ml-auto">
                    <span className="gate-wordmark__prefix">Pizzeria </span>
                    <span className="gate-wordmark__name">Verona</span>
                </Link>
            </div>
            <span className="gate-header-sep" aria-hidden="true"/>
            <span className="gate-banner-sub pl-4">{subtitle}</span>
        </header>
    )
}