import type {ReactNode} from 'react'
import {useLocation} from 'react-router'
import {SITE_URL} from '../shared/siteUrl'
import {Header, type HeaderCta} from './Header'
import {Footer} from './Footer'

interface PageLayoutProps {
    subtitle?: string
    description?: string
    showBack?: boolean
    cta?: HeaderCta
    children: ReactNode
}

export function PageLayout({subtitle, description, showBack, cta, children}: PageLayoutProps) {
    const {pathname} = useLocation()
    const pageTitle = subtitle ? `${subtitle} · Pizzeria Verona` : 'Pizzeria Verona'
    const canonicalUrl = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname.replace(/\/$/, '')}`

    return (
        <div className="min-h-dvh flex flex-col">
            <title>{pageTitle}</title>
            {description && <meta name="description" content={description}/>}
            <link rel="canonical" href={canonicalUrl}/>
            <Header subtitle={subtitle} showBack={showBack} cta={cta}/>
            {children}
            <Footer/>
        </div>
    )
}
