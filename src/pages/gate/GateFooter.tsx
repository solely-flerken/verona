import {Link} from 'react-router'
import './GateFooter.css'

export function GateFooter() {
    return (
        <footer className="gate-footer flex items-center justify-between px-8 py-3.5">
            <span>© {new Date().getFullYear()} Pizzeria Verona · Weseke &amp; Borken</span>
            <div className="flex items-center gap-5">
                <Link to="/jobs" className="gate-footer__link">Jobs</Link>
                <span className="gate-footer__divider"/>
                <Link to="/datenschutz" className="gate-footer__link">Datenschutz</Link>
                <span className="gate-footer__divider"/>
                <Link to="/impressum" className="gate-footer__link">Impressum</Link>
            </div>
        </footer>
    )
}