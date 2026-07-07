import {Link} from 'react-router'
import {ArrowLeft} from 'lucide-react'
import './Header.css'

export interface HeaderCta {
    label: string
    href: string
}

interface HeaderProps {
    subtitle?: string
    showBack?: boolean
    cta?: HeaderCta
}

export function Header({subtitle = 'Bitte Standort wählen', showBack = false, cta}: HeaderProps) {
    return (
        <header className="gate-header relative flex flex-col gap-1 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center px-6 py-3.5">
            <div className="flex items-center justify-center gap-3 md:justify-start md:gap-0 md:pr-4">
                {showBack && (
                    <Link to="/" className="gate-header-back absolute left-3 inset-y-0 flex items-center gap-1.5 p-3 md:static md:inset-y-auto md:p-0">
                        <ArrowLeft size={15} strokeWidth={1.75}/>
                        <span className="hidden md:inline">Standorte</span>
                    </Link>
                )}
                <Link to="/" className="gate-wordmark md:ml-auto">
                    <span className="gate-wordmark__prefix">Pizzeria </span>
                    <span className="gate-wordmark__name">Verona</span>
                </Link>
            </div>
            <span className="gate-header-sep hidden md:block" aria-hidden="true"/>
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4 md:pl-4">
                <span className="gate-banner-sub text-center md:text-left">{subtitle}</span>
                {cta && (
                    <div className="hidden md:block">
                        <a href={cta.href} target="_blank" rel="noopener" className="gate-header-cta">
                            {cta.label}
                        </a>
                    </div>
                )}
            </div>
        </header>
    )
}
