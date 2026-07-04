import {Link} from 'react-router'
import {ArrowLeft} from 'lucide-react'
import './Header.css'

interface HeaderProps {
    subtitle?: string
    showBack?: boolean
}

export function Header({subtitle = 'Bitte Standort wählen', showBack = false}: HeaderProps) {
    return (
        <header className="gate-header relative flex flex-col gap-1 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center px-6 py-3.5">
            <div className="flex items-center justify-center gap-3 md:justify-start md:gap-0 md:pr-4">
                {showBack && (
                    <Link to="/" className="gate-header-back absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 md:static md:top-auto md:translate-y-0">
                        <ArrowLeft size={15} strokeWidth={1.75}/>
                        Standorte
                    </Link>
                )}
                <Link to="/" className="gate-wordmark md:ml-auto">
                    <span className="gate-wordmark__prefix">Pizzeria </span>
                    <span className="gate-wordmark__name">Verona</span>
                </Link>
            </div>
            <span className="gate-header-sep hidden md:block" aria-hidden="true"/>
            <span className="gate-banner-sub text-center md:text-left md:pl-4">{subtitle}</span>
        </header>
    )
}
