import {Fragment} from 'react'
import Link from 'next/link'
import {locationsData} from '@/shared/locationsData.ts'
import type {Socials} from '@/shared/types'
import {FacebookIcon, InstagramIcon} from './SocialIcons'
import './Footer.css'

// Site-wide pages fall back to the main restaurant's social accounts.
const DEFAULT_SOCIALS = locationsData.find((location) => location.id === 'weseke')!.socials

export interface FooterLink {
    label: string
    href: string
}

interface FooterProps {
    sectionLinks?: FooterLink[]
    locationLabel?: string
    socials?: Socials
}

export function Footer({sectionLinks = [], locationLabel, socials = DEFAULT_SOCIALS}: FooterProps) {
    return (
        <footer className="gate-footer">
            {/* ── Mobile ──────────────────────────────────────────── */}
            <div className="gate-footer__mobile lg:hidden flex flex-col items-center gap-5 px-8 py-6">
                <Link href="/" aria-label="Pizzeria Verona">
                    <img src="/images/verona_logo.png" alt="Pizzeria Verona" className="gate-footer__logo"/>
                </Link>

                {locationLabel && <span className="gate-footer__location">{locationLabel}</span>}

                <div className="flex items-center gap-3">
                    <a href={socials.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="gate-footer__social">
                        <FacebookIcon size={28}/>
                    </a>
                    <a href={socials.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="gate-footer__social">
                        <InstagramIcon size={28}/>
                    </a>
                </div>

                <nav className="flex flex-col items-center gap-1">
                    {sectionLinks.map((link) => (
                        <a key={link.href} href={link.href} className="gate-footer__nav-link">{link.label}</a>
                    ))}
                    <Link href="/jobs" className="gate-footer__nav-link">Jobs</Link>
                    <Link href="/impressum" className="gate-footer__nav-link">Impressum</Link>
                </nav>

                <span className="gate-footer__copyright">© {new Date().getFullYear()} Pizzeria Verona · Weseke &amp; Borken</span>
            </div>

            {/* ── Desktop ─────────────────────────────────────────── */}
            <div className="gate-footer__desktop hidden lg:grid lg:grid-cols-[1fr_auto_minmax(0,1fr)] lg:items-center gap-4 px-8 py-2.5">
                <div className="flex items-center gap-2">
                    <Link href="/" aria-label="Pizzeria Verona" className="shrink-0">
                        <img src="/images/verona_logo.png" alt="Pizzeria Verona" className="gate-footer__logo-desktop"/>
                    </Link>
                    <div className="flex items-center gap-2 ml-4">
                        <a href={socials.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="gate-footer__social gate-footer__social--desktop shrink-0">
                            <FacebookIcon size={28}/>
                        </a>
                        <a href={socials.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="gate-footer__social gate-footer__social--desktop shrink-0">
                            <InstagramIcon size={28}/>
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {[
                        ...sectionLinks.map((link) => (
                            <a key={link.href} href={link.href} className="gate-footer__link">{link.label}</a>
                        )),
                        <Link key="jobs" href="/jobs" className="gate-footer__link">Jobs</Link>,
                        <Link key="impressum" href="/impressum" className="gate-footer__link">Impressum</Link>,
                    ].map((link, i) => (
                        <Fragment key={link.key}>
                            {i > 0 && <span className="gate-footer__link-sep" aria-hidden="true">|</span>}
                            {link}
                        </Fragment>
                    ))}
                </div>

                <span className="gate-footer__copyright-desktop flex flex-wrap items-baseline gap-x-2">
                    <span className="whitespace-nowrap">© {new Date().getFullYear()} Pizzeria Verona</span>
                    <span className="whitespace-nowrap">· {locationLabel ?? 'Weseke & Borken'}</span>
                </span>
            </div>
        </footer>
    )
}
