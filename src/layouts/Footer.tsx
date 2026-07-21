import {Link} from 'react-router'
import './Footer.css'

export function Footer() {
    return (
        <footer className="gate-footer flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 px-8 py-3.5">
            <span className="text-center md:text-left">© {new Date().getFullYear()} Pizzeria Verona · Weseke &amp; Borken</span>
            <div className="flex items-center justify-center md:justify-start gap-5">
                <Link to="/jobs" className="gate-footer__link">Jobs</Link>
                <span className="gate-footer__divider"/>
                {/*<Link to="/datenschutz" className="gate-footer__link">Datenschutz</Link>*/}
                {/*<span className="gate-footer__divider"/>*/}
                <Link to="/impressum" className="gate-footer__link">Impressum</Link>
            </div>
        </footer>
    )
}
