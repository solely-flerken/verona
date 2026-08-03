import type {ReactNode} from 'react'
import {Header, type HeaderCta} from './Header'
import {Footer, type FooterLink, type FooterSocial} from './Footer'

interface PageLayoutProps {
    subtitle?: string
    showBack?: boolean
    cta?: HeaderCta
    footerLinks?: FooterLink[]
    footerLocationLabel?: string
    footerSocial?: FooterSocial
    children: ReactNode
}

export function PageLayout({subtitle, showBack, cta, footerLinks, footerLocationLabel, footerSocial, children}: PageLayoutProps) {
    return (
        <div className="min-h-dvh flex flex-col">
            <Header subtitle={subtitle} showBack={showBack} cta={cta}/>
            {children}
            <Footer sectionLinks={footerLinks} locationLabel={footerLocationLabel} social={footerSocial}/>
        </div>
    )
}
