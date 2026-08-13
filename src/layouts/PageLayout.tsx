import type {ReactNode} from 'react'
import {Header, type HeaderCta} from './Header'
import {Footer, type FooterLink} from './Footer'
import type {Socials} from '@/shared/types'
import './PageLayout.css'

interface PageLayoutProps {
    subtitle?: string
    showBack?: boolean
    cta?: HeaderCta
    footerLinks?: FooterLink[]
    footerLocationLabel?: string
    footerSocials?: Socials
    children: ReactNode
}

export function PageLayout({subtitle, showBack, cta, footerLinks, footerLocationLabel, footerSocials, children}: PageLayoutProps) {
    return (
        <div className="page-shell flex flex-col">
            <Header subtitle={subtitle} showBack={showBack} cta={cta}/>
            {children}
            <Footer sectionLinks={footerLinks} locationLabel={footerLocationLabel} socials={footerSocials}/>
        </div>
    )
}
