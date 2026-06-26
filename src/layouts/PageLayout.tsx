import type {ReactNode} from 'react'
import {Header} from './Header'
import {Footer} from './Footer'

interface PageLayoutProps {
    subtitle?: string
    showBack?: boolean
    children: ReactNode
}

export function PageLayout({subtitle, showBack, children}: PageLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header subtitle={subtitle} showBack={showBack}/>
            {children}
            <Footer/>
        </div>
    )
}
