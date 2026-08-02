import {Fragment} from 'react'
import {Link} from 'react-router'
import {FacebookIcon, InstagramIcon} from './SocialIcons'
import './Footer.css'

const FACEBOOK_URL = 'https://www.facebook.com/p/Pizzeria-Verona-100063678484513/'
const INSTAGRAM_URL = 'https://www.instagram.com/pizzeria_verona2_borken_/'

export interface FooterLink {
    label: string
    href: string
}

interface FooterProps {
    sectionLinks?: FooterLink[]
    locationLabel?: string
}

export function Footer({sectionLinks = [], locationLabel}: FooterProps) {
    return (
        <footer className="gate-footer">
            {/* ── Mobile ──────────────────────────────────────────── */}
            <div className="gate-footer__mobile md:hidden flex flex-col items-center gap-5 px-8 py-6">
                <Link to="/" aria-label="Pizzeria Verona">
                    <img src="/images/verona_logo.png" alt="Pizzeria Verona" className="gate-footer__logo"/>
                </Link>

                {locationLabel && <span className="gate-footer__location">{locationLabel}</span>}

                <div className="flex items-center gap-3">
                    <a href={FACEBOOK_URL} target="_blank" rel="noopener" aria-label="Facebook" className="gate-footer__social">
                        <FacebookIcon size={28}/>
                    </a>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram"
                       className="gate-footer__social">
                        <InstagramIcon size={28}/>
                    </a>
                </div>

                <nav className="flex flex-col items-center gap-1">
                    {sectionLinks.map((link) => (
                        <a key={link.href} href={link.href} className="gate-footer__nav-link">{link.label}</a>
                    ))}
                    <Link to="/jobs" className="gate-footer__nav-link">Jobs</Link>
                    <Link to="/impressum" className="gate-footer__nav-link">Impressum</Link>
                </nav>

                <span className="gate-footer__copyright">© {new Date().getFullYear()} Pizzeria Verona · Weseke &amp; Borken</span>
            </div>

            {/* ── Desktop ─────────────────────────────────────────── */}
            <div
                className="gate-footer__desktop hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-4 px-8 py-2.5">
                <div className="flex items-center gap-2">
                    <Link to="/" aria-label="Pizzeria Verona">
                        <img src="/images/verona_logo.png" alt="Pizzeria Verona" className="gate-footer__logo-desktop"/>
                    </Link>
                    <div className="flex items-center gap-2 ml-4">
                        <a href={FACEBOOK_URL} target="_blank" rel="noopener" aria-label="Facebook"
                           className="gate-footer__social gate-footer__social--desktop">
                            <FacebookIcon size={28}/>
                        </a>
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram"
                           className="gate-footer__social gate-footer__social--desktop">
                            <InstagramIcon size={28}/>
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {[
                        ...sectionLinks.map((link) => (
                            <a key={link.href} href={link.href} className="gate-footer__link">{link.label}</a>
                        )),
                        <Link key="jobs" to="/jobs" className="gate-footer__link">Jobs</Link>,
                        <Link key="impressum" to="/impressum" className="gate-footer__link">Impressum</Link>,
                    ].map((link, i) => (
                        <Fragment key={link.key}>
                            {i > 0 && <span className="gate-footer__link-sep" aria-hidden="true">|</span>}
                            {link}
                        </Fragment>
                    ))}
                </div>

                <span className="text-right">© {new Date().getFullYear()} Pizzeria Verona · {locationLabel ?? 'Weseke & Borken'}</span>
            </div>
        </footer>
    )
}
