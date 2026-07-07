import type {ReactNode} from 'react'
import {Header, type HeaderCta} from './Header'
import {Footer} from './Footer'

interface PageLayoutProps {
    subtitle?: string
    showBack?: boolean
    cta?: HeaderCta
    children: ReactNode
}

export function PageLayout({subtitle, showBack, cta, children}: PageLayoutProps) {
    const pageTitle = subtitle
        ? `${subtitle} · Pizzeria Verona`
        : 'Pizzeria Verona'

    return (
        <div className="min-h-dvh flex flex-col">
            <title>{pageTitle}</title>
            <Header subtitle={subtitle} showBack={showBack} cta={cta}/>
            {children}
            <Footer/>
        </div>
    )
}
