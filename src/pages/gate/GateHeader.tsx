import './GateHeader.css'

interface GateHeaderProps {
    subtitle?: string
}

export function GateHeader({subtitle = 'Bitte Standort wählen'}: GateHeaderProps) {
    return (
        <header className="gate-header grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5">
            <div className="justify-self-end pr-4">
                <span className="gate-wordmark__prefix">Pizzeria </span>
                <span className="gate-wordmark__name">Verona</span>
            </div>
            <span className="gate-header-sep" aria-hidden="true"/>
            <span className="gate-banner-sub pl-4">{subtitle}</span>
        </header>
    )
}